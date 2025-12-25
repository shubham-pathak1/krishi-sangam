import { useState, useEffect } from 'react';
import {
    Users, Briefcase, DollarSign, Clock,
    TrendingUp, Activity, ArrowRight
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
} from 'chart.js';
import CompanyLayout from '../../components/layout/CompanyLayout';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
);

const CompanyDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats] = useState({
        activeContracts: 12,
        totalInvestment: 850000,
        pendingDeliveries: 5,
        verifiedFarmers: 48
    });

    useEffect(() => {
        // Simulate API fetch
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const lineChartData = {
        labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        datasets: [{
            label: 'Procurement Value',
            data: [45000, 52000, 48000, 61000, 55000, 67000],
            borderColor: '#3B82F6', // Blue-500
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#3B82F6',
            pointBorderWidth: 2
        }]
    };

    const doughnutData = {
        labels: ['Wheat', 'Rice', 'Corn', 'Cotton'],
        datasets: [{
            data: [40, 25, 20, 15],
            backgroundColor: [
                '#3B82F6', // Blue-500
                '#60A5FA', // Blue-400
                '#93C5FD', // Blue-300
                '#BFDBFE'  // Blue-200
            ],
            borderWidth: 0,
            cutout: '75%'
        }]
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <CompanyLayout title="Company Dashboard" subtitle="Monitor your agricultural supply chain and contract status.">
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
                                <Briefcase className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Active</span>
                        </div>
                        <h3 className="text-gray-500 font-medium text-sm">Active Contracts</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeContracts}</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-50 rounded-2xl group-hover:bg-emerald-100 transition-colors">
                                <DollarSign className="w-6 h-6 text-emerald-600" />
                            </div>
                            <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Total Paid</span>
                        </div>
                        <h3 className="text-gray-500 font-medium text-sm">Supply Investment</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-1">₹{stats.totalInvestment.toLocaleString('en-IN')}</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-amber-50 rounded-2xl group-hover:bg-amber-100 transition-colors">
                                <Clock className="w-6 h-6 text-amber-600" />
                            </div>
                            <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{stats.pendingDeliveries} Late</span>
                        </div>
                        <h3 className="text-gray-500 font-medium text-sm">Pending Deliveries</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingDeliveries}</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-50 rounded-2xl group-hover:bg-indigo-100 transition-colors">
                                <Users className="w-6 h-6 text-indigo-600" />
                            </div>
                            <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">Network</span>
                        </div>
                        <h3 className="text-gray-500 font-medium text-sm">Verified Farmers</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{stats.verifiedFarmers}</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Procurement Trends</h3>
                                <p className="text-sm text-gray-500 mt-1">Monthly spending on farmer contracts</p>
                            </div>
                            <TrendingUp className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="h-80">
                            <Line data={lineChartData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { grid: { color: '#F3F4F6' }, border: { display: false } },
                                    x: { grid: { display: false }, border: { display: false } }
                                }
                            }} />
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Crop Distribution</h3>
                        <p className="text-sm text-gray-500 mb-8">Breakdown of current procurement</p>
                        <div className="flex-1 flex items-center justify-center relative">
                            <div className="w-48 h-48">
                                <Doughnut data={doughnutData} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />
                            </div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-bold text-gray-900">100%</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total</span>
                            </div>
                        </div>
                        <div className="mt-8 space-y-3">
                            {doughnutData.labels.map((label, i) => (
                                <div key={label} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: doughnutData.datasets[0].backgroundColor[i] }}></div>
                                        <span className="text-sm text-gray-600">{label}</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">{doughnutData.datasets[0].data[i]}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Recent Activity & Notifications */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Recent Supply Requests</h3>
                            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group">
                                View Marketplace <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors group cursor-pointer">
                                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                        <Activity className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-900">Farmer #521{item} listed new Wheat stock</p>
                                        <p className="text-xs text-gray-500">2.5 Tons • Mehsana, Gujarat • ₹2,400/quintal</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">2h ago</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Upcoming Deliveries</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { crop: 'Cotton', farmer: 'Rajesh Kumar', date: 'Dec 28', status: 'In Transit' },
                                { crop: 'Rice', farmer: 'Amit Patel', date: 'Dec 30', status: 'Processing' },
                                { crop: 'Corn', farmer: 'Suresh Singh', date: 'Jan 02', status: 'Scheduled' },
                            ].map((delivery, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50">
                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-blue-600">
                                        {delivery.farmer.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-bold text-gray-900">{delivery.crop} Delivery</p>
                                            <span className="text-xs font-semibold text-blue-600">{delivery.date}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-xs text-gray-500">{delivery.farmer}</p>
                                            <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-bold uppercase">{delivery.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </CompanyLayout>
    );
};

export default CompanyDashboard;
