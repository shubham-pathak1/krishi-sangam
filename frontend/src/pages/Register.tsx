import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Eye, EyeOff, Menu, X, Users, Building2,
  ArrowRight, Check, Loader2
} from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [language, setLanguage] = useState<'en' | 'gu'>('en');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [formData, setFormData] = useState({
    Category: '' as 'Farmer' | 'Company' | '',
    Name: '',
    Email: '',
    Phone_no: '',
    password: '',
    agreedToTerms: false,
  });

  useEffect(() => {
    document.title = language === 'gu'
      ? 'રજીસ્ટ્રેશન - કૃષિ સંગમ'
      : 'Registration - Krishi Sangam';
  }, [language]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = {
    en: {
      home: 'Home',
      aboutUs: 'About Us',
      contactUs: 'Contact Us',
      help: 'Help',
      login: 'Login',
      title: 'Create Your Account',
      subtitle: 'Join thousands of farmers and companies on Krishi Sangam',
      selectRole: 'I am a...',
      farmer: 'Farmer',
      farmerDesc: 'Sell your crops directly to companies',
      company: 'Company',
      companyDesc: 'Source quality produce from farmers',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Enter your full name',
      mobile: 'Mobile Number',
      mobilePlaceholder: '10-digit mobile number',
      email: 'Email Address',
      emailPlaceholder: 'your@email.com',
      emailOptional: 'Email (Optional)',
      password: 'Password',
      passwordPlaceholder: 'Create a strong password',
      terms: 'I agree to the',
      termsLink: 'Terms and Conditions',
      registerBtn: 'Create Account',
      registering: 'Creating account...',
      haveAccount: 'Already have an account?',
      loginLink: 'Login here',
    },
    gu: {
      home: 'હોમ',
      aboutUs: 'અમારા વિશે',
      contactUs: 'અમારો સંપર્ક કરો',
      help: 'મદદ',
      login: 'લૉગિન',
      title: 'તમારું ખાતું બનાવો',
      subtitle: 'કૃષિ સંગમ પર હજારો ખેડૂતો અને કંપનીઓ સાથે જોડાઓ',
      selectRole: 'હું છું...',
      farmer: 'ખેડૂત',
      farmerDesc: 'તમારા પાક સીધા કંપનીઓને વેચો',
      company: 'કંપની',
      companyDesc: 'ખેડૂતો પાસેથી ગુણવત્તાયુક્ત ઉત્પાદન મેળવો',
      fullName: 'પૂરું નામ',
      fullNamePlaceholder: 'તમારું પૂરું નામ દાખલ કરો',
      mobile: 'મોબાઇલ નંબર',
      mobilePlaceholder: '10-અંકનો મોબાઇલ નંબર',
      email: 'ઇમેઇલ સરનામું',
      emailPlaceholder: 'your@email.com',
      emailOptional: 'ઇમેઇલ (વૈકલ્પિક)',
      password: 'પાસવર્ડ',
      passwordPlaceholder: 'મજબૂત પાસવર્ડ બનાવો',
      terms: 'હું સંમત છું',
      termsLink: 'શરતો અને નિયમો',
      registerBtn: 'ખાતું બનાવો',
      registering: 'ખાતું બનાવી રહ્યા છીએ...',
      haveAccount: 'પહેલેથી જ ખાતું છે?',
      loginLink: 'અહીં લૉગિન કરો',
    }
  };

  const text = t[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.Category || !formData.Name || !formData.password) {
      setError('Please fill all required fields');
      return;
    }

    if (!formData.Email && !formData.Phone_no) {
      setError(formData.Category === 'Farmer' ? 'Mobile number is required' : 'Email or Phone number is required');
      return;
    }

    if (formData.Phone_no && !/^[0-9]{10}$/.test(formData.Phone_no)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (formData.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!formData.agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      await register({
        Category: formData.Category as 'Farmer' | 'Company',
        Name: formData.Name,
        Email: formData.Email || undefined,
        Phone_no: formData.Phone_no ? parseInt(formData.Phone_no) : undefined,
        password: formData.password,
      });

      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
              to="/login"
              className="text-sm font-semibold px-5 py-2 rounded-full bg-gray-900 text-white hover:bg-emerald-600 transition-all duration-300"
            >
              {text.login}
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
          <Link to="/login" onClick={() => setMenuOpen(false)} className="text-3xl font-light text-white hover:text-emerald-400 transition-colors">{text.login}</Link>
          <button onClick={() => { setLanguage(language === 'en' ? 'gu' : 'en'); setMenuOpen(false); }} className="text-xl font-bold text-gray-500 uppercase tracking-widest mt-8">
            Switch to {language === 'en' ? 'Gujarati' : 'English'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-28 pb-16 px-4 min-h-screen flex items-center justify-center">
        <div className="max-w-lg w-full">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{text.title}</h1>
            <p className="text-gray-500 text-lg">{text.subtitle}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                {text.selectRole}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, Category: 'Farmer' })}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${formData.Category === 'Farmer'
                      ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {formData.Category === 'Farmer' && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all ${formData.Category === 'Farmer' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                    <Users size={24} className={formData.Category === 'Farmer' ? 'text-white' : 'text-gray-600'} />
                  </div>
                  <h3 className={`font-bold text-lg mb-1 ${formData.Category === 'Farmer' ? 'text-emerald-700' : 'text-gray-900'}`}>
                    {text.farmer}
                  </h3>
                  <p className="text-sm text-gray-500">{text.farmerDesc}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, Category: 'Company' })}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${formData.Category === 'Company'
                      ? 'border-amber-500 bg-amber-50 shadow-lg shadow-amber-500/10'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {formData.Category === 'Company' && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all ${formData.Category === 'Company' ? 'bg-amber-500 shadow-lg shadow-amber-500/30' : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                    <Building2 size={24} className={formData.Category === 'Company' ? 'text-white' : 'text-gray-600'} />
                  </div>
                  <h3 className={`font-bold text-lg mb-1 ${formData.Category === 'Company' ? 'text-amber-700' : 'text-gray-900'}`}>
                    {text.company}
                  </h3>
                  <p className="text-sm text-gray-500">{text.companyDesc}</p>
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {text.fullName}
              </label>
              <input
                type="text"
                value={formData.Name}
                onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                placeholder={text.fullNamePlaceholder}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                required
              />
            </div>

            {/* Mobile (for Farmer) or Phone (for Company) */}
            {formData.Category && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {formData.Category === 'Farmer' ? text.mobile : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  value={formData.Phone_no}
                  onChange={(e) => setFormData({ ...formData, Phone_no: e.target.value })}
                  placeholder={text.mobilePlaceholder}
                  pattern="[0-9]{10}"
                  maxLength={10}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                  required={formData.Category === 'Farmer'}
                />
              </div>
            )}

            {/* Email */}
            {formData.Category && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {formData.Category === 'Farmer' ? text.emailOptional : text.email}
                </label>
                <input
                  type="email"
                  value={formData.Email}
                  onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                  placeholder={text.emailPlaceholder}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                  required={formData.Category === 'Company'}
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {text.password}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={text.passwordPlaceholder}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none pr-14"
                  required
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

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreedToTerms}
                onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                className="w-5 h-5 mt-0.5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                required
              />
              <label htmlFor="terms" className="text-gray-600 cursor-pointer">
                {text.terms}{' '}
                <Link to="/terms" className="text-emerald-600 font-semibold hover:underline">
                  {text.termsLink}
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.Category}
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group shadow-lg shadow-gray-900/10 hover:shadow-emerald-600/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {text.registering}
                </>
              ) : (
                <>
                  {text.registerBtn}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-500 mt-10">
            {text.haveAccount}{' '}
            <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
              {text.loginLink}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;