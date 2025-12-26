import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Send, Mail, Phone, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import feedbackService from '../services/feedback.service';
import type { FeedbackData } from '../services/feedback.service';

const Contact = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [language, setLanguage] = useState<'en' | 'gu'>('en');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<FeedbackData>({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    useEffect(() => {
        document.title = language === 'en' ? 'Contact Us - Krishi Sangam' : 'અમારો સંપર્ક કરો - કૃષિ સંગમ';
    }, [language]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const t = {
        en: {
            contactUs: 'Contact Us',
            aboutUs: 'About Us',
            help: 'Help',
            login: 'Login',
            heroTitle: 'Get in Touch',
            heroSubtitle: 'Have questions? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
            formTitle: 'Send us a Message',
            formSubtitle: 'Fill out the form below and our team will get back to you within 24 hours.',
            name: 'Full Name',
            namePlaceholder: 'Enter your full name',
            email: 'Email Address',
            emailPlaceholder: 'Enter your email address',
            phone: 'Phone Number',
            phonePlaceholder: 'Enter your 10-digit phone number',
            message: 'Message',
            messagePlaceholder: 'Write your message here...',
            submit: 'Send Message',
            submitting: 'Sending...',
            successTitle: 'Message Sent!',
            successMessage: 'Thank you for reaching out. We\'ll get back to you within 24 hours.',
            sendAnother: 'Send Another Message',
            emailLabel: 'Email Us',
            emailValue: 'support@krishisangam.com',
            phoneLabel: 'Call Us',
            phoneValue: '+91 98765 43210',
            addressLabel: 'Visit Us',
            addressValue: 'Vadodara, Gujarat, India',
            footer: '© 2024 Krishi Sangam. All rights reserved.',
            errorRequired: 'Please fill out all fields.',
            errorPhone: 'Please enter a valid 10-digit phone number.',
            errorSubmit: 'Failed to submit. Please try again.',
        },
        gu: {
            contactUs: 'અમારો સંપર્ક કરો',
            aboutUs: 'અમારા વિશે',
            help: 'મદદ',
            login: 'લૉગિન',
            heroTitle: 'સંપર્કમાં રહો',
            heroSubtitle: 'પ્રશ્નો છે? અમને તમારી પાસેથી સાંભળવું ગમશે. અમને સંદેશ મોકલો અને અમે શક્ય તેટલા ટૂંક સમયમાં જવાબ આપીશું.',
            formTitle: 'અમને સંદેશ મોકલો',
            formSubtitle: 'નીચેનું ફોર્મ ભરો અને અમારી ટીમ 24 કલાકમાં તમને જવાબ આપશે.',
            name: 'પૂર્ણ નામ',
            namePlaceholder: 'તમારું પૂર્ણ નામ દાખલ કરો',
            email: 'ઇમેઇલ સરનામું',
            emailPlaceholder: 'તમારું ઇમેઇલ સરનામું દાખલ કરો',
            phone: 'ફોન નંબર',
            phonePlaceholder: 'તમારો 10-અંકનો ફોન નંબર દાખલ કરો',
            message: 'સંદેશ',
            messagePlaceholder: 'તમારો સંદેશ અહીં લખો...',
            submit: 'સંદેશ મોકલો',
            submitting: 'મોકલી રહ્યા છીએ...',
            successTitle: 'સંદેશ મોકલાયો!',
            successMessage: 'સંપર્ક કરવા બદલ આભાર. અમે 24 કલાકમાં તમને જવાબ આપીશું.',
            sendAnother: 'બીજો સંદેશ મોકલો',
            emailLabel: 'ઇમેઇલ કરો',
            emailValue: 'support@krishisangam.com',
            phoneLabel: 'કૉલ કરો',
            phoneValue: '+91 98765 43210',
            addressLabel: 'મુલાકાત લો',
            addressValue: 'વડોદરા, ગુજરાત, ભારત',
            footer: '© 2024 કૃષિ સંગમ. સર્વ હક સંચિત.',
            errorRequired: 'કૃપા કરીને બધા ફીલ્ડ ભરો.',
            errorPhone: 'કૃપા કરીને માન્ય 10-અંકનો ફોન નંબર દાખલ કરો.',
            errorSubmit: 'સબમિટ કરવામાં નિષ્ફળ. કૃપા કરીને ફરીથી પ્રયાસ કરો.',
        }
    };

    const text = t[language];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.name || !formData.email || !formData.phone || !formData.message) {
            setError(text.errorRequired);
            return;
        }

        if (!/^[0-9]{10}$/.test(formData.phone)) {
            setError(text.errorPhone);
            return;
        }

        setIsSubmitting(true);

        try {
            await feedbackService.submitFeedback(formData);
            setIsSubmitted(true);
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (err) {
            console.error('Error submitting feedback:', err);
            setError(text.errorSubmit);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setIsSubmitted(false);
        setError('');
    };

    return (
        <div className="font-['Inter'] bg-white w-full min-h-screen overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900">

            {/* Floating Navbar */}
            <header
                className={`fixed top-0 w-full z-[1000] transition-all duration-500 border-b ${scrolled
                    ? 'bg-white/80 backdrop-blur-xl border-gray-200/50 py-3 shadow-sm'
                    : 'bg-white/50 backdrop-blur-md border-gray-200/30 py-4'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3 group relative z-50">
                        <div className="relative">
                            <img
                                src="/src/assets/images/l.png"
                                alt="Krishi Sangam"
                                className="h-10 w-auto relative z-10"
                            />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">
                            Krishi Sangam
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-8 bg-gray-100/80 backdrop-blur-md px-8 py-2.5 rounded-full border border-gray-200/50 shadow-sm">
                        {[
                            { to: '/about', label: text.aboutUs },
                            { to: '/contact', label: text.contactUs },
                            { to: '/help', label: text.help },
                        ].map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="w-px h-4 bg-gray-300"></div>

                        <button
                            onClick={() => setLanguage(l => l === 'en' ? 'gu' : 'en')}
                            className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded text-gray-500 hover:text-black transition-colors"
                        >
                            {language === 'en' ? 'GU' : 'EN'}
                        </button>

                        <Link
                            to="/login"
                            className="text-sm font-semibold px-5 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
                        >
                            {text.login}
                        </Link>
                    </nav>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="lg:hidden relative z-50 p-2 rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-white z-[990] transition-all duration-500 lg:hidden flex items-center justify-center ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                <div className="flex flex-col items-center gap-8 text-center">
                    <Link to="/" onClick={() => setMenuOpen(false)} className="text-3xl font-light text-black hover:text-gray-600 transition-colors">Home</Link>
                    <Link to="/about" onClick={() => setMenuOpen(false)} className="text-3xl font-light text-black hover:text-gray-600 transition-colors">{text.aboutUs}</Link>
                    <Link to="/contact" onClick={() => setMenuOpen(false)} className="text-3xl font-light text-black hover:text-gray-600 transition-colors">{text.contactUs}</Link>
                    <Link to="/help" onClick={() => setMenuOpen(false)} className="text-3xl font-light text-black hover:text-gray-600 transition-colors">{text.help}</Link>
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="text-3xl font-light text-black hover:text-gray-600 transition-colors">{text.login}</Link>
                    <button onClick={() => { setLanguage(language === 'en' ? 'gu' : 'en'); setMenuOpen(false); }} className="text-xl font-bold text-gray-500 uppercase tracking-widest mt-8">
                        Switch to {language === 'en' ? 'Gujarati' : 'English'}
                    </button>
                </div>
            </div>

            <main className="pt-24">
                {/* Hero Section */}
                <section className="py-20 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight">
                            {text.heroTitle}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
                            {text.heroSubtitle}
                        </p>
                    </div>
                </section>

                {/* Contact Info Cards */}
                <section className="pb-12 px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Email */}
                            <div className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-gray-100 transition-colors">
                                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">{text.emailLabel}</p>
                                <p className="text-black font-medium">{text.emailValue}</p>
                            </div>

                            {/* Phone */}
                            <div className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-gray-100 transition-colors">
                                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Phone className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">{text.phoneLabel}</p>
                                <p className="text-black font-medium">{text.phoneValue}</p>
                            </div>

                            {/* Address */}
                            <div className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-gray-100 transition-colors">
                                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">{text.addressLabel}</p>
                                <p className="text-black font-medium">{text.addressValue}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Form Section */}
                <section className="py-16 px-6">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-3xl border border-gray-200 p-8 md:p-12">

                            {isSubmitted ? (
                                /* Success State */
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-black mb-4">{text.successTitle}</h3>
                                    <p className="text-gray-500 mb-8">{text.successMessage}</p>
                                    <button
                                        onClick={resetForm}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        {text.sendAnother}
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            ) : (
                                /* Form */
                                <>
                                    <div className="text-center mb-10">
                                        <h2 className="text-3xl font-bold text-black mb-2">{text.formTitle}</h2>
                                        <p className="text-gray-500">{text.formSubtitle}</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Name */}
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                                                {text.name}
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder={text.namePlaceholder}
                                                maxLength={255}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                                                {text.email}
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder={text.emailPlaceholder}
                                                maxLength={255}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">
                                                {text.phone}
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder={text.phonePlaceholder}
                                                maxLength={10}
                                                pattern="[0-9]{10}"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                                            />
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                                                {text.message}
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                placeholder={text.messagePlaceholder}
                                                maxLength={1000}
                                                rows={5}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none"
                                            />
                                        </div>

                                        {/* Error Message */}
                                        {error && (
                                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                                {error}
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                text.submitting
                                            ) : (
                                                <>
                                                    {text.submit}
                                                    <Send size={18} />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-black text-white py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <img src="/src/assets/images/l.png" alt="Logo" className="h-8 opacity-90" />
                            <span className="text-lg font-bold">Krishi Sangam</span>
                        </div>
                        <p className="text-gray-500 text-sm">{text.footer}</p>
                        <div className="flex gap-6 text-sm">
                            <Link to="/help" className="text-gray-400 hover:text-white transition-colors">{text.help}</Link>
                            <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">{text.contactUs}</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Contact;
