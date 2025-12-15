import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [language, setLanguage] = useState<'en' | 'gu'>('en');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    Category: '' as 'Farmer' | 'Company' | '',
    Name: '',
    Email: '',
    Phone_no: '',
    password: '',
    agreedToTerms: false,
  });

  const t = {
    en: {
      title: 'Register',
      category: 'Category',
      selectCategory: 'Select Category',
      farmer: 'Farmer',
      company: 'Company',
      fullName: 'Full Name',
      mobile: 'Mobile Number',
      email: 'Email Address',
      emailOptional: 'Email (Optional)',
      password: 'Password',
      terms: 'I agree to the Terms and Conditions',
      registerBtn: 'Register',
      haveAccount: 'Already have an account?',
      login: 'Login',
    },
    gu: {
      title: 'રજીસ્ટર',
      category: 'શ્રેણી',
      selectCategory: 'શ્રેણી પસંદ કરો',
      farmer: 'ખેડૂત',
      company: 'કંપની',
      fullName: 'પૂરું નામ',
      mobile: 'મોબાઇલ નંબર',
      email: 'ઇમેઇલ સરનામું',
      emailOptional: 'ઇમેઇલ (વૈકલ્પિક)',
      password: 'પાસવર્ડ',
      terms: 'હું શરતો અને નિયમો સાથે સંમત છું',
      registerBtn: 'રજીસ્ટર',
      haveAccount: 'પહેલેથી જ ખાતું છે?',
      login: 'લૉગિન કરો',
    }
  };

  const text = t[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
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

      // After successful registration, navigate to login
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <img src="/src/assets/images/l.png" alt="Logo" className="h-12" />
          <span className="text-2xl font-bold text-black">Krishi Sangam</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-black p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-emerald-600">{text.title}</h2>
            <button
              onClick={() => setLanguage(language === 'en' ? 'gu' : 'en')}
              className="text-sm px-3 py-1.5 border border-gray-300 rounded-full hover:border-emerald-500 transition-colors"
            >
              {language === 'en' ? 'ગુ' : 'EN'}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {text.category}
              </label>
              <select
                value={formData.Category}
                onChange={(e) => setFormData({ ...formData, Category: e.target.value as 'Farmer' | 'Company' })}
                className="w-full px-4 py-3 border border-black rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
              >
                <option value="">{text.selectCategory}</option>
                <option value="Farmer">{text.farmer}</option>
                <option value="Company">{text.company}</option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {text.fullName}
              </label>
              <input
                type="text"
                value={formData.Name}
                onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                className="w-full px-4 py-3 border border-black rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Mobile (for Farmer) or Phone (for Company) */}
            {formData.Category && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.Category === 'Farmer' ? text.mobile : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  value={formData.Phone_no}
                  onChange={(e) => setFormData({ ...formData, Phone_no: e.target.value })}
                  pattern="[0-9]{10}"
                  maxLength={10}
                  className="w-full px-4 py-3 border border-black rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required={formData.Category === 'Farmer'}
                />
              </div>
            )}

            {/* Email */}
            {formData.Category && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.Category === 'Farmer' ? text.emailOptional : text.email}
                </label>
                <input
                  type="email"
                  value={formData.Email}
                  onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                  className="w-full px-4 py-3 border border-black rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required={formData.Category === 'Company'}
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {text.password}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-black rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.agreedToTerms}
                onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                required
              />
              <label className="text-sm text-gray-700">
                {text.terms}
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
            >
              {loading ? 'Registering...' : text.registerBtn}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            {text.haveAccount}{' '}
            <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
              {text.login}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;