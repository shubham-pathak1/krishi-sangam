import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Building2, ShieldCheck, Globe } from 'lucide-react';
import { getAllCompanies, createCompany, updateCompany, deleteCompany } from '../../services/company.service';
import type { CompanyDetails, CreateCompanyRequest } from '../../types/company.types';
import AdminLayout from '../../components/layout/AdminLayout';
import StatsCard from '../../components/ui/StatsCard';
import Modal from '../../components/ui/Modal';

const CompanyManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [companies, setCompanies] = useState<CompanyDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState<CompanyDetails | null>(null);
    const [formData, setFormData] = useState<CreateCompanyRequest>({
        company_name: '', email: '', phone_no: '', address: '', gstin: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const stats = {
        total: companies.length,
        verified: companies.filter(c => c.gstin).length,
        enterprise: companies.filter(c => c.phone_no).length // Mock
    };

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const data = await getAllCompanies();
            setCompanies(data || []);
        } catch (err) {
            console.error('Failed to load companies');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = 'Companies — KS Console';
        fetchCompanies();
    }, []);

    const filteredCompanies = companies.filter((c) => {
        const q = searchQuery.toLowerCase();
        return (
            (c.company_name || '').toLowerCase().includes(q) ||
            (c.email || '').toLowerCase().includes(q) ||
            String(c.phone_no || '').includes(q) ||
            (c.address || '').toLowerCase().includes(q) ||
            (c.gstin || '').toLowerCase().includes(q)
        );
    });

    const openAddModal = () => {
        setEditingCompany(null);
        setFormData({
            company_name: '', email: '', phone_no: '', address: '', gstin: ''
        });
        setModalOpen(true);
    };

    const openEditModal = (c: CompanyDetails) => {
        setEditingCompany(c);
        setFormData({
            company_name: c.company_name || '', email: c.email || '',
            phone_no: c.phone_no || '', address: c.address || '',
            gstin: c.gstin || ''
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingCompany) { await updateCompany(editingCompany._id, formData); }
            else { await createCompany(formData); }
            setModalOpen(false);
            fetchCompanies();
        } catch (err) {
            console.error('Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Permanently remove this company from the network?')) return;
        try {
            await deleteCompany(id);
            fetchCompanies();
        } catch {
            alert('Deletion failed');
        }
    };

    return (
        <AdminLayout
            title="Entity Registry"
            subtitle="Manage and verify institutional partners and processing units."
            onSearch={setSearchQuery}
        >
            <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatsCard
                        label="TOTAL COMPANIES"
                        value={stats.total}
                        icon={Building2}
                    />
                    <StatsCard
                        label="VAT/GST VERIFIED"
                        value={stats.verified}
                        icon={ShieldCheck}
                        color="text-emerald-500"
                    />
                    <StatsCard
                        label="ENTERPRISE NODES"
                        value={stats.enterprise}
                        icon={Globe}
                        color="text-amber-500"
                    />
                </div>

                <div className="bg-white rounded-3xl border border-zinc-100 shadow-premium overflow-hidden">
                    <div className="p-10 border-b border-zinc-50 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-zinc-900 font-display tracking-tight">Partner Entities</h2>
                            <p className="text-sm text-zinc-400 font-bold tracking-institutional mt-1">Monitoring organizational integrity and tax compliance.</p>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="btn-premium h-14 px-8"
                        >
                            <Plus className="w-5 h-5" /> ONBOARD PARTNER
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50/50">
                                <tr>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">COMPANY IDENTITY</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">CONTACT AXIS</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">GSTIN / TAX ID</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">LOCATION</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] text-right">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-20 text-center text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">Synchronizing Registry...</td>
                                    </tr>
                                ) : filteredCompanies.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-20 text-center text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">No institutional records found.</td>
                                    </tr>
                                ) : (
                                    filteredCompanies.map((c) => (
                                        <tr key={c._id} className="group hover:bg-zinc-50 transition-colors">
                                            <td className="px-10 py-7">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center font-black text-zinc-900 text-sm border border-zinc-100 group-hover:bg-zinc-950 group-hover:text-white transition-all duration-300">
                                                        {c.company_name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-[15px] font-black text-zinc-900 tracking-tight">{c.company_name}</p>
                                                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">UID: {c._id.slice(-6).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-7">
                                                <p className="text-xs font-bold text-zinc-600">{c.email}</p>
                                                <p className="text-[11px] text-zinc-400 font-medium mt-1">{c.phone_no}</p>
                                            </td>
                                            <td className="px-10 py-7">
                                                <span className="px-4 py-1.5 bg-zinc-50 text-[10px] font-black text-zinc-900 rounded-lg border border-zinc-100 font-mono tracking-tighter">
                                                    {c.gstin || 'NOT VERIFIED'}
                                                </span>
                                            </td>
                                            <td className="px-10 py-7 text-[12px] font-bold text-zinc-400 uppercase tracking-widest truncate max-w-[180px]">
                                                {c.address || 'Global Port'}
                                            </td>
                                            <td className="px-10 py-7">
                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <button onClick={() => openEditModal(c)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-50 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-all border border-zinc-100">
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(c._id)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 transition-all border border-red-50">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingCompany ? "Modify Entity" : "Company Onboarding"}
            >
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Entity Legal Name</label>
                        <input
                            type="text"
                            value={formData.company_name}
                            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                            className="input-premium"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Official Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="input-premium"
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Direct Contact</label>
                            <input
                                type="tel"
                                value={formData.phone_no}
                                onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })}
                                className="input-premium"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">GSTIN / VAT ID</label>
                        <input
                            type="text"
                            value={formData.gstin}
                            onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                            className="input-premium"
                            placeholder="State-issued Tax Identifier"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-premium w-full py-5 text-sm"
                    >
                        {submitting ? 'EXECUTING...' : editingCompany ? 'COMMIT REVISIONS' : 'BIND ENTITY'}
                    </button>
                </form>
            </Modal>
        </AdminLayout>
    );
};

export default CompanyManagement;
