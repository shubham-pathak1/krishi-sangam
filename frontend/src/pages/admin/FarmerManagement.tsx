import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, LayoutDashboard, Users, Building2, FileText, CreditCard, LogOut, User, ChevronDown, Plus, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAllFarmers, createFarmer, updateFarmer, deleteFarmer } from '../../services/farmer.service';
import type { FarmerDetails, CreateFarmerRequest } from '../../types/farmer.types';

const FarmerManagement = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [farmers, setFarmers] = useState<FarmerDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingFarmer, setEditingFarmer] = useState<FarmerDetails | null>(null);
    const [formData, setFormData] = useState<CreateFarmerRequest>({ name: '', email: '', phone_no: '', address: '', land_size: 0, id_proof: '', survey_no: '', crop_one: '', crop_two: '' });
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const sidebarLinks = [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/farmers', icon: Users, label: 'Farmer Management' },
        { to: '/admin/companies', icon: Building2, label: 'Company Management' },
        { to: '/admin/contracts', icon: FileText, label: 'Contract Management' },
        { to: '/admin/transactions', icon: CreditCard, label: 'Transactions' },
    ];

    useEffect(() => { document.title = 'Farmer Management - Krishi Sangam'; }, []);

    const fetchFarmers = async () => {
        setLoading(true);
        try { const data = await getAllFarmers(); setFarmers(data || []); }
        catch { setError('Failed to load data'); }
        setLoading(false);
    };

    useEffect(() => { fetchFarmers(); }, []);

    const handleLogout = async () => {
        try { await logout(); navigate('/login'); } catch { navigate('/login'); }
    };

    const filteredFarmers = farmers.filter((f) => {
        const q = searchQuery.toLowerCase();
        return (f.name || '').toLowerCase().includes(q) || (f.email || '').toLowerCase().includes(q) || String(f.phone_no || '').includes(q) || (f.address || '').toLowerCase().includes(q);
    });

    const openAddModal = () => { setEditingFarmer(null); setFormData({ name: '', email: '', phone_no: '', address: '', land_size: 0, id_proof: '', survey_no: '', crop_one: '', crop_two: '' }); setFormError(''); setModalOpen(true); };

    const openEditModal = (f: FarmerDetails) => {
        setEditingFarmer(f);
        setFormData({ name: f.name || '', email: f.email || '', phone_no: f.phone_no || '', address: f.address || '', land_size: f.land_size || 0, id_proof: f.id_proof || '', survey_no: f.survey_no || '', crop_one: f.crop_one || '', crop_two: f.crop_two || '' });
        setFormError(''); setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.phone_no) { setFormError('Fill required fields'); return; }
        setSubmitting(true);
        try {
            if (editingFarmer) { await updateFarmer(editingFarmer._id, formData); }
            else { await createFarmer(formData); }
            setModalOpen(false); fetchFarmers();
        } catch (err) { setFormError(err instanceof Error ? err.message : 'Failed'); }
        setSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this farmer?')) return;
        try { await deleteFarmer(id); fetchFarmers(); } catch { alert('Failed to delete'); }
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
                <nav className="p-4 space-y-2">{sidebarLinks.map((l) => <Link key={l.to} to={l.to} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${l.to === '/admin/farmers' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}><l.icon className="w-5 h-5" />{l.label}</Link>)}</nav>
            </aside>
            {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
            <main className="pt-16 lg:pl-64">
                <div className="p-6 max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold text-gray-900">Farmer Management</h1><button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800"><Plus className="w-4 h-4" />Add Farmer</button></div>
                    <div className="bg-white rounded-2xl border overflow-hidden">
                        {loading ? <div className="p-12 text-center text-gray-500">Loading...</div> : error ? <div className="p-12 text-center text-red-500">{error}</div> : filteredFarmers.length === 0 ? <div className="p-12 text-center text-gray-500">No farmers</div> : (
                            <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Name</th><th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Email</th><th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th><th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Address</th><th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Land Size</th><th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th></tr></thead>
                                <tbody className="divide-y">{filteredFarmers.map((f) => <tr key={f._id} className="hover:bg-gray-50"><td className="px-6 py-4 text-sm font-medium text-gray-900">{f.name || '-'}</td><td className="px-6 py-4 text-sm text-gray-500">{f.email || '-'}</td><td className="px-6 py-4 text-sm text-gray-500">{f.phone_no || '-'}</td><td className="px-6 py-4 text-sm text-gray-500">{f.address || '-'}</td><td className="px-6 py-4 text-sm text-gray-500">{f.land_size || '-'}</td><td className="px-6 py-4"><div className="flex justify-center gap-2"><button onClick={() => openEditModal(f)} className="p-2 rounded-lg hover:bg-gray-100"><Pencil className="w-4 h-4" /></button><button onClick={() => handleDelete(f._id)} className="p-2 rounded-lg hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button></div></td></tr>)}</tbody></table></div>
                        )}
                    </div>
                </div>
            </main>
            {modalOpen && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"><div className="p-6 border-b flex justify-between"><h2 className="text-xl font-bold">{editingFarmer ? 'Edit Farmer' : 'Add Farmer'}</h2><button onClick={() => setModalOpen(false)}><X className="w-5 h-5" /></button></div><form onSubmit={handleSubmit} className="p-6 space-y-4"><div><label className="block text-sm font-medium mb-1">Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border rounded-xl" required /></div><div><label className="block text-sm font-medium mb-1">Email *</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border rounded-xl" required /></div><div><label className="block text-sm font-medium mb-1">Phone *</label><input type="tel" value={formData.phone_no} onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })} className="w-full px-4 py-2 border rounded-xl" required /></div><div><label className="block text-sm font-medium mb-1">Address</label><input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-2 border rounded-xl" /></div><div><label className="block text-sm font-medium mb-1">Land Size</label><input type="number" value={formData.land_size} onChange={(e) => setFormData({ ...formData, land_size: Number(e.target.value) })} className="w-full px-4 py-2 border rounded-xl" /></div>{formError && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{formError}</div>}<button type="submit" disabled={submitting} className="w-full py-3 bg-black text-white rounded-xl">{submitting ? 'Saving...' : editingFarmer ? 'Update' : 'Add'}</button></form></div></div>}
        </div>
    );
};

export default FarmerManagement;
