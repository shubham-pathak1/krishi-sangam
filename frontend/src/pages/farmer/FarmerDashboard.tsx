import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Activity, LayoutDashboard, CreditCard, Leaf,
    ArrowUpRight, TrendingUp, ArrowRight, DollarSign, FileText
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import FarmerLayout from '../../components/layout/FarmerLayout';
import StatsCard from '../../components/ui/StatsCard';
import contractService from '../../services/contract.service';
import transactionService from '../../services/transaction.service';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const FarmerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        activeContracts: 0,
        totalEarnings: 0,
        cropsListed: 0,
        pendingPayments: 0
    });
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const text = {
        stats: {
            active: 'Active Contracts',
            earnings: 'Total Revenue',
            crops: 'Crops Listed',
            pending: 'Pending Payment'
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [contracts, transactions] = await Promise.all([
                    contractService.getAllContracts(),
                    transactionService.getAllTransactions()
                ]);

                const active = contracts.filter((c: any) => c.status === true || String(c.status) === 'active').length;
                const earnings = transactions
                    .filter((t: any) => String(t.status).toLowerCase() === 'completed')
                    .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

                const uniqueCrops = new Set(contracts.map((c: any) => c.crop_name || c.contract?.crop_name)).size;
                const pending = transactions
                    .filter((t: any) => String(t.status).toLowerCase() === 'pending' || t.status === false)
                    .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

                setStats({
                    activeContracts: active,
                    totalEarnings: earnings,
                    cropsListed: uniqueCrops,
                    pendingPayments: pending
                });

                const formattedActivity = [
                    ...contracts.map((c: any) => ({
                        type: 'Contract',
                        company: c.company?.company_name || 'AgroCorp',
                        details: `Crop: ${c.crop_name || 'Crop'}`,
                        amount: (c.price_per_unit || 0) * (c.quantity || 0),
                        date: c.createdAt,
                        status: c.status ? 'Active' : 'Completed'
                    })),
                    ...transactions.map((t: any) => ({
                        type: 'Payment',
                        company: t.contract?.company?.company_name || 'AgroCorp',
                        details: `ID: ${t._id?.substring(0, 8)}`,
                        amount: t.amount,
                        date: t.date || t.createdAt,
                        status: String(t.status).toLowerCase() === 'completed' ? 'Completed' : 'Pending'
                    }))
                ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

                setActivities(formattedActivity);
            } catch (error: any) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user, navigate]);

    const chartData = {
        labels: activities.filter(a => a.type === 'Payment').length > 0
            ? activities.filter(a => a.type === 'Payment').map(a => new Date(a.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })).reverse()
            : ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        datasets: [{
            label: 'Net Earnings',
            data: activities.filter(a => a.type === 'Payment').length > 0
                ? activities.filter(a => a.type === 'Payment').map(a => a.amount).reverse()
                : [12000, 15000, 11000, 18000, 15000, 22000],
            borderColor: '#10b981', // Emerald-500
            backgroundColor: (context: any) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
                gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
                return gradient;
            },
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHitRadius: 10,
            pointBackgroundColor: '#10b981',
            borderWidth: 3
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#09090b',
                padding: 16,
                titleFont: { family: 'Inter', size: 13, weight: 'bold' as const },
                bodyFont: { family: 'Inter', size: 13 },
                displayColors: false,
                cornerRadius: 16,
                callbacks: {
                    label: (context: any) => `₹${context.parsed.y.toLocaleString('en-IN')}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#f4f4f5', drawTicks: false },
                border: { display: false },
                ticks: {
                    font: { family: 'Inter', size: 11, weight: 'bold' as const },
                    color: '#a1a1aa',
                    padding: 12,
                    callback: (value: any) => `₹${value >= 1000 ? value / 1000 + 'k' : value}`
                }
            },
            x: {
                grid: { display: false },
                border: { display: false },
                ticks: {
                    font: { family: 'Inter', size: 11, weight: 'bold' as const },
                    color: '#a1a1aa',
                    padding: 12
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-t-2 border-zinc-900 animate-spin"></div>
            </div>
        );
    }

    return (
        <FarmerLayout title={`Hello, ${user?.Name?.split(' ')[0] || 'Farmer'}.`} subtitle="Institutional performance and agricultural registry overview.">
            {/* Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatsCard
                    label={text.stats.active}
                    value={stats.activeContracts}
                    icon={LayoutDashboard}
                    trend={{ label: 'Live Protocol', icon: Activity }}
                />
                <StatsCard
                    label={text.stats.earnings}
                    value={`₹${stats.totalEarnings.toLocaleString('en-IN')}`}
                    icon={CreditCard}
                    trend={{ label: '+12.5%', icon: ArrowUpRight }}
                    color="text-emerald-500"
                />
                <StatsCard
                    label={text.stats.crops}
                    value={stats.cropsListed}
                    icon={Leaf}
                    trend={{ label: 'Inventory', isNeutral: true }}
                />
                <StatsCard
                    label={text.stats.pending}
                    value={`₹${stats.pendingPayments.toLocaleString('en-IN')}`}
                    icon={Activity}
                    trend={{ label: 'Settling', icon: TrendingUp }}
                    color="text-amber-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
                <div className="lg:col-span-2 bg-white p-10 rounded-3xl border border-zinc-100 shadow-premium">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-black text-zinc-900 font-display tracking-tight">Revenue Stream</h3>
                            <p className="text-sm text-zinc-400 font-bold tracking-institutional mt-1">Institutional analytics (Monthly fulfillment)</p>
                        </div>
                        <div className="flex gap-2 p-1.5 bg-zinc-50 rounded-2xl">
                            <button className="px-5 py-2 bg-zinc-950 text-white text-[11px] font-black rounded-xl tracking-widest uppercase">EARNINGS</button>
                            <button className="px-5 py-2 text-zinc-400 hover:text-zinc-900 text-[11px] font-black rounded-xl tracking-widest uppercase transition-colors">VOLUME</button>
                        </div>
                    </div>
                    <div className="h-[380px] w-full">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>

                <div className="bg-white p-10 rounded-3xl border border-zinc-100 shadow-premium flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black text-zinc-900 font-display tracking-tight">Registry</h3>
                        <button className="text-[11px] font-black text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-2 group tracking-widest uppercase">
                            HISTORY <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                        {activities.length > 0 ? activities.map((activity, index) => (
                            <div key={index} className="flex items-center gap-5 group cursor-pointer">
                                <div className={`w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center shrink-0 border border-zinc-100 transition-all duration-300 group-hover:bg-zinc-950 group-hover:text-white`}>
                                    {activity.type === 'Payment' ? <DollarSign className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[14px] font-black text-zinc-900 truncate tracking-tight">{activity.type === 'Payment' ? 'Protocol Settlement' : 'Agreement Signed'}</p>
                                    <p className="text-[12px] text-zinc-400 font-bold truncate mt-1 tracking-institutional uppercase">{activity.company}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[14px] font-black text-zinc-900 tracking-tighter">₹{activity.amount.toLocaleString('en-IN')}</p>
                                    <p className="text-[11px] font-bold text-zinc-300 mt-1 uppercase tracking-widest">{new Date(activity.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-20">
                                <p className="text-sm font-black text-zinc-300 tracking-widest uppercase italic">Clear Registry</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #f1f1f1;
                    border-radius: 20px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background-color: #e4e4e7;
                }
            `}</style>
        </FarmerLayout>
    );
};

export default FarmerDashboard;
