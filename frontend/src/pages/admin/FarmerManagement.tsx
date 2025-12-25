import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Users, ShieldCheck, MapPin } from 'lucide-react';
import { getAllFarmers, createFarmer, updateFarmer, deleteFarmer } from '../../services/farmer.service';
import type { FarmerDetails, CreateFarmerRequest } from '../../types/farmer.types';
import AdminLayout from '../../components/layout/AdminLayout';
import StatsCard from '../../components/ui/StatsCard';
import Modal from '../../components/ui/Modal';

const FarmerManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [farmers, setFarmers] = useState<FarmerDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingFarmer, setEditingFarmer] = useState<FarmerDetails | null>(null);
    const [formData, setFormData] = useState<CreateFarmerRequest>({
        name: '', email: '', phone_no: '', address: '', land_size: 0,
        id_proof: '', survey_no: '', crop_one: '', crop_two: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const stats = {
        total: farmers.length,
        active: farmers.filter(f => f.email && f.phone_no).length,
        heavyLand: farmers.filter(f => (f.land_size || 0) > 10).length
    };

    const fetchFarmers = async () => {
        setLoading(true);
        try {
            const data = await getAllFarmers();
            setFarmers(data || []);
        } catch (err) {
            console.error('Failed to load farmers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = 'Farmers — KS Console';
        fetchFarmers();
    }, []);

    const filteredFarmers = farmers.filter((f) => {
        const q = searchQuery.toLowerCase();
        return (
            (f.name || '').toLowerCase().includes(q) ||
            (f.email || '').toLowerCase().includes(q) ||
            String(f.phone_no || '').includes(q) ||
            (f.address || '').toLowerCase().includes(q)
        );
    });

    const openAddModal = () => {
        setEditingFarmer(null);
        setFormData({
            name: '', email: '', phone_no: '', address: '',
            land_size: 0, id_proof: '', survey_no: '',
            crop_one: '', crop_two: ''
        });
        setModalOpen(true);
    };

    const openEditModal = (f: FarmerDetails) => {
        setEditingFarmer(f);
        setFormData({
            name: f.name || '', email: f.email || '',
            phone_no: f.phone_no || '', address: f.address || '',
            land_size: f.land_size || 0, id_proof: f.id_proof || '',
            survey_no: f.survey_no || '', crop_one: f.crop_one || '',
            crop_two: f.crop_two || ''
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingFarmer) { await updateFarmer(editingFarmer._id, formData); }
            else { await createFarmer(formData); }
            setModalOpen(false);
            fetchFarmers();
        } catch (err) {
            console.error('Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Permanently remove this farmer from the registry?')) return;
        try {
            await deleteFarmer(id);
            fetchFarmers();
        } catch {
            alert('Deletion failed');
        }
    };

    return (
        <AdminLayout
            title="Farmer Registry"
            subtitle="Manage and verify individual agricultural producer accounts."
            onSearch={setSearchQuery}
        >
            <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatsCard
                        label="TOTAL FARMERS"
                        value={stats.total}
                        icon={Users}
                    />
                    <StatsCard
                        label="VERIFIED PRODUCERS"
                        value={stats.active}
                        icon={ShieldCheck}
                        color="text-emerald-500"
                    />
                    <StatsCard
                        label="LARGE SCALE"
                        value={stats.heavyLand}
                        icon={MapPin}
                        color="text-amber-500"
                        trend={{ label: '>10 Acres', isNeutral: true }}
                    />
                </div>

                <div className="bg-white rounded-3xl border border-zinc-100 shadow-premium overflow-hidden">
                    <div className="p-10 border-b border-zinc-50 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-zinc-900 font-display tracking-tight">Active Registrations</h2>
                            <p className="text-sm text-zinc-400 font-bold tracking-institutional mt-1">Monitoring verification and inventory status.</p>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="btn-premium h-14 px-8"
                        >
                            <Plus className="w-5 h-5" /> BIND NEW PRODUCER
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50/50">
                                <tr>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">FARMER IDENTITY</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">CONTACT INTEL</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">ESTATE SIZE</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">PRIMARY CROPS</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] text-right">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-20 text-center text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">Accessing Registry...</td>
                                    </tr>
                                ) : filteredFarmers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-20 text-center text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">No producer records found.</td>
                                    </tr>
                                ) : (
                                    filteredFarmers.map((f) => (
                                        <tr key={f._id} className="group hover:bg-zinc-50 transition-colors">
                                            <td className="px-10 py-7">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center font-black text-zinc-900 text-sm border border-zinc-100 group-hover:bg-zinc-950 group-hover:text-white transition-all duration-300">
                                                        {f.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-[15px] font-black text-zinc-900 tracking-tight">{f.name}</p>
                                                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">UID: {f._id.slice(-6).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-7">
                                                <p className="text-xs font-bold text-zinc-600">{f.email}</p>
                                                <p className="text-[11px] text-zinc-400 font-medium mt-1">{f.phone_no}</p>
                                            </td>
                                            <td className="px-10 py-7 text-[13px] font-black text-zinc-900 uppercase tracking-tighter">
                                                {f.land_size} Acres
                                            </td>
                                            <td className="px-10 py-7">
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="px-3 py-1 bg-zinc-50 text-[10px] font-black text-zinc-400 rounded-lg border border-zinc-100 uppercase tracking-widest">{f.crop_one || 'None'}</span>
                                                    {f.crop_two && <span className="px-3 py-1 bg-zinc-50 text-[10px] font-black text-zinc-400 rounded-lg border border-zinc-100 uppercase tracking-widest">{f.crop_two}</span>}
                                                </div>
                                            </td>
                                            <td className="px-10 py-7">
                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <button onClick={() => openEditModal(f)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-50 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-all border border-zinc-100">
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(f._id)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 transition-all border border-red-50">
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
                title={editingFarmer ? "Revise Profile" : "Onboard Producer"}
            >
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Full Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="input-premium"
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Phone Axis</label>
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
                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Email Address</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="input-premium"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Estate Size (Acres)</label>
                            <input
                                type="number"
                                value={formData.land_size}
                                onChange={(e) => setFormData({ ...formData, land_size: Number(e.target.value) })}
                                className="input-premium"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Survey Number</label>
                            <input
                                type="text"
                                value={formData.survey_no}
                                onChange={(e) => setFormData({ ...formData, survey_no: e.target.value })}
                                className="input-premium"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-premium w-full py-5 text-sm"
                    >
                        {submitting ? 'EXECUTING...' : editingFarmer ? 'COMMIT REVISIONS' : 'BIND PRODUCER'}
                    </button>
                </form>
            </Modal>
        </AdminLayout>
    );
};

export default FarmerManagement;
