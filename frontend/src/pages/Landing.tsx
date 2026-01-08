import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Menu, X, CheckCircle, TrendingUp, Users, Shield,
  Handshake, Truck, IndianRupee, ArrowRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = () => {
    const newLang = i18n.language === 'en' ? 'gu' : 'en';
    i18n.changeLanguage(newLang);
  };

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

  const partners = ['high-altitude-organics', 'agrifresh-relief', 'terrasavant', 'agri-corp', 'farm-solutions', 'green-harvest'];
  const doubledPartners = [...partners, ...partners];

  const testimonials = [
    { img: 'ramesh.jpg', name: t('testimonial1Name'), role: t('testimonial1Role'), quote: t('testimonial1Quote') },
    { img: 'agrib.png', name: t('testimonial2Name'), role: t('testimonial2Role'), quote: t('testimonial2Quote') },
    { img: 'vikram.jpg', name: t('testimonial3Name'), role: t('testimonial3Role'), quote: t('testimonial3Quote') }
  ];


  return (
    <div className="font-['Inter'] bg-white w-full overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900">

      {/* --- Modern Floating Navbar --- */}
      <header
        className={`fixed top-0 w-full z-[1000] transition-all duration-500 border-b ${scrolled
          ? 'bg-white/80 backdrop-blur-xl border-gray-200/50 py-3 shadow-sm'
          : 'bg-transparent border-transparent py-6'
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
            <span className={`text-xl font-bold tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              Krishi Sangam
            </span>
          </Link>

          {/* Pill-Shaped Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 bg-white/10 backdrop-blur-md px-8 py-2.5 rounded-full border border-white/20 shadow-sm transition-all duration-300 hover:bg-white/20">
            {[
              { to: '/about', label: t('aboutUs') },
              { to: '/contact', label: t('contactUs') },
              { to: '/help', label: t('help') },
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
              onClick={changeLanguage}
              className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${scrolled ? 'text-gray-500 hover:text-emerald-600' : 'text-gray-300 hover:text-white'}`}
            >
              {i18n.language === 'en' ? 'GU' : 'EN'}
            </button>

            <Link
              to="/login"
              className={`text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300 ${scrolled
                ? 'bg-gray-900 text-white hover:bg-emerald-600'
                : 'bg-white text-gray-900 hover:bg-emerald-50'
                }`}
            >
              {t('login')}
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
          <Link to="/about" onClick={() => setMenuOpen(false)} className="text-3xl font-light text-white hover:text-emerald-400 transition-colors">{t('aboutUs')}</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="text-3xl font-light text-white hover:text-emerald-400 transition-colors">{t('contactUs')}</Link>
          <Link to="/help" onClick={() => setMenuOpen(false)} className="text-3xl font-light text-white hover:text-emerald-400 transition-colors">{t('help')}</Link>
          <Link to="/login" onClick={() => setMenuOpen(false)} className="text-3xl font-light text-white hover:text-emerald-400 transition-colors">{t('login')}</Link>
          <button onClick={() => { changeLanguage(); setMenuOpen(false); }} className="text-xl font-bold text-gray-500 uppercase tracking-widest mt-8">
            Switch to {i18n.language === 'en' ? 'Gujarati' : 'English'}
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
              {t('heroTitle').split(',').map((part, i) => (
                <span key={i} className="block">{part}</span>
              ))}
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
              <Link
                to="/register"
                className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-bold text-lg rounded-full transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                {t('signUp')}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-32 px-6 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full mb-6">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-emerald-700 font-semibold text-sm uppercase tracking-wider">{t('aboutTag')}</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-8 leading-[1.1]">{t('aboutTitle')}</h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  {t('aboutDesc1')}
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t('aboutDesc2')}
                </p>

                {/* Stats - Plain white bg, black font */}
                <div className="mt-12 flex gap-12">
                  <div>
                    <span className="text-5xl font-black text-black">10K+</span>
                    <p className="text-gray-500 text-sm mt-1">Active Farmers</p>
                  </div>
                  <div className="w-px bg-gray-200"></div>
                  <div>
                    <span className="text-5xl font-black text-black">500+</span>
                    <p className="text-gray-500 text-sm mt-1">Partner Companies</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-emerald-100 rounded-[2.5rem] rotate-2 transition-transform group-hover:rotate-1"></div>
                  <img
                    src="/src/assets/images/contract farming.jpg"
                    alt="Farming"
                    className="relative w-full h-[550px] object-cover rounded-[2rem] shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer - Bento Grid with Clean B&W Theme */}
        <section className="py-32 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">{t('offerTitle')}</h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">{t('offerSubtitle')}</p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Farmer Main Card - Spans 2 columns */}
              <div className="lg:col-span-2 group bg-white rounded-3xl p-10 border border-gray-200 hover:border-black transition-all duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center">
                    <Users size={24} className="text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-black">{t('forFarmers')}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    { title: t('farmerBenefit1'), desc: t('farmerBenefit1Desc'), icon: CheckCircle },
                    { title: t('farmerBenefit2'), desc: t('farmerBenefit2Desc'), icon: IndianRupee },
                    { title: t('farmerBenefit3'), desc: t('farmerBenefit3Desc'), icon: TrendingUp },
                  ].map((item, i) => (
                    <div key={i} className="bg-gray-50 rounded-2xl p-5 group-hover:bg-gray-100/50 transition-colors">
                      <item.icon className="w-6 h-6 text-black mb-3" />
                      <h4 className="text-black font-semibold mb-1">{item.title}</h4>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Farmer CTA Card */}
              <div className="bg-gray-50 rounded-3xl p-8 flex flex-col justify-between border border-gray-100 hover:border-black transition-all duration-300">
                <div>
                  <p className="text-gray-400 font-semibold text-sm uppercase tracking-wider mb-3">{t('forFarmers')}</p>
                  <h4 className="text-2xl font-bold text-black mb-4">{t('farmerCTA')}</h4>
                  <p className="text-gray-500">{t('farmerCTADesc')}</p>
                </div>
                <Link to="/register" className="mt-6 inline-flex items-center gap-2 text-black font-semibold hover:gap-3 transition-all group/link">
                  {t('registerNow')} <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Company CTA Card */}
              <div className="bg-black rounded-3xl p-8 flex flex-col justify-between">
                <div>
                  <p className="text-gray-500 font-semibold text-sm uppercase tracking-wider mb-3">{t('forCompanies')}</p>
                  <h4 className="text-2xl font-bold text-white mb-4">{t('companyCTA')}</h4>
                  <p className="text-gray-400">{t('companyCTADesc')}</p>
                </div>
                <Link to="/register" className="mt-6 inline-flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all group/link">
                  {t('getStarted')} <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Company Main Card - Spans 2 columns */}
              <div className="lg:col-span-2 group bg-black rounded-3xl p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center">
                    <Handshake size={24} className="text-black" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">{t('forCompanies')}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    { title: t('companyBenefit1'), desc: t('companyBenefit1Desc'), icon: Truck },
                    { title: t('companyBenefit2'), desc: t('companyBenefit2Desc'), icon: Shield },
                    { title: t('companyBenefit3'), desc: t('companyBenefit3Desc'), icon: Handshake },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-colors">
                      <item.icon className="w-6 h-6 text-white mb-3" />
                      <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Visual Narrative Grid */}
        <section className="py-32 bg-gray-50/30 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black mb-6 tracking-tight uppercase leading-none">
                {t('howItWorksTitle')}
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">{t('howItWorksSubtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: t('step1'),
                  desc: t('step1Desc'),
                  num: '01'
                },
                {
                  title: t('step2'),
                  desc: t('step2Desc'),
                  num: '02'
                },
                {
                  title: t('step3'),
                  desc: t('step3Desc'),
                  num: '03'
                },
                {
                  title: t('step4'),
                  desc: t('step4Desc'),
                  num: '04'
                }
              ].map((step, index) => (
                <div key={index} className="group bg-white rounded-[2rem] p-8 border border-gray-100 hover:border-black hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col items-start">
                  <div className="mb-6 w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center font-black text-sm text-black group-hover:bg-black group-hover:text-white transition-colors">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-black text-black mb-3 tracking-tight uppercase leading-none">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Section - Original Simple Marquee */}
        <section className="py-20 border-y border-gray-100 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
          <div className="max-w-7xl mx-auto px-6 text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black">{t('partnersTitle')}</h2>
          </div>

          <div className="relative w-full overflow-hidden whitespace-nowrap [mask-image:_linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
            <div className="inline-block animate-marquee">
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

        {/* Testimonials Section - Better Design */}
        <section className="py-32 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">{t('testimonialsTitle')}</h2>
              <p className="text-lg text-gray-500">{t('testimonialsSubtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="group relative bg-white p-8 rounded-3xl border border-gray-200 hover:border-black transition-all duration-300 flex flex-col h-full"
                >
                  {/* Large Quote */}
                  <div className="text-8xl font-serif text-gray-100 leading-none mb-4 group-hover:text-emerald-100 transition-colors">"</div>

                  {/* Quote */}
                  <p className="text-lg text-gray-700 leading-relaxed mb-8 flex-1 -mt-8">
                    {t.quote}
                  </p>

                  {/* Author */}
                  <div className="flex gap-4 items-center pt-6 border-t border-gray-100">
                    <img src={`/src/assets/images/${t.img}`} alt={t.name} className="w-14 h-14 rounded-full object-cover" />
                    <div>
                      <h5 className="font-bold text-black">{t.name}</h5>
                      <span className="text-sm text-gray-500">{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA - Black background */}
            <div className="mt-20 text-center">
              <div className="inline-flex flex-col sm:flex-row items-center gap-6 px-10 py-8 bg-black rounded-3xl">
                <div className="text-white text-center sm:text-left">
                  <h3 className="text-2xl font-bold mb-1">{t('readyToStart')}</h3>
                  <p className="text-gray-400">{t('joinThousands')}</p>
                </div>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2 group shrink-0"
                >
                  {t('step1')}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
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
                {t('footerLogoText')}
              </p>
            </div>

            <div className="flex gap-16 flex-wrap">
              <div>
                <h4 className="font-bold mb-6 text-white">{t('footerPlatform')}</h4>
                <ul className="space-y-4 text-zinc-400 text-sm">
                  <li><Link to="/about" className="hover:text-white transition-colors">{t('aboutUs')}</Link></li>
                  <li><Link to="/register" className="hover:text-white transition-colors">{t('forFarmers')}</Link></li>
                  <li><Link to="/register" className="hover:text-white transition-colors">{t('forCompanies')}</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-white">{t('footerSupport')}</h4>
                <ul className="space-y-4 text-zinc-400 text-sm">
                  <li><Link to="/help" className="hover:text-white transition-colors">{t('help')}</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">{t('contactUs')}</Link></li>
                  <li><Link to="/legal" className="hover:text-white transition-colors">{t('footerPrivacy')}</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 text-sm">
            <p>{t('footerCopyright')}</p>
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