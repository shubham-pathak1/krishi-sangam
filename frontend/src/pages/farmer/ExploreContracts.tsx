import { Search, MapPin, Package, Calendar, ArrowRight, Activity, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { getAllContracts } from '../../services/contract.service';
import FarmerLayout from '../../components/layout/FarmerLayout';
import StatsCard from '../../components/ui/StatsCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { useState, useEffect } from 'react';

const ExploreContracts = () => {
    const [language] = useState<'en' | 'gu'>('en');

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

    const t = {
        en: {
            title: 'Marketplace',
            desc: 'Protocol-verified agricultural partnerships.',
            searchPlaceholder: 'Search crops or locations...',
            city: 'Location',
            allCities: 'All Locations',
            product: 'Commodity',
            allProducts: 'All Categories',
            sortBy: 'Sort Axis',
            results: `${filteredContracts.length} Records`,
            stats: {
                total: 'Live Inventory',
                demandSpike: 'Demand Spike'
            }
        },
        gu: {
            title: 'બજાર',
            desc: 'પ્રોટોકોલ-ચકાસાયેલ કૃષિ ભાગીદારી.',
            searchPlaceholder: 'શોધો...',
            city: 'સ્થાન',
            allCities: 'બધા સ્થાનો',
            product: 'પાક',
            allProducts: 'બધી શ્રેણીઓ',
            sortBy: 'સૉર્ટ કરો',
            results: `${filteredContracts.length} રેકોર્ડ્સ`,
            stats: {
                total: 'લાઇવ ઇન્વેન્ટરી',
                demandSpike: 'માંગમાં વધારો'
            }
        }
    };

    const text = t[language];
    const uniqueCities = [...new Set(allContracts.map(c => c.place).filter(Boolean))];
    const uniqueProducts = [...new Set(allContracts.map(c => c.product).filter(Boolean))];

    return (
        <FarmerLayout title={text.title} subtitle={text.desc}>
            <div className="space-y-10">
                {/* Search & Intelligence Section */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-[0_4px_20px_-1px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row gap-10 items-center justify-between">
                    <div className="relative w-full lg:max-w-2xl group">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder={text.searchPlaceholder}
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all font-medium"
                        />
                    </div>

                    <div className="flex gap-12 border-l border-gray-100 pl-12 hidden lg:flex">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-2">LIVE INVENTORY</p>
                            <p className="text-3xl font-black text-gray-900 leading-none tracking-tighter">{stats.total}</p>
                        </div>
                        {stats.topProducts !== 'None' && (
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-2">DEMAND SPIKE</p>
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-emerald-500" />
                                    <p className="text-sm font-black text-gray-900 truncate max-w-[200px] tracking-tight">{stats.topProducts}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Intelligence Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatsCard
                        label={text.stats.total}
                        value={stats.total}
                        icon={Package}
                        trend={{ label: 'Live Inventory', icon: Activity }}
                    />
                    <StatsCard
                        label={language === 'en' ? 'Demand Spike' : 'માંગમાં વધારો'}
                        value={stats.topProducts.split(',')[0] || 'N/A'}
                        icon={Activity}
                        color="text-emerald-500"
                        trend={{ label: '+22%', icon: ArrowUpRight }}
                    />
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm transition-all focus-within:border-black group">
                        <MapPin className="w-4 h-4 text-gray-400 group-focus-within:text-black" />
                        <select
                            value={filters.city}
                            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                            className="bg-transparent border-none outline-none text-[13px] font-bold text-gray-900 cursor-pointer min-w-[140px]"
                        >
                            <option value="all">{text.allCities}</option>
                            {uniqueCities.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm transition-all focus-within:border-black group">
                        <Package className="w-4 h-4 text-gray-400 group-focus-within:text-black" />
                        <select
                            value={filters.product}
                            onChange={(e) => setFilters({ ...filters, product: e.target.value })}
                            className="bg-transparent border-none outline-none text-[13px] font-bold text-gray-900 cursor-pointer min-w-[140px]"
                        >
                            <option value="all">{text.allProducts}</option>
                            {uniqueProducts.map(prod => <option key={prod} value={prod}>{prod}</option>)}
                        </select>
                    </div>

                    <div className="lg:ml-auto flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm transition-all focus-within:border-black group">
                        <SlidersHorizontal className="w-4 h-4 text-gray-400 group-focus-within:text-black" />
                        <select
                            value={filters.sort}
                            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                            className="bg-transparent border-none outline-none text-[13px] font-bold text-gray-900 cursor-pointer"
                        >
                            <option value="price-desc">Value: High-Low</option>
                            <option value="price-asc">Value: Low-High</option>
                            <option value="quantity-desc">Volume: High-Low</option>
                            <option value="quantity-asc">Volume: Low-High</option>
                        </select>
                    </div>
                </div>

                {/* Contracts Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 min-h-[400px]">
                        <div className="w-12 h-12 rounded-full border-t-2 border-black animate-spin mb-6"></div>
                        <p className="text-sm font-black text-gray-300 uppercase tracking-widest">Compiling Market Data</p>
                    </div>
                ) : filteredContracts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {paginatedContracts.map((contract, index) => (
                            <div
                                key={contract._id || index}
                                className="group bg-white rounded-[2.5rem] p-9 border border-gray-100 hover:border-black transition-all duration-500 flex flex-col shadow-[0_4px_20px_-1px_rgba(0,0,0,0.03)]"
                            >
                                <div className="flex items-start justify-between mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 font-black text-xl border border-gray-100 group-hover:bg-black group-hover:text-white transition-all duration-300">
                                        {contract.company?.company_name?.charAt(0) || 'C'}
                                    </div>
                                    <StatusBadge
                                        status={contract.payment_type || 'Digital'}
                                        className="shadow-sm"
                                    />
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-2xl font-black text-gray-900 mb-1 tracking-tight group-hover:translate-x-1 transition-transform">{contract.product}</h3>
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-tight">
                                        {contract.company?.company_name || 'AgroCorp Global'}
                                    </p>
                                </div>

                                <div className="space-y-4 mb-10 flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5" /> Duration
                                        </span>
                                        <span className="text-sm font-black text-gray-900 tracking-tight">{contract.duration} Months</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                            <Package className="w-3.5 h-3.5" /> Quantity
                                        </span>
                                        <span className="text-sm font-black text-gray-900 tracking-tight">{contract.quantity} MT</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5" /> Center
                                        </span>
                                        <span className="text-sm font-black text-gray-900 tracking-tight">{contract.place}</span>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">UNIT LOCK-IN</p>
                                        <p className="text-2xl font-black text-gray-900 tracking-tighter">₹{(contract.price || 0).toLocaleString('en-IN')}</p>
                                    </div>
                                    <button className="h-14 w-14 bg-black text-white rounded-[1.25rem] flex items-center justify-center hover:scale-105 transition-all shadow-xl shadow-gray-200">
                                        <ArrowRight className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">Zero Records Found</h3>
                        <p className="text-sm text-gray-400 font-medium max-w-sm mx-auto">No contracts matched the selected search parameters.</p>
                        <button
                            onClick={() => setFilters({ search: '', city: 'all', product: 'all', sort: 'price-desc' })}
                            className="mt-8 text-xs font-black text-black underline underline-offset-4 hover:opacity-70 transition-opacity uppercase tracking-widest"
                        >
                            Reset System Filters
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {!loading && filteredContracts.length > 0 && (
                    <div className="flex justify-center items-center gap-4 pt-10">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed hover:border-black transition-all font-black"
                        >
                            ←
                        </button>
                        <div className="px-6 py-3 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-widest">
                            Page {currentPage} / {totalPages}
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed hover:border-black transition-all font-black"
                        >
                            →
                        </button>
                    </div>
                )}
            </div>
        </FarmerLayout>
    );
};

export default ExploreContracts;
