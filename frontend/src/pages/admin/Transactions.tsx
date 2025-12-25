import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, LayoutDashboard, Users, Building2, FileText, CreditCard, LogOut, User, ChevronDown, Pencil, Trash2 } from 'lucide-react';
import transactionService from '../../services/transaction.service';
import type { Transaction } from '../../types/transaction.types';

const Transactions = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ contract_id: '', company_id: '', farmer_id: '', status: '0', payment_type: 'Advance', payment_id: '' });
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const sidebarLinks = [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/farmers', icon: Users, label: 'Farmer Management' },
        { to: '/admin/companies', icon: Building2, label: 'Company Management' },
        { to: '/admin/contracts', icon: FileText, label: 'Contract Management' },
        { to: '/admin/transactions', icon: CreditCard, label: 'Transactions' },
    ];

    useEffect(() => { document.title = 'Transactions - Krishi Sangam'; }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try { const data = await transactionService.getAllTransactions(); setTransactions(data || []); }
        catch { setError('Failed to load data'); }
        setLoading(false);
    };

    useEffect(() => { fetchTransactions(); }, []);

    const handleLogout = async () => {
        try { await fetch('http://localhost:8000/api/v1/users/logout', { method: 'POST', credentials: 'include' }); } catch { }
        navigate('/login');
    };

    const filteredTransactions = transactions.filter((t) => {
        const q = searchQuery.toLowerCase();
        const statusText = t.status ? 'completed' : 'pending';
        return (t.contract_id || '').toLowerCase().includes(q) || (t.company_id || '').toLowerCase().includes(q) || (t.farmer_id || '').toLowerCase().includes(q) || statusText.includes(q) || (t.payment_type || '').toLowerCase().includes(q);
    });

    const openEditModal = (t: Transaction) => {
        setCurrentId(t._id);
        setFormData({ contract_id: t.contract_id || '', company_id: t.company_id || '', farmer_id: t.farmer_id || '', status: t.status ? '1' : '0', payment_type: t.payment_type || 'Advance', payment_id: t.payment_id || '' });
        setFormError(''); setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.contract_id || !formData.company_id || !formData.farmer_id) { setFormError('Fill required fields'); return; }
        if (!currentId) return;
        setSubmitting(true);
        try {
            await transactionService.updateTransaction(currentId, { contract_id: formData.contract_id, company_id: formData.company_id, farmer_id: formData.farmer_id, status: formData.status, payment_type: formData.payment_type, payment_id: formData.payment_id || undefined });
            setModalOpen(false); fetchTransactions();
        } catch (err) { setFormError(err instanceof Error ? err.message : 'Failed'); }
        setSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this transaction?')) return;
        try { await transactionService.deleteTransaction(id); fetchTransactions(); } catch { alert('Failed to delete'); }
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
                <nav className="p-4 space-y-2">{sidebarLinks.map((l) => <Link key={l.to} to={l.to} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${l.to === '/admin/transactions' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}><l.icon className="w-5 h-5" />{l.label}</Link>)}</nav>
            </aside>
            {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
            <main className="pt-16 lg:pl-64">
                <div className="p-6 max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Transaction Management</h1>
                    <div className="bg-white rounded-2xl border overflow-hidden">
                        {loading ? <div className="p-12 text-center text-gray-500">Loading...</div> : error ? <div className="p-12 text-center text-red-500">{error}</div> : filteredTransactions.length === 0 ? <div className="p-12 text-center text-gray-500">No transactions</div> : (
                            <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Contract ID</th><th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Company ID</th><th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Farmer ID</th><th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th><th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Payment Type</th><th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Payment ID</th><th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th></tr></thead>
                                <tbody className="divide-y">{filteredTransactions.map((t) => <tr key={t._id} className="hover:bg-gray-50"><td className="px-4 py-4 text-sm font-mono text-xs">{t.contract_id || '-'}</td><td className="px-4 py-4 text-sm font-mono text-xs">{t.company_id || '-'}</td><td className="px-4 py-4 text-sm font-mono text-xs">{t.farmer_id || '-'}</td><td className="px-4 py-4"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${t.status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{t.status ? 'Completed' : 'Pending'}</span></td><td className="px-4 py-4 text-sm">{t.payment_type || '-'}</td><td className="px-4 py-4 text-sm font-mono text-xs">{t.payment_id || '-'}</td><td className="px-4 py-4"><div className="flex justify-center gap-2"><button onClick={() => openEditModal(t)} className="p-2 rounded-lg hover:bg-gray-100"><Pencil className="w-4 h-4" /></button><button onClick={() => handleDelete(t._id)} className="p-2 rounded-lg hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button></div></td></tr>)}</tbody></table></div>
                        )}
                    </div>
                </div>
            </main>
            {modalOpen && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"><div className="p-6 border-b flex justify-between"><h2 className="text-xl font-bold">Edit Transaction</h2><button onClick={() => setModalOpen(false)}><X className="w-5 h-5" /></button></div><form onSubmit={handleSubmit} className="p-6 space-y-4"><div><label className="block text-sm font-medium mb-1">Contract ID *</label><input type="text" value={formData.contract_id} onChange={(e) => setFormData({ ...formData, contract_id: e.target.value })} className="w-full px-4 py-2 border rounded-xl" required /></div><div><label className="block text-sm font-medium mb-1">Company ID *</label><input type="text" value={formData.company_id} onChange={(e) => setFormData({ ...formData, company_id: e.target.value })} className="w-full px-4 py-2 border rounded-xl" required /></div><div><label className="block text-sm font-medium mb-1">Farmer ID *</label><input type="text" value={formData.farmer_id} onChange={(e) => setFormData({ ...formData, farmer_id: e.target.value })} className="w-full px-4 py-2 border rounded-xl" required /></div><div><label className="block text-sm font-medium mb-1">Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 border rounded-xl"><option value="1">Completed</option><option value="0">Pending</option></select></div><div><label className="block text-sm font-medium mb-1">Payment Type</label><select value={formData.payment_type} onChange={(e) => setFormData({ ...formData, payment_type: e.target.value })} className="w-full px-4 py-2 border rounded-xl"><option value="Advance">Advance</option><option value="Installment">Installment</option><option value="Full Payment">Full Payment</option></select></div><div><label className="block text-sm font-medium mb-1">Payment ID</label><input type="text" value={formData.payment_id} onChange={(e) => setFormData({ ...formData, payment_id: e.target.value })} className="w-full px-4 py-2 border rounded-xl" /></div>{formError && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{formError}</div>}<button type="submit" disabled={submitting} className="w-full py-3 bg-black text-white rounded-xl">{submitting ? 'Saving...' : 'Save'}</button></form></div></div>}
        </div>
    );
};

export default Transactions;
