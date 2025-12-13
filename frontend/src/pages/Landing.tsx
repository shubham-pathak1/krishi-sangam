import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Menu, X, CheckCircle, TrendingUp, Users, Shield, 
  Handshake, Truck, IndianRupee, FileText, Headset, 
  ArrowRight, Quote 
} from 'lucide-react';

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguage] = useState<'en' | 'gu'>('en');

  useEffect(() => {
    document.title = 'Krishi Sangam - Home';
    
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = '/src/assets/images/l.png';
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const t = {
    en: {
      contactUs: 'Contact Us',
      aboutUs: 'About Us',
      help: 'Help',
      login: 'Login',
      signUp: 'Get Started',
      heroTitle: 'Empowering Farmers, Connecting Markets',
      aboutTag: 'Who We Are',
      aboutTitle: 'Empowering Growth Through Contract Farming',
      aboutDesc1: 'At Krishi Sangam, we connect farmers with businesses to create mutually beneficial partnerships. Farmers gain a reliable market for their produce, while businesses access consistent, high-quality crops.',
      aboutDesc2: 'Join us in building sustainable food systems and contributing to rural development. Whether you\'re a farmer seeking stability or a business looking for trusted suppliers, we are here to help you succeed.',
      offerTitle: 'Tailored Solutions for Growth',
      forFarmers: 'For Farmers',
      farmerBenefit1: 'Market Access',
      farmerBenefit1Desc: 'Fair prices and security for your harvests',
      farmerBenefit2: 'Financial Support',
      farmerBenefit2Desc: 'Assistance with financing, seeds, and equipment',
      farmerBenefit3: 'Training Programs',
      farmerBenefit3Desc: 'Sustainable and modern farming practices',
      forCompanies: 'For Companies',
      companyBenefit1: 'Consistent Supply',
      companyBenefit1Desc: 'Verified farmers delivering quality produce',
      companyBenefit2: 'Risk Mitigation',
      companyBenefit2Desc: 'Handle market fluctuations with ease',
      companyBenefit3: 'Scalable Partnerships',
      companyBenefit3Desc: 'Flexible contracts tailored to your needs',
      howItWorksTitle: 'How It Works',
      step1: 'Register',
      step1Desc: 'Create your profile in minutes',
      step2: 'Contract',
      step2Desc: 'Customized contracts ensure fair terms',
      step3: 'Support',
      step3Desc: 'We provide advice and monitor progress',
      step4: 'Payment',
      step4Desc: 'Secure payments, on time',
      partnersTitle: 'Our Partners',
      testimonialsTitle: 'What Our Users Say',
      footer: '© 2024 Krishi Sangam. All rights reserved.',
    },
    gu: {
      contactUs: 'અમારો સંપર્ક કરો',
      aboutUs: 'અમારા વિશે',
      help: 'મદદ',
      login: 'લૉગિન',
      signUp: 'જોડાવો',
      heroTitle: 'ખેડૂતોને સશક્ત કરવું, બજારોને જોડવું',
      aboutTag: 'અમે કોણ છીએ',
      aboutTitle: 'કોન્ટ્રાક્ટ ફાર્મિંગ દ્વારા વિકાસને સશક્ત કરવો',
      aboutDesc1: 'કૃષિ સંગમ પર, અમે ખેડૂતોને વ્યવસાયો સાથે જોડીએ છીએ જેથી પરસ્પર લાભદાયી ભાગીદારી બને.',
      aboutDesc2: 'ટકાઉ ખાદ્ય પ્રણાલીઓ બનાવવામાં અમારી સાથે જોડાઓ.',
      offerTitle: 'વિકાસ માટે અનુકૂળ ઉકેલો',
      forFarmers: 'ખેડૂતો માટે',
      farmerBenefit1: 'બજાર પહોંચ',
      farmerBenefit1Desc: 'યોગ્ય ભાવ અને સુરક્ષા',
      farmerBenefit2: 'નાણાકીય સહાય',
      farmerBenefit2Desc: 'બીજ, સાધનો અને ધિરાણમાં મદદ',
      farmerBenefit3: 'તાલીમ કાર્યક્રમો',
      farmerBenefit3Desc: 'ટકાઉ અને આધુનિક ખેતી પદ્ધતિઓ',
      forCompanies: 'કંપનીઓ માટે',
      companyBenefit1: 'સતત પુરવઠો',
      companyBenefit1Desc: 'ચકાસાયેલ ખેડૂતો દ્વારા ઉચ્ચ-ગુણવત્તા',
      companyBenefit2: 'જોખમ ઘટાડો',
      companyBenefit2Desc: 'બજાર ઉતાર-ચઢાવને હેન્ડલ કરો',
      companyBenefit3: 'માપનીય ભાગીદારી',
      companyBenefit3Desc: 'લવચીક કરાર તમારી જરૂરિયાત મુજબ',
      howItWorksTitle: 'તે કેવી રીતે કામ કરે છે',
      step1: 'નોંધણી',
      step1Desc: 'તમારી પ્રોફાઇલ બનાવો',
      step2: 'કરાર',
      step2Desc: 'પારદર્શક શરતો',
      step3: 'સપોર્ટ',
      step3Desc: 'સલાહ અને નિરીક્ષણ',
      step4: 'ચુકવણી',
      step4Desc: 'સુરક્ષિત ચુકવણી',
      partnersTitle: 'અમારા ભાગીદારો',
      testimonialsTitle: 'વપરાશકર્તાઓના અભિપ્રાય',
      footer: '© 2024 કૃષિ સંગમ. સર્વ હક સંચિત.',
    }
  };

  const text = t[language];

  // List of partner logos (duplicate them for the scrolling effect)
  const partners = ['high-altitude-organics', 'agrifresh-relief', 'terrasavant', 'agri-corp', 'farm-solutions', 'green-harvest'];
  const doubledPartners = [...partners, ...partners];

  // Testimonial Data
  const testimonials = [
    { img: 'ramesh.jpg', name: 'Ramesh Patel', role: 'Farmer', quote: 'Krishi Sangam has transformed my farming business. I now have a guaranteed buyer and better prices for my crops!' },
    { img: 'agrib.png', name: 'Priya Sharma', role: 'Agri-Business Owner', quote: 'The platform made it easy to source high-quality produce directly from farmers. It\'s a game-changer for our supply chain.' },
    { img: 'vikram.jpg', name: 'Vikram Singh', role: 'Farmer', quote: 'With Krishi Sangam, I\'ve been able to scale my farming operations and connect with reliable buyers.' }
  ];


  return (
    <div className="font-['Inter'] bg-white w-full overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* --- Modern Floating Navbar --- */}
      <header
        className={`fixed top-0 w-full z-[1000] transition-all duration-500 border-b ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-xl border-gray-200/50 py-3 shadow-sm' 
            : 'bg-transparent border-transparent py-6'
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
            <span className={`text-xl font-bold tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              Krishi Sangam
            </span>
          </Link>

          {/* Pill-Shaped Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 bg-white/10 backdrop-blur-md px-8 py-2.5 rounded-full border border-white/20 shadow-sm transition-all duration-300 hover:bg-white/20">
            {[
              { to: '/about', label: text.aboutUs },
              { to: '/contact', label: text.contactUs },
              { to: '/help', label: text.help },
            ].map((link) => (
              <Link 
                key={link.to} 
                to={link.to} 
                className={`text-sm font-medium transition-colors hover:text-emerald-400 ${scrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-gray-100'}`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="w-px h-4 bg-white/20"></div>

            <button 
              onClick={() => setLanguage(l => l === 'en' ? 'gu' : 'en')}
              className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${scrolled ? 'text-gray-500 hover:text-emerald-600' : 'text-gray-300 hover:text-white'}`}
            >
              {language === 'en' ? 'GU' : 'EN'}
            </button>

            <Link
              to="/login"
              className={`text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300 ${
                scrolled 
                  ? 'bg-gray-900 text-white hover:bg-emerald-600' 
                  : 'bg-white text-gray-900 hover:bg-emerald-50'
              }`}
            >
              {text.login}
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`lg:hidden relative z-50 p-2 rounded-full transition-colors ${scrolled ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-gray-900/95 backdrop-blur-xl z-[990] transition-all duration-500 lg:hidden flex items-center justify-center ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="flex flex-col items-center gap-8 text-center">
          <Link to="/about" onClick={() => setMenuOpen(false)} className="text-3xl font-light text-white hover:text-emerald-400 transition-colors">{text.aboutUs}</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="text-3xl font-light text-white hover:text-emerald-400 transition-colors">{text.contactUs}</Link>
          <Link to="/help" onClick={() => setMenuOpen(false)} className="text-3xl font-light text-white hover:text-emerald-400 transition-colors">{text.help}</Link>
          <Link to="/login" onClick={() => setMenuOpen(false)} className="text-3xl font-light text-white hover:text-emerald-400 transition-colors">{text.login}</Link>
          <button onClick={() => {setLanguage(language === 'en' ? 'gu' : 'en'); setMenuOpen(false);}} className="text-xl font-bold text-gray-500 uppercase tracking-widest mt-8">
            Switch to {language === 'en' ? 'Gujarati' : 'English'}
          </button>
        </div>
      </div>

      <main>
        {/* Hero Section */}
        <section className="relative h-screen min-h-[700px] w-full overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <video autoPlay muted loop playsInline className="w-full h-full object-cover">
              <source src="/src/assets/cropsv.mov" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center pt-20">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.9] mb-8 drop-shadow-2xl">
              Empowering Growth
              <br />
              Connecting Roots
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
              <Link 
                to="/register" 
                className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-bold text-lg rounded-full transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                {text.signUp}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* About Section - Who We Are (Image reverted to contract farming.jpg) */}
        <section className="py-32 px-6 max-w-7xl mx-auto reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <h4 className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-4">{text.aboutTag}</h4>
              <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 leading-[1.1]">{text.aboutTitle}</h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                {text.aboutDesc1}
              </p>
              <p className="text-xl text-gray-600 leading-relaxed">
                {text.aboutDesc2}
              </p>
              
              <div className="mt-12 flex gap-8">
                <div className="flex flex-col">
                  <span className="text-4xl font-bold text-black">10K+</span>
                  <span className="text-gray-500 text-sm mt-1">Active Farmers</span>
                </div>
                <div className="w-px bg-gray-200"></div>
                <div className="flex flex-col">
                  <span className="text-4xl font-bold text-black">500+</span>
                  <span className="text-gray-500 text-sm mt-1">Partner Companies</span>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-4 bg-emerald-100 rounded-[2.5rem] rotate-2 transition-transform group-hover:rotate-1"></div>
              <img
                // --- REVERTED IMAGE SOURCE ---
                src="/src/assets/images/contract farming.jpg" 
                alt="Farming"
                className="relative w-full h-[600px] object-cover rounded-[2rem] shadow-2xl transition-all duration-700"
              />
            </div>
          </div>
        </section>

        {/* What We Offer - Improved Bento */}
        <section className="py-32 bg-gray-50 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-20 text-center max-w-3xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-bold text-black mb-6">{text.offerTitle}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Farmer Card */}
              <div className="group bg-white border border-black rounded-3xl p-10 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-4 bg-white border border-black rounded-2xl">
                    <Users size={32} className="text-black" />
                  </div>
                  <h3 className="text-3xl font-bold text-black">{text.forFarmers}</h3>
                </div>

                <div className="space-y-6">
                  {[
                    { title: text.farmerBenefit1, desc: text.farmerBenefit1Desc, icon: CheckCircle },
                    { title: text.farmerBenefit2, desc: text.farmerBenefit2Desc, icon: IndianRupee },
                    { title: text.farmerBenefit3, desc: text.farmerBenefit3Desc, icon: TrendingUp },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6">
                      <item.icon className="w-6 h-6 text-black shrink-0 mt-1" />
                      <div>
                        <h4 className="text-lg font-semibold text-black mb-1">{item.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company Card */}
              <div className="group bg-white border border-black rounded-3xl p-10 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-4 bg-white border border-black rounded-2xl">
                    <Handshake size={32} className="text-black" />
                  </div>
                  <h3 className="text-3xl font-bold text-black">{text.forCompanies}</h3>
                </div>

                <div className="space-y-6">
                  {[
                    { title: text.companyBenefit1, desc: text.companyBenefit1Desc, icon: Truck },
                    { title: text.companyBenefit2, desc: text.companyBenefit2Desc, icon: Shield },
                    { title: text.companyBenefit3, desc: text.companyBenefit3Desc, icon: Handshake },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6">
                      <item.icon className="w-6 h-6 text-black shrink-0 mt-1" />
                      <div>
                        <h4 className="text-lg font-semibold text-black mb-1">{item.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-32 max-w-7xl mx-auto px-6 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-4">
              {text.howItWorksTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, title: text.step1, desc: text.step1Desc },
              { icon: FileText, title: text.step2, desc: text.step2Desc },
              { icon: Headset, title: text.step3, desc: text.step3Desc },
              { icon: IndianRupee, title: text.step4, desc: text.step4Desc }
            ].map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-white p-8 rounded-2xl border border-black hover:shadow-2xl transition-all duration-300">
                  <div className="w-14 h-14 bg-white border border-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <step.icon className="w-7 h-7 text-black" />
                  </div>
                  <div className="text-5xl font-black text-gray-100 mb-4">0{index + 1}</div>
                  <h3 className="text-xl font-bold text-black mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Partners Section - Continuous Auto-Scrolling Marquee */}
        <section className="py-20 border-y border-gray-100 bg-white reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
          <div className="max-w-7xl mx-auto px-6 text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black">{text.partnersTitle}</h2>
          </div>
          
          <div className="relative w-full overflow-hidden whitespace-nowrap [mask-image:_linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
            <div className="inline-block animate-marquee group-hover:[animation-play-state:paused]">
              {doubledPartners.map((partner, index) => (
                <img
                  key={index}
                  src={`/src/assets/images/${partner}.webp`}
                  alt="Partner"
                  className="h-14 mx-12 inline-block object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section - Aesthetic Card Grid */}
        <section className="py-32 max-w-7xl mx-auto px-6 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
          <h2 className="text-5xl md:text-6xl font-bold text-center text-black mb-20">{text.testimonialsTitle}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div 
                key={i} 
                className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 hover:border-black transition-all duration-500 flex flex-col h-full relative group"
              >
                {/* Visual Quote Accent */}
                <Quote size={40} className="text-emerald-100 absolute top-6 right-8 rotate-12 opacity-80 group-hover:text-emerald-200 transition-colors" />

                {/* Quote Text */}
                <p className="text-xl text-gray-700 leading-relaxed italic mb-8 relative z-10">
                  "{t.quote}"
                </p>

                {/* User Info */}
                <div className="mt-auto flex gap-4 items-center pt-4 border-t border-gray-100">
                  <img src={`/src/assets/images/${t.img}`} alt={t.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-300/50" />
                  <div>
                    <h5 className="font-bold text-black">{t.name}</h5>
                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* --- Footer (Black & White) --- */}
      <footer className="bg-zinc-950 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div>
              <Link to="/" className="flex items-center gap-3 mb-6">
                 <img src="/src/assets/images/l.png" alt="Logo" className="h-8 opacity-90" />
                 <span className="text-xl font-bold">Krishi Sangam</span>
              </Link>
              <p className="text-zinc-400 max-w-xs leading-relaxed">
                Building the digital infrastructure for the future of Indian agriculture.
              </p>
            </div>
            
            <div className="flex gap-16 flex-wrap">
              <div>
                <h4 className="font-bold mb-6 text-white">Platform</h4>
                <ul className="space-y-4 text-zinc-400 text-sm">
                  <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                  <li><Link to="/register" className="hover:text-white transition-colors">For Farmers</Link></li>
                  <li><Link to="/register" className="hover:text-white transition-colors">For Companies</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-white">Support</h4>
                <ul className="space-y-4 text-zinc-400 text-sm">
                  <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                  <li><Link to="/legal" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 text-sm">
            <p>{text.footer}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Tailwind CSS keyframes for Marquee */}
      <style>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        html {
          scroll-behavior: smooth;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Landing;