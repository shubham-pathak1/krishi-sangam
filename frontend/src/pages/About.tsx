import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Target, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';

const About = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [language, setLanguage] = useState<'en' | 'gu'>('en');

    useEffect(() => {
        document.title = language === 'en' ? 'About Us - Krishi Sangam' : 'અમારા વિશે - કૃષિ સંગમ';
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
            heroTitle: 'Empowering Agriculture, One Partnership at a Time',
            heroSubtitle: 'At Krishi Sangam, we believe in empowering farmers and businesses through contract-based farming models. Our mission is to build sustainable, mutually beneficial partnerships that help optimize agricultural productivity and foster rural development.',
            visionTitle: 'Our Vision',
            visionDesc: 'We aim to create a reliable platform that connects farmers with businesses to ensure stable markets and fair prices for farmers. Our platform encourages transparency, long-term collaboration, and sustainable agricultural practices.',
            offerTitle: 'What We Offer',
            offerDesc: 'We offer guaranteed market access for farmers and ensure businesses have a reliable supply of high-quality produce. Through our platform, we provide financing, training, and a supportive environment for farmers to thrive and meet business demands.',
            impactTitle: 'Our Impact',
            impactDesc: 'Our platform has transformed the agricultural landscape by providing equal opportunities for both small and large-scale farmers. With our support, we are reducing market volatility and ensuring better livelihoods for farming communities across India.',
            ctaTitle: 'Ready to Join Us?',
            ctaSubtitle: 'Start your journey with Krishi Sangam today',
            ctaButton: 'Get Started',
            footer: '© 2024 Krishi Sangam. All rights reserved.',
        },
        gu: {
            contactUs: 'અમારો સંપર્ક કરો',
            aboutUs: 'અમારા વિશે',
            help: 'મદદ',
            login: 'લૉગિન',
            heroTitle: 'ખેતીને સશક્ત બનાવવી, એક ભાગીદારી એક સમયે',
            heroSubtitle: 'કૃષિ સંગમ પર, અમે ખેડૂતો અને વ્યવસાયોને કોન્ટ્રાક્ટ-આધારિત ખેતી મોડલ દ્વારા સશક્ત કરવામાં માનીએ છીએ. અમારો ઉદ્દેશ ટકાઉ, પરસ્પર લાભદાયી ભાગીદારી બનાવવાનો છે જે ખેતી ઉત્પાદકતાને ઑપ્ટિમાઇઝ કરવામાં અને ગ્રામીણ વિકાસને પ્રોત્સાહન આપવામાં મદદ કરે છે.',
            visionTitle: 'અમારી દ્રષ્ટિ',
            visionDesc: 'અમે ખેડૂતોને વ્યવસાયો સાથે જોડવા માટે વિશ્વસનીય પ્લેટફોર્મ બનાવવાનો લક્ષ્ય રાખીએ છીએ જેથી ખેડૂતો માટે સ્થિર બજારો અને યોગ્ય ભાવો સુનિશ્ચિત થાય. અમારું પ્લેટફોર્મ પારદર્શિતા, લાંબા ગાળાના સહયોગ અને ટકાઉ ખેતી પદ્ધતિઓને પ્રોત્સાહન આપે છે.',
            offerTitle: 'અમે શું ઓફર કરીએ છીએ',
            offerDesc: 'અમે ખેડૂતો માટે ખાતરીપૂર્વકની બજાર પહોંચ ઓફર કરીએ છીએ અને સુનિશ્ચિત કરીએ છીએ કે વ્યવસાયોને ઉચ્ચ-ગુણવત્તાવાળા ઉત્પાદનનો વિશ્વસનીય પુરવઠો મળે. અમારા પ્લેટફોર્મ દ્વારા, અમે ખેડૂતોને ધિરાણ, તાલીમ અને સહાયક વાતાવરણ પ્રદાન કરીએ છીએ જેથી તેઓ વિકાસ પામે અને વ્યવસાયની માંગ પૂરી કરે.',
            impactTitle: 'અમારી અસર',
            impactDesc: 'અમારા પ્લેટફોર્મે ખેતીના લેન્ડસ્કેપને બદલી નાખ્યો છે નાના અને મોટા પાયે ખેડૂતો બંનેને સમાન તકો પૂરી પાડીને. અમારા સમર્થનથી, અમે બજારની અસ્થિરતા ઘટાડી રહ્યા છીએ અને ભારતભરના ખેતી સમુદાયો માટે વધુ સારી આજીવિકા સુનિશ્ચિત કરી રહ્યા છીએ.',
            ctaTitle: 'અમારી સાથે જોડાવા તૈયાર છો?',
            ctaSubtitle: 'આજે કૃષિ સંગમ સાથે તમારી સફર શરૂ કરો',
            ctaButton: 'શરૂ કરો',
            footer: '© 2024 કૃષિ સંગમ. સર્વ હક સંચિત.',
        }
    };

    const text = t[language];

    const sections = [
        {
            icon: Target,
            title: text.visionTitle,
            description: text.visionDesc,
            image: '/src/assets/images/ov.jpg',
            imageAlt: 'Our Vision',
        },
        {
            icon: Sparkles,
            title: text.offerTitle,
            description: text.offerDesc,
            image: '/src/assets/images/offer.jpg',
            imageAlt: 'What We Offer',
        },
        {
            icon: TrendingUp,
            title: text.impactTitle,
            description: text.impactDesc,
            image: '/src/assets/images/impact.jpg',
            imageAlt: 'Our Impact',
        },
    ];

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
                            <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full mb-8">
                            <div className="w-2 h-2 bg-black rounded-full"></div>
                            <span className="text-black font-semibold text-sm uppercase tracking-wider">{text.aboutUs}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-8 leading-tight">
                            {text.heroTitle}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
                            {text.heroSubtitle}
                        </p>
                    </div>
                </section>

                {/* Content Sections */}
                {sections.map((section, index) => (
                    <section
                        key={index}
                        className={`py-24 px-6 ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}
                    >
                        <div className="max-w-7xl mx-auto">
                            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                                {/* Content */}
                                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center">
                                            <section.icon size={24} className="text-white" />
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-bold text-black">{section.title}</h2>
                                    </div>
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        {section.description}
                                    </p>
                                </div>

                                {/* Image */}
                                <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                                    <div className="relative group">
                                        <div className={`absolute -inset-4 bg-gray-100 rounded-[2rem] ${index % 2 === 0 ? 'rotate-2' : '-rotate-2'} transition-transform group-hover:rotate-0`}></div>
                                        <img
                                            src={section.image}
                                            alt={section.imageAlt}
                                            className="relative w-full h-[400px] object-cover rounded-[1.5rem] shadow-xl"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                ))}

                {/* CTA Section */}
                <section className="py-24 px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-black rounded-3xl p-12 md:p-16 text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                {text.ctaTitle}
                            </h2>
                            <p className="text-gray-400 text-lg mb-8">
                                {text.ctaSubtitle}
                            </p>
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors group"
                            >
                                {text.ctaButton}
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
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

export default About;
