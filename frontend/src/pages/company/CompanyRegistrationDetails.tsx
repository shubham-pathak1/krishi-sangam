import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createCompany } from '../../services/company.service';
import {
    Building2, Mail, Phone, MapPin, FileCheck,
    LogOut, ArrowRight, Loader2, Menu, X
} from 'lucide-react';

const CompanyRegistrationDetails = () => {
    const navigate = useNavigate();
    const { user, logout, isLoading: authLoading } = useAuth();
    const [language, setLanguage] = useState<'en' | 'gu'>('en');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const [formData, setFormData] = useState({
        company_name: '',
        email: '',
        phone_no: '',
        address: '',
        gstin: '',
    });

    useEffect(() => {
        document.title = language === 'gu'
            ? 'કંપની વિગતો - કૃષિ સંગમ'
            : 'Company Details - Krishi Sangam';
    }, [language]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        } else if (!authLoading && user && user.Category !== 'Company') {
            navigate('/farmer/registration-details');
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                company_name: user.Name || '',
                email: user.Email || '',
                phone_no: user.Phone_no?.toString() || '',
            }));
        }
    }, [user]);

    const t = {
        en: {
            home: 'Home',
            help: 'Help',
            logout: 'Logout',
            title: 'Complete Company Profile',
            subtitle: 'Fill in your business details to start sourcing from farmers',
            companyName: 'Company Name',
            companyNamePlaceholder: 'Enter company name',
            email: 'Email Address',
            emailPlaceholder: 'company@example.com',
            phone: 'Phone Number',
            phonePlaceholder: '10-digit number',
            address: 'Business Address',
            addressPlaceholder: 'Full business address',
            gstin: 'GSTIN',
            gstinPlaceholder: 'e.g., 22AAAAA0000A1Z5',
            gstinHelp: 'GST Identification Number (15 characters)',
            submit: 'Complete Registration',
            submitting: 'Submitting...',
        },
        gu: {
            home: 'હોમ',
            help: 'મદદ',
            logout: 'લોગઆઉટ',
            title: 'કંપની પ્રોફાઇલ પૂર્ણ કરો',
            subtitle: 'ખેડૂતો પાસેથી ઉત્પાદન મેળવવા માટે તમારી વ્યવસાયની વિગતો ભરો',
            companyName: 'કંપનીનું નામ',
            companyNamePlaceholder: 'કંપનીનું નામ દાખલ કરો',
            email: 'ઇમેઇલ સરનામું',
            emailPlaceholder: 'company@example.com',
            phone: 'ફોન નંબર',
            phonePlaceholder: '10-અંકનો નંબર',
            address: 'વ્યવસાયનું સરનામું',
            addressPlaceholder: 'સંપૂર્ણ વ્યવસાય સરનામું',
            gstin: 'GSTIN',
            gstinPlaceholder: 'દા.ત., 22AAAAA0000A1Z5',
            gstinHelp: 'GST ઓળખ નંબર (15 અક્ષરો)',
            submit: 'રજીસ્ટ્રેશન પૂર્ણ કરો',
            submitting: 'સબમિટ થઈ રહ્યું છે...',
        }
    };

    const text = t[language];

    const handleLogout = async () => {
        const confirmMessage = language === 'gu'
            ? 'શું તમે ખરેખર લૉગઆઉટ કરવા માંગો છો?'
            : 'Are you sure you want to logout?';

        if (confirm(confirmMessage)) {
            await logout();
            navigate('/login');
        }
    };

    const validateGSTIN = (gstin: string): boolean => {
        const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        return gstinRegex.test(gstin);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.company_name || !formData.email || !formData.phone_no ||
            !formData.address || !formData.gstin) {
            setError('Please fill all required fields');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!/^[0-9]{10}$/.test(formData.phone_no)) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        if (!validateGSTIN(formData.gstin)) {
            setError('Please enter a valid GSTIN (e.g., 22AAAAA0000A1Z5)');
            return;
        }

        setLoading(true);

        try {
            await createCompany({
                company_name: formData.company_name,
                email: formData.email,
                address: formData.address,
                phone_no: parseInt(formData.phone_no),
                gstin: formData.gstin,
            });

            navigate('/company/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to submit details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-['Inter']">
            {/* Floating Navbar */}
            <header
                className={`fixed top-0 w-full z-[1000] transition-all duration-500 border-b ${scrolled
                        ? 'bg-white/80 backdrop-blur-xl border-gray-200/50 py-3 shadow-sm'
                        : 'bg-white/50 backdrop-blur-md border-gray-200/30 py-4'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-amber-500 blur-lg opacity-0 group-hover:opacity-30 transition-opacity rounded-full"></div>
                            <img src="/src/assets/images/l.png" alt="Krishi Sangam" className="h-10 w-auto relative z-10" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">Krishi Sangam</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-8 bg-gray-100/80 backdrop-blur-md px-8 py-2.5 rounded-full border border-gray-200/50 shadow-sm">
                        <Link to="/" className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors">
                            {text.home}
                        </Link>
                        <Link to="/help" className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors">
                            {text.help}
                        </Link>

                        <div className="w-px h-4 bg-gray-300"></div>

                        <button
                            onClick={() => setLanguage(l => l === 'en' ? 'gu' : 'en')}
                            className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-amber-600 transition-colors"
                        >
                            {language === 'en' ? 'GU' : 'EN'}
                        </button>

                        <button
                            onClick={handleLogout}
                            className="text-sm font-semibold px-5 py-2 rounded-full text-red-600 hover:bg-red-50 transition-all duration-300 flex items-center gap-2"
                        >
                            <LogOut size={16} />
                            {text.logout}
                        </button>
                    </nav>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="lg:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 bg-gray-900/95 backdrop-blur-xl z-[990] transition-all duration-500 lg:hidden flex items-center justify-center ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                <div className="flex flex-col items-center gap-8 text-center">
                    <Link to="/" onClick={() => setMenuOpen(false)} className="text-3xl font-light text-white hover:text-amber-400 transition-colors">{text.home}</Link>
                    <Link to="/help" onClick={() => setMenuOpen(false)} className="text-3xl font-light text-white hover:text-amber-400 transition-colors">{text.help}</Link>
                    <button onClick={() => { setLanguage(language === 'en' ? 'gu' : 'en'); setMenuOpen(false); }} className="text-xl font-bold text-gray-500 uppercase tracking-widest mt-4">
                        {language === 'en' ? 'ગુજરાતી' : 'English'}
                    </button>
                    <button onClick={handleLogout} className="text-2xl font-light text-red-400 hover:text-red-300 transition-colors mt-4">
                        {text.logout}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="pt-28 pb-16 px-4 min-h-screen flex items-center justify-center">
                <div className="w-full max-w-xl">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-6">
                            <Building2 className="w-8 h-8 text-amber-600" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{text.title}</h1>
                        <p className="text-gray-500 text-lg">{text.subtitle}</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Company Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {text.companyName} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.company_name}
                                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                    placeholder={text.companyNamePlaceholder}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {text.email} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder={text.emailPlaceholder}
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {text.phone} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        value={formData.phone_no}
                                        onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })}
                                        placeholder={text.phonePlaceholder}
                                        maxLength={10}
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {text.address} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder={text.addressPlaceholder}
                                    rows={2}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none resize-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* GSTIN */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {text.gstin} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <FileCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.gstin}
                                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                                    placeholder={text.gstinPlaceholder}
                                    maxLength={15}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none uppercase"
                                    required
                                />
                            </div>
                            <p className="mt-2 text-xs text-gray-500">{text.gstinHelp}</p>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-amber-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group shadow-lg shadow-gray-900/10 hover:shadow-amber-600/25 mt-8"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {text.submitting}
                                </>
                            ) : (
                                <>
                                    {text.submit}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default CompanyRegistrationDetails;
