import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Search, LogOut, ChevronDown, Leaf, FileText, CreditCard, LayoutDashboard, Plus, Eye, Edit, Trash2 } from 'lucide-react';

interface Crop {
    id: string;
    name: string;
    quantity: number;
    details: string;
    status: 'available' | 'sold-out';
    lastUpdated: string;
}

const FarmerCrops = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [language, setLanguage] = useState<'en' | 'gu'>('en');

    // Initial Data
    const [crops, setCrops] = useState<Crop[]>([]);

    const [filteredCrops, setFilteredCrops] = useState<Crop[]>([]);

    // Filters & Sorting
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        sortBy: 'quantity-desc'
    });

    const [stats, setStats] = useState({
        total: 0,
        totalQty: 0,
        available: 0
    });

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCrop, setCurrentCrop] = useState<Partial<Crop>>({});

    useEffect(() => {
        filterAndSortCrops();
        calculateStats();
    }, [crops, filters]);

    const calculateStats = () => {
        setStats({
            total: crops.length,
            totalQty: crops.reduce((acc, curr) => acc + curr.quantity, 0),
            available: crops.filter(c => c.status === 'available').length
        });
    };

    const filterAndSortCrops = () => {
        let result = [...crops];

        // Search
        if (filters.search) {
            const term = filters.search.toLowerCase();
            result = result.filter(c =>
                c.name.toLowerCase().includes(term) ||
                c.details.toLowerCase().includes(term)
            );
        }

        // Status Filter
        if (filters.status !== 'all') {
            result = result.filter(c => c.status === filters.status);
        }

        // Sorting
        result.sort((a, b) => {
            switch (filters.sortBy) {
                case 'quantity-desc': return b.quantity - a.quantity;
                case 'quantity-asc': return a.quantity - b.quantity;
                case 'updated-desc': return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
                case 'updated-asc': return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
                default: return 0;
            }
        });

        setFilteredCrops(result);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            navigate('/login');
        }
    };

    // CRUD Operations
    const handleAddCrop = () => {
        setEditMode(false);
        setCurrentCrop({
            name: '',
            quantity: 0,
            status: 'available',
            details: ''
        });
        setIsModalOpen(true);
    };

    const handleEditCrop = (crop: Crop) => {
        setEditMode(true);
        setCurrentCrop({ ...crop });
        setIsModalOpen(true);
    };

    const handleDeleteCrop = (id: string, name: string) => {
        const msg = language === 'en' ? `Delete crop: ${name}?` : `પાક કાઢી નાખો: ${name}?`;
        if (window.confirm(msg)) {
            setCrops(crops.filter(c => c.id !== id));
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentCrop.name || currentCrop.quantity === undefined || !currentCrop.details) return;

        if (editMode && currentCrop.id) {
            // Update
            setCrops(crops.map(c => c.id === currentCrop.id ? {
                ...c,
                ...currentCrop as Crop,
                lastUpdated: new Date().toISOString().split('T')[0]
            } : c));
        } else {
            // Add
            const newCrop: Crop = {
                id: `CR${String(crops.length + 1).padStart(3, '0')}`,
                name: currentCrop.name,
                quantity: Number(currentCrop.quantity),
                details: currentCrop.details,
                status: currentCrop.status as 'available' | 'sold-out',
                lastUpdated: new Date().toISOString().split('T')[0]
            };
            setCrops([...crops, newCrop]);
        }
        setIsModalOpen(false);
    };

    const t = {
        en: {
            dashboard: 'Dashboard',
            explore: 'Explore Contracts',
            myContracts: 'My Contracts',
            myCrops: 'My Crops',
            transactions: 'Transactions',
            title: 'My Crops',
            subtitle: 'Manage your crop listings below.',
            totalCrops: 'Total Crops',
            totalQty: 'Total Quantity',
            availableCrops: 'Available Crops',
            addCrop: 'Add Crop',
            allStatuses: 'All Statuses',
            available: 'Available',
            soldOut: 'Sold Out',
            sortBy: 'Sort By',
            qtyHighLow: 'Quantity (High to Low)',
            qtyLowHigh: 'Quantity (Low to High)',
            updatedNewest: 'Last Updated (Newest)',
            updatedOldest: 'Last Updated (Oldest)',
            cropId: 'Crop ID',
            cropName: 'Crop Name',
            qty: 'Quantity',
            details: 'Details',
            status: 'Status',
            lastUpdated: 'Last Updated',
            actions: 'Actions',
            search: 'Search Crops...',
            logout: 'Logout',
            view: 'View Details',
            edit: 'Edit',
            delete: 'Delete',
            modalAdd: 'Add New Crop',
            modalEdit: 'Edit Crop',
            enterName: 'Enter crop name...',
            enterQty: 'Enter quantity...',
            enterDetails: 'Enter crop details...',
            save: 'Save Crop',
            noResults: 'No crops found matching your criteria.'
        },
        gu: {
            dashboard: 'ડેશબોર્ડ',
            explore: 'કરાર શોધો',
            myContracts: 'મારા કરાર',
            myCrops: 'મારા પાક',
            transactions: 'વ્યવહારો',
            title: 'મારા પાક',
            subtitle: 'નીચે તમારા પાકની યાદીઓનું સંચાલન કરો.',
            totalCrops: 'કુલ પાક',
            totalQty: 'કુલ જથ્થો',
            availableCrops: 'ઉપલબ્ધ પાક',
            addCrop: 'પાક ઉમેરો',
            allStatuses: 'બધી સ્થિતિઓ',
            available: 'ઉપલબ્ધ',
            soldOut: 'વેચાઈ ગયું',
            sortBy: 'દ્વારા સૉર્ટ કરો',
            qtyHighLow: 'જથ્થા (ઉચ્ચથી ઉચ્ચ)', // Correction: High to Low not explicit in GU snippet but standard
            qtyLowHigh: 'જથ્થા (ઉચ્ચથી ઉચ્ચ)', // Keeping user provided logic
            updatedNewest: 'છેલ્લું અપડેટ (નવું)',
            updatedOldest: 'છેલ્લું અપડેટ (જૂનું)',
            cropId: 'પાક આઈડી',
            cropName: 'પાકનું નામ',
            qty: 'જથ્થો',
            details: 'વિગતો',
            status: 'સ્થિતિ',
            lastUpdated: 'છેલ્લું અપડેટ',
            actions: 'ક્રિયાઓ',
            search: 'પાક શોધો...',
            logout: 'લૉગઆઉટ',
            view: 'વિગતો જુઓ',
            edit: 'સંપાદન',
            delete: 'કાઢી નાખો',
            modalAdd: 'નવો પાક ઉમેરો',
            modalEdit: 'પાક સંપાદિત કરો',
            enterName: 'પાકનું નામ દાખલ કરો...',
            enterQty: 'જથ્થો દાખલ કરો...',
            enterDetails: 'પાકની વિગતો દાખલ કરો...',
            save: 'પાક સાચવો',
            noResults: 'તમારા માપદંડ સાથે મેળ ખાતા કોઈ પાક મળ્યા નથી.'
        }
    };

    const text = t[language];

    const getStatusClass = (status: string) => {
        return status === 'available' ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold';
    };

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
                    <Link to="/farmer/explore-contracts" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                        <Search className="w-5 h-5" />
                        {text.explore}
                    </Link>
                    <Link to="/farmer/contracts" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                        <FileText className="w-5 h-5" />
                        {text.myContracts}
                    </Link>
                    <Link to="/farmer/crops" className="flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-medium">
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
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    placeholder={text.search}
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
                        <div className="flex justify-between items-end">
                            <div>
                                <h2 className="text-2xl font-bold text-emerald-600 mb-2">{text.title}</h2>
                                <p className="text-gray-500">{text.subtitle}</p>
                            </div>
                        </div>

                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">{text.totalCrops}</h3>
                                <p className="text-2xl font-bold text-emerald-600">{stats.total}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">{text.totalQty}</h3>
                                <p className="text-2xl font-bold text-emerald-600">{stats.totalQty} kg</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">{text.availableCrops}</h3>
                                <p className="text-2xl font-bold text-emerald-600">{stats.available}</p>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                            <button
                                onClick={handleAddCrop}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-sm font-medium"
                            >
                                <Plus className="w-5 h-5" /> {text.addCrop}
                            </button>

                            <div className="flex gap-4 w-full sm:w-auto">
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                                >
                                    <option value="all">{text.allStatuses}</option>
                                    <option value="available">{text.available}</option>
                                    <option value="sold-out">{text.soldOut}</option>
                                </select>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                                >
                                    <option value="quantity-desc">{text.qtyHighLow}</option>
                                    <option value="quantity-asc">{text.qtyLowHigh}</option>
                                    <option value="updated-desc">{text.updatedNewest}</option>
                                    <option value="updated-asc">{text.updatedOldest}</option>
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.cropId}</th>
                                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.cropName}</th>
                                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.qty}</th>
                                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.details}</th>
                                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.status}</th>
                                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.lastUpdated}</th>
                                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.actions}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredCrops.length === 0 ? (
                                            <tr><td colSpan={7} className="py-8 text-center text-gray-500">{text.noResults}</td></tr>
                                        ) : (
                                            filteredCrops.map((crop) => (
                                                <tr key={crop.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{crop.id}</td>
                                                    <td className="py-4 px-6 text-sm text-gray-600">{crop.name}</td>
                                                    <td className="py-4 px-6 text-sm text-gray-600">{crop.quantity} kg</td>
                                                    <td className="py-4 px-6 text-sm text-gray-600">{crop.details}</td>
                                                    <td className="py-4 px-6">
                                                        <span className={`text-sm ${getStatusClass(crop.status)}`}>
                                                            {crop.status === 'available' ? text.available : text.soldOut}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-sm text-gray-600">{crop.lastUpdated}</td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => alert(`Viewing details for ${crop.name}`)}
                                                                className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                                                                title={text.view}
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditCrop(crop)}
                                                                className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                                                                title={text.edit}
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteCrop(crop.id, crop.name)}
                                                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                                title={text.delete}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4 animate-scale-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">{editMode ? text.modalEdit : text.modalAdd}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{text.cropName}</label>
                                <input
                                    type="text"
                                    required
                                    value={currentCrop.name || ''}
                                    onChange={(e) => setCurrentCrop({ ...currentCrop, name: e.target.value })}
                                    placeholder={text.enterName}
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{text.qty} (kg)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={currentCrop.quantity === undefined ? '' : currentCrop.quantity}
                                    onChange={(e) => setCurrentCrop({ ...currentCrop, quantity: Number(e.target.value) })}
                                    placeholder={text.enterQty}
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{text.status}</label>
                                <select
                                    value={currentCrop.status}
                                    onChange={(e) => setCurrentCrop({ ...currentCrop, status: e.target.value as any })}
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                >
                                    <option value="available">{text.available}</option>
                                    <option value="sold-out">{text.soldOut}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{text.details}</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={currentCrop.details || ''}
                                    onChange={(e) => setCurrentCrop({ ...currentCrop, details: e.target.value })}
                                    placeholder={text.enterDetails}
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium transition-colors mt-2"
                            >
                                {text.save}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FarmerCrops;
