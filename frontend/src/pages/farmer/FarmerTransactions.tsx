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
                    />
                    <StatsCard
                        label={text.stats.revenue}
                        value={`₹${stats.totalAmount.toLocaleString('en-IN')}`}
                        icon={ArrowUpRight}
                        color="text-emerald-500"
                        trend={{ label: 'Realized', value: 0, isNeutral: true }}
                    />
                    <StatsCard
                        label={text.stats.pending}
                        value={`₹${stats.pending.toLocaleString('en-IN')}`}
                        icon={AlertCircle}
                        color="text-amber-500"
                        trend={{ label: 'Awaiting', value: 0, isNeutral: true }}
                    />
                </div>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_4px_20px_-1px_rgba(0,0,0,0.03)] overflow-hidden">
                    <div className="p-10 border-b border-gray-50 flex flex-col lg:flex-row gap-10 items-center justify-between bg-gray-50/20">
                        <div className="flex gap-2 bg-white p-1.5 rounded-[1.5rem] border border-gray-200/40 shadow-sm">
                            {(['stock', 'payments'] as const).map((id) => (
                                <button
                                    key={id}
                                    onClick={() => setTab(id)}
                                    className={`px-8 py-3 rounded-[1.25rem] text-[11px] font-black uppercase tracking-widest transition-all ${tab === id
                                        ? 'bg-black text-white shadow-lg'
                                        : 'text-gray-400 hover:text-black'
                                        }`}
                                >
                                    {text.tabs[id]}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full lg:max-w-md group">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Audit logs..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-[13px] font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Identifier</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Counterparty</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">{tab === 'stock' ? 'Volume' : 'Method'}</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Timestamp</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Status</th>
                                    <th className="px-10 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Settlement</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
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
                                        <tr key={item._id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-10 py-7">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2.5 rounded-xl ${tab === 'stock' ? 'bg-indigo-50 text-indigo-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                                        {tab === 'stock' ? <Package className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                                                    </div>
                                                    <span className="font-mono text-[11px] font-bold text-gray-400">ID-{item._id.substring(item._id.length - 8).toUpperCase()}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-7">
                                                <div>
                                                    <p className="text-[13px] font-black text-gray-900 tracking-tight">{item.contract?.company?.company_name || 'Protocol Partner'}</p>
                                                    <p className="text-[11px] font-bold text-gray-400 uppercase">{item.contract?.product || 'Commodity'}</p>
                                                </div>
                                            </td>
                                            <td className="px-10 py-7">
                                                <span className="text-[13px] font-bold text-gray-600">
                                                    {tab === 'stock' ? `${item.quantity || '0'} MT` : (item.payment_type || 'Electronic')}
                                                </span>
                                            </td>
                                            <td className="px-10 py-7 text-[13px] font-bold text-gray-400">
                                                {new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-10 py-7">
                                                <StatusBadge status={String(item.status)} />
                                            </td>
                                            <td className="px-10 py-7 text-right">
                                                <span className={`text-[15px] font-black ${tab === 'payments' ? 'text-emerald-600' : 'text-gray-900'} tracking-tighter`}>
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
