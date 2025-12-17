import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Eye, EyeOff, Mail, Phone, Lock, Loader2,
    ArrowRight, Menu, X
} from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, user, isLoading: authLoading } = useAuth();
    const [language, setLanguage] = useState<'en' | 'gu'>('en');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('phone');
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const [formData, setFormData] = useState({
        Email: '',
        Phone_no: '',
        password: '',
    });

    useEffect(() => {
        document.title = language === 'gu'
            ? 'લૉગિન - કૃષિ સંગમ'
            : 'Login - Krishi Sangam';
    }, [language]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const state = location.state as { message?: string } | null;
        if (state?.message) {
            setSuccessMessage(state.message);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    useEffect(() => {
        if (!authLoading && user) {
            if (user.Category === 'Farmer') {
                navigate('/farmer/registration-details');
            } else if (user.Category === 'Company') {
                navigate('/company/registration-details');
            } else if (user.Category === 'Admin') {
                navigate('/admin/dashboard');
            }
        }
    }, [user, authLoading, navigate]);

    const t = {
        en: {
            home: 'Home',
            aboutUs: 'About Us',
            contactUs: 'Contact Us',
            help: 'Help',
            register: 'Register',
            title: 'Welcome Back',
            subtitle: 'Login to continue to your dashboard',
            emailTab: 'Email',
            phoneTab: 'Phone',
            email: 'Email Address',
            emailPlaceholder: 'Enter your email',
            phone: 'Mobile Number',
            phonePlaceholder: 'Enter your mobile number',
            password: 'Password',
            passwordPlaceholder: 'Enter your password',
            forgotPassword: 'Forgot Password?',
            loginBtn: 'Login',
            loggingIn: 'Logging in...',
            noAccount: "Don't have an account?",
            registerLink: 'Create one',
        },
        gu: {
            home: 'હોમ',
            aboutUs: 'અમારા વિશે',
            contactUs: 'અમારો સંપર્ક કરો',
            help: 'મદદ',
            register: 'રજીસ્ટર',
            title: 'પાછા આવો',
            subtitle: 'તમારા ડેશબોર્ડ પર જવા માટે લૉગિન કરો',
            emailTab: 'ઇમેઇલ',
            phoneTab: 'ફોન',
            email: 'ઇમેઇલ સરનામું',
            emailPlaceholder: 'તમારું ઇમેઇલ દાખલ કરો',
            phone: 'મોબાઇલ નંબર',
            phonePlaceholder: 'તમારો મોબાઇલ નંબર દાખલ કરો',
            password: 'પાસવર્ડ',
            passwordPlaceholder: 'તમારો પાસવર્ડ દાખલ કરો',
            forgotPassword: 'પાસવર્ડ ભૂલી ગયા?',
            loginBtn: 'લૉગિન',
            loggingIn: 'લૉગિન થઈ રહ્યું છે...',
            noAccount: 'ખાતું નથી?',
            registerLink: 'બનાવો',
        }
    };

    const text = t[language];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (loginMethod === 'email' && !formData.Email) {
            setError('Please enter your email address');
            return;
        }

        if (loginMethod === 'phone' && !formData.Phone_no) {
            setError('Please enter your mobile number');
            return;
        }

        if (!formData.password) {
            setError('Please enter your password');
            return;
        }

        if (loginMethod === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (loginMethod === 'phone' && !/^[0-9]{10}$/.test(formData.Phone_no)) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        setLoading(true);

        try {
            await login({
                Email: loginMethod === 'email' ? formData.Email : undefined,
                Phone_no: loginMethod === 'phone' ? parseInt(formData.Phone_no) : undefined,
                password: formData.password,
            });
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-['Inter']">
            {/* Floating Navbar - Same as Landing */}
            <header
                className={`fixed top-0 w-full z-[1000] transition-all duration-500 border-b ${scrolled
                        ? 'bg-white/80 backdrop-blur-xl border-gray-200/50 py-3 shadow-sm'
                        : 'bg-white/50 backdrop-blur-md border-gray-200/30 py-4'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-0 group-hover:opacity-30 transition-opacity rounded-full"></div>
                            <img src="/src/assets/images/l.png" alt="Krishi Sangam" className="h-10 w-auto relative z-10" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">Krishi Sangam</span>
                    </Link>

                    {/* Pill-Shaped Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-8 bg-gray-100/80 backdrop-blur-md px-8 py-2.5 rounded-full border border-gray-200/50 shadow-sm">
                        <Link to="/" className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
                            {text.home}
                        </Link>
                        <Link to="/about" className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
                            {text.aboutUs}
                        </Link>
                        <Link to="/contact" className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
                            {text.contactUs}
                        </Link>
                        <Link to="/help" className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
                            {text.help}
                        </Link>

                        <div className="w-px h-4 bg-gray-300"></div>

                        <button
                            onClick={() => setLanguage(l => l === 'en' ? 'gu' : 'en')}
                            className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-emerald-600 transition-colors"
                        >
                            {language === 'en' ? 'GU' : 'EN'}
                        </button>

                        <Link
                            to="/register"
                            className="text-sm font-semibold px-5 py-2 rounded-full bg-gray-900 text-white hover:bg-emerald-600 transition-all duration-300"
                        >
                            {text.register}
                        </Link>
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

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-gray-900/95 backdrop-blur-xl z-[990] transition-all duration-500 lg:hidden flex items-center justify-center ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                <div className="flex flex-col items-center gap-8 text-center">
                    <Link to="/" onClick={() => setMenuOpen(false)} className="text-3xl font-light text-white hover:text-emerald-400 transition-colors">{text.home}</Link>
                    <Link to="/about" onClick={() => setMenuOpen(false)} className="text-3xl font-light text-white hover:text-emerald-400 transition-colors">{text.aboutUs}</Link>
                    <Link to="/contact" onClick={() => setMenuOpen(false)} className="text-3xl font-light text-white hover:text-emerald-400 transition-colors">{text.contactUs}</Link>
                    <Link to="/help" onClick={() => setMenuOpen(false)} className="text-3xl font-light text-white hover:text-emerald-400 transition-colors">{text.help}</Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)} className="text-3xl font-light text-white hover:text-emerald-400 transition-colors">{text.register}</Link>
                    <button onClick={() => { setLanguage(language === 'en' ? 'gu' : 'en'); setMenuOpen(false); }} className="text-xl font-bold text-gray-500 uppercase tracking-widest mt-8">
                        Switch to {language === 'en' ? 'Gujarati' : 'English'}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="pt-28 pb-16 px-4 min-h-screen flex items-center justify-center">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{text.title}</h1>
                        <p className="text-gray-500 text-lg">{text.subtitle}</p>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-sm">
                            {successMessage}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm">
                            {error}
                        </div>
                    )}

                    {/* Login Method Tabs */}
                    <div className="flex mb-8 bg-gray-100 rounded-2xl p-1.5">
                        <button
                            type="button"
                            onClick={() => setLoginMethod('phone')}
                            className={`flex-1 py-3.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${loginMethod === 'phone'
                                    ? 'bg-white shadow-md text-gray-900'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Phone size={18} />
                            {text.phoneTab}
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginMethod('email')}
                            className={`flex-1 py-3.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${loginMethod === 'email'
                                    ? 'bg-white shadow-md text-gray-900'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Mail size={18} />
                            {text.emailTab}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email or Phone */}
                        {loginMethod === 'email' ? (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {text.email}
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={formData.Email}
                                        onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                                        placeholder={text.emailPlaceholder}
                                        className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {text.phone}
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        value={formData.Phone_no}
                                        onChange={(e) => setFormData({ ...formData, Phone_no: e.target.value })}
                                        placeholder={text.phonePlaceholder}
                                        pattern="[0-9]{10}"
                                        maxLength={10}
                                        className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Password */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    {text.password}
                                </label>
                                <Link to="/forgot-password" className="text-sm text-emerald-600 hover:underline font-medium">
                                    {text.forgotPassword}
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder={text.passwordPlaceholder}
                                    className="w-full pl-12 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group shadow-lg shadow-gray-900/10 hover:shadow-emerald-600/25"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {text.loggingIn}
                                </>
                            ) : (
                                <>
                                    {text.loginBtn}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <p className="text-center text-gray-500 mt-10">
                        {text.noAccount}{' '}
                        <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
                            {text.registerLink}
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Login;
