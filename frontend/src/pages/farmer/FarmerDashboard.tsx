import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { Menu, X, Search, Bell, User, LogOut, ChevronDown, Leaf, FileText, CreditCard, LayoutDashboard } from 'lucide-react';
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
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [language, setLanguage] = useState<'en' | 'gu'>('en');

    const [stats, setStats] = useState({
        activeContracts: 0,
        totalEarnings: 0,
        cropsListed: 0,
        pendingPayments: 0
    });
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Dynamically import services to avoid circular deps if any
                const { getAllContracts } = await import('../../services/contract.service');
                const transactionResult = await import('../../services/transaction.service');
                const getAllTransactions = transactionResult.default.getAllTransactions;

                const [contracts, transactions] = await Promise.all([
                    getAllContracts(),
                    getAllTransactions()
                ]);

                // Calculate Stats
                const active = contracts.filter((c: any) => c.status === true).length; // Assuming status true means active
                const earnings = transactions
                    .filter((t: any) => t.status === 'Completed') // Adjust based on actual status values
                    .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

                // Crops listed - derived from contracts for now
                const uniqueCrops = new Set(contracts.map((c: any) => c.crop_name)).size;
                const pending = transactions
                    .filter((t: any) => t.status === 'Pending')
                    .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

                setStats({
                    activeContracts: active,
                    totalEarnings: earnings,
                    cropsListed: uniqueCrops,
                    pendingPayments: pending
                });

                // Format Activity
                const formattedActivity = [
                    ...contracts.map((c: any) => ({
                        type: 'Contract',
                        company: c.company?.company_name || 'Unknown',
                        details: `Crop: ${c.crop_name}, Qty: ${c.quantity} ${c.unit || 'kg'}`,
                        amount: c.price_per_unit * c.quantity, // Estimate
                        date: c.createdAt,
                        status: c.status ? 'Active' : 'Completed' // Logic check needed
                    })),
                    ...transactions.map((t: any) => ({
                        type: 'Payment',
                        company: t.contract?.company?.company_name || 'Unknown',
                        details: `Payment ID: ${t._id.substring(0, 8)}`,
                        amount: t.amount,
                        date: t.date || t.createdAt,
                        status: t.status
                    }))
                ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

                setActivities(formattedActivity);
            } catch (error: any) {
                console.error('Failed to fetch dashboard data:', error);
                // Do NOT redirect automatically on API errors to avoid loops (e.g. if transaction endpoint 404s but profile exists)
                // Instead, we will just show empty stats or an error message if needed
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user, navigate]);

    // Generate Chart Data dynamically from transactions
    const chartLabels = activities.length > 0
        ? activities.filter(a => a.type === 'Payment').map(a => new Date(a.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })).reverse()
        : ['No Data'];

    const chartEarnings = activities.length > 0
        ? activities.filter(a => a.type === 'Payment').map(a => a.amount).reverse()
        : [0];

    const chartData = {
        labels: chartLabels,
        datasets: [{
            label: 'Earnings (₹)',
            data: chartEarnings,
            borderColor: '#24B05E',
            backgroundColor: 'rgba(36, 176, 94, 0.2)',
            fill: true,
            tension: 0.3
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f0f0f0'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            navigate('/login');
        }
    };

    const t = {
        en: {
            dashboard: 'Dashboard',
            explore: 'Explore Contracts',
            myContracts: 'My Contracts',
            myCrops: 'My Crops',
            transactions: 'Transactions',
            welcome: `Welcome, ${user?.Name || 'Farmer'}`,
            subtitle: 'Manage your contracts, crops, and transactions here.',
            activeContracts: 'Active Contracts',
            totalEarnings: 'Total Earnings',
            cropsListed: 'Crops Listed',
            pendingPayments: 'Pending Payments',
            earningsTrend: 'Earnings Trend (Last 6 Months)',
            recentActivity: 'Recent Activity',
            topCompanies: 'Top Companies',
            pendingActions: 'Pending Actions',
            type: 'Type',
            company: 'Company',
            details: 'Details',
            amount: 'Amount',
            date: 'Date',
            status: 'Status',
            actions: 'Actions',
            view: 'View',
            logout: 'Logout'
        },
        gu: {
            dashboard: 'ડેશબોર્ડ',
            explore: 'કરાર શોધો',
            myContracts: 'મારા કરાર',
            myCrops: 'મારા પાક',
            transactions: 'વ્યવહારો',
            welcome: `${user?.Name || 'ખેડૂત'}, સ્વાગત છે`,
            subtitle: 'અહીં તમારા કરાર, પાક અને વ્યવહારોનું સંચાલન કરો.',
            activeContracts: 'સક્રિય કરાર',
            totalEarnings: 'કુલ કમાણી',
            cropsListed: 'સૂચિબદ્ધ પાક',
            pendingPayments: 'બાકી ચૂકવણીઓ',
            earningsTrend: 'કમાણી વલણ (છેલ્લા 6 મહિના)',
            recentActivity: 'તાજેતરની પ્રવૃત્તિ',
            topCompanies: 'ટોચની કંપનીઓ',
            pendingActions: 'બાકી ક્રિયાઓ',
            type: 'પ્રકાર',
            company: 'કંપની',
            details: 'વિગતો',
            amount: 'રકમ',
            date: 'તારીખ',
            status: 'સ્થિતિ',
            actions: 'ક્રિયાઓ',
            view: 'જુઓ',
            logout: 'લૉગઆઉટ'
        }
    };

    const text = t[language];

    const getStatusClass = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'active' || s === 'completed') return 'text-emerald-600 font-bold';
        if (s === 'pending') return 'text-red-500 font-bold';
        return 'text-gray-600 font-bold';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block`}>
                <div className="flex items-center justify-between p-6 h-20 border-b">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/src/assets/images/l.png" alt="Logo" className="h-8 w-auto" />
                        <span className="text-xl font-bold text-gray-900">Krishi Sangam</span>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <nav className="p-4 space-y-1">
                    <Link to="/farmer/dashboard" className="flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-medium">
                        <LayoutDashboard className="w-5 h-5" />
                        {text.dashboard}
                    </Link>
                    <Link to="/farmer/explore-contracts" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                        <Search className="w-5 h-5" />
                        {text.explore}
                    </Link>
                    <Link to="/farmer/contracts" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                        <FileText className="w-5 h-5" />
                        {text.myContracts}
                    </Link>
                    <Link to="/farmer/crops" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                        <Leaf className="w-5 h-5" />
                        {text.myCrops}
                    </Link>
                    <Link to="/farmer/transactions" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                        <CreditCard className="w-5 h-5" />
                        {text.transactions}
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className={`sticky top-0 z-40 bg-white border-b transition-shadow ${scrolled ? 'shadow-sm' : ''}`}>
                    <div className="flex items-center justify-between px-6 py-4 h-20">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mr-4">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex-1 max-w-xl hidden md:block">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4 ml-auto">
                            <button
                                onClick={() => setLanguage(l => l === 'en' ? 'gu' : 'en')}
                                className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                {language === 'en' ? 'GU' : 'EN'}
                            </button>
                            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                                        {user?.Name?.charAt(0) || 'F'}
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                </button>
                                {profileOpen && (
                                    <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-fade-in-up z-50">
                                        <div className="px-4 py-2 border-b border-gray-50">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{user?.Name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.Email}</p>
                                        </div>
                                        <Link to="/farmer/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                            <User className="w-4 h-4" /> Profile
                                        </Link>
                                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left">
                                            <LogOut className="w-4 h-4" /> {text.logout}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
                        {/* Welcome */}
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{text.welcome}</h1>
                            <p className="text-gray-500 mt-1">{text.subtitle}</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
                                <h3 className="text-sm font-medium text-gray-500">{text.activeContracts}</h3>
                                <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.activeContracts}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
                                <h3 className="text-sm font-medium text-gray-500">{text.totalEarnings}</h3>
                                <p className="text-3xl font-bold text-emerald-600 mt-2">₹{stats.totalEarnings.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
                                <h3 className="text-sm font-medium text-gray-500">{text.cropsListed}</h3>
                                <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.cropsListed}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
                                <h3 className="text-sm font-medium text-gray-500">{text.pendingPayments}</h3>
                                <p className="text-3xl font-bold text-red-500 mt-2">₹{stats.pendingPayments.toLocaleString('en-IN')}</p>
                            </div>
                        </div>

                        {/* Chart Section */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">{text.earningsTrend}</h3>
                            <div className="h-64 sm:h-80 w-full">
                                <Line data={chartData} options={chartOptions} />
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900">{text.recentActivity}</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.type}</th>
                                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.company}</th>
                                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.amount}</th>
                                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.status}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {activities.length > 0 ? activities.map((activity, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-3 px-4 text-sm font-medium text-gray-900">{activity.type}</td>
                                                <td className="py-3 px-4 text-sm text-gray-600">{activity.company}</td>
                                                <td className="py-3 px-4 text-sm font-medium text-gray-900">₹{activity.amount.toLocaleString('en-IN')}</td>
                                                <td className={`py-3 px-4 text-sm ${getStatusClass(activity.status)}`}>{activity.status}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={4} className="py-8 text-center text-gray-400 text-sm">
                                                    No recent activity found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default FarmerDashboard;
