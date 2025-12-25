import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Search, LogOut, ChevronDown, Leaf, FileText, CreditCard, LayoutDashboard, Download, Eye } from 'lucide-react';
import transactionService from '../../services/transaction.service';

interface Transaction {
    _id: string;
    contract_id: string;
    company_id: string; // Or object if populated
    contract?: any; // Populated contract
    farmer_id: string;
    status: boolean | string;
    payment_type: string;
    payment_id?: string;
    amount?: number; // Not in type but used in UI
    quantity?: string; // Not in type but used in UI
    createdAt: string;
}

const FarmerTransactions = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [language, setLanguage] = useState<'en' | 'gu'>('en');

    // Data State
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState('');
    const [stockSort, setStockSort] = useState('date-desc');
    const [paymentFilter, setPaymentFilter] = useState({ status: 'all', sort: 'date-desc' });

    // Stats
    const [stats, setStats] = useState({
        total: 0,
        totalAmount: 0,
        pending: 0
    });

    // Modal
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [modalType, setModalType] = useState<'transaction' | 'payment' | null>(null);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const data: any = await transactionService.getAllTransactions();
            // Assuming data has amount and quantity which might not be in the strict TS type yet
            setTransactions(data);

            // Calculate Stats
            const total = data.length;
            const totalAmount = data.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);
            const pending = data.reduce((acc: number, curr: any) => {
                const isPending = String(curr.status).toLowerCase() === 'pending' || curr.status === false;
                return isPending ? acc + (curr.amount || 0) : acc;
            }, 0);

            setStats({ total, totalAmount, pending });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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
            title: 'My Transactions',
            subtitle: 'View your transaction history below.',
            totalTrans: 'Total Transactions',
            totalAmt: 'Total Amount',
            pendingPay: 'Pending Payments',
            search: 'Search Transactions...',
            stockDelivered: 'Stock Delivered',
            payReceived: 'Payments Received',
            download: 'Download Report',
            transId: 'Transaction ID',
            contractId: 'Contract ID',
            company: 'Company',
            qty: 'Quantity',
            amt: 'Amount',
            date: 'Date',
            dueDate: 'Due Date',
            status: 'Status',
            actions: 'Actions',
            crop: 'Crop',
            deliveredQty: 'Delivered Quantity',
            dateDelivered: 'Date Delivered',
            payId: 'Payment ID',
            mode: 'Mode of Payment',
            view: 'View Details',
            logout: 'Logout',
            allStatuses: 'All Statuses',
            pending: 'Pending',
            completed: 'Completed',
            sortDateNew: 'Date (Newest)',
            sortDateOld: 'Date (Oldest)',
            sortAmtHigh: 'Amount (High to Low)',
            sortAmtLow: 'Amount (Low to High)',
            modalTrans: 'Transaction Details',
            modalPay: 'Payment Details',
            close: 'Close',
            noData: 'No transactions found.'
        },
        gu: {
            dashboard: 'ડેશબોર્ડ',
            explore: 'કરાર શોધો',
            myContracts: 'મારા કરાર',
            myCrops: 'મારા પાક',
            transactions: 'વ્યવહારો',
            title: 'મારા વ્યવહારો',
            subtitle: 'નીચે તમારા વ્યવહાર ઇતિહાસ જુઓ.',
            totalTrans: 'કુલ વ્યવહારો',
            totalAmt: 'કુલ રકમ',
            pendingPay: 'બાકી ચૂકવણી',
            search: 'વ્યવહારો શોધો...',
            stockDelivered: 'સ્ટોક પહોંચાડવામાં આવ્યો',
            payReceived: 'ચૂકવણી પ્રાપ્ત',
            download: 'રિપોર્ટ ડાઉનલોડ કરો',
            transId: 'વ્યવહાર આઈડી',
            contractId: 'કરાર આઈડી',
            company: 'કંપની',
            qty: 'જથ્થો',
            amt: 'રકમ',
            date: 'તારીખ',
            dueDate: 'નિયત તારીખ',
            status: 'સ્થિતિ',
            actions: 'ક્રિયાઓ',
            crop: 'પાક',
            deliveredQty: 'પહોંચાડેલ જથ્થો',
            dateDelivered: 'પહોંચાડવાની તારીખ',
            payId: 'ચૂકવણી આઈડી',
            mode: 'ચૂકવણીનું માધ્યમ',
            view: 'વિગતો જુઓ',
            logout: 'લૉગઆઉટ',
            allStatuses: 'બધી સ્થિતિઓ',
            pending: 'બાકી',
            completed: 'પૂર્ણ',
            sortDateNew: 'તારીખ (નવું)',
            sortDateOld: 'તારીખ (જૂનું)',
            sortAmtHigh: 'રકમ (ઉચ્ચથી નીચું)',
            sortAmtLow: 'રકમ (નીચુંથી ઉચ્ચ)',
            modalTrans: 'વ્યવહારની વિગતો',
            modalPay: 'ચૂકવણીની વિગતો',
            close: 'બંધ',
            noData: 'કોઈ વ્યવહાર મળ્યા નથી.'
        }
    };

    const text = t[language];

    // Filtered lists
    const getFilteredTransactions = () => {
        return transactions.filter(t =>
            t._id.toLowerCase().includes(search.toLowerCase()) ||
            (t.contract?.company?.company_name || '').toLowerCase().includes(search.toLowerCase()) ||
            (t.contract?.product || '').toLowerCase().includes(search.toLowerCase())
        );
    };

    const getStocks = () => {
        // Assuming stocks are transactions with a certain property or just using all for now
        // In a real app, you'd filter by type. We'll reuse transactions as stocks for demo
        let list = [...transactions];
        if (stockSort === 'date-desc') list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        if (stockSort === 'date-asc') list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        return list;
    };

    const getPayments = () => {
        let list = [...transactions];
        if (paymentFilter.status !== 'all') {
            list = list.filter(t => {
                const s = String(t.status).toLowerCase();
                const f = paymentFilter.status.toLowerCase();
                return s === f || (f === 'pending' && s === 'false') || (f === 'completed' && s === 'true');
            });
        }

        list.sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            const amtA = a.amount || 0;
            const amtB = b.amount || 0;

            switch (paymentFilter.sort) {
                case 'date-desc': return dateB - dateA;
                case 'date-asc': return dateA - dateB;
                case 'amount-desc': return amtB - amtA;
                case 'amount-asc': return amtA - amtB;
                default: return 0;
            }
        });
        return list;
    };

    const getStatusClass = (status: any) => {
        const s = String(status).toLowerCase();
        if (s === 'active' || s === 'true' || s === 'completed') return 'bg-emerald-100 text-emerald-700';
        return 'bg-red-100 text-red-700';
    };

    const getStatusText = (status: any) => {
        const s = String(status).toLowerCase();
        if (s === 'active' || s === 'true' || s === 'completed') return text.completed;
        return text.pending;
    };

    const downloadCSV = (data: any[], filename: string) => {
        if (!data.length) return;
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).join(',')).join('\n');
        const csv = `${headers}\n${rows}`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
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
                    <Link to="/farmer/crops" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                        <Leaf className="w-5 h-5" />
                        {text.myCrops}
                    </Link>
                    <Link to="/farmer/transactions" className="flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-medium">
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
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
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
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                            </div>
                        ) : (
                            <>
                                {/* Title & Desc */}
                                <div>
                                    <h2 className="text-2xl font-bold text-emerald-600 mb-2">{text.title}</h2>
                                    <p className="text-gray-500">{text.subtitle}</p>
                                </div>

                                {/* Summary Stats */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">{text.totalTrans}</h3>
                                        <p className="text-2xl font-bold text-emerald-600">{stats.total}</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">{text.totalAmt}</h3>
                                        <p className="text-2xl font-bold text-emerald-600">₹{stats.totalAmount.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">{text.pendingPay}</h3>
                                        <p className="text-2xl font-bold text-amber-600">₹{stats.pending.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>

                                {/* Transactions Table */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-4 border-b border-gray-50 font-semibold text-lg">{text.transactions}</div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">{text.transId}</th>
                                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">{text.contractId}</th>
                                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">{text.company}</th>
                                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">{text.qty}</th>
                                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">{text.amt}</th>
                                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">{text.dueDate}</th>
                                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">{text.status}</th>
                                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase">{text.actions}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {getFilteredTransactions().length === 0 ? (
                                                    <tr><td colSpan={8} className="py-8 text-center text-gray-500">{text.noData}</td></tr>
                                                ) : (
                                                    getFilteredTransactions().map((t: any) => (
                                                        <tr key={t._id} className="hover:bg-gray-50">
                                                            <td className="py-4 px-6 text-sm font-medium">{t._id.substring(0, 6)}</td>
                                                            <td className="py-4 px-6 text-sm text-gray-600">{t.contract_id.substring(0, 6)}</td>
                                                            <td className="py-4 px-6 text-sm text-gray-600">{t.contract?.company?.company_name || 'N/A'}</td>
                                                            <td className="py-4 px-6 text-sm text-gray-600">{t.quantity || t.contract?.quantity} kg</td>
                                                            <td className="py-4 px-6 text-sm font-medium">₹{(t.amount || 0).toLocaleString('en-IN')}</td>
                                                            <td className="py-4 px-6 text-sm text-gray-600">{new Date(t.createdAt).toLocaleDateString()}</td>
                                                            <td className="py-4 px-6">
                                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(t.status)}`}>
                                                                    {getStatusText(t.status)}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                <button
                                                                    onClick={() => { setSelectedItem(t); setModalType('transaction'); }}
                                                                    className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1"
                                                                >
                                                                    <Eye className="w-4 h-4" /> {text.view}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Stock Delivered */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                                        <h3 className="font-semibold text-lg">{text.stockDelivered}</h3>
                                        <div className="flex gap-2">
                                            <select
                                                value={stockSort}
                                                onChange={(e) => setStockSort(e.target.value)}
                                                className="text-sm border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-emerald-500"
                                            >
                                                <option value="date-desc">{text.sortDateNew}</option>
                                                <option value="date-asc">{text.sortDateOld}</option>
                                            </select>
                                            <button
                                                onClick={() => downloadCSV(getStocks(), 'stocks.csv')}
                                                className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg transition-colors" title={text.download}
                                            >
                                                <Download className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="py-3 px-6 text-xs text-gray-500 uppercase">{text.contractId}</th>
                                                    <th className="py-3 px-6 text-xs text-gray-500 uppercase">{text.crop}</th>
                                                    <th className="py-3 px-6 text-xs text-gray-500 uppercase">{text.deliveredQty}</th>
                                                    <th className="py-3 px-6 text-xs text-gray-500 uppercase">{text.dateDelivered}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {getStocks().map((t: any) => (
                                                    <tr key={t._id} className="hover:bg-gray-50">
                                                        <td className="py-3 px-6 text-sm">{t.contract_id.substring(0, 6)}</td>
                                                        <td className="py-3 px-6 text-sm">{t.contract?.product || 'Crop'}</td>
                                                        <td className="py-3 px-6 text-sm">{t.quantity || t.contract?.quantity} kg</td>
                                                        <td className="py-3 px-6 text-sm">{new Date(t.createdAt).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Payments Received */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <h3 className="font-semibold text-lg">{text.payReceived}</h3>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <select
                                                value={paymentFilter.status}
                                                onChange={(e) => setPaymentFilter({ ...paymentFilter, status: e.target.value })}
                                                className="text-sm border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-emerald-500 w-full sm:w-auto"
                                            >
                                                <option value="all">{text.allStatuses}</option>
                                                <option value="pending">{text.pending}</option>
                                                <option value="completed">{text.completed}</option>
                                            </select>
                                            <select
                                                value={paymentFilter.sort}
                                                onChange={(e) => setPaymentFilter({ ...paymentFilter, sort: e.target.value })}
                                                className="text-sm border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-emerald-500 w-full sm:w-auto"
                                            >
                                                <option value="date-desc">{text.sortDateNew}</option>
                                                <option value="date-asc">{text.sortDateOld}</option>
                                                <option value="amount-desc">{text.sortAmtHigh}</option>
                                                <option value="amount-asc">{text.sortAmtLow}</option>
                                            </select>
                                            <button
                                                onClick={() => downloadCSV(getPayments(), 'payments.csv')}
                                                className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg transition-colors border border-gray-100" title={text.download}
                                            >
                                                <Download className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="py-3 px-6 text-xs text-gray-500 uppercase">{text.payId}</th>
                                                    <th className="py-3 px-6 text-xs text-gray-500 uppercase">{text.contractId}</th>
                                                    <th className="py-3 px-6 text-xs text-gray-500 uppercase">{text.mode}</th>
                                                    <th className="py-3 px-6 text-xs text-gray-500 uppercase">{text.date}</th>
                                                    <th className="py-3 px-6 text-xs text-gray-500 uppercase">{text.amt}</th>
                                                    <th className="py-3 px-6 text-xs text-gray-500 uppercase">{text.status}</th>
                                                    <th className="py-3 px-6 text-xs text-gray-500 uppercase">{text.actions}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {getPayments().map((t: any) => (
                                                    <tr key={t._id} className="hover:bg-gray-50">
                                                        <td className="py-3 px-6 text-sm">{t._id.substring(0, 6)}</td>
                                                        <td className="py-3 px-6 text-sm">{t.contract_id.substring(0, 6)}</td>
                                                        <td className="py-3 px-6 text-sm">{t.payment_type || 'Bank Transfer'}</td>
                                                        <td className="py-3 px-6 text-sm">{new Date(t.createdAt).toLocaleDateString()}</td>
                                                        <td className="py-3 px-6 text-sm font-medium">₹{(t.amount || 0).toLocaleString('en-IN')}</td>
                                                        <td className="py-3 px-6">
                                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(t.status)}`}>
                                                                {getStatusText(t.status)}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-6">
                                                            <button
                                                                onClick={() => { setSelectedItem(t); setModalType('payment'); }}
                                                                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1"
                                                            >
                                                                <Eye className="w-4 h-4" /> {text.view}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>

            {/* Modals */}
            {selectedItem && modalType && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4 animate-scale-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">{modalType === 'transaction' ? text.modalTrans : text.modalPay}</h3>
                            <button onClick={() => { setSelectedItem(null); setModalType(null); }} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500 text-sm">{text.transId}</span>
                                <span className="font-medium text-gray-900">{selectedItem._id}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500 text-sm">{text.contractId}</span>
                                <span className="font-medium text-gray-900">{selectedItem.contract_id}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500 text-sm">{text.company}</span>
                                <span className="font-medium text-gray-900">{selectedItem.contract?.company?.company_name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500 text-sm">{text.qty}</span>
                                <span className="font-medium text-gray-900">{selectedItem.quantity || selectedItem.contract?.quantity} kg</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500 text-sm">{text.amt}</span>
                                <span className="font-medium text-emerald-600">₹{(selectedItem.amount || 0).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500 text-sm">{text.date}</span>
                                <span className="font-medium text-gray-900">{new Date(selectedItem.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">{text.status}</span>
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(selectedItem.status)}`}>
                                    {getStatusText(selectedItem.status)}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => { setSelectedItem(null); setModalType(null); }}
                            className="w-full mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-colors"
                        >
                            {text.close}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FarmerTransactions;
