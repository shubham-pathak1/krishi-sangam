import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Search, LogOut, ChevronDown, Leaf, FileText, CreditCard, LayoutDashboard } from 'lucide-react';
import { getAllContracts } from '../../services/contract.service';

const ExploreContracts = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [language, setLanguage] = useState<'en' | 'gu'>('en');

    // State for Contracts, Filters, Pagination
    const [allContracts, setAllContracts] = useState<any[]>([]);
    const [filteredContracts, setFilteredContracts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [filters, setFilters] = useState({
        search: '',
        city: 'all',
        product: 'all',
        sort: 'price-desc'
    });

    const [stats, setStats] = useState({
        total: 0,
        topProducts: ''
    });

    useEffect(() => {
        fetchContracts();
    }, []);

    useEffect(() => {
        filterAndSortContracts();
    }, [allContracts, filters]);

    const fetchContracts = async () => {
        try {
            setLoading(true);
            const response: any = await getAllContracts();
            const contractsData = Array.isArray(response) ? response : (response.data || []);
            setAllContracts(contractsData);
        } catch (error) {
            console.error("Failed to fetch contracts:", error);
            setAllContracts([]);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortContracts = () => {
        let result = [...allContracts];

        if (filters.search) {
            const term = filters.search.toLowerCase();
            result = result.filter(c =>
                (c.company?.company_name || 'Unknown').toLowerCase().includes(term) ||
                (c.product || '').toLowerCase().includes(term) ||
                (c.place || '').toLowerCase().includes(term)
            );
        }

        if (filters.city !== 'all') {
            result = result.filter(c => c.place === filters.city);
        }

        if (filters.product !== 'all') {
            result = result.filter(c => c.product === filters.product);
        }

        result.sort((a, b) => {
            switch (filters.sort) {
                case 'price-desc': return (b.price || 0) - (a.price || 0);
                case 'price-asc': return (a.price || 0) - (b.price || 0);
                case 'quantity-desc': return (b.quantity || 0) - (a.quantity || 0);
                case 'quantity-asc': return (a.quantity || 0) - (b.quantity || 0);
                case 'duration-desc': return (b.duration || 0) - (a.duration || 0);
                case 'duration-asc': return (a.duration || 0) - (b.duration || 0);
                default: return 0;
            }
        });

        setFilteredContracts(result);
        setCurrentPage(1);

        const products = [...new Set(result.map(c => c.product))].slice(0, 3).join(', ');
        setStats({
            total: result.length,
            topProducts: products || (language === 'en' ? 'None' : 'કોઈ નહીં')
        });
    };

    const totalPages = Math.ceil(filteredContracts.length > 0 ? filteredContracts.length / itemsPerPage : 1);
    const paginatedContracts = filteredContracts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
            exploreTitle: 'Explore Contracts',
            exploreDesc: 'Browse available contracts from various companies.',
            totalContracts: 'Total Contracts',
            topProducts: 'Top Products',
            city: 'City',
            allCities: 'All Cities',
            product: 'Product',
            allProducts: 'All Products',
            sortBy: 'Sort By',
            priceHighLow: 'Price: High to Low',
            priceLowHigh: 'Price: Low to High',
            qtyHighLow: 'Quantity: High to Low',
            qtyLowHigh: 'Quantity: Low to High',
            durHighLow: 'Duration: High to Low',
            durLowHigh: 'Duration: Low to High',
            noContracts: 'No contracts found.',
            prev: 'Previous',
            next: 'Next',
            page: 'Page',
            of: 'of',
            logout: 'Logout',
            contract: 'Contract',
            companyName: 'Company Name',
            quantity: 'Quantity',
            duration: 'Duration',
            price: 'Price',
            paymentType: 'Payment Type',
            kg: 'kg',
            months: 'Months'
        },
        gu: {
            dashboard: 'ડેશબોર્ડ',
            explore: 'કરાર શોધો',
            myContracts: 'મારા કરાર',
            myCrops: 'મારા પાક',
            transactions: 'વ્યવહારો',
            exploreTitle: 'કરાર શોધો',
            exploreDesc: 'વિવિધ કંપનીઓમાંથી ઉપલબ્ધ કરાર બ્રાઉઝ કરો.',
            totalContracts: 'કુલ કરાર',
            topProducts: 'ટોચના ઉત્પાદનો',
            city: 'શહેર',
            allCities: 'બધા શહેરો',
            product: 'ઉત્પાદન',
            allProducts: 'બધા ઉત્પાદનો',
            sortBy: 'દ્વારા સૉર્ટ કરો',
            priceHighLow: 'ભાવ: ઉચ્ચથી નીચું',
            priceLowHigh: 'ભાવ: નીચુંથી ઉચ્ચ',
            qtyHighLow: 'જથ્થો: ઉચ્ચથી નીચું',
            qtyLowHigh: 'જથ્થો: નીચુંથી ઉચ્ચ',
            durHighLow: 'અવધિ: ઉચ્ચથી નીચું',
            durLowHigh: 'અવધિ: નીચુંથી ઉચ્ચ',
            noContracts: 'કોઈ કરાર મળ્યા નથી.',
            prev: 'પાછળ',
            next: 'આગળ',
            page: 'પૃષ્ઠ',
            of: 'નું',
            logout: 'લૉગઆઉટ',
            contract: 'કરાર',
            companyName: 'કંપનીનું નામ',
            quantity: 'જથ્થો',
            duration: 'અવધિ',
            price: 'ભાવ',
            paymentType: 'ચુકવણી પ્રકાર',
            kg: 'કિલો',
            months: 'મહિના'
        }
    };

    const text = t[language];
    const uniqueCities = [...new Set(allContracts.map(c => c.place).filter(Boolean))];
    const uniqueProducts = [...new Set(allContracts.map(c => c.product).filter(Boolean))];

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
                    <Link to="/farmer/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                        <LayoutDashboard className="w-5 h-5" />
                        {text.dashboard}
                    </Link>
                    <Link to="/farmer/explore-contracts" className="flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-medium">
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
                <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
                    <div className="flex items-center justify-between px-6 py-4 h-20">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mr-4">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex-1 max-w-xl hidden md:block">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={language === 'en' ? "Search..." : "શોધો..."}
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
                                    <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 anime-fade-in-up z-50">
                                        <div className="px-4 py-2 border-b border-gray-50">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{user?.Name}</p>
                                        </div>
                                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left">
                                            <LogOut className="w-4 h-4" /> {text.logout}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-gray-50">
                    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
                        {/* Title & Desc */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-2xl font-bold text-emerald-600 mb-2">{text.exploreTitle}</h2>
                            <p className="text-gray-500 mb-8">{text.exploreDesc}</p>

                            {/* Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">{text.totalContracts}</h3>
                                    <p className="text-2xl font-bold text-emerald-600">{stats.total}</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">{text.topProducts}</h3>
                                    <p className="text-lg font-bold text-emerald-600">{stats.topProducts}</p>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-wrap gap-4 mb-8 items-end">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">{text.city}</label>
                                    <select
                                        value={filters.city}
                                        onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm min-w-[150px]"
                                    >
                                        <option value="all">{text.allCities}</option>
                                        {uniqueCities.map(city => <option key={city} value={city}>{city}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">{text.product}</label>
                                    <select
                                        value={filters.product}
                                        onChange={(e) => setFilters({ ...filters, product: e.target.value })}
                                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm min-w-[150px]"
                                    >
                                        <option value="all">{text.allProducts}</option>
                                        {uniqueProducts.map(prod => <option key={prod} value={prod}>{prod}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">{text.sortBy}</label>
                                    <select
                                        value={filters.sort}
                                        onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm min-w-[180px]"
                                    >
                                        <option value="price-desc">{text.priceHighLow}</option>
                                        <option value="price-asc">{text.priceLowHigh}</option>
                                        <option value="quantity-desc">{text.qtyHighLow}</option>
                                        <option value="quantity-asc">{text.qtyLowHigh}</option>
                                        <option value="duration-desc">{text.durHighLow}</option>
                                        <option value="duration-asc">{text.durLowHigh}</option>
                                    </select>
                                </div>
                                <div className="flex-grow min-w-[250px]">
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Search</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder={language === 'en' ? "Search contracts..." : "કરા કરાર શોધો..."}
                                            value={filters.search}
                                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                                        />
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    </div>
                                </div>
                            </div>

                            {/* Contracts List */}
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                        {paginatedContracts.map((contract, index) => (
                                            <div key={contract._id || index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group">
                                                <h4 className="text-lg font-bold text-emerald-600 mb-3 group-hover:text-emerald-700 transition-colors">
                                                    {text.contract} #{index + 1 + (currentPage - 1) * itemsPerPage}
                                                </h4>
                                                <div className="space-y-2 text-sm text-gray-600">
                                                    <p><span className="font-semibold text-gray-900">{text.companyName}:</span> {contract.company?.company_name || 'N/A'}</p>
                                                    <p><span className="font-semibold text-gray-900">{text.product}:</span> {contract.product}</p>
                                                    <p><span className="font-semibold text-gray-900">{text.quantity}:</span> {contract.quantity} {text.kg}</p>
                                                    <p><span className="font-semibold text-gray-900">{text.duration}:</span> {contract.duration} {text.months}</p>
                                                    <p><span className="font-semibold text-gray-900">{text.city}:</span> {contract.place}</p>
                                                    <p><span className="font-semibold text-gray-900">{text.price}:</span> ₹{(contract.price || 0).toLocaleString('en-IN')}</p>
                                                    <div className="pt-2 mt-2 border-t border-gray-50 flex items-center justify-between">
                                                        <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-600">{contract.payment_type}</span>
                                                        <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700">View Details</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {paginatedContracts.length === 0 && (
                                        <p className="text-center text-gray-500 py-12 bg-white rounded-2xl border border-gray-100 border-dashed">{text.noContracts}</p>
                                    )}

                                    {/* Pagination */}
                                    <div className="flex justify-center items-center gap-4">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-emerald-200 transition-colors text-sm font-medium"
                                        >
                                            {text.prev}
                                        </button>
                                        <span className="text-sm font-medium text-gray-600">{text.page} {currentPage} {text.of} {totalPages}</span>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages || totalPages === 0}
                                            className="px-4 py-2 bg-emerald-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 shadow-sm hover:shadow transition-colors text-sm font-medium"
                                        >
                                            {text.next}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ExploreContracts;
