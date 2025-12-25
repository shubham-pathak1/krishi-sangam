import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Menu, X, Search, LayoutDashboard, Users, Building2,
    FileText, CreditCard, LogOut, User, ChevronDown, Pencil, Trash2, FileCheck
} from 'lucide-react';
import contractService from '../../services/contract.service';
import type { Contract } from '../../types/contract.types';

const ContractManagement = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [language, setLanguage] = useState<'en' | 'gu'>('en');
    const [searchQuery, setSearchQuery] = useState('');
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Edit Modal state
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentContractId, setCurrentContractId] = useState<string | null>(null);
    const [editStatus, setEditStatus] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Accept Modal state
    const [acceptModalOpen, setAcceptModalOpen] = useState(false);
    const [acceptContractId, setAcceptContractId] = useState<string | null>(null);
    const [acceptCompanyId, setAcceptCompanyId] = useState<string | null>(null);
    const [farmerPhone, setFarmerPhone] = useState('');
    const [paymentType, setPaymentType] = useState('Advance');
    const [acceptError, setAcceptError] = useState('');

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
            companyId: 'Company ID',
            product: 'Product',
            quantity: 'Quantity',
            duration: 'Duration',
            place: 'Place',
            price: 'Price',
            status: 'Status',
            createdAt: 'Created At',
            actions: 'Actions',
            active: 'Active',
            inactive: 'Inactive',
            noContracts: 'No contracts found',
            loadingError: 'Failed to load data',
            editContract: 'Edit Contract',
            saveContract: 'Save Contract',
            acceptContract: 'Accept Contract',
            farmerPhone: 'Farmer Phone Number',
            paymentType: 'Payment Type',
            advance: 'Advance',
            installment: 'Installment',
            fullPayment: 'Full Payment',
            none: 'None',
            confirmDelete: 'Are you sure you want to delete this contract?',
            phoneRequired: 'Please enter farmer phone number',
            noFarmerFound: 'No farmer found with this phone number',
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
            companyId: 'કંપની ID',
            product: 'ઉત્પાદન',
            quantity: 'જથ્થો',
            duration: 'સમયગાળો',
            place: 'સ્થળ',
            price: 'કિંમત',
            status: 'સ્થિતિ',
            createdAt: 'બનાવવામાં આવ્યું',
            actions: 'ક્રિયાઓ',
            active: 'સક્રિય',
            inactive: 'નિષ્ક્રિય',
            noContracts: 'કોઈ કોન્ટ્રાક્ટ મળ્યા નથી',
            loadingError: 'ડેટા લોડ કરવામાં નિષ્ફળ',
            editContract: 'કોન્ટ્રાક્ટ સંપાદિત કરો',
            saveContract: 'કોન્ટ્રાક્ટ સાચવો',
            acceptContract: 'કોન્ટ્રાક્ટ સ્વીકારો',
            farmerPhone: 'ખેડૂતનો ફોન નંબર',
            paymentType: 'ચુકવણી પ્રકાર',
            advance: 'એડવાન્સ',
            installment: 'હપ્તો',
            fullPayment: 'પૂર્ણ ચુકવણી',
            none: 'કોઈ નહીં',
            confirmDelete: 'શું તમે આ કોન્ટ્રાક્ટને ડિલીટ કરવા માંગો છો?',
            phoneRequired: 'કૃપા કરીને ખેડૂતનો ફોન નંબર દાખલ કરો',
            noFarmerFound: 'આ ફોન નંબર સાથે કોઈ ખેડૂત મળ્યા નથી',
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
        document.title = language === 'en' ? 'Contract Management - Krishi Sangam' : 'કોન્ટ્રાક્ટ વ્યવસ્થાપન - કૃષિ સંગમ';
    }, [language]);

    const fetchContracts = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await contractService.getAllContracts();
            setContracts(data || []);
        } catch (err) {
            console.error('Error fetching contracts:', err);
            setError(text.loadingError);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContracts();
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
            String(contract.quantity || '').includes(query) ||
            (contract.duration || '').toLowerCase().includes(query) ||
            (contract.place || '').toLowerCase().includes(query) ||
            String(contract.price || '').includes(query) ||
            (contract.status ? 'active' : 'inactive').includes(query)
        );
    });

    const openEditModal = (contract: Contract) => {
        setCurrentContractId(contract._id);
        setEditStatus(contract.status);
        setEditModalOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentContractId) return;

        setSubmitting(true);
        try {
            await contractService.updateContract(currentContractId, { status: editStatus });
            setEditModalOpen(false);
            fetchContracts();
        } catch (err) {
            console.error('Error updating contract:', err);
            alert(err instanceof Error ? err.message : 'Failed to update contract');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (contractId: string) => {
        if (!confirm(text.confirmDelete)) return;

        try {
            await contractService.deleteContract(contractId);
            fetchContracts();
        } catch (err) {
            console.error('Error deleting contract:', err);
            alert(err instanceof Error ? err.message : 'Failed to delete contract');
        }
    };

    const openAcceptModal = (contractId: string, companyId: string) => {
        setAcceptContractId(contractId);
        setAcceptCompanyId(companyId);
        setFarmerPhone('');
        setPaymentType('Advance');
        setAcceptError('');
        setAcceptModalOpen(true);
    };

    const handleAcceptSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAcceptError('');

        if (!farmerPhone) {
            setAcceptError(text.phoneRequired);
            return;
        }

        if (!acceptContractId || !acceptCompanyId) return;

        setSubmitting(true);
        try {
            // Get farmer by phone
            const farmers = await contractService.getFarmerByPhone(farmerPhone);
            if (!farmers || farmers.length === 0) {
                setAcceptError(text.noFarmerFound);
                setSubmitting(false);
                return;
            }

            const farmerId = farmers[0]._id;

            // Create contract transaction
            await contractService.createContractTransaction({
                contract_id: acceptContractId,
                farmer_id: farmerId,
                company_id: acceptCompanyId,
                status: 'false',
                payment_type: paymentType,
            });

            setAcceptModalOpen(false);
            fetchContracts();
        } catch (err) {
            console.error('Error accepting contract:', err);
            setAcceptError(err instanceof Error ? err.message : 'Failed to accept contract');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-['Inter']">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 h-16">
                <div className="flex items-center justify-between h-full px-4 lg:px-6">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/src/assets/images/l.png" alt="Krishi Sangam" className="h-10 w-auto" />
                        <span className="text-xl font-bold text-gray-900 hidden sm:block">Krishi Sangam</span>
                    </Link>

                    <div className="flex items-center gap-4">
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

                        <button
                            onClick={() => setLanguage(l => l === 'en' ? 'gu' : 'en')}
                            className="text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            {language === 'en' ? 'ગુજ' : 'EN'}
                        </button>

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
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${link.to === '/admin/contracts'
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

            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main Content */}
            <main className="pt-16 lg:pl-64">
                <div className="p-6 max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">{text.contractManagement}</h1>

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

                    {/* Contracts Table */}
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
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
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{text.companyId}</th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{text.product}</th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{text.quantity}</th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{text.duration}</th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{text.place}</th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{text.price}</th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{text.status}</th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{text.createdAt}</th>
                                            <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase">{text.actions}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredContracts.map((contract) => (
                                            <tr key={contract._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-4 text-sm text-gray-900 font-mono text-xs">{contract.company_id || '-'}</td>
                                                <td className="px-4 py-4 text-sm text-gray-900">{contract.product || '-'}</td>
                                                <td className="px-4 py-4 text-sm text-gray-900">{contract.quantity || '-'}</td>
                                                <td className="px-4 py-4 text-sm text-gray-900">{contract.duration || '-'}</td>
                                                <td className="px-4 py-4 text-sm text-gray-900">{contract.place || '-'}</td>
                                                <td className="px-4 py-4 text-sm text-gray-900">{contract.price || '-'}</td>
                                                <td className="px-4 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${contract.status
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {contract.status ? text.active : text.inactive}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-500">
                                                    {new Date(contract.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => openEditModal(contract)}
                                                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(contract._id)}
                                                            className="p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => openAcceptModal(contract._id, contract.company_id)}
                                                            className="p-2 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors"
                                                            title="Accept Contract"
                                                        >
                                                            <FileCheck className="w-4 h-4" />
                                                        </button>
                                                    </div>
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

            {/* Edit Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">{text.editContract}</h2>
                            <button onClick={() => setEditModalOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{text.status}</label>
                                <select
                                    value={editStatus ? 'true' : 'false'}
                                    onChange={(e) => setEditStatus(e.target.value === 'true')}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                                >
                                    <option value="true">{text.active}</option>
                                    <option value="false">{text.inactive}</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {submitting ? 'Saving...' : text.saveContract}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Accept Modal */}
            {acceptModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">{text.acceptContract}</h2>
                            <button onClick={() => setAcceptModalOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAcceptSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{text.farmerPhone} *</label>
                                <input
                                    type="tel"
                                    value={farmerPhone}
                                    onChange={(e) => setFarmerPhone(e.target.value)}
                                    pattern="[0-9]{10}"
                                    placeholder="Enter 10-digit phone number"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{text.paymentType}</label>
                                <select
                                    value={paymentType}
                                    onChange={(e) => setPaymentType(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                                >
                                    <option value="Advance">{text.advance}</option>
                                    <option value="Installment">{text.installment}</option>
                                    <option value="Full payment">{text.fullPayment}</option>
                                    <option value="None">{text.none}</option>
                                </select>
                            </div>

                            {acceptError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                    {acceptError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {submitting ? 'Processing...' : text.acceptContract}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContractManagement;
