import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Menu, X, Search, LayoutDashboard, Users, Building2,
    FileText, CreditCard, LogOut, User, ChevronDown
} from 'lucide-react';
import adminService from '../../services/admin.service';
import contractService from '../../services/contract.service';
import type { AdminCounts } from '../../types/admin.types';
import type { Contract } from '../../types/contract.types';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [language, setLanguage] = useState<'en' | 'gu'>('en');
    const [searchQuery, setSearchQuery] = useState('');
    const [counts, setCounts] = useState<AdminCounts>({
        Farmers: 0,
        Companies: 0,
        'Active Contracts': 0,
        'Completed Contracts': 0,
    });
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const t = {
        en: {
            dashboard: 'Dashboard',
            farmerManagement: 'Farmer Management',
            companyManagement: 'Company Management',
            contractManagement: 'Contract Management',
            transactions: 'Transactions',
            profile: 'Profile',
            logout: 'Logout',
            searchPlaceholder: 'Search Contracts...',
            adminDashboard: 'Admin Dashboard',
            totalActiveContracts: 'Total Active Contracts',
            registeredFarmers: 'Number of Registered Farmers',
            registeredCompanies: 'Number of Registered Companies',
            completedContracts: 'Completed Contracts',
            currentContracts: 'Current Contracts',
            companyId: 'Company ID',
            product: 'Product',
            quantity: 'Quantity',
            duration: 'Duration',
            place: 'Place',
            price: 'Price',
            status: 'Status',
            createdAt: 'Created At',
            active: 'Active',
            completed: 'Completed',
            noContracts: 'No contracts found',
            loadingError: 'Failed to load data',
        },
        gu: {
            dashboard: 'ડેશબોર્ડ',
            farmerManagement: 'ખેડૂત વ્યવસ્થાપન',
            companyManagement: 'કંપની વ્યવસ્થાપન',
            contractManagement: 'કોન્ટ્રાક્ટ વ્યવસ્થાપન',
            transactions: 'લેન-દેન',
            profile: 'પ્રોફાઇલ',
            logout: 'લોગઆઉટ',
            searchPlaceholder: 'કોન્ટ્રાક્ટ્સ શોધો...',
            adminDashboard: 'એડમિન ડેશબોર્ડ',
            totalActiveContracts: 'કુલ સક્રિય કોન્ટ્રાક્ટ્સ',
            registeredFarmers: 'નોંધાયેલા ખેડૂતોની સંખ્યા',
            registeredCompanies: 'નોંધાયેલી કંપનીઓની સંખ્યા',
            completedContracts: 'પૂર્ણ થયેલા કોન્ટ્રાક્ટ્સ',
            currentContracts: 'વર્તમાન કોન્ટ્રાક્ટ્સ',
            companyId: 'કંપની ID',
            product: 'ઉત્પાદન',
            quantity: 'જથ્થો',
            duration: 'સમયગાળો',
            place: 'સ્થળ',
            price: 'કિંમત',
            status: 'સ્થિતિ',
            createdAt: 'બનાવવામાં આવ્યું',
            active: 'સક્રિય',
            completed: 'પૂર્ણ',
            noContracts: 'કોઈ કોન્ટ્રાક્ટ મળ્યા નથી',
            loadingError: 'ડેટા લોડ કરવામાં નિષ્ફળ',
        },
    };

    const text = t[language];

    const sidebarLinks = [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: text.dashboard },
        { to: '/admin/farmers', icon: Users, label: text.farmerManagement },
        { to: '/admin/companies', icon: Building2, label: text.companyManagement },
        { to: '/admin/contracts', icon: FileText, label: text.contractManagement },
        { to: '/admin/transactions', icon: CreditCard, label: text.transactions },
    ];

    useEffect(() => {
        document.title = language === 'en' ? 'Admin Dashboard - Krishi Sangam' : 'એડમિન ડેશબોર્ડ - કૃષિ સંગમ';
    }, [language]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const [countsData, contractsData] = await Promise.all([
                    adminService.getCounts(),
                    contractService.getAllContracts(),
                ]);
                setCounts(countsData);
                setContracts(contractsData || []);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(text.loadingError);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:8000/api/v1/users/logout', {
                method: 'POST',
                credentials: 'include',
            });
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
            navigate('/login');
        }
    };

    const filteredContracts = contracts.filter((contract) => {
        const query = searchQuery.toLowerCase();
        return (
            (contract.company_id || '').toLowerCase().includes(query) ||
            (contract.product || '').toLowerCase().includes(query) ||
            (contract.place || '').toLowerCase().includes(query) ||
            String(contract.quantity).includes(query) ||
            String(contract.price).includes(query)
        );
    });

    const statsData = [
        { label: text.totalActiveContracts, value: counts['Active Contracts'] || 0 },
        { label: text.registeredFarmers, value: counts.Farmers || 0 },
        { label: text.registeredCompanies, value: counts.Companies || 0 },
        { label: text.completedContracts, value: counts['Completed Contracts'] || 0 },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-['Inter']">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 h-16">
                <div className="flex items-center justify-between h-full px-4 lg:px-6">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/src/assets/images/l.png" alt="Krishi Sangam" className="h-10 w-auto" />
                        <span className="text-xl font-bold text-gray-900 hidden sm:block">Krishi Sangam</span>
                    </Link>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        {/* Search Bar - Desktop */}
                        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
                            <Search className="w-4 h-4 text-gray-400 mr-2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={text.searchPlaceholder}
                                className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
                            />
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-40 z-50">
                                    <Link
                                        to="/admin/profile"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <User className="w-4 h-4" />
                                        {text.profile}
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        {text.logout}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Language Toggle */}
                        <button
                            onClick={() => setLanguage(l => l === 'en' ? 'gu' : 'en')}
                            className="text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            {language === 'en' ? 'ગુજ' : 'EN'}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Sidebar */}
            <aside
                className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <nav className="p-4 space-y-2">
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${link.to === '/admin/dashboard'
                                    ? 'bg-black text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <link.icon className="w-5 h-5" />
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="pt-16 lg:pl-64">
                <div className="p-6 max-w-7xl mx-auto">
                    {/* Page Title */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">{text.adminDashboard}</h1>

                    {/* Mobile Search */}
                    <div className="md:hidden mb-6">
                        <div className="flex items-center bg-white rounded-xl px-4 py-3 border border-gray-200">
                            <Search className="w-5 h-5 text-gray-400 mr-3" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={text.searchPlaceholder}
                                className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {statsData.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-black transition-colors"
                            >
                                <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
                                <p className="text-3xl font-bold text-black">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Contracts Table */}
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">{text.currentContracts}</h2>
                        </div>

                        {loading ? (
                            <div className="p-12 text-center text-gray-500">Loading...</div>
                        ) : error ? (
                            <div className="p-12 text-center text-red-500">{error}</div>
                        ) : filteredContracts.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">{text.noContracts}</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.companyId}</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.product}</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.quantity}</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.duration}</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.place}</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.price}</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.status}</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.createdAt}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredContracts.map((contract) => (
                                            <tr key={contract._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-gray-900">{contract.company_id || 'Unknown'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{contract.product || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{contract.quantity || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{contract.duration || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{contract.place || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{contract.price || '-'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${contract.status
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {contract.status ? text.active : text.completed}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(contract.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
