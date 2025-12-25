import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Menu, X, Search, LayoutDashboard, Users, Building2,
    FileText, CreditCard, LogOut, User, ChevronDown, Plus, Pencil, Trash2
} from 'lucide-react';
import { getAllCompanies, createCompany, updateCompany, deleteCompany } from '../../services/company.service';
import type { CompanyDetails } from '../../types/company.types';

// Form state interface
interface CompanyFormData {
    company_name: string;
    email: string;
    phone_no: string;
    address: string;
    gstin: string;
}

const CompanyManagement = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [language, setLanguage] = useState<'en' | 'gu'>('en');
    const [searchQuery, setSearchQuery] = useState('');
    const [companies, setCompanies] = useState<CompanyDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);
    const [formData, setFormData] = useState<CompanyFormData>({
        company_name: '',
        email: '',
        phone_no: '',
        address: '',
        gstin: '',
    });
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const t = {
        en: {
            dashboard: 'Dashboard',
            farmerManagement: 'Farmer Management',
            companyManagement: 'Company Management',
            contractManagement: 'Contract Management',
            transactions: 'Transactions',
            profile: 'Profile',
            logout: 'Logout',
            searchPlaceholder: 'Search Companies...',
            addNewCompany: 'Add New Company',
            companyId: 'Company ID',
            companyName: 'Company Name',
            email: 'Email',
            phone: 'Phone',
            address: 'Address',
            gstin: 'GSTIN',
            actions: 'Actions',
            noCompanies: 'No companies found',
            loadingError: 'Failed to load data',
            addCompany: 'Add Company',
            editCompany: 'Edit Company',
            saveCompany: 'Save Company',
            updateCompany: 'Update Company',
            confirmDelete: 'Are you sure you want to delete this company?',
            deleteSuccess: 'Company deleted successfully',
            saveSuccess: 'Company saved successfully',
            requiredFields: 'Please fill all required fields',
        },
        gu: {
            dashboard: 'ડેશબોર્ડ',
            farmerManagement: 'ખેડૂત વ્યવસ્થાપન',
            companyManagement: 'કંપની વ્યવસ્થાપન',
            contractManagement: 'કોન્ટ્રાક્ટ વ્યવસ્થાપન',
            transactions: 'લેન-દેન',
            profile: 'પ્રોફાઇલ',
            logout: 'લોગઆઉટ',
            searchPlaceholder: 'કંપનીઓ શોધો...',
            addNewCompany: 'નવી કંપની ઉમેરો',
            companyId: 'કંપની આઈડી',
            companyName: 'કંપનીનું નામ',
            email: 'ઈમેલ',
            phone: 'ફોન',
            address: 'સરનામું',
            gstin: 'જીએસટીઆઈએન',
            actions: 'ક્રિયાઓ',
            noCompanies: 'કોઈ કંપની મળી નથી',
            loadingError: 'ડેટા લોડ કરવામાં નિષ્ફળ',
            addCompany: 'કંપની ઉમેરો',
            editCompany: 'કંપની સંપાદિત કરો',
            saveCompany: 'કંપની સાચવો',
            updateCompany: 'કંપની અપડેટ કરો',
            confirmDelete: 'શું તમે આ કંપનીને ડિલીટ કરવા માંગો છો?',
            deleteSuccess: 'કંપની સફળતાપૂર્વક ડિલીટ થયી',
            saveSuccess: 'કંપની સફળતાપૂર્વક સેવ થયી',
            requiredFields: 'કૃપા કરીને બધા જરૂરી ફીલ્ડ ભરો',
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
        document.title = language === 'en' ? 'Company Management - Krishi Sangam' : 'કંપની વ્યવસ્થાપન - કૃષિ સંગમ';
    }, [language]);

    const fetchCompanies = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getAllCompanies();
            setCompanies(data || []);
        } catch (err) {
            console.error('Error fetching companies:', err);
            setError(text.loadingError);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
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

    const filteredCompanies = companies.filter((company) => {
        const query = searchQuery.toLowerCase();
        return (
            (company._id || '').toLowerCase().includes(query) ||
            (company.company_name || '').toLowerCase().includes(query) ||
            (company.email || '').toLowerCase().includes(query) ||
            (company.address || '').toLowerCase().includes(query) ||
            String(company.phone_no || '').includes(query) ||
            (company.gstin || '').toLowerCase().includes(query)
        );
    });

    const openAddModal = () => {
        setEditMode(false);
        setCurrentCompanyId(null);
        setFormData({
            company_name: '',
            email: '',
            phone_no: '',
            address: '',
            gstin: '',
        });
        setFormError('');
        setModalOpen(true);
    };

    const openEditModal = (company: CompanyDetails) => {
        setEditMode(true);
        setCurrentCompanyId(company._id);
        setFormData({
            company_name: company.company_name || '',
            email: company.email || '',
            phone_no: String(company.phone_no || ''),
            address: company.address || '',
            gstin: company.gstin || '',
        });
        setFormError('');
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!formData.company_name || !formData.email || !formData.phone_no || !formData.address || !formData.gstin) {
            setFormError(text.requiredFields);
            return;
        }

        setSubmitting(true);
        try {
            const requestData = {
                company_name: formData.company_name,
                email: formData.email,
                address: formData.address,
                phone_no: formData.phone_no,
                gstin: formData.gstin,
            };

            if (editMode && currentCompanyId) {
                await updateCompany(currentCompanyId, requestData);
            } else {
                await createCompany(requestData);
            }
            setModalOpen(false);
            fetchCompanies();
        } catch (err) {
            console.error('Error saving company:', err);
            setFormError(err instanceof Error ? err.message : 'Failed to save company');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (companyId: string) => {
        if (!confirm(text.confirmDelete)) return;

        try {
            await deleteCompany(companyId);
            fetchCompanies();
        } catch (err) {
            console.error('Error deleting company:', err);
            alert(err instanceof Error ? err.message : 'Failed to delete company');
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
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${link.to === '/admin/companies'
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
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">{text.companyManagement}</h1>
                        <button
                            onClick={openAddModal}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            {text.addNewCompany}
                        </button>
                    </div>

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

                    {/* Companies Table */}
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        {loading ? (
                            <div className="p-12 text-center text-gray-500">Loading...</div>
                        ) : error ? (
                            <div className="p-12 text-center text-red-500">{error}</div>
                        ) : filteredCompanies.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">{text.noCompanies}</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{text.companyName}</th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{text.email}</th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{text.phone}</th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{text.address}</th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{text.gstin}</th>
                                            <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase">{text.actions}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredCompanies.map((company) => (
                                            <tr key={company._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-4 text-sm text-gray-900 font-medium">{company.company_name || '-'}</td>
                                                <td className="px-4 py-4 text-sm text-gray-900">{company.email || '-'}</td>
                                                <td className="px-4 py-4 text-sm text-gray-900">{company.phone_no || '-'}</td>
                                                <td className="px-4 py-4 text-sm text-gray-900 max-w-[150px] truncate">{company.address || '-'}</td>
                                                <td className="px-4 py-4 text-sm text-gray-500 font-mono">{company.gstin || '-'}</td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => openEditModal(company)}
                                                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(company._id)}
                                                            className="p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
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

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editMode ? text.editCompany : text.addCompany}
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{text.companyName} *</label>
                                <input
                                    type="text"
                                    value={formData.company_name}
                                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{text.email} *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{text.phone} *</label>
                                <input
                                    type="text"
                                    value={formData.phone_no}
                                    onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{text.address} *</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{text.gstin} *</label>
                                <input
                                    type="text"
                                    value={formData.gstin}
                                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                                    required
                                />
                            </div>

                            {formError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                    {formError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {submitting ? 'Saving...' : (editMode ? text.updateCompany : text.saveCompany)}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyManagement;
