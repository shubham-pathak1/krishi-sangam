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
            : [],
        datasets: [{
            label: 'Net Earnings',
            data: activities.filter(a => a.type === 'Payment').length > 0
                ? activities.filter(a => a.type === 'Payment').map(a => a.amount).reverse()
                : [],
            borderColor: '#09090b', // Zinc-950
            backgroundColor: (context: any) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, 'rgba(9, 9, 11, 0.15)');
                gradient.addColorStop(0.5, 'rgba(9, 9, 11, 0.05)');
                gradient.addColorStop(1, 'rgba(9, 9, 11, 0)');
                return gradient;
            },
            fill: true,
            tension: 0.45, // Slightly smoother
            pointRadius: 4,
            pointBackgroundColor: '#09090b',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 7,
            pointHoverBackgroundColor: '#09090b',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 3,
            borderWidth: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.1)'
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(9, 9, 11, 0.95)',
                backdropColor: 'rgba(255, 255, 255, 0.1)',
                padding: {
                    top: 12,
                    bottom: 12,
                    left: 16,
                    right: 16
                },
                titleFont: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' as const },
                bodyFont: { family: 'Plus Jakarta Sans', size: 14, weight: 'bold' as const },
                displayColors: false,
                cornerRadius: 14,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                caretSize: 6,
                callbacks: {
                    label: (context: any) => `₹ ${context.parsed.y.toLocaleString('en-IN')}`,
                    title: (context: any) => context[0].label.toUpperCase()
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(9, 9, 11, 0.03)', drawTicks: false },
                border: { display: false },
                ticks: {
                    font: { family: 'Plus Jakarta Sans', size: 10, weight: 'bold' as const },
                    color: '#a1a1aa',
                    padding: 12,
                    callback: (value: any) => `₹${value >= 1000 ? value / 1000 + 'k' : value}`
                }
            },
            x: {
                grid: { display: false },
                border: { display: false },
                ticks: {
                    font: { family: 'Plus Jakarta Sans', size: 10, weight: 'bold' as const },
                    color: '#a1a1aa',
                    padding: 12
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FCFAF8] flex items-center justify-center relative">
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-zinc-900/5 rounded-full blur-[160px]"></div>
                </div>
                <div className="relative z-10 w-12 h-12 rounded-full border-t-2 border-zinc-950 animate-spin"></div>
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
                    imageSrc="/src/assets/images/ccontract.png"
                    trend={{ label: 'Live Protocol', icon: Activity }}
                />
                <StatsCard
                    label={text.stats.earnings}
                    value={`₹${stats.totalEarnings.toLocaleString('en-IN')}`}
                    icon={CreditCard}
                    imageSrc="/src/assets/images/transactions.png"
                    trend={{ label: '+12.5% Growth', icon: ArrowUpRight }}
                />
                <StatsCard
                    label={text.stats.crops}
                    value={stats.cropsListed}
                    icon={Leaf}
                    imageSrc="/src/assets/images/crops.png"
                    trend={{ label: 'Inventory', isNeutral: true }}
                />
                <StatsCard
                    label={text.stats.pending}
                    value={`₹${stats.pendingPayments.toLocaleString('en-IN')}`}
                    icon={Activity}
                    imageSrc="/src/assets/images/transactions.png"
                    trend={{ label: 'Settling', icon: TrendingUp }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10 pb-10">
                <div className="lg:col-span-2 bg-white/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/60 shadow-premium">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-zinc-900 font-display tracking-tightest">Revenue Stream</h3>
                            <p className="text-[15px] text-zinc-400 font-medium tracking-tight mt-1">Institutional analytics (Monthly fulfillment)</p>
                        </div>
                        <div className="flex gap-2 p-1.5 bg-zinc-50/50 rounded-2xl border border-white">
                            <button className="px-5 py-2 bg-zinc-950 text-white text-[10px] font-black rounded-xl tracking-[0.15em] uppercase shadow-lg">EARNINGS</button>
                            <button className="px-5 py-2 text-zinc-400 hover:text-zinc-900 text-[10px] font-black rounded-xl tracking-[0.15em] uppercase transition-colors">VOLUME</button>
                        </div>
                    </div>
                    <div className="h-[400px] w-full">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>

                <div className="bg-white/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/60 shadow-premium flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-black text-zinc-900 font-display tracking-tightest">Registry</h3>
                        <button className="text-[10px] font-black text-zinc-400 hover:text-zinc-950 transition-colors flex items-center gap-2 group tracking-[0.15em] uppercase">
                            HISTORY <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                        {activities.length > 0 ? activities.map((activity, index) => (
                            <div key={index} className="flex items-center gap-5 group cursor-pointer">
                                <div className={`w-14 h-14 rounded-2xl bg-white/60 flex items-center justify-center shrink-0 border border-white transition-all duration-500 shadow-sm group-hover:bg-zinc-950 group-hover:text-white group-hover:shadow-lg`}>
                                    {activity.type === 'Payment' ? <DollarSign className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[14px] font-black text-zinc-900 truncate tracking-tight">{activity.type === 'Payment' ? 'Protocol Settlement' : 'Agreement Signed'}</p>
                                    <p className="text-[11px] text-zinc-400 font-bold truncate mt-1 tracking-[0.1em] uppercase">{activity.company}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[14px] font-black text-zinc-900 tracking-tighter">₹{activity.amount.toLocaleString('en-IN')}</p>
                                    <p className="text-[10px] font-bold text-zinc-300 mt-1 uppercase tracking-[0.15em]">{new Date(activity.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-20">
                                <p className="text-[11px] font-black text-zinc-300 tracking-[0.2em] uppercase">Clear Registry Records</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(0,0,0,0.05);
                    border-radius: 20px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background-color: rgba(0,0,0,0.1);
                }
            `}</style>
        </FarmerLayout>
    );
};

export default FarmerDashboard;
