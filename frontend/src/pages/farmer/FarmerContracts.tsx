import { useState, useEffect } from 'react';
import { Eye, Edit, Calendar, DollarSign, Package, ArrowRight, CheckCircle2, AlertCircle, Activity } from 'lucide-react';
import transactionService from '../../services/transaction.service';
import FarmerLayout from '../../components/layout/FarmerLayout';
import StatsCard from '../../components/ui/StatsCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';

const FarmerContracts = () => {
    const [language] = useState<'en' | 'gu'>('en');

    const [contracts, setContracts] = useState<any[]>([]);
    const [filteredContracts, setFilteredContracts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        status: 'all',
        sort: 'start-date-desc'
    });

    const [stats, setStats] = useState({
        total: 0,
        totalValue: 0,
        active: 0
    });

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState<any>(null);
    const [requestForm, setRequestForm] = useState({
        quantity: '',
        amount: '',
        reason: ''
    });

    useEffect(() => {
        fetchContracts();
    }, []);

    useEffect(() => {
        filterAndSortContracts();
    }, [contracts, filters]);

    const fetchContracts = async () => {
        try {
            setLoading(true);
            const transactions: any[] = await transactionService.getAllTransactions();
            setContracts(transactions);

            const total = transactions.length;
            const value = transactions.reduce((acc, curr) => acc + (curr.amount || 0), 0);
            const active = transactions.filter(t => String(t.status).toLowerCase() === 'active' || t.status === true).length;

            setStats({
                total,
                totalValue: value,
                active
            });

        } catch (error) {
            console.error("Failed to fetch contracts:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortContracts = () => {
        let result = [...contracts];

        if (filters.status !== 'all') {
            result = result.filter(c => {
                const status = String(c.status).toLowerCase();
                return status === filters.status.toLowerCase();
            });
        }

        result.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            const amountA = a.amount || 0;
            const amountB = b.amount || 0;

            switch (filters.sort) {
                case 'start-date-desc': return dateB - dateA;
                case 'start-date-asc': return dateA - dateB;
                case 'amount-desc': return amountB - amountA;
                case 'amount-asc': return amountA - amountB;
                default: return 0;
            }
        });

        setFilteredContracts(result);
    };

    const openRequestModal = (contract: any) => {
        setSelectedContract(contract);
        setRequestForm({
            quantity: contract.quantity || '',
            amount: contract.amount || '',
            reason: ''
        });
        setIsModalOpen(true);
    };

    const handleRequestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Request Submitted:", { contractId: selectedContract?._id, ...requestForm });
        setIsModalOpen(false);
        alert("Modification request sent successfully to the company.");
    };

    const t = {
        en: {
            title: 'Active Agreements',
            subtitle: 'Legally binding agricultural protocols and settlements.',
            stats: {
                total: 'Total Vault',
                active: 'Live Protocol',
                value: 'Total Settlement'
            },
            status: {
                active: 'Active',
                completed: 'Settled',
                pending: 'Queued',
                all: 'All Status'
            }
        },
        gu: {
            title: 'સક્રિય કરારો',
            subtitle: 'કાયદેસર રીતે બંધનકર્તા કૃષિ પ્રોટોકોલ અને વસાહતો.',
            stats: {
                total: 'કુલ તિજોરી',
                active: 'લાઈવ પ્રોટોકોલ',
                value: 'કુલ પતાવટ'
            },
            status: {
                active: 'સક્રિય',
                completed: 'પતાવટ',
                pending: 'કતારબદ્ધ',
                all: 'બધી સ્થિતિ'
            }
        }
    };

    const text = (t as any)[language];

    return (
        <FarmerLayout title={text.title} subtitle={text.subtitle}>
            <div className="space-y-10">
                {/* Protocol Insight Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatsCard
                        label={text.stats.total}
                        value={stats.total}
                        icon={Package}
                        trend={{ label: 'Total Vault', value: 0, isNeutral: true }}
                    />
                    <StatsCard
                        label={text.stats.active}
                        value={stats.active}
                        icon={CheckCircle2}
                        color="text-emerald-500"
                        trend={{ label: 'Live Protocol', value: 0, icon: Activity }}
                    />
                    <StatsCard
                        label={text.stats.value}
                        value={`₹${stats.totalValue.toLocaleString('en-IN')}`}
                        icon={DollarSign}
                        color="text-indigo-500"
                        trend={{ label: 'Total Settlement', value: 0, icon: ArrowRight }}
                    />
                </div>

                {/* Filter Matrix */}
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex gap-2 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-200/40">
                        {['all', 'active', 'completed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilters({ ...filters, status })}
                                className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${filters.status === status
                                    ? 'bg-black text-white shadow-lg'
                                    : 'text-gray-400 hover:text-black'
                                    }`}
                            >
                                {text.status[status as keyof typeof text.status]}
                            </button>
                        ))}
                    </div>

                    <div className="lg:ml-auto flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm transition-all focus-within:border-black group">
                        <select
                            value={filters.sort}
                            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                            className="bg-transparent border-none outline-none text-[13px] font-bold text-gray-900 cursor-pointer min-w-[160px]"
                        >
                            <option value="start-date-desc">Newest First</option>
                            <option value="start-date-asc">Oldest First</option>
                            <option value="amount-desc">Value: High-Low</option>
                            <option value="amount-asc">Value: Low-High</option>
                        </select>
                    </div>
                </div>

                {/* Agreement Terminal */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-[0_4px_20px_-1px_rgba(0,0,0,0.03)]">
                    {loading ? (
                        <div className="py-32 flex flex-col items-center justify-center">
                            <div className="w-10 h-10 border-t-2 border-black rounded-full animate-spin mb-6"></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Syncing Ledger</p>
                        </div>
                    ) : filteredContracts.length === 0 ? (
                        <div className="py-32 flex flex-col items-center justify-center text-center">
                            <AlertCircle className="w-12 h-12 text-gray-100 mb-6" />
                            <p className="text-xl font-black text-gray-900 mb-2">Null Set</p>
                            <p className="text-sm text-gray-400 font-medium">No agreement records match your current filter matrix.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Contract Entity</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Terminal Date</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Volume</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Settlement</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Protocol Status</th>
                                        <th className="px-10 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Management</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredContracts.map((contract) => (
                                        <tr key={contract._id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-10 py-7">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-900 font-black text-sm border border-gray-100 group-hover:bg-black group-hover:text-white transition-all duration-300">
                                                        {contract.company?.company_name?.charAt(0) || 'L'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-gray-900 tracking-tight">{contract.product || 'Agri Commodity'}</p>
                                                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">{contract.company?.company_name || 'AgroCorp'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-7">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5 text-gray-300" />
                                                    <span className="text-sm font-bold text-gray-900">{new Date(contract.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-7 text-sm font-bold text-gray-600">{contract.quantity || '0'} MT</td>
                                            <td className="px-10 py-7 text-sm font-black text-gray-900">₹{(contract.amount || 0).toLocaleString('en-IN')}</td>
                                            <td className="px-10 py-7">
                                                <StatusBadge status={contract.status} />
                                            </td>
                                            <td className="px-10 py-7 text-right">
                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-black hover:border-black transition-all">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openRequestModal(contract)}
                                                        className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-black hover:border-black transition-all"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Contract Modification Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Protocol Adjustment"
                subtitle="Submit a formal request for contract modification."
            >
                <form
                    onSubmit={handleRequestSubmit}
                    className="space-y-8"
                >
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">TARGET QUANTITY (MT)</label>
                        <input
                            type="number"
                            required
                            value={requestForm.quantity}
                            onChange={(e) => setRequestForm({ ...requestForm, quantity: e.target.value })}
                            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all"
                            placeholder="Enter new volume..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PROPOSED RATE (PER MT)</label>
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-400">₹</span>
                            <input
                                type="number"
                                required
                                value={requestForm.amount}
                                onChange={(e) => setRequestForm({ ...requestForm, amount: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-2xl pl-10 pr-5 py-4 text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">JUSTIFICATION</label>
                        <textarea
                            rows={4}
                            required
                            value={requestForm.reason}
                            onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all resize-none"
                            placeholder="Provide formal reasoning for this protocol change..."
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-5 rounded-[1.5rem] text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-gray-200 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        INITIATE REQUEST
                    </button>
                </form>
            </Modal>
        </FarmerLayout>
    );
};

export default FarmerContracts;
