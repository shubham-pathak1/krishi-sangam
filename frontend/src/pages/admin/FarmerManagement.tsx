import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Menu, X, Search, LayoutDashboard, Users, Building2,
    FileText, CreditCard, LogOut, User, ChevronDown, Plus, Pencil, Trash2
} from 'lucide-react';
import { getAllFarmers, createFarmer, updateFarmer, deleteFarmer } from '../../services/farmer.service';
import type { FarmerDetails, CreateFarmerRequest } from '../../types/farmer.types';

const FarmerManagement = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [language, setLanguage] = useState<'en' | 'gu'>('en');
    const [searchQuery, setSearchQuery] = useState('');
    const [farmers, setFarmers] = useState<FarmerDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentFarmerId, setCurrentFarmerId] = useState<string | null>(null);
    const [formData, setFormData] = useState<CreateFarmerRequest>({
        name: '',
        email: '',
        phone_no: '',
        address: '',
        land_size: 0,
        id_proof: '',
        survey_no: '',
        crop_one: '',
        crop_two: '',
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
            searchPlaceholder: 'Search Farmers...',
            addNewFarmer: 'Add New Farmer',
            farmerId: 'Farmer ID',
            fullName: 'Full Name',
            email: 'Email',
            phone: 'Phone',
            address: 'Address',
            landSize: 'Land Size',
            idProof: 'ID Proof',
            surveyNo: 'Survey No',
            cropOne: 'Crop One',
            cropTwo: 'Crop Two',
            actions: 'Actions',
            noFarmers: 'No farmers found',
            loadingError: 'Failed to load data',
            addFarmer: 'Add Farmer',
            editFarmer: 'Edit Farmer',
            saveFarmer: 'Save Farmer',
            updateFarmer: 'Update Farmer',
            acres: 'Acres',
            confirmDelete: 'Are you sure you want to delete this farmer?',
            deleteSuccess: 'Farmer deleted successfully',
            saveSuccess: 'Farmer saved successfully',
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
            searchPlaceholder: 'ખેડૂતો શોધો...',
            addNewFarmer: 'નવું ખેડૂત ઉમેરો',
            farmerId: 'ખેડૂત આઈડી',
            fullName: 'પૂરું નામ',
            email: 'ઈમેલ',
            phone: 'ફોન',
            address: 'સરનામું',
            landSize: 'જમીનનું કદ',
            idProof: 'ઓળખ પુરાવો',
            surveyNo: 'સર્વે નંબર',
            cropOne: 'પાક એક',
            cropTwo: 'પાક બે',
            actions: 'ક્રિયાઓ',
            noFarmers: 'કોઈ ખેડૂત મળ્યા નથી',
            loadingError: 'ડેટા લોડ કરવામાં નિષ્ફળ',
            addFarmer: 'ખેડૂત ઉમેરો',
            editFarmer: 'ખેડૂત સંપાદિત કરો',
            saveFarmer: 'ખેડૂત સાચવો',
            updateFarmer: 'ખેડૂત અપડેટ કરો',
            acres: 'એકર',
            confirmDelete: 'શું તમે આ ખેડૂતને ડિલીટ કરવા માંગો છો?',
            deleteSuccess: 'ખેડૂત સફળતાપૂર્વક ડિલીટ થયું',
            saveSuccess: 'ખેડૂત સફળતાપૂર્વક સેવ થયું',
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
        document.title = language === 'en' ? 'Farmer Management - Krishi Sangam' : 'ખેડૂત વ્યવસ્થાપન - કૃષિ સંગમ';
    }, [language]);

    const fetchFarmers = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getAllFarmers();
            setFarmers(data || []);
        } catch (err) {
            console.error('Error fetching farmers:', err);
            setError(text.loadingError);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFarmers();
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

    const filteredFarmers = farmers.filter((farmer) => {
        const query = searchQuery.toLowerCase();
        return (
            (farmer._id || '').toLowerCase().includes(query) ||
            (farmer.name || '').toLowerCase().includes(query) ||
            (farmer.email || '').toLowerCase().includes(query) ||
            (farmer.address || '').toLowerCase().includes(query) ||
            String(farmer.phone_no || '').includes(query) ||
            (farmer.crop_one || '').toLowerCase().includes(query) ||
            (farmer.crop_two || '').toLowerCase().includes(query)
        );
    });

    const openAddModal = () => {
        setEditMode(false);
        setCurrentFarmerId(null);
        setFormData({
            name: '',
            email: '',
            phone_no: '',
            address: '',
            land_size: 0,
            id_proof: '',
            survey_no: '',
            crop_one: '',
            crop_two: '',
        });
        setFormError('');
        setModalOpen(true);
    };

    const openEditModal = (farmer: FarmerDetails) => {
        setEditMode(true);
        setCurrentFarmerId(farmer._id);
        setFormData({
            name: farmer.name || '',
            email: farmer.email || '',
            phone_no: String(farmer.phone_no || ''),
            address: farmer.address || '',
            land_size: farmer.land_size || 0,
            id_proof: farmer.id_proof || '',
            survey_no: farmer.survey_no || '',
            crop_one: farmer.crop_one || '',
            crop_two: farmer.crop_two || '',
        });
        setFormError('');
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!formData.name || !formData.email || !formData.phone_no || !formData.address) {
            setFormError(text.requiredFields);
            return;
        }

        setSubmitting(true);
        try {
            if (editMode && currentFarmerId) {
                await updateFarmer(currentFarmerId, formData);
            } else {
                await createFarmer(formData);
            }
            setModalOpen(false);
            fetchFarmers();
        } catch (err) {
            console.error('Error saving farmer:', err);
            setFormError(err instanceof Error ? err.message : 'Failed to save farmer');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (farmerId: string) => {
        if (!confirm(text.confirmDelete)) return;

        try {
            await deleteFarmer(farmerId);
            fetchFarmers();
        } catch (err) {
            console.error('Error deleting farmer:', err);
            alert(err instanceof Error ? err.message : 'Failed to delete farmer');
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
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${link.to === '/admin/farmers'
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
                        <h1 className="text-2xl font-bold text-gray-900">{text.farmerManagement}</h1>
                        <button
                            onClick={openAddModal}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            {text.addNewFarmer}
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

                    {/* Farmers Table */}
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        {loading ? (
                            <div className="p-12 text-center text-gray-500">Loading...</div>
                        ) : error ? (
                            <div className="p-12 text-center text-red-500">{error}</div>
                        ) : filteredFarmers.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">{text.noFarmers}</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{text.fullName}</th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{text.email}</th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{text.phone}</th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{text.address}</th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{text.landSize}</th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{text.cropOne}</th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase">{text.cropTwo}</th>
                                            <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase">{text.actions}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredFarmers.map((farmer) => (
                                            <tr key={farmer._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-4 text-sm text-gray-900">{farmer.name || '-'}</td>
                                                <td className="px-4 py-4 text-sm text-gray-900">{farmer.email || '-'}</td>
                                                <td className="px-4 py-4 text-sm text-gray-900">{farmer.phone_no || '-'}</td>
                                                <td className="px-4 py-4 text-sm text-gray-900 max-w-[150px] truncate">{farmer.address || '-'}</td>
                                                <td className="px-4 py-4 text-sm text-gray-900">{farmer.land_size ? `${farmer.land_size} ${text.acres}` : '-'}</td>
                                                <td className="px-4 py-4 text-sm text-gray-900">{farmer.crop_one || '-'}</td>
                                                <td className="px-4 py-4 text-sm text-gray-900">{farmer.crop_two || '-'}</td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => openEditModal(farmer)}
                                                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(farmer._id)}
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
                                {editMode ? text.editFarmer : text.addFarmer}
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{text.fullName} *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">{text.landSize} ({text.acres})</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.land_size}
                                    onChange={(e) => setFormData({ ...formData, land_size: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{text.idProof}</label>
                                <input
                                    type="text"
                                    value={formData.id_proof}
                                    onChange={(e) => setFormData({ ...formData, id_proof: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{text.surveyNo}</label>
                                <input
                                    type="text"
                                    value={formData.survey_no}
                                    onChange={(e) => setFormData({ ...formData, survey_no: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{text.cropOne}</label>
                                    <input
                                        type="text"
                                        value={formData.crop_one}
                                        onChange={(e) => setFormData({ ...formData, crop_one: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{text.cropTwo}</label>
                                    <input
                                        type="text"
                                        value={formData.crop_two}
                                        onChange={(e) => setFormData({ ...formData, crop_two: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                                    />
                                </div>
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
                                {submitting ? 'Saving...' : (editMode ? text.updateFarmer : text.saveFarmer)}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FarmerManagement;
