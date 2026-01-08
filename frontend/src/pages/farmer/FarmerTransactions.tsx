import { useState, useEffect } from 'react';
import { ArrowUpRight, Search, Activity, CreditCard, Package, AlertCircle } from 'lucide-react';
import transactionService from '../../services/transaction.service';
import FarmerLayout from '../../components/layout/FarmerLayout';
import StatsCard from '../../components/ui/StatsCard';
import StatusBadge from '../../components/ui/StatusBadge';

interface Transaction {
    _id: string;
    contract_id: string;
    company_id: string;
    contract?: any;
    farmer_id: string;
    status: boolean | string;
    payment_type: string;
    payment_id?: string;
    amount?: number;
    quantity?: string;
    createdAt: string;
}

const FarmerTransactions = () => {
    const [language] = useState<'en' | 'gu'>('en');

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [tab, setTab] = useState<'stock' | 'payments'>('stock');

    const [stats, setStats] = useState({
        total: 0,
        totalAmount: 0,
        pending: 0
    });

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const data: any = await transactionService.getAllTransactions();
            const transactionsData = Array.isArray(data) ? data : [];
            setTransactions(transactionsData);

            const total = transactionsData.length;
            const totalAmount = transactionsData.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);
            const pending = transactionsData.reduce((acc: number, curr: any) => {
                const isPending = String(curr.status).toLowerCase() === 'pending' || curr.status === false;
                return isPending ? acc + (curr.amount || 0) : acc;
            }, 0);

            setStats({ total, totalAmount, pending });
        } catch (error) {
            console.error(error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const t = {
        en: {
            title: 'Financial Console',
            subtitle: 'Institutional-grade ledger of commodity flows and settlements.',
            stats: {
                total: 'Event Volume',
                revenue: 'Realized Revenue',
                pending: 'Awaiting Settlement'
            },
            tabs: {
                stock: 'Asset Logistics',
                payments: 'Wallet History'
            }
        },
        gu: {
            title: 'નાણાકીય કન્સોલ',
            subtitle: 'ચીજવસ્તુઓના પ્રવાહ અને વસાહતોનું સંસ્થાકીય-ગ્રેડ લેજર.',
            stats: {
                total: 'ઇવેન્ટ વોલ્યુમ',
                revenue: 'પ્રાપ્ત આવક',
                pending: 'પતાવટ બાકી'
            },
            tabs: {
                stock: 'એસેટ લોજિસ્ટિક્સ',
                payments: 'વોલેટ ઇતિહાસ'
            }
        }
    };

    const text = (t as any)[language];

    const filteredTransactions = transactions.filter(t => {
        const term = search.toLowerCase();
        return (
            t._id.toLowerCase().includes(term) ||
            (t.contract?.product || '').toLowerCase().includes(term) ||
            (t.contract?.company?.company_name || '').toLowerCase().includes(term)
        );
    });

    return (
        <FarmerLayout title={text.title} subtitle={text.subtitle}>
            <div className="space-y-10">
                {/* Fiscal Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatsCard
                        label={text.stats.total}
                        value={stats.total}
                        icon={Activity}
                        imageSrc="/src/assets/images/fmanage.png"
                    />
                    <StatsCard
                        label={text.stats.revenue}
                        value={`₹${stats.totalAmount.toLocaleString('en-IN')}`}
                        icon={ArrowUpRight}
                        imageSrc="/src/assets/images/transactions.png"
                        trend={{ label: 'Realized Protocol', icon: Activity }}
                    />
                    <StatsCard
                        label={text.stats.pending}
                        value={`₹${stats.pending.toLocaleString('en-IN')}`}
                        icon={AlertCircle}
                        imageSrc="/src/assets/images/ccontract.png"
                        trend={{ label: 'Awaiting Settlement', isNeutral: true }}
                    />
                </div>

                <div className="bg-white/40 backdrop-blur-2xl rounded-[3rem] border border-white/60 shadow-premium overflow-hidden transition-[background-color] duration-500">
                    <div className="p-10 border-b border-white/40 flex flex-col lg:flex-row gap-10 items-center justify-between">
                        <div className="flex gap-2 bg-white/40 backdrop-blur-md p-1.5 rounded-[1.5rem] border border-white">
                            {(['stock', 'payments'] as const).map((id) => (
                                <button
                                    key={id}
                                    onClick={() => setTab(id)}
                                    className={`px-8 py-3 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${tab === id
                                        ? 'bg-zinc-950 text-white shadow-xl'
                                        : 'text-zinc-400 hover:text-zinc-950'
                                        }`}
                                >
                                    {text.tabs[id]}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full lg:max-w-md group">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Audit logs..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-[13px] font-black placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-950/5 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/20 border-b border-white/40">
                                    <th className="px-12 py-8 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">Identifier</th>
                                    <th className="px-12 py-8 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">Counterparty</th>
                                    <th className="px-12 py-8 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">{tab === 'stock' ? 'Volume' : 'Method'}</th>
                                    <th className="px-12 py-8 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">Timestamp</th>
                                    <th className="px-12 py-8 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">Status</th>
                                    <th className="px-12 py-8 text-right text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">Settlement</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/20">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center">
                                            <div className="w-8 h-8 border-t-2 border-black rounded-full animate-spin mx-auto mb-4"></div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Parsing Ledger</p>
                                        </td>
                                    </tr>
                                ) : filteredTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center">
                                            <AlertCircle className="w-10 h-10 text-gray-100 mx-auto mb-4" />
                                            <p className="text-sm font-black text-gray-300 uppercase tracking-widest">Null Response</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTransactions.map((item) => (
                                        <tr key={item._id} className="group hover:bg-white/60 transition-all duration-300">
                                            <td className="px-12 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 rounded-2xl ${tab === 'stock' ? 'bg-zinc-100 text-zinc-950' : 'bg-zinc-950 text-white shadow-lg'} transition-all duration-500`}>
                                                        {tab === 'stock' ? <Package className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                                                    </div>
                                                    <span className="font-mono text-[10px] font-black text-zinc-400">ID-{item._id.substring(item._id.length - 8).toUpperCase()}</span>
                                                </div>
                                            </td>
                                            <td className="px-12 py-8">
                                                <div>
                                                    <p className="text-[14px] font-black text-zinc-950 tracking-tight">{item.contract?.company?.company_name || 'Protocol Partner'}</p>
                                                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.1em] mt-0.5">{item.contract?.product || 'Commodity'}</p>
                                                </div>
                                            </td>
                                            <td className="px-12 py-8">
                                                <span className="text-[14px] font-semibold text-zinc-600 tracking-tight">
                                                    {tab === 'stock' ? `${item.quantity || '0'} MT` : (item.payment_type || 'Electronic')}
                                                </span>
                                            </td>
                                            <td className="px-12 py-8 text-[14px] font-semibold text-zinc-400 tracking-tight">
                                                {new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-12 py-8">
                                                <StatusBadge status={String(item.status)} />
                                            </td>
                                            <td className="px-12 py-8 text-right">
                                                <span className={`text-[17px] font-black text-zinc-950 tracking-tightest`}>
                                                    ₹{(item.amount || 0).toLocaleString('en-IN')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </FarmerLayout>
    );
};

export default FarmerTransactions;
