import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createFarmer } from '../../services/farmer.service';
import {
    User, Mail, Phone, MapPin, Ruler, CreditCard,
    FileText, Leaf, LogOut, AlertCircle, ArrowRight, Loader2, Menu, X
} from 'lucide-react';

const FarmerRegistrationDetails = () => {
    const navigate = useNavigate();
    const { user, logout, isLoading: authLoading } = useAuth();
    const [language, setLanguage] = useState<'en' | 'gu'>('en');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_no: '',
        address: '',
        land_size: '',
        id_proof: '',
        survey_no: '',
        crop_one: '',
        crop_two: '',
    });

    useEffect(() => {
        document.title = language === 'gu'
            ? 'ખેડૂત વિગતો — કૃષિ સંગમ'
            : 'Farmer Details — Krishi Sangam';
    }, [language]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        } else if (!authLoading && user && user.Category !== 'Farmer') {
            navigate('/company/registration-details');
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.Name || '',
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
            title: 'Complete Your Profile',
            subtitle: 'Fill in your farming details to start connecting with companies',
            name: 'Full Name',
            namePlaceholder: 'Enter your full name',
            email: 'Email Address',
            emailOptional: '(Optional)',
            emailPlaceholder: 'your@email.com',
            phone: 'Phone Number',
            phonePlaceholder: '10-digit number',
            address: 'Address',
            addressPlaceholder: 'Village, Taluka, District, State',
            landSize: 'Land Size (Acres)',
            landSizePlaceholder: 'e.g., 2.5',
            idProof: 'Aadhar Card Number',
            idProofPlaceholder: '12-digit Aadhar number',
            surveyNo: 'Survey Number',
            surveyNoPlaceholder: 'Land survey number',
            crop1: 'Primary Crop',
            crop1Placeholder: 'e.g., Wheat',
            crop2: 'Secondary Crop',
            crop2Placeholder: 'e.g., Cotton',
            submit: 'Complete Registration',
            submitting: 'Submitting...',
        },
        gu: {
            home: 'હોમ',
            help: 'મદદ',
            logout: 'લોગઆઉટ',
            title: 'તમારી પ્રોફાઇલ પૂર્ણ કરો',
            subtitle: 'કંપનીઓ સાથે જોડાવા માટે તમારી ખેતીની વિગતો ભરો',
            name: 'પૂરું નામ',
            namePlaceholder: 'તમારું પૂરું નામ દાખલ કરો',
            email: 'ઇમેઇલ સરનામું',
            emailOptional: '(વૈકલ્પિક)',
            emailPlaceholder: 'your@email.com',
            phone: 'ફોન નંબર',
            phonePlaceholder: '10-અંકનો નંબર',
            address: 'સરનામું',
            addressPlaceholder: 'ગામ, તાલુકો, જિલ્લો, રાજ્ય',
            landSize: 'જમીનનું કદ (એકર)',
            landSizePlaceholder: 'દા.ત., 2.5',
            idProof: 'આધાર કાર્ડ નંબર',
            idProofPlaceholder: '12-અંકનો આધાર નંબર',
            surveyNo: 'સર્વે નંબર',
            surveyNoPlaceholder: 'જમીન સર્વે નંબર',
            crop1: 'પ્રાથમિક પાક',
            crop1Placeholder: 'દા.ત., ઘઉં',
            crop2: 'ગૌણ પાક',
            crop2Placeholder: 'દા.ત., કપાસ',
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.phone_no || !formData.address ||
            !formData.land_size || !formData.id_proof || !formData.survey_no ||
            !formData.crop_one || !formData.crop_two) {
            setError('Please fill all required fields');
            return;
        }

        if (!/^[0-9]{10}$/.test(formData.phone_no)) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!/^[0-9]{12}$/.test(formData.id_proof)) {
            setError('Please enter a valid 12-digit Aadhar Card number');
            return;
        }

        const landSize = parseFloat(formData.land_size);
        if (isNaN(landSize) || landSize <= 0) {
            setError('Please enter a valid land size');
            return;
        }

        setLoading(true);

        try {
            await createFarmer({
                name: formData.name,
                email: formData.email || `${formData.phone_no}@farmer.local`,
                address: formData.address,
                land_size: landSize,
                phone_no: parseInt(formData.phone_no),
                id_proof: formData.id_proof,
                survey_no: formData.survey_no,
                crop_one: formData.crop_one,
                crop_two: formData.crop_two,
            });

            navigate('/farmer/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to submit details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center font-['Plus_Jakarta_Sans']">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="w-10 h-10 animate-spin text-zinc-950" />
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">Authenticating Pulse...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 font-['Plus_Jakarta_Sans'] selection:bg-zinc-950 selection:text-white">
            {/* Background Depth */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-400/5 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-900/5 blur-[120px] rounded-full animate-pulse delay-700"></div>
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-zinc-800/5 blur-[100px] rounded-full animate-pulse delay-1000"></div>
            </div>

            {/* Floating Navbar */}
            <header
                className={`fixed top-8 left-1/2 -translate-x-1/2 w-[90%] md:w-[85%] max-w-7xl z-[1000] transition-all duration-700 ${scrolled
                    ? 'bg-white/40 backdrop-blur-3xl border border-white shadow-premium py-4 rounded-[2.5rem]'
                    : 'bg-white/60 backdrop-blur-2xl border border-white shadow-lg py-5 rounded-[3rem]'
                    }`}
            >
                <div className="px-8 md:px-12 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-4 group">
                        <img src="/src/assets/images/l.png" alt="Logo" className="w-10 h-10 object-contain transition-transform duration-500" />
                        <span className="text-xl font-bold font-display tracking-tightest text-zinc-900 whitespace-nowrap">
                            Krishi Sangam
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-10">
                        <div className="flex items-center gap-8 bg-zinc-50/50 backdrop-blur-md px-8 py-3 rounded-2xl border border-zinc-100 shadow-inner">
                            <Link to="/" className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-950 transition-colors">
                                {text.home}
                            </Link>
                            <Link to="/help" className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-950 transition-colors">
                                {text.help}
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setLanguage(l => l === 'en' ? 'gu' : 'en')}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-zinc-100 text-[11px] font-black text-zinc-950 hover:bg-zinc-950 hover:text-white hover:shadow-xl transition-all active:scale-95"
                            >
                                {language === 'en' ? 'GU' : 'EN'}
                            </button>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 text-[11px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-xl transition-all active:scale-95"
                            >
                                <LogOut size={16} />
                                {text.logout}
                            </button>
                        </div>
                    </nav>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="lg:hidden w-12 h-12 flex items-center justify-center bg-zinc-50 rounded-2xl border border-zinc-100 text-zinc-950 shadow-sm"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 bg-zinc-950/98 backdrop-blur-3xl z-[990] transition-all duration-700 lg:hidden flex items-center justify-center ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
                <div className="flex flex-col items-center gap-12 text-center p-12">
                    <img src="/src/assets/images/l.png" alt="Logo" className="w-20 h-20 brightness-0 invert mb-4" />
                    <Link to="/" onClick={() => setMenuOpen(false)} className="text-5xl font-black text-white hover:text-zinc-400 transition-colors tracking-tightest uppercase">{text.home}</Link>
                    <Link to="/help" onClick={() => setMenuOpen(false)} className="text-5xl font-black text-white hover:text-zinc-400 transition-colors tracking-tightest uppercase">{text.help}</Link>
                    <div className="flex flex-col gap-6 mt-12 w-full">
                        <button onClick={() => { setLanguage(language === 'en' ? 'gu' : 'en'); setMenuOpen(false); }} className="w-full py-5 rounded-3xl bg-white/10 text-xl font-black text-white uppercase tracking-[0.25em] border border-white/10 active:scale-95 transition-all">
                            {language === 'en' ? 'ગુજરાતી' : 'English Interface'}
                        </button>
                        <button onClick={handleLogout} className="w-full py-5 rounded-3xl bg-red-500 text-xl font-black text-white uppercase tracking-[0.25em] shadow-2xl active:scale-95 transition-all">
                            {text.logout}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="pt-48 pb-32 px-6 relative z-10">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-premium mb-8 animate-bounce-slow">
                            <img src="/src/assets/images/crops.png" alt="Icon" className="w-12 h-12 grayscale brightness-50" />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-zinc-950 mb-6 tracking-tightest leading-[0.9]">{text.title}</h1>
                        <p className="text-zinc-400 text-lg font-medium tracking-tight max-w-md mx-auto">{text.subtitle}</p>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white/40 backdrop-blur-3xl rounded-[3.5rem] p-12 md:p-16 border border-white/60 shadow-premium">
                        {/* Error */}
                        {error && (
                            <div className="mb-10 p-6 bg-red-50 border border-red-100 text-red-600 rounded-3xl text-sm font-black uppercase tracking-widest animate-pulse flex items-center gap-3">
                                <AlertCircle size={20} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* Name & Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-2">
                                        {text.name}
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder={text.namePlaceholder}
                                            className="w-full pl-14 pr-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-950 placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-950/5 focus:bg-white transition-all font-semibold tracking-tight h-16"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-2">
                                        {text.phone}
                                    </label>
                                    <div className="relative group">
                                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
                                        <input
                                            type="tel"
                                            value={formData.phone_no}
                                            onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })}
                                            placeholder={text.phonePlaceholder}
                                            maxLength={10}
                                            className="w-full pl-14 pr-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-950 placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-950/5 focus:bg-white transition-all font-semibold tracking-tight h-16"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-2">
                                    {text.email} <span className="text-zinc-300 font-bold">{text.emailOptional}</span>
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder={text.emailPlaceholder}
                                        className="w-full pl-14 pr-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-950 placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-950/5 focus:bg-white transition-all font-semibold tracking-tight h-16"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-2">
                                    {text.address}
                                </label>
                                <div className="relative group">
                                    <MapPin className="absolute left-6 top-6 w-5 h-5 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder={text.addressPlaceholder}
                                        rows={3}
                                        className="w-full pl-14 pr-6 py-6 bg-zinc-50 border border-zinc-100 rounded-[2rem] text-zinc-950 placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-950/5 focus:bg-white transition-all font-semibold tracking-tight resize-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Land Size & Survey */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-2">
                                        {text.landSize}
                                    </label>
                                    <div className="relative group">
                                        <Ruler className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
                                        <input
                                            type="number"
                                            value={formData.land_size}
                                            onChange={(e) => setFormData({ ...formData, land_size: e.target.value })}
                                            placeholder={text.landSizePlaceholder}
                                            min="0"
                                            step="0.1"
                                            className="w-full pl-14 pr-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-950 placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-950/5 focus:bg-white transition-all font-semibold tracking-tight h-16"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-2">
                                        {text.surveyNo}
                                    </label>
                                    <div className="relative group">
                                        <FileText className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.survey_no}
                                            onChange={(e) => setFormData({ ...formData, survey_no: e.target.value })}
                                            placeholder={text.surveyNoPlaceholder}
                                            className="w-full pl-14 pr-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-950 placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-950/5 focus:bg-white transition-all font-semibold tracking-tight h-16"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Aadhar */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-2">
                                    {text.idProof}
                                </label>
                                <div className="relative group">
                                    <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
                                    <input
                                        type="text"
                                        value={formData.id_proof}
                                        onChange={(e) => setFormData({ ...formData, id_proof: e.target.value })}
                                        placeholder={text.idProofPlaceholder}
                                        maxLength={12}
                                        className="w-full pl-14 pr-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-950 placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-950/5 focus:bg-white transition-all font-semibold tracking-tight h-16"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Crops */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-2">
                                        {text.crop1}
                                    </label>
                                    <div className="relative group">
                                        <Leaf className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.crop_one}
                                            onChange={(e) => setFormData({ ...formData, crop_one: e.target.value })}
                                            placeholder={text.crop1Placeholder}
                                            className="w-full pl-14 pr-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-950 placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-950/5 focus:bg-white transition-all font-semibold tracking-tight h-16"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] ml-2">
                                        {text.crop2}
                                    </label>
                                    <div className="relative group">
                                        <Leaf className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.crop_two}
                                            onChange={(e) => setFormData({ ...formData, crop_two: e.target.value })}
                                            placeholder={text.crop2Placeholder}
                                            className="w-full pl-14 pr-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-950 placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-950/5 focus:bg-white transition-all font-semibold tracking-tight h-16"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-20 bg-zinc-950 text-white rounded-[2rem] font-black text-[13px] uppercase tracking-[0.3em] hover:bg-zinc-900 active:scale-95 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 group mt-12 shadow-xl shadow-zinc-950/20"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        {text.submitting}
                                    </>
                                ) : (
                                    <>
                                        {text.submit}
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FarmerRegistrationDetails;
