import { Link } from 'react-router-dom';
import { Sprout, Users, FileText, Shield, TrendingUp, CheckCircle, ArrowRight, Leaf, DollarSign, Award, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    setIsVisible(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Premium Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        scrollY > 50 ? 'bg-white/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-400 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <Sprout className="h-10 w-10 text-primary-600 relative transform group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Krishi Sangam
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-300 hover:scale-105">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-300 hover:scale-105">
                How it Works
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-primary-600 font-medium transition-all duration-300 hover:scale-105">
                Testimonials
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-primary-600 font-semibold transition-all duration-300 hover:scale-105"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="group relative bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2.5 rounded-full font-semibold overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Premium */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-green-50">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.05) 0%, transparent 50%)',
          }}></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full mb-6 hover:bg-primary-200 transition-colors duration-300">
            <Leaf className="w-4 h-4 text-primary-600 mr-2" />
            <span className="text-sm font-semibold text-primary-800">Revolutionizing Contract Farming</span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 mb-6 leading-tight">
            Empowering Farmers,
            <br />
            <span className="bg-gradient-to-r from-primary-600 via-green-600 to-primary-700 bg-clip-text text-transparent">
              Connecting Markets
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            A modern platform bridging farmers and companies through transparent, 
            secure, and sustainable contract farming agreements.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <Link 
              to="/register?type=farmer" 
              className="group relative bg-gradient-to-r from-primary-600 to-primary-700 text-white px-10 py-5 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <span className="relative z-10 flex items-center justify-center">
                Join as Farmer
                <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>
            
            <Link 
              to="/register?type=company" 
              className="group relative bg-white border-2 border-gray-200 text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-primary-300"
            >
              <span className="relative z-10 flex items-center justify-center">
                Join as Company
                <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Stats - Premium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { number: '10,000+', label: 'Active Farmers', icon: Users },
              { number: '500+', label: 'Partner Companies', icon: Award },
              { number: '₹50Cr+', label: 'Contracts Value', icon: DollarSign }
            ].map((stat, index) => (
              <div 
                key={index}
                className="group relative bg-white/60 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 hover:bg-white hover:shadow-2xl transition-all duration-500 hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <stat.icon className="w-8 h-8 text-primary-600 mb-4 mx-auto transform group-hover:scale-110 transition-transform duration-300" />
                <div className="relative text-5xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="relative text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center p-2">
            <div className="w-1 h-2 bg-gray-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section id="features" className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full mb-6">
              <span className="text-sm font-semibold text-primary-800">FEATURES</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
              Why Choose 
              <span className="bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent"> Krishi Sangam?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Empowering agriculture through cutting-edge technology and unwavering trust
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Feature Card */}
            <div className="md:col-span-2 md:row-span-2 group relative bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-10 overflow-hidden hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
              <div className="relative z-10">
                <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-white mb-4">Smart Digital Contracts</h3>
                <p className="text-primary-100 text-lg leading-relaxed mb-6">
                  Revolutionary contract management with transparent terms, automated milestone tracking, 
                  and secure digital signatures. Say goodbye to paperwork and hello to efficiency.
                </p>
                <ul className="space-y-3">
                  {['Automated Payments', 'Real-time Tracking', 'Legal Compliance', 'Zero Paperwork'].map((item, i) => (
                    <li key={i} className="flex items-center text-white">
                      <CheckCircle className="w-5 h-5 mr-3 text-primary-200" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Medium Feature Cards */}
            <div className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-2xl hover:border-primary-300 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-primary-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Shield className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Secure Payments</h3>
                <p className="text-gray-600 leading-relaxed">
                  Guaranteed payments with escrow protection. Complete transparency, zero delays.
                </p>
              </div>
            </div>

            <div className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-2xl hover:border-primary-300 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-green-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Users className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Direct Connect</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect directly with verified partners. No middlemen, better margins.
                </p>
              </div>
            </div>

            <div className="md:col-span-2 group relative bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 overflow-hidden">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3">Market Intelligence</h3>
                  <p className="text-green-100 text-lg max-w-lg">
                    Real-time market prices, demand forecasts, and AI-powered crop recommendations.
                  </p>
                </div>
                <BarChart3 className="h-32 w-32 text-white/20 hidden lg:block" />
              </div>
            </div>

            <div className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-2xl hover:border-primary-300 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="bg-primary-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <CheckCircle className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Quality Assured</h3>
                <p className="text-gray-600 leading-relaxed">
                  Built-in quality tracking and compliance management systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Modern Timeline */}
      <section id="how-it-works" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full mb-6">
              <span className="text-sm font-semibold text-primary-800">PROCESS</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
              Simple. <span className="bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">Transparent.</span> Efficient.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200"></div>

            {[
              { step: '01', title: 'Register', desc: 'Create your verified account in minutes', icon: Users },
              { step: '02', title: 'Connect', desc: 'Browse and match with ideal partners', icon: Sprout },
              { step: '03', title: 'Contract', desc: 'Sign secure digital agreements', icon: FileText },
              { step: '04', title: 'Grow', desc: 'Track progress and earn transparently', icon: TrendingUp }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="text-center">
                  <div className="relative mx-auto w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl transform rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
                    <div className="relative bg-white rounded-3xl w-full h-full flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                      <item.icon className="w-10 h-10 text-primary-600" />
                    </div>
                  </div>
                  <div className="text-6xl font-black text-primary-100 mb-3">{item.step}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Premium Cards */}
      <section id="testimonials" className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full mb-6">
              <span className="text-sm font-semibold text-primary-800">TESTIMONIALS</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
              What Our <span className="bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">Users Say</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Ramesh Patel',
                role: 'Farmer, Gujarat',
                text: 'Krishi Sangam transformed my farming. Direct access to companies means better prices and no middlemen taking cuts.',
                avatar: '👨‍🌾'
              },
              {
                name: 'Priya Sharma',
                role: 'Agri Business Owner',
                text: 'The platform makes sourcing reliable. We can directly connect with farmers and ensure quality at every step.',
                avatar: '👩‍💼'
              },
              {
                name: 'Vikram Singh',
                role: 'Contract Farmer',
                text: 'Secure payments and transparent contracts give me peace of mind. I can focus on farming, not worrying about payments.',
                avatar: '🧑‍🌾'
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="text-5xl mb-6">{testimonial.avatar}</div>
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-primary-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Premium */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-green-600 to-primary-800">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          }}></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
            Ready to Transform Your
            <br />
            Agriculture Business?
          </h2>
          <p className="text-2xl text-primary-100 mb-12 max-w-3xl mx-auto">
            Join thousands of farmers and companies already benefiting from transparent contract farming
          </p>
          <Link 
            to="/register" 
            className="group inline-flex items-center bg-white text-primary-600 px-12 py-6 rounded-full font-bold text-xl hover:bg-primary-50 transition-all duration-300 hover:shadow-2xl hover:scale-105"
          >
            Get Started Today
            <ArrowRight className="ml-3 w-6 h-6 transform group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer - Modern */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Sprout className="h-8 w-8 text-primary-400" />
                <span className="text-2xl font-bold text-white">Krishi Sangam</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering farmers and companies through transparent, secure contract farming.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4 text-lg">For Farmers</h3>
              <ul className="space-y-3">
                {['Find Contracts', 'Track Payments', 'Market Prices', 'Quality Standards'].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-300 flex items-center">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4 text-lg">For Companies</h3>
              <ul className="space-y-3">
                {['Find Farmers', 'Create Contracts', 'Quality Tracking', 'Analytics'].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-300 flex items-center">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4 text-lg">Company</h3>
              <ul className="space-y-3">
                {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-300 flex items-center">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 Krishi Sangam. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">Facebook</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Landing;