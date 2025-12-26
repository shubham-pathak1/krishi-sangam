import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, AlertCircle, Pencil, Trash2 } from 'lucide-react';
import transactionService from '../../services/transaction.service';
import type { Transaction } from '../../types/transaction.types';
import AdminLayout from '../../components/layout/AdminLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import StatsCard from '../../components/ui/StatsCard';
import Modal from '../../components/ui/Modal';

const Transactions = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        contract_id: '',
        company_id: '',
        farmer_id: '',
        status: '0',
        payment_type: 'Advance',
        payment_id: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0
    });

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const data = await transactionService.getAllTransactions();
            const list = data || [];
            setTransactions(list);

            setStats({
                total: list.length,
                completed: list.filter((t: any) => t.status === true || t.status === '1').length,
                pending: list.filter((t: any) => t.status === false || t.status === '0').length
            });
        }
        catch (err) { console.error('Failed to load transactions'); }
        setLoading(false);
    };

    useEffect(() => {
        document.title = 'Transactions — KS Console';
        fetchTransactions();
    }, []);

    const filteredTransactions = transactions.filter((t) => {
        const q = searchQuery.toLowerCase();
        const statusText = t.status ? 'completed' : 'pending';
        return (
            (t.contract_id || '').toLowerCase().includes(q) ||
            (t.company_id || '').toLowerCase().includes(q) ||
            (t.farmer_id || '').toLowerCase().includes(q) ||
            statusText.includes(q) ||
            (t.payment_type || '').toLowerCase().includes(q)
        );
    });

    const openEditModal = (t: Transaction) => {
        setCurrentId(t._id);
        setFormData({
            contract_id: t.contract_id || '',
            company_id: t.company_id || '',
            farmer_id: t.farmer_id || '',
            status: t.status ? '1' : '0',
            payment_type: t.payment_type || 'Advance',
            payment_id: t.payment_id || ''
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentId) return;
        setSubmitting(true);
        try {
            await transactionService.updateTransaction(currentId, {
                ...formData,
                status: formData.status === '1'
            });
            setModalOpen(false);
            fetchTransactions();
        } catch (err) {
            console.error('Update failed');
        }
        setSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Permanently delete this financial record?')) return;
        try {
            await transactionService.deleteTransaction(id);
            fetchTransactions();
        } catch {
            alert('Deletion failed');
        }
    };

    return (
        <AdminLayout
            title="Financial Registry"
            subtitle="Deep auditing of cross-entity settlements and capital flow."
            onSearch={setSearchQuery}
        >
            <div className="space-y-10">
                {/* Fiscal Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatsCard
                        label="TOTAL TRANSACTIONS"
                        value={stats.total}
                        icon={CreditCard}
                    />
                    <StatsCard
                        label="COMPLETED SETTLEMENTS"
                        value={stats.completed}
                        icon={CheckCircle2}
                        color="text-primary-500"
                    />
                    <StatsCard
                        label="PENDING PAYMENTS"
                        value={stats.pending}
                        icon={AlertCircle}
                        color="text-amber-500"
                    />
                </div>

                {/* Operations Table */}
                <div className="bg-white rounded-3xl border border-zinc-100 shadow-premium overflow-hidden">
                    <div className="p-10 border-b border-zinc-50 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-zinc-900 font-display tracking-tight">System Transactions</h2>
                            <p className="text-sm text-zinc-400 font-bold tracking-institutional mt-1">Verify and manage the flow of funds across the network.</p>
                        </div>
                        <button className="btn-premium h-14 px-8">
                            EXPORT LEDGER
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50/50">
                                <tr>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">PROTOCOL REF</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">INVOLVED PARTIES</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">STATUS</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">MODALITY</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] text-right">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-20 text-center text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">Synchronizing Ledger...</td>
                                    </tr>
                                ) : filteredTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-20 text-center text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em]">No transactional data available.</td>
                                    </tr>
                                ) : (
                                    filteredTransactions.map((t) => (
                                        <tr key={t._id} className="group hover:bg-zinc-50 transition-colors">
                                            <td className="px-10 py-7">
                                                <p className="text-xs font-bold text-zinc-400 font-mono tracking-tighter">REF-{t.contract_id?.slice(-8).toUpperCase() || 'N/A'}</p>
                                                <p className="text-[10px] text-zinc-300 font-bold mt-1 uppercase tracking-widest">UID: {t._id.slice(-6).toUpperCase()}</p>
                                            </td>
                                            <td className="px-10 py-7">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">FARMER:</span>
                                                        <span className="text-[13px] font-black text-zinc-900 tracking-tighter">{t.farmer_id?.slice(-8).toUpperCase()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">ENTITY:</span>
                                                        <span className="text-[13px] font-black text-zinc-500 tracking-tighter">{t.company_id?.slice(-8).toUpperCase()}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-7">
                                                <StatusBadge status={String(t.status)} />
                                            </td>
                                            <td className="px-10 py-7">
                                                <span className="px-3 py-1.5 bg-zinc-50 text-[10px] font-black text-zinc-900 rounded-lg border border-zinc-100 uppercase tracking-widest">{t.payment_type}</span>
                                            </td>
                                            <td className="px-10 py-7">
                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <button onClick={() => openEditModal(t)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-50 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-all border border-zinc-100">
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(t._id)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 transition-all border border-red-50">
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

            {/* Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Verify Transaction"
            >
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Payment Protocol</label>
                            <select
                                value={formData.payment_type}
                                onChange={(e) => setFormData({ ...formData, payment_type: e.target.value })}
                                className="input-premium appearance-none"
                            >
                                <option value="Advance">Advance (Standard)</option>
                                <option value="Installment">Installment-based</option>
                                <option value="Full Payment">Full Settlement</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Registry Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="input-premium appearance-none"
                            >
                                <option value="1">Settled (Finalized)</option>
                                <option value="0">Pending (Awaiting Flow)</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Institutional Payment Identifier</label>
                        <input
                            type="text"
                            value={formData.payment_id}
                            onChange={(e) => setFormData({ ...formData, payment_id: e.target.value })}
                            className="input-premium"
                            placeholder="e.g. TXN-8273-KS-PROTOCOL"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-premium w-full py-5 text-sm"
                    >
                        {submitting ? 'EXECUTING...' : 'COMMIT AUDIT CHANGES'}
                    </button>
                </form>
            </Modal>
        </AdminLayout>
    );
};

export default Transactions;
