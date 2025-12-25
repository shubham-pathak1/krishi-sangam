import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Search, ChevronDown, FileText, Mail, Phone, ArrowRight, HelpCircle, BookOpen, Headset } from 'lucide-react';

const Help = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [language, setLanguage] = useState<'en' | 'gu'>('en');
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    useEffect(() => {
        document.title = language === 'en' ? 'Help - Krishi Sangam' : 'મદદ - કૃષિ સંગમ';
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
            heroTitle: 'How can we help you?',
            heroSubtitle: 'Find answers to your questions or explore our guides to get started with Krishi Sangam.',
            searchPlaceholder: 'Search for help...',
            faqTitle: 'Frequently Asked Questions',
            guidesTitle: 'How-To Guides',
            supportTitle: 'Need More Help?',
            supportDesc: 'If you have additional questions or need assistance, feel free to reach out to our support team.',
            emailLabel: 'Email',
            phoneLabel: 'Phone',
            ctaTitle: 'Still have questions?',
            ctaSubtitle: 'Get in touch with our team and we\'ll help you out.',
            ctaButton: 'Contact Support',
            footer: '© 2024 Krishi Sangam. All rights reserved.',
        },
        gu: {
            contactUs: 'અમારો સંપર્ક કરો',
            aboutUs: 'અમારા વિશે',
            help: 'મદદ',
            login: 'લૉગિન',
            heroTitle: 'અમે તમને કેવી રીતે મદદ કરી શકીએ?',
            heroSubtitle: 'તમારા પ્રશ્નોના જવાબો શોધો અથવા કૃષિ સંગમ સાથે શરૂઆત કરવા માટે અમારા માર્ગદર્શિકાઓનો અભ્યાસ કરો.',
            searchPlaceholder: 'મદદ માટે શોધો...',
            faqTitle: 'વારંવાર પૂછાતા પ્રશ્નો',
            guidesTitle: 'કેવી રીતે માર્ગદર્શિકાઓ',
            supportTitle: 'વધુ મદદની જરૂર છે?',
            supportDesc: 'જો તમારી પાસે વધારાના પ્રશ્નો હોય અથવા સહાયની જરૂર હોય, તો અમારી સમર્થન ટીમનો સંપર્ક કરવા માટે મુક્ત રહો.',
            emailLabel: 'ઇમેઇલ',
            phoneLabel: 'ફોન',
            ctaTitle: 'હજી પણ પ્રશ્નો છે?',
            ctaSubtitle: 'અમારી ટીમ સાથે સંપર્કમાં રહો અને અમે તમને મદદ કરીશું.',
            ctaButton: 'સપોર્ટનો સંપર્ક કરો',
            footer: '© 2024 કૃષિ સંગમ. સર્વ હક સંચિત.',
        }
    };

    const text = t[language];

    const faqs = [
        {
            questionEn: 'How do I register as a farmer?',
            questionGu: 'હું ખેડૂત તરીકે કેવી રીતે રજીસ્ટર કરું?',
            answerEn: 'To register as a farmer, go to the Registration page, select "Farmer" as your account type, and fill in the required details including your personal information, land details, and preferred crops.',
            answerGu: 'રજીસ્ટર કરવા માટે, ખેડૂત રજીસ્ટ્રેશન પૃષ્ઠ પર જાઓ અને જરૂરી વિગતો ભરો.',
        },
        {
            questionEn: 'How can I reset my password?',
            questionGu: 'હું મારો પાસવર્ડ કેવી રીતે રીસેટ કરી શકું?',
            answerEn: 'Click the "Forgot Password" link on the login page. Enter your registered email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.',
            answerGu: 'લૉગિન પૃષ્ઠ પર "પાસવર્ડ ભૂલી ગયા" લિંક પર ક્લિક કરો અને સૂચનાઓને અનુસરો.',
        },
        {
            questionEn: 'How do contracts work?',
            questionGu: 'કોન્ટ્રાક્ટ કેવી રીતે કામ કરે છે?',
            answerEn: 'Contracts are agreements between farmers and companies. Companies post contract opportunities specifying crop requirements, pricing, and duration. Farmers can browse and accept contracts that match their capabilities.',
            answerGu: 'કોન્ટ્રાક્ટ ખેડૂતો અને કંપનીઓ વચ્ચેના કરાર છે. કંપનીઓ તેમની જરૂરિયાતો મુજબ કોન્ટ્રાક્ટ પોસ્ટ કરે છે.',
        },
        {
            questionEn: 'When do I receive payment?',
            questionGu: 'મને ચુકવણી ક્યારે મળે છે?',
            answerEn: 'Payments are processed according to the contract terms, typically within 7-14 days after successful delivery and quality verification of your produce. You can track payment status in your dashboard.',
            answerGu: 'ચુકવણી કોન્ટ્રાક્ટની શરતો મુજબ પ્રક્રિયા કરવામાં આવે છે, સામાન્ય રીતે સફળ ડિલિવરી પછી 7-14 દિવસમાં.',
        },
        {
            questionEn: 'How do I contact customer support?',
            questionGu: 'હું ગ્રાહક સમર્થનનો સંપર્ક કેવી રીતે કરું?',
            answerEn: 'You can reach our support team via email at support@krishisangam.com or call us at +91 98765 43210. Our support hours are Monday to Saturday, 9 AM to 6 PM IST.',
            answerGu: 'તમે support@krishisangam.com પર ઇમેઇલ દ્વારા અથવા +91 98765 43210 પર કૉલ કરીને અમારી સમર્થન ટીમનો સંપર્ક કરી શકો છો.',
        },
    ];

    const guides = [
        {
            titleEn: 'How to create a contract as a business',
            titleGu: 'વ્યવસાય તરીકે કોન્ટ્રાક્ટ કેવી રીતે બનાવવું',
            link: '#',
        },
        {
            titleEn: 'Steps for farmers to accept contracts',
            titleGu: 'ખેડૂતો માટે કોન્ટ્રાક્ટ સ્વીકારવાના પગલાં',
            link: '#',
        },
        {
            titleEn: 'Managing transactions and payments',
            titleGu: 'વ્યવહારો અને ચુકવણીઓનું સંચાલન',
            link: '#',
        },
        {
            titleEn: 'Understanding quality requirements',
            titleGu: 'ગુણવત્તા જરૂરિયાતોને સમજવી',
            link: '#',
        },
    ];

    const filteredFaqs = faqs.filter(faq => {
        const query = searchQuery.toLowerCase();
        const question = language === 'en' ? faq.questionEn : faq.questionGu;
        const answer = language === 'en' ? faq.answerEn : faq.answerGu;
        return question.toLowerCase().includes(query) || answer.toLowerCase().includes(query);
    });

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
                {/* Hero Section with Search */}
                <section className="py-20 px-6 bg-gray-50">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-8">
                            <HelpCircle size={32} className="text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6">
                            {text.heroTitle}
                        </h1>
                        <p className="text-lg text-gray-500 mb-10">
                            {text.heroSubtitle}
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={text.searchPlaceholder}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-lg"
                            />
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 px-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                <HelpCircle size={24} className="text-black" />
                            </div>
                            <h2 className="text-3xl font-bold text-black">{text.faqTitle}</h2>
                        </div>

                        <div className="space-y-4">
                            {filteredFaqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-black transition-colors"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full px-6 py-5 flex items-center justify-between text-left"
                                    >
                                        <span className="text-lg font-medium text-black">
                                            {language === 'en' ? faq.questionEn : faq.questionGu}
                                        </span>
                                        <ChevronDown
                                            size={20}
                                            className={`text-gray-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {openFaq === index && (
                                        <div className="px-6 pb-5">
                                            <p className="text-gray-600 leading-relaxed">
                                                {language === 'en' ? faq.answerEn : faq.answerGu}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {filteredFaqs.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    No results found for "{searchQuery}"
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Guides Section */}
                <section className="py-20 px-6 bg-gray-50">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                                <BookOpen size={24} className="text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-black">{text.guidesTitle}</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {guides.map((guide, index) => (
                                <Link
                                    key={index}
                                    to={guide.link}
                                    className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-black transition-all flex items-center gap-4"
                                >
                                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-black transition-colors">
                                        <FileText size={20} className="text-gray-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <span className="text-black font-medium flex-1">
                                        {language === 'en' ? guide.titleEn : guide.titleGu}
                                    </span>
                                    <ArrowRight size={18} className="text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Support Section */}
                <section className="py-20 px-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                <Headset size={24} className="text-black" />
                            </div>
                            <h2 className="text-3xl font-bold text-black">{text.supportTitle}</h2>
                        </div>

                        <p className="text-gray-600 mb-8">{text.supportDesc}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-2xl p-6 flex items-center gap-4">
                                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                                    <Mail size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">{text.emailLabel}</p>
                                    <a href="mailto:support@krishisangam.com" className="text-black font-medium hover:underline">
                                        support@krishisangam.com
                                    </a>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 flex items-center gap-4">
                                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                                    <Phone size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">{text.phoneLabel}</p>
                                    <a href="tel:+919876543210" className="text-black font-medium hover:underline">
                                        +91 98765 43210
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-black rounded-3xl p-12 text-center">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                {text.ctaTitle}
                            </h2>
                            <p className="text-gray-400 mb-8">
                                {text.ctaSubtitle}
                            </p>
                            <Link
                                to="/contact"
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

export default Help;
