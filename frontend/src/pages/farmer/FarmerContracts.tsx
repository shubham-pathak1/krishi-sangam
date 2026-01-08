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
                        imageSrc="/src/assets/images/ccontract.png"
                        trend={{ label: 'Total Vault', isNeutral: true }}
                    />
                    <StatsCard
                        label={text.stats.active}
                        value={stats.active}
                        icon={CheckCircle2}
                        imageSrc="/src/assets/images/fmanage.png"
                        trend={{ label: 'Live Protocol', icon: Activity }}
                    />
                    <StatsCard
                        label={text.stats.value}
                        value={`₹${stats.totalValue.toLocaleString('en-IN')}`}
                        icon={DollarSign}
                        imageSrc="/src/assets/images/transactions.png"
                        trend={{ label: 'Total Settlement', icon: ArrowRight }}
                    />
                </div>

                {/* Filter Matrix */}
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex gap-2 bg-white/40 backdrop-blur-md p-1.5 rounded-[1.5rem] border border-white">
                        {['all', 'active', 'completed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilters({ ...filters, status })}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${filters.status === status
                                    ? 'bg-zinc-950 text-white shadow-xl translate-y-[-1px]'
                                    : 'text-zinc-400 hover:text-zinc-950'
                                    }`}
                            >
                                {text.status[status as keyof typeof text.status]}
                            </button>
                        ))}
                    </div>

                    <div className="lg:ml-auto flex items-center gap-3 bg-white/60 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white shadow-sm transition-all focus-within:ring-4 focus-within:ring-zinc-950/5 group">
                        <select
                            value={filters.sort}
                            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                            className="bg-transparent border-none outline-none text-[13px] font-black text-zinc-950 cursor-pointer min-w-[180px] tracking-tight"
                        >
                            <option value="start-date-desc">Newest First</option>
                            <option value="start-date-asc">Oldest First</option>
                            <option value="amount-desc">Value: High-Low</option>
                            <option value="amount-asc">Value: Low-High</option>
                        </select>
                    </div>
                </div>

                {/* Agreement Terminal */}
                <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white/60 overflow-hidden shadow-premium transition-all duration-500">
                    {loading ? (
                        <div className="py-40 flex flex-col items-center justify-center">
                            <div className="w-12 h-12 border-t-2 border-zinc-950 rounded-full animate-spin mb-8"></div>
                            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400">Syncing Institutional Ledger...</p>
                        </div>
                    ) : filteredContracts.length === 0 ? (
                        <div className="py-40 flex flex-col items-center justify-center text-center">
                            <AlertCircle className="w-16 h-16 text-zinc-200 mb-8" />
                            <p className="text-2xl font-black text-zinc-950 mb-3 tracking-tightest">Null Registry Set</p>
                            <p className="text-[15px] text-zinc-400 font-medium max-w-sm mx-auto tracking-tight">No agreement records match your current protocol filter matrix.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/40 border-b border-white/60">
                                        <th className="px-12 py-8 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">Contract Entity</th>
                                        <th className="px-12 py-8 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">Terminal Date</th>
                                        <th className="px-12 py-8 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">Volume</th>
                                        <th className="px-12 py-8 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">Settlement</th>
                                        <th className="px-12 py-8 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">Protocol Status</th>
                                        <th className="px-12 py-8 text-right text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">Management</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/20">
                                    {filteredContracts.map((contract) => (
                                        <tr key={contract._id} className="group hover:bg-white/60 transition-all duration-300">
                                            <td className="px-12 py-8">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center text-zinc-950 font-black text-sm border border-white group-hover:bg-zinc-950 group-hover:text-white group-hover:shadow-lg transition-all duration-500">
                                                        {contract.company?.company_name?.charAt(0) || 'L'}
                                                    </div>
                                                    <div>
                                                        <p className="text-[15px] font-black text-zinc-950 tracking-tight">{contract.product || 'Agri Commodity'}</p>
                                                        <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-[0.1em] mt-0.5">{contract.company?.company_name || 'AgroCorp'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-8">
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="w-4 h-4 text-zinc-300" />
                                                    <span className="text-[14px] font-semibold text-zinc-900 tracking-tight">{new Date(contract.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                            </td>
                                            <td className="px-12 py-8 text-[14px] font-semibold text-zinc-600 tracking-tight">{contract.quantity || '0'} MT</td>
                                            <td className="px-12 py-8 text-[15px] font-black text-zinc-950 tracking-tightest">₹{(contract.amount || 0).toLocaleString('en-IN')}</td>
                                            <td className="px-12 py-8">
                                                <StatusBadge status={contract.status} />
                                            </td>
                                            <td className="px-12 py-8 text-right">
                                                <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                                    <button className="p-3 bg-white/80 border border-white rounded-[1.2rem] text-zinc-400 hover:text-zinc-950 hover:bg-white hover:shadow-md transition-all active:scale-90">
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => openRequestModal(contract)}
                                                        className="p-3 bg-white/80 border border-white rounded-[1.2rem] text-zinc-400 hover:text-zinc-950 hover:bg-white hover:shadow-md transition-all active:scale-90"
                                                    >
                                                        <Edit className="w-5 h-5" />
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
                        className="w-full bg-black text-white py-5 rounded-[1.5rem] text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-gray-200 active:scale-95 transition-all"
                    >
                        INITIATE REQUEST
                    </button>
                </form>
            </Modal>
        </FarmerLayout>
    );
};

export default FarmerContracts;
