import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, LayoutDashboard, Users, Building2, FileText, CreditCard, LogOut, User, ChevronDown, Pencil, Trash2, FileCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import contractService from '../../services/contract.service';
import type { Contract } from '../../types/contract.types';

const ContractManagement = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentContractId, setCurrentContractId] = useState<string | null>(null);
    const [editStatus, setEditStatus] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [acceptModalOpen, setAcceptModalOpen] = useState(false);
    const [acceptContractId, setAcceptContractId] = useState<string | null>(null);
    const [acceptCompanyId, setAcceptCompanyId] = useState<string | null>(null);
    const [farmerPhone, setFarmerPhone] = useState('');
    const [paymentType, setPaymentType] = useState('Advance');
    const [acceptError, setAcceptError] = useState('');

    const sidebarLinks = [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/farmers', icon: Users, label: 'Farmer Management' },
        { to: '/admin/companies', icon: Building2, label: 'Company Management' },
        { to: '/admin/contracts', icon: FileText, label: 'Contract Management' },
        { to: '/admin/transactions', icon: CreditCard, label: 'Transactions' },
    ];

    useEffect(() => { document.title = 'Contract Management - Krishi Sangam'; }, []);

    const fetchContracts = async () => {
        setLoading(true);
        try {
            const data = await contractService.getAllContracts();
            setContracts(data || []);
        } catch (err) {
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchContracts(); }, []);

    const handleLogout = async () => {
        try { await logout(); navigate('/login'); } catch { navigate('/login'); }
    };

    const filteredContracts = contracts.filter((c) => {
        const q = searchQuery.toLowerCase();
        return (c.company_id || '').toLowerCase().includes(q) || (c.product || '').toLowerCase().includes(q) || (c.place || '').toLowerCase().includes(q);
    });

    const openEditModal = (c: Contract) => { setCurrentContractId(c._id); setEditStatus(c.status); setEditModalOpen(true); };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentContractId) return;
        setSubmitting(true);
        try {
            await contractService.updateContract(currentContractId, { status: editStatus });
            setEditModalOpen(false);
            fetchContracts();
        } catch { alert('Failed to update'); }
        setSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this contract?')) return;
        try { await contractService.deleteContract(id); fetchContracts(); } catch { alert('Failed to delete'); }
    };

    const openAcceptModal = (cId: string, compId: string) => { setAcceptContractId(cId); setAcceptCompanyId(compId); setFarmerPhone(''); setPaymentType('Advance'); setAcceptError(''); setAcceptModalOpen(true); };

    const handleAcceptSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!farmerPhone) { setAcceptError('Enter phone'); return; }
        if (!acceptContractId || !acceptCompanyId) return;
        setSubmitting(true);
        try {
            const farmers = await contractService.getFarmerByPhone(farmerPhone);
            if (!farmers?.length) { setAcceptError('Farmer not found'); setSubmitting(false); return; }
            await contractService.createContractTransaction({ contract_id: acceptContractId, farmer_id: farmers[0]._id, company_id: acceptCompanyId, status: 'false', payment_type: paymentType });
            setAcceptModalOpen(false);
            fetchContracts();
        } catch { setAcceptError('Failed'); }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-['Inter']">
            <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 h-16">
                <div className="flex items-center justify-between h-full px-4 lg:px-6">
                    <Link to="/" className="flex items-center gap-3"><img src="/src/assets/images/l.png" alt="Logo" className="h-10 w-auto" /><span className="text-xl font-bold text-gray-900 hidden sm:block">Krishi Sangam</span></Link>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64"><Search className="w-4 h-4 text-gray-400 mr-2" /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-full" /></div>
                        <div className="relative">
                            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"><div className="w-8 h-8 bg-black rounded-full flex items-center justify-center"><User className="w-4 h-4 text-white" /></div><ChevronDown className="w-4 h-4 text-gray-500" /></button>
                            {profileOpen && <div className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border py-2 min-w-40 z-50"><Link to="/admin/profile" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50"><User className="w-4 h-4" />Profile</Link><button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"><LogOut className="w-4 h-4" />Logout</button></div>}
                        </div>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">{sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
                    </div>
                </div>
            </header>
            <aside className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r z-40 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <nav className="p-4 space-y-2">{sidebarLinks.map((l) => <Link key={l.to} to={l.to} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${l.to === '/admin/contracts' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}><l.icon className="w-5 h-5" />{l.label}</Link>)}</nav>
            </aside>
            {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
            <main className="pt-16 lg:pl-64">
                <div className="p-6 max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Contract Management</h1>
                    <div className="bg-white rounded-2xl border overflow-hidden">
                        {loading ? <div className="p-12 text-center text-gray-500">Loading...</div> : error ? <div className="p-12 text-center text-red-500">{error}</div> : filteredContracts.length === 0 ? <div className="p-12 text-center text-gray-500">No contracts</div> : (
                            <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Company ID</th><th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Product</th><th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Qty</th><th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Duration</th><th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Place</th><th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Price</th><th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th><th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Created</th><th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th></tr></thead>
                                <tbody className="divide-y">{filteredContracts.map((c) => <tr key={c._id} className="hover:bg-gray-50"><td className="px-4 py-4 text-sm font-mono">{c.company_id || '-'}</td><td className="px-4 py-4 text-sm">{c.product || '-'}</td><td className="px-4 py-4 text-sm">{c.quantity || '-'}</td><td className="px-4 py-4 text-sm">{c.duration || '-'}</td><td className="px-4 py-4 text-sm">{c.place || '-'}</td><td className="px-4 py-4 text-sm">{c.price || '-'}</td><td className="px-4 py-4"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${c.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{c.status ? 'Active' : 'Inactive'}</span></td><td className="px-4 py-4 text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td><td className="px-4 py-4"><div className="flex justify-center gap-2"><button onClick={() => openEditModal(c)} className="p-2 rounded-lg hover:bg-gray-100"><Pencil className="w-4 h-4" /></button><button onClick={() => handleDelete(c._id)} className="p-2 rounded-lg hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button><button onClick={() => openAcceptModal(c._id, c.company_id)} className="p-2 rounded-lg hover:bg-green-50 text-green-600"><FileCheck className="w-4 h-4" /></button></div></td></tr>)}</tbody></table></div>
                        )}
                    </div>
                </div>
            </main>
            {editModalOpen && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-2xl w-full max-w-md"><div className="p-6 border-b flex justify-between"><h2 className="text-xl font-bold">Edit Contract</h2><button onClick={() => setEditModalOpen(false)}><X className="w-5 h-5" /></button></div><form onSubmit={handleEditSubmit} className="p-6 space-y-4"><div><label className="block text-sm font-medium mb-1">Status</label><select value={editStatus ? 'true' : 'false'} onChange={(e) => setEditStatus(e.target.value === 'true')} className="w-full px-4 py-2 border rounded-xl"><option value="true">Active</option><option value="false">Inactive</option></select></div><button type="submit" disabled={submitting} className="w-full py-3 bg-black text-white rounded-xl">{submitting ? 'Saving...' : 'Save'}</button></form></div></div>}
            {acceptModalOpen && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-2xl w-full max-w-md"><div className="p-6 border-b flex justify-between"><h2 className="text-xl font-bold">Accept Contract</h2><button onClick={() => setAcceptModalOpen(false)}><X className="w-5 h-5" /></button></div><form onSubmit={handleAcceptSubmit} className="p-6 space-y-4"><div><label className="block text-sm font-medium mb-1">Farmer Phone *</label><input type="tel" value={farmerPhone} onChange={(e) => setFarmerPhone(e.target.value)} placeholder="10-digit phone" className="w-full px-4 py-2 border rounded-xl" required /></div><div><label className="block text-sm font-medium mb-1">Payment Type</label><select value={paymentType} onChange={(e) => setPaymentType(e.target.value)} className="w-full px-4 py-2 border rounded-xl"><option value="Advance">Advance</option><option value="Installment">Installment</option><option value="Full payment">Full Payment</option><option value="None">None</option></select></div>{acceptError && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{acceptError}</div>}<button type="submit" disabled={submitting} className="w-full py-3 bg-black text-white rounded-xl">{submitting ? 'Processing...' : 'Accept'}</button></form></div></div>}
        </div>
    );
};

export default ContractManagement;
