import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Search, LogOut, ChevronDown, Leaf, FileText, CreditCard, LayoutDashboard, Eye, Edit } from 'lucide-react';
import transactionService from '../../services/transaction.service';


const FarmerContracts = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [language, setLanguage] = useState<'en' | 'gu'>('en');

    const [contracts, setContracts] = useState<any[]>([]);
    const [filteredContracts, setFilteredContracts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        status: 'all',
        sort: 'start-date-desc'
    });

    const [stats, setStats] = useState({
        total: 0,
        totalValue: 0,
        active: 0
    });

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState<any>(null);
    const [requestForm, setRequestForm] = useState({
        quantity: '',
        amount: '',
        reason: ''
    });

    useEffect(() => {
        fetchContracts();
    }, []);

    useEffect(() => {
        filterAndSortContracts();
    }, [contracts, filters]);

    const fetchContracts = async () => {
        try {
            setLoading(true);
            const transactions: any[] = await transactionService.getAllTransactions();
            // const allContracts = await getAllContracts(); // Might need this for cross-reference if transaction doesn't have full details

            // Filter transactions for current user if backend doesn't (assuming it does, but safe to map)
            // The API likely returns enriched transactions. 
            // Based on dashboard, transactions have 'contract' object populated?
            // If not, we map manually. Let's assume enrichment for now as per Dashboard experience.

            setContracts(transactions);

            // Calculate Stats
            const total = transactions.length;
            const value = transactions.reduce((acc, curr) => acc + (curr.amount || 0), 0);
            const active = transactions.filter(t => t.status === 'Active' || t.status === true || t.status === 'active').length;

            setStats({
                total,
                totalValue: value,
                active
            });

        } catch (error) {
            console.error("Failed to fetch contracts:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortContracts = () => {
        let result = [...contracts];

        // Filter by Status
        if (filters.status !== 'all') {
            result = result.filter(c => {
                const status = String(c.status).toLowerCase();
                return status === filters.status.toLowerCase();
            });
        }

        // Sort
        result.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            const amountA = a.amount || 0;
            const amountB = b.amount || 0;

            switch (filters.sort) {
                case 'start-date-desc': return dateB - dateA;
                case 'start-date-asc': return dateA - dateB;
                case 'amount-desc': return amountB - amountA;
                case 'amount-asc': return amountA - amountB;
                default: return 0;
            }
        });

        setFilteredContracts(result);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            navigate('/login');
        }
    };

    const openRequestModal = (contract: any) => {
        setSelectedContract(contract);
        setRequestForm({
            quantity: contract.quantity || '',
            amount: contract.amount || '',
            reason: ''
        });
        setIsModalOpen(true);
    };

    const handleRequestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here we would call an API availability to submit a change request
        alert(`Request submitted for Contract ${selectedContract?._id}`);
        setIsModalOpen(false);
    };

    const t = {
        en: {
            dashboard: 'Dashboard',
            explore: 'Explore Contracts',
            myContracts: 'My Contracts',
            myCrops: 'My Crops',
            transactions: 'Transactions',
            title: 'My Contracts',
            subtitle: 'View and manage your active contracts below.',
            totalContracts: 'Total Contracts',
            totalValue: 'Total Value',
            activeContracts: 'Active Contracts',
            allStatuses: 'All Statuses',
            active: 'Active',
            pending: 'Pending',
            completed: 'Completed',
            sortBy: 'Sort By',
            newest: 'Start Date (Newest)',
            oldest: 'Start Date (Oldest)',
            highLow: 'Amount (High to Low)',
            lowHigh: 'Amount (Low to High)',
            contractId: 'Contract ID',
            company: 'Company Name',
            crop: 'Crop',
            qty: 'Quantity',
            amount: 'Amount',
            start: 'Start Date',
            end: 'End Date',
            status: 'Status',
            actions: 'Actions',
            view: 'View Details',
            request: 'Request Change',
            logout: 'Logout',
            modalTitle: 'Request Contract Change',
            propQty: 'Proposed Quantity (kg)',
            propAmt: 'Proposed Amount (₹)',
            reason: 'Reason for Change',
            submit: 'Submit Request',
            cancel: 'Cancel',
            noContracts: 'No contracts found.'
        },
        gu: {
            dashboard: 'ડેશબોર્ડ',
            explore: 'કરાર શોધો',
            myContracts: 'મારા કરાર',
            myCrops: 'મારા પાક',
            transactions: 'વ્યવહારો',
            title: 'મારા કરાર',
            subtitle: 'નીચે તમારા સક્રિય કરાર જુઓ અને સંચાલન કરો.',
            totalContracts: 'કુલ કરાર',
            totalValue: 'કુલ મૂલ્ય',
            activeContracts: 'સક્રિય કરાર',
            allStatuses: 'બધી સ્થિતિઓ',
            active: 'સક્રિય',
            pending: 'બાકી',
            completed: 'પૂર્ણ',
            sortBy: 'દ્વારા સૉર્ટ કરો',
            newest: 'પ્રારંભ તારીખ (નવું)',
            oldest: 'પ્રારંભ તારીખ (જૂનું)',
            highLow: 'રકમ (ઉચ્ચથી નીચું)',
            lowHigh: 'રકમ (નીચુંથી ઉચ્ચ)',
            contractId: 'કરાર આઈડી',
            company: 'કંપનીનું નામ',
            crop: 'પાક',
            qty: 'જથ્થો',
            amount: 'રકમ',
            start: 'પ્રારંભ તારીખ',
            end: 'અંત તારીખ',
            status: 'સ્થિતિ',
            actions: 'ક્રિયાઓ',
            view: 'વિગતો જુઓ',
            request: 'ફેરફારની વિનંતી',
            logout: 'લૉગઆઉટ',
            modalTitle: 'કરાર ફેરફારની વિનંતી',
            propQty: 'પ્રસ્તાવિત જથ્થો (કિલો)',
            propAmt: 'પ્રસ્તાવિત રકમ (₹)',
            reason: 'ફેરફારનું કારણ',
            submit: 'વિનંતી સબમિટ કરો',
            cancel: 'રદ કરો',
            noContracts: 'કોઈ કરાર મળ્યા નથી.'
        }
    };

    const text = t[language];

    const getStatusClass = (status: any) => {
        const s = String(status).toLowerCase();
        if (s === 'active' || s === 'true') return 'bg-emerald-100 text-emerald-700';
        if (s === 'pending') return 'bg-amber-100 text-amber-700';
        if (s === 'completed') return 'bg-gray-100 text-gray-700';
        return 'bg-gray-100 text-gray-700';
    };

    const getStatusText = (status: any) => {
        const s = String(status).toLowerCase();
        if (s === 'active' || s === 'true') return text.active;
        if (s === 'pending') return text.pending;
        if (s === 'completed') return text.completed;
        return status;
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
                    <Link to="/farmer/contracts" className="flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-medium">
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
                        <div>
                            <h2 className="text-2xl font-bold text-emerald-600 mb-2">{text.title}</h2>
                            <p className="text-gray-500">{text.subtitle}</p>
                        </div>

                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">{text.totalContracts}</h3>
                                <p className="text-2xl font-bold text-emerald-600">{stats.total}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">{text.totalValue}</h3>
                                <p className="text-2xl font-bold text-emerald-600">₹{stats.totalValue.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">{text.activeContracts}</h3>
                                <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
                            </div>
                        </div>

                        {/* Filters & Table */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                                <div className="flex gap-4 w-full sm:w-auto">
                                    <select
                                        value={filters.status}
                                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                        className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm w-full sm:w-auto"
                                    >
                                        <option value="all">{text.allStatuses}</option>
                                        <option value="active">{text.active}</option>
                                        <option value="pending">{text.pending}</option>
                                        <option value="completed">{text.completed}</option>
                                    </select>
                                    <select
                                        value={filters.sort}
                                        onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                                        className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm w-full sm:w-auto"
                                    >
                                        <option value="start-date-desc">{text.newest}</option>
                                        <option value="start-date-asc">{text.oldest}</option>
                                        <option value="amount-desc">{text.highLow}</option>
                                        <option value="amount-asc">{text.lowHigh}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.contractId}</th>
                                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.company}</th>
                                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.crop}</th>
                                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.qty}</th>
                                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.amount}</th>
                                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.start}</th>
                                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.end}</th>
                                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.status}</th>
                                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">{text.actions}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {loading ? (
                                            <tr><td colSpan={9} className="py-8 text-center text-gray-500">Loading...</td></tr>
                                        ) : filteredContracts.length === 0 ? (
                                            <tr><td colSpan={9} className="py-8 text-center text-gray-500">{text.noContracts}</td></tr>
                                        ) : (
                                            filteredContracts.map((contract) => (
                                                <tr key={contract._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 px-6 text-sm font-medium text-gray-900">#{contract._id.substring(0, 6)}</td>
                                                    <td className="py-4 px-6 text-sm text-gray-600">{contract.contract?.company?.company_name || contract.company_id || 'N/A'}</td>
                                                    <td className="py-4 px-6 text-sm text-gray-600">{contract.contract?.product || 'Unknown'}</td>
                                                    <td className="py-4 px-6 text-sm text-gray-600">{contract.quantity || contract.contract?.quantity} kg</td>
                                                    <td className="py-4 px-6 text-sm font-medium text-gray-900">₹{(contract.amount || 0).toLocaleString('en-IN')}</td>
                                                    <td className="py-4 px-6 text-sm text-gray-600">{new Date(contract.createdAt).toLocaleDateString()}</td>
                                                    <td className="py-4 px-6 text-sm text-gray-600">{contract.contract?.duration ? new Date(new Date(contract.createdAt).setMonth(new Date(contract.createdAt).getMonth() + parseInt(contract.contract.duration))).toLocaleDateString() : 'N/A'}</td>
                                                    <td className="py-4 px-6">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(contract.status)}`}>
                                                            {getStatusText(contract.status)}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex gap-2">
                                                            <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title={text.view}>
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => openRequestModal(contract)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title={text.request}
                                                                disabled={String(contract.status).toLowerCase() === 'completed'}
                                                            >
                                                                <Edit className="w-4 h-4" />
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

            {/* Request Change Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4 animate-scale-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">{text.modalTitle}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleRequestSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{text.contractId}</label>
                                <input
                                    type="text"
                                    value={selectedContract?._id}
                                    readOnly
                                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{text.propQty}</label>
                                <input
                                    type="number"
                                    required
                                    value={requestForm.quantity}
                                    onChange={(e) => setRequestForm({ ...requestForm, quantity: e.target.value })}
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{text.propAmt}</label>
                                <input
                                    type="number"
                                    required
                                    value={requestForm.amount}
                                    onChange={(e) => setRequestForm({ ...requestForm, amount: e.target.value })}
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{text.reason}</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={requestForm.reason}
                                    onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                                ></textarea>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                                >
                                    {text.cancel}
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium transition-colors"
                                >
                                    {text.submit}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FarmerContracts;
