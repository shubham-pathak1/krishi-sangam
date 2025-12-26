import { useState, useEffect } from 'react';
import {
    FileText, CreditCard, Activity, CheckCircle2, Users, Building2,
    ArrowRight
} from 'lucide-react';
import adminService from '../../services/admin.service';
import contractService from '../../services/contract.service';
import { Radar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
    LinearScale
} from 'chart.js';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
    LinearScale
);
import type { AdminCounts } from '../../types/admin.types';
import type { Contract } from '../../types/contract.types';
import StatsCard from '../../components/ui/StatsCard';
import StatusBadge from '../../components/ui/StatusBadge';
import AdminLayout from '../../components/layout/AdminLayout';
import * as farmerService from '../../services/farmer.service';
import * as companyService from '../../services/company.service';

const AdminDashboard = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [counts, setCounts] = useState<AdminCounts>({
        Farmers: 0,
        Companies: 0,
        'Active Contracts': 0,
        'Completed Contracts': 0,
    });
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'Console — Krishi Sangam';
        const fetchData = async () => {
            setLoading(true);
            try {
                // Try to get counts from API, if fails, aggregate from other calls
                let countsData: AdminCounts;
                let contractsData: Contract[];

                try {
                    const [cData, contData] = await Promise.all([
                        adminService.getCounts(),
                        contractService.getAllContracts(),
                    ]);
                    countsData = cData;
                    contractsData = contData;
                } catch (e) {
                    console.warn('Dashboard specific counts failed, aggregating locally...');
                    const [fData, compData, contData] = await Promise.all([
                        farmerService.getAllFarmers(),
                        companyService.getAllCompanies(),
                        contractService.getAllContracts(),
                    ]);
                    contractsData = contData;
                    countsData = {
                        Farmers: fData.length,
                        Companies: compData.length,
                        'Active Contracts': contData.filter((c: Contract) => c.status === true || String(c.status).toLowerCase() === 'active').length,
                        'Completed Contracts': contData.filter((c: Contract) => c.status === false || String(c.status).toLowerCase() === 'completed').length,
                    };
                }

                setCounts(countsData);
                setContracts(contractsData || []);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredContracts = contracts.filter((contract) => {
        const query = searchQuery.toLowerCase();
        return (
            (contract.product || '').toLowerCase().includes(query) ||
            (contract.company_id || '').toLowerCase().includes(query) ||
            (contract._id || '').toLowerCase().includes(query)
        );
    });

    const radarData = {
        labels: ['REGISTRY GROWTH', 'NODE STABILITY', 'TRANS-VELOCITY', 'API UPTIME', 'QUERY LATENCY'],
        datasets: [{
            label: 'System Vitality',
            data: [
                Math.min(100, (counts.Farmers + counts.Companies) * 2), // Registry growth (scaled)
                counts['Active Contracts'] > 0 ? 95 : 0,               // Node stability
                counts['Completed Contracts'] > 5 ? 88 : 40,           // Trans-velocity
                loading ? 0 : 99,                                      // API Uptime
                loading ? 0 : 92                                       // Query Latency
            ],
            backgroundColor: 'rgba(9, 9, 11, 0.05)',
            borderColor: '#09090b',
            borderWidth: 2,
            pointBackgroundColor: '#09090b',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#09090b'
        }]
    };

    const radarOptions = {
        scales: {
            r: {
                angleLines: { color: 'rgba(9, 9, 11, 0.05)' },
                grid: { color: 'rgba(9, 9, 11, 0.05)' },
                pointLabels: {
                    font: { family: 'Plus Jakarta Sans', size: 10, weight: 'bold' as const },
                    color: '#a1a1aa'
                },
                ticks: { display: false }
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(9, 9, 11, 0.95)',
                padding: 12,
                titleFont: { family: 'Plus Jakarta Sans', size: 10, weight: 'bold' as const },
                bodyFont: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' as const },
                displayColors: false,
                cornerRadius: 12
            }
        }
    };

    const doughnutData = {
        labels: ['Farmers', 'Companies', 'Active'],
        datasets: [{
            data: [counts.Farmers, counts.Companies, counts['Active Contracts']],
            backgroundColor: [
                '#09090b', // Black
                '#71717a', // Zinc-500
                '#d4d4d8', // Zinc-300
            ],
            borderWidth: 0,
            hoverOffset: 15
        }]
    };

    const doughnutOptions = {
        cutout: '80%',
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(9, 9, 11, 0.95)',
                padding: 12,
                titleFont: { family: 'Plus Jakarta Sans', size: 10, weight: 'bold' as const },
                bodyFont: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' as const },
                displayColors: false,
                cornerRadius: 12
            }
        }
    };

    return (
        <AdminLayout
            title="System Insights"
            subtitle="Operational command center for agricultural trade and monitoring."
            onSearch={setSearchQuery}
        >
            <div className="space-y-10">
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    <StatsCard
                        label="PROTOCOL VOLUME"
                        value={counts['Active Contracts'] || 0}
                        icon={FileText}
                        imageSrc="/src/assets/images/ccontract.png"
                        trend={{ label: '+4.2% Growth', icon: Activity }}
                    />
                    <StatsCard
                        label="VERIFIED FARMERS"
                        value={counts.Farmers || 0}
                        icon={Users}
                        imageSrc="/src/assets/images/fmanage.png"
                        trend={{ label: 'Aggregated', isNeutral: true }}
                    />
                    <StatsCard
                        label="ENTERPRISE NODES"
                        value={counts.Companies || 0}
                        icon={Building2}
                        imageSrc="/src/assets/images/cmanage.png"
                        trend={{ label: 'Institutional', isNeutral: true }}
                    />
                    <StatsCard
                        label="TOTAL SETTLEMENTS"
                        value={counts['Completed Contracts'] || 0}
                        icon={CreditCard}
                        imageSrc="/src/assets/images/transactions.png"
                        trend={{ label: 'Finalized', icon: CheckCircle2 }}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white/60 p-10 shadow-premium flex flex-col items-center justify-center min-h-[450px]">
                        <div className="w-full flex justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-black text-zinc-900 tracking-tightest">SYSTEM VITALITY</h3>
                                <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Institutional Health Index</p>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 rounded-2xl border border-zinc-100">
                                <div className="w-2 h-2 bg-zinc-950 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Live Pulse</span>
                            </div>
                        </div>
                        <div className="w-full flex-1 max-w-md">
                            <Radar data={radarData} options={radarOptions as any} />
                        </div>
                    </div>

                    <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white/60 p-10 shadow-premium flex flex-col items-center">
                        <div className="w-full mb-10">
                            <h3 className="text-xl font-black text-zinc-900 tracking-tightest">NETWORK DENSITY</h3>
                            <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Weighted Entity Distribution</p>
                        </div>
                        <div className="relative w-64 h-64 mb-10">
                            <Doughnut data={doughnutData} options={doughnutOptions as any} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-black text-zinc-900 tracking-tightest">{counts.Farmers + counts.Companies}</span>
                                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-1">Total Nodes</span>
                            </div>
                        </div>
                        <div className="w-full space-y-4">
                            {[
                                { label: 'Farmers', count: counts.Farmers, color: 'bg-zinc-950' },
                                { label: 'Agro-Corps', count: counts.Companies, color: 'bg-zinc-500' },
                                { label: 'Active Channels', count: counts['Active Contracts'], color: 'bg-zinc-300' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-zinc-50/50 rounded-2xl border border-white">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                        <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider">{item.label}</span>
                                    </div>
                                    <span className="text-sm font-black text-zinc-950 tracking-tighter">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Primary Ledger */}
                <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-500">
                    <div className="p-8 lg:p-12 border-b border-white/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div>
                            <h2 className="text-3xl font-black text-zinc-900 font-display tracking-tightest">Agro-Protocol Registry</h2>
                            <p className="text-[15px] text-zinc-500 font-medium tracking-tight mt-1">Audit log of system-wide agricultural agreements and status.</p>
                        </div>
                        <button className="flex items-center gap-2.5 px-8 py-3 bg-zinc-950 text-white rounded-[1.2rem] text-[11px] font-black uppercase tracking-[0.15em] hover:bg-zinc-800 transition-all border border-zinc-900 group shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                            VIEW FULL AUDIT <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead>
                                <tr className="bg-zinc-50/30">
                                    <th className="px-12 py-7 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">PROTOCOL ID</th>
                                    <th className="px-12 py-7 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">COMMODITY</th>
                                    <th className="px-12 py-7 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">INTENSITY</th>
                                    <th className="px-12 py-7 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">VALUATION</th>
                                    <th className="px-12 py-7 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">PROTO-STATE</th>
                                    <th className="px-12 py-7 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">TIMESTAMP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-12 py-32 text-center">
                                            <div className="flex flex-col items-center gap-5">
                                                <div className="w-10 h-10 rounded-full border-[3px] border-zinc-900 border-t-transparent animate-spin"></div>
                                                <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Synchronizing Registry...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredContracts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-12 py-32 text-center text-zinc-400 font-black uppercase tracking-[0.2em] text-[11px]">
                                            Clear Ledger Record — No matches found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredContracts.map((contract) => (
                                        <tr key={contract._id} className="group hover:bg-zinc-50/80 transition-all duration-300 cursor-pointer">
                                            <td className="px-12 py-8 text-[12px] font-semibold text-zinc-400 font-mono tracking-tightest">
                                                #{contract._id.slice(-8).toUpperCase()}
                                            </td>
                                            <td className="px-12 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 shadow-[0_0_10px_rgba(0,0,0,0.1)]"></div>
                                                    <span className="text-[15px] font-bold text-zinc-900 tracking-tight">{contract.product || 'Standard Commodity'}</span>
                                                </div>
                                            </td>
                                            <td className="px-12 py-8 text-[14px] font-medium text-zinc-600 tracking-tight">
                                                {contract.quantity || '0'} Metric Tonnes
                                            </td>
                                            <td className="px-12 py-8 text-[16px] font-black text-zinc-950 tracking-tightest">
                                                ₹{(contract.price || 0).toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-12 py-8">
                                                <StatusBadge status={String(contract.status)} />
                                            </td>
                                            <td className="px-12 py-8 text-xs font-semibold text-zinc-400 uppercase tracking-[0.1em] whitespace-nowrap">
                                                {new Date(contract.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
