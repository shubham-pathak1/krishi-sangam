import { useState, useEffect } from 'react';
import { Pencil, Trash2, FileCheck, FileText, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import contractService from '../../services/contract.service';
import type { Contract } from '../../types/contract.types';
import AdminLayout from '../../components/layout/AdminLayout';
import StatsCard from '../../components/ui/StatsCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';

const ContractManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
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

    const stats = {
        total: contracts.length,
        active: contracts.filter(c => c.status === true).length,
        pending: contracts.filter(c => c.status === false).length
    };

    const fetchContracts = async () => {
        setLoading(true);
        try {
            const data = await contractService.getAllContracts();
            setContracts(data || []);
        } catch (err) {
            console.error('Failed to load contracts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = 'Contracts — KS Console';
        fetchContracts();
    }, []);

    const filteredContracts = contracts.filter((c) => {
        const q = searchQuery.toLowerCase();
        return (c.company_id || '').toLowerCase().includes(q) || (c.product || '').toLowerCase().includes(q) || (c.place || '').toLowerCase().includes(q);
    });

    const openEditModal = (c: Contract) => {
        setCurrentContractId(c._id);
        setEditStatus(c.status);
        setEditModalOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentContractId) return;
        setSubmitting(true);
        try {
            await contractService.updateContract(currentContractId, { status: editStatus });
            setEditModalOpen(false);
            fetchContracts();
        } catch {
            alert('Failed to update');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Permanently nullify this contract protocol?')) return;
        try {
            await contractService.deleteContract(id);
            fetchContracts();
        } catch {
            alert('Deletion failed');
        }
    };

    const openAcceptModal = (cId: string, compId: string) => {
        setAcceptContractId(cId);
        setAcceptCompanyId(compId);
        setFarmerPhone('');
        setPaymentType('Advance');
        setAcceptError('');
        setAcceptModalOpen(true);
    };

    const handleAcceptSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!farmerPhone) { setAcceptError('Enter phone'); return; }
        if (!acceptContractId || !acceptCompanyId) return;
        setSubmitting(true);
        try {
            const farmers = await contractService.getFarmerByPhone(farmerPhone);
            if (!farmers?.length) { setAcceptError('Farmer not found in registry'); setSubmitting(false); return; }
            await contractService.createContractTransaction({
                contract_id: acceptContractId,
                farmer_id: farmers[0]._id,
                company_id: acceptCompanyId,
                status: 'false',
                payment_type: paymentType
            });
            setAcceptModalOpen(false);
            fetchContracts();
        } catch {
            setAcceptError('Execution failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AdminLayout
            title="Protocol Console"
            subtitle="Centralized governance of agricultural agreements and fulfillment binding."
            onSearch={setSearchQuery}
        >
            <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatsCard
                        label="TOTAL PROTOCOLS"
                        value={stats.total}
                        icon={FileText}
                    />
                    <StatsCard
                        label="ACTIVE BINDINGS"
                        value={stats.active}
                        icon={Activity}
                        color="text-emerald-500"
                    />
                    <StatsCard
                        label="PENDING REVIEW"
                        value={stats.pending}
                        icon={AlertCircle}
                        color="text-amber-500"
                    />
                </div>

                <div className="bg-white rounded-3xl border border-zinc-100 shadow-premium overflow-hidden">
                    <div className="p-10 border-b border-zinc-50 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-zinc-900 font-display tracking-tight">Contract Pipeline</h2>
                            <p className="text-sm text-zinc-400 font-bold tracking-institutional mt-1">Monitoring legal agreements and transactional bindings.</p>
                        </div>
                        <button className="btn-premium h-14 px-8">
                            EXPORT AUDIT LOG
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50/50">
                                <tr>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">PROTOCOL ID</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">ASSET & VOLUME</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">PRICING</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">STATUS</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] text-right">OPERATIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-20 text-center text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">Synchronizing Registry...</td>
                                    </tr>
                                ) : filteredContracts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-20 text-center text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">No protocol records found.</td>
                                    </tr>
                                ) : (
                                    filteredContracts.map((c) => (
                                        <tr key={c._id} className="group hover:bg-zinc-50 transition-colors">
                                            <td className="px-10 py-7">
                                                <p className="text-[13px] font-black text-zinc-900 tracking-tight">ID: {c._id.slice(-6).toUpperCase()}</p>
                                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">OWNER: {c.company_id?.slice(-6).toUpperCase() || 'N/A'}</p>
                                            </td>
                                            <td className="px-10 py-7">
                                                <p className="text-[15px] font-black text-zinc-950 tracking-tight">{c.product}</p>
                                                <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-institutional mt-0.5">{c.quantity} Units — {c.duration}</p>
                                            </td>
                                            <td className="px-10 py-7">
                                                <span className="text-[15px] font-black text-zinc-900 tracking-tighter">
                                                    ₹{(c.price || 0).toLocaleString('en-IN')}
                                                </span>
                                            </td>
                                            <td className="px-10 py-7">
                                                <StatusBadge status={String(c.status)} />
                                            </td>
                                            <td className="px-10 py-7">
                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <button onClick={() => openAcceptModal(c._id, c.company_id)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100 border border-emerald-50 transition-all" title="Bind Farmer">
                                                        <FileCheck className="w-4 h-4" />
                                                    </button>
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
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                title="Review Protocol"
            >
                <form onSubmit={handleEditSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Protocol Registry Status</label>
                        <select
                            value={editStatus ? 'true' : 'false'}
                            onChange={(e) => setEditStatus(e.target.value === 'true')}
                            className="input-premium appearance-none"
                        >
                            <option value="true">Live (Active)</option>
                            <option value="false">Archived (Inactive)</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-premium w-full py-5 text-sm"
                    >
                        {submitting ? 'EXECUTING...' : 'UPDATE PROTOCOL'}
                    </button>
                </form>
            </Modal>

            <Modal
                isOpen={acceptModalOpen}
                onClose={() => setAcceptModalOpen(false)}
                title="Execute Fulfillment Binding"
            >
                <form onSubmit={handleAcceptSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Farmer Contact Intel</label>
                        <input
                            type="tel"
                            value={farmerPhone}
                            onChange={(e) => setFarmerPhone(e.target.value)}
                            className="input-premium"
                            placeholder="Verified 10-digit number"
                            required
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Fulfillment Modality</label>
                        <select
                            value={paymentType}
                            onChange={(e) => setPaymentType(e.target.value)}
                            className="input-premium appearance-none"
                        >
                            <option value="Advance">Advance (Standard)</option>
                            <option value="Installment">Installment-based</option>
                            <option value="Full payment">Full Settlement</option>
                        </select>
                    </div>
                    {acceptError && <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-red-50">
                        <AlertCircle className="w-4 h-4" /> {acceptError}
                    </div>}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-premium w-full py-5 text-sm flex items-center justify-center gap-2"
                    >
                        {submitting ? 'PROCESSING...' : <><CheckCircle2 className="w-4 h-4" /> FINALIZE BINDING</>}
                    </button>
                </form>
            </Modal>
        </AdminLayout>
    );
};

export default ContractManagement;
