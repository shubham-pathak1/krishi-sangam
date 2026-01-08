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
            <div className="space-y-12 pb-20">
                {/* Search & Intelligence Section */}
                <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/60 shadow-premium flex flex-col lg:flex-row gap-10 items-center justify-between transition-all duration-500">
                    <div className="relative w-full lg:max-w-2xl group">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder={text.searchPlaceholder}
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full pl-14 pr-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-950 placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-950/5 focus:bg-white transition-all font-semibold tracking-tight h-16"
                        />
                    </div>

                    <div className="flex gap-12 border-l border-white/40 pl-12 hidden lg:flex">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-2">LIVE INVENTORY</p>
                            <p className="text-4xl font-black text-zinc-950 leading-none tracking-tightest">{stats.total}</p>
                        </div>
                        {stats.topProducts !== 'None' && (
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-2">DEMAND SPIKE</p>
                                <div className="flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-zinc-950 animate-pulse" />
                                    <p className="text-[15px] font-black text-zinc-950 truncate max-w-[200px] tracking-tight">{stats.topProducts}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Intelligence Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    <StatsCard
                        label={text.stats.total}
                        value={stats.total}
                        icon={Package}
                        imageSrc="/src/assets/images/ccontract.png"
                        trend={{ label: 'Live Inventory', icon: Activity }}
                    />
                    <StatsCard
                        label={language === 'en' ? 'Demand Spike' : 'માંગમાં વધારો'}
                        value={stats.topProducts.split(',')[0] || 'N/A'}
                        icon={Activity}
                        imageSrc="/src/assets/images/crops.png"
                        trend={{ label: 'High Velocity', icon: ArrowUpRight }}
                    />
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white shadow-sm transition-all focus-within:ring-4 focus-within:ring-zinc-950/5 group">
                        <MapPin className="w-4.5 h-4.5 text-zinc-400 group-focus-within:text-zinc-950" />
                        <select
                            value={filters.city}
                            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                            className="bg-transparent border-none outline-none text-[13px] font-black text-zinc-950 cursor-pointer min-w-[160px] tracking-tight"
                        >
                            <option value="all">{text.allCities}</option>
                            {uniqueCities.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white shadow-sm transition-all focus-within:ring-4 focus-within:ring-zinc-950/5 group">
                        <Package className="w-4.5 h-4.5 text-zinc-400 group-focus-within:text-zinc-950" />
                        <select
                            value={filters.product}
                            onChange={(e) => setFilters({ ...filters, product: e.target.value })}
                            className="bg-transparent border-none outline-none text-[13px] font-black text-zinc-950 cursor-pointer min-w-[160px] tracking-tight"
                        >
                            <option value="all">{text.allProducts}</option>
                            {uniqueProducts.map(prod => <option key={prod} value={prod}>{prod}</option>)}
                        </select>
                    </div>

                    <div className="lg:ml-auto flex items-center gap-3 bg-white/60 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white shadow-sm transition-all focus-within:ring-4 focus-within:ring-zinc-950/5 group">
                        <SlidersHorizontal className="w-4.5 h-4.5 text-zinc-400 group-focus-within:text-zinc-950" />
                        <select
                            value={filters.sort}
                            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                            className="bg-transparent border-none outline-none text-[13px] font-black text-zinc-950 cursor-pointer tracking-tight"
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
                    <div className="flex flex-col items-center justify-center py-40 min-h-[400px]">
                        <div className="w-12 h-12 rounded-full border-t-2 border-zinc-950 animate-spin mb-8"></div>
                        <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.25em]">Compiling Market Data...</p>
                    </div>
                ) : filteredContracts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {paginatedContracts.map((contract, index) => (
                            <div
                                key={contract._id || index}
                                className="group bg-white/40 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/60 transition-[background-color] duration-500 flex flex-col shadow-premium hover:bg-white/60 cursor-pointer will-change-transform translate-z-0"
                            >
                                <div className="flex items-start justify-between mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center text-zinc-950 font-black text-xl border border-white shadow-sm transition-all duration-500 group-hover:bg-zinc-950 group-hover:text-white group-hover:shadow-lg group-hover:-rotate-3">
                                        {contract.company?.company_name?.charAt(0) || 'C'}
                                    </div>
                                    <StatusBadge
                                        status={contract.payment_type || 'Digital'}
                                        className="shadow-sm"
                                    />
                                </div>

                                <div className="mb-10">
                                    <h3 className="text-3xl font-black text-zinc-950 mb-1.5 tracking-tightest leading-tight">{contract.product}</h3>
                                    <p className="text-[13px] text-zinc-400 font-bold uppercase tracking-[0.1em]">
                                        {contract.company?.company_name || 'AgroCorp Global'}
                                    </p>
                                </div>

                                <div className="space-y-5 mb-12 flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.2em] flex items-center gap-3">
                                            <Calendar className="w-4 h-4" /> Duration
                                        </span>
                                        <span className="text-[15px] font-black text-zinc-950 tracking-tight">{contract.duration} Months</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.2em] flex items-center gap-3">
                                            <Package className="w-4 h-4" /> Quantity
                                        </span>
                                        <span className="text-[15px] font-black text-zinc-950 tracking-tight">{contract.quantity} MT</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.2em] flex items-center gap-3">
                                            <MapPin className="w-4 h-4" /> Center
                                        </span>
                                        <span className="text-[15px] font-black text-zinc-950 tracking-tight">{contract.place}</span>
                                    </div>
                                </div>

                                <div className="pt-10 border-t border-white/40 flex items-center justify-between mt-auto">
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.25em] mb-1.5">UNIT LOCK-IN</p>
                                        <p className="text-3xl font-black text-zinc-950 tracking-tightest leading-none">₹{(contract.price || 0).toLocaleString('en-IN')}</p>
                                    </div>
                                    <button className="h-14 w-14 bg-zinc-950 text-white rounded-[1.5rem] flex items-center justify-center transition-all shadow-xl hover:shadow-2xl active:scale-95 group/btn">
                                        <ArrowRight className="w-6 h-6 transition-transform group-hover/btn:translate-x-1" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 bg-white/30 backdrop-blur-xl rounded-[4rem] border border-dashed border-zinc-200">
                        <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <Search className="w-8 h-8 text-zinc-300" />
                        </div>
                        <h3 className="text-2xl font-black text-zinc-950 mb-3 tracking-tightest">Zero Records Found</h3>
                        <p className="text-[15px] text-zinc-400 font-medium max-w-sm mx-auto tracking-tight">No contracts matched the selected search parameters in the registry.</p>
                        <button
                            onClick={() => setFilters({ search: '', city: 'all', product: 'all', sort: 'price-desc' })}
                            className="mt-10 px-8 py-3.5 bg-zinc-950 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:shadow-xl transition-all active:scale-95"
                        >
                            Reset System Filters
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {!loading && filteredContracts.length > 0 && (
                    <div className="flex justify-center items-center gap-6 pt-12">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-14 h-14 flex items-center justify-center bg-white/60 backdrop-blur-md border border-white rounded-[1.5rem] disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white hover:shadow-md transition-all font-black text-xl active:scale-90"
                        >
                            ←
                        </button>
                        <div className="px-8 py-4 bg-zinc-950 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.25em] shadow-lg">
                            PROTOCOL PAGE {currentPage} / {totalPages}
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="w-14 h-14 flex items-center justify-center bg-white/60 backdrop-blur-md border border-white rounded-[1.5rem] disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white hover:shadow-md transition-all font-black text-xl active:scale-90"
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
