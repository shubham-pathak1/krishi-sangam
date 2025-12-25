import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, CreditCard,
    LogOut, Menu, ChevronDown, Bell, Settings,
    Building2, Users, Briefcase
} from 'lucide-react';

interface CompanyLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
}

const CompanyLayout = ({ children, title, subtitle }: CompanyLayoutProps) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            navigate('/login');
        }
    };

    const navItems = [
        { path: '/company/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/company/explore-farmers', label: 'Farmer Listings', icon: Users },
        { path: '/company/my-contracts', label: 'My Contracts', icon: Briefcase },
        { path: '/company/transactions', label: 'Transactions', icon: CreditCard },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-['Inter'] flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-zinc-950 text-white shadow-2xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}
            >
                <div className="flex items-center gap-3 p-8 border-b border-white/10">
                    <img src="/src/assets/images/l.png" alt="Logo" className="h-8 w-auto" />
                    <span className="text-lg font-bold tracking-wide">Krishi Sangam</span>
                </div>

                <div className="px-8 pt-8 pb-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit">
                        <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Company Portal</span>
                    </div>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive(item.path)
                                ? 'bg-white text-black font-semibold shadow-lg scale-[1.02]'
                                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 transition-colors ${isActive(item.path) ? 'text-black' : 'text-zinc-400 group-hover:text-white'}`} />
                            <span className="relative z-10">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full p-6 border-t border-white/10">
                    <div className="flex items-center gap-4 px-4 py-3 bg-white/5 rounded-2xl border border-white/5 transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {user?.Name?.charAt(0) || 'C'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold text-white truncate">{user?.Name || 'Company'}</p>
                            <p className="text-xs text-zinc-500 truncate">{user?.Email || 'contact@company.com'}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen bg-[#F8FAFC]">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <Menu className="w-6 h-6 text-gray-700" />
                        </button>
                        <div>
                            {title && <h1 className="text-2xl font-bold text-gray-900 leading-none">{title}</h1>}
                            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-3 rounded-full hover:bg-gray-100/80 transition-all text-gray-500 hover:text-blue-600 relative group">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2.5 right-3 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-3 pl-2 pr-4 py-2 bg-white border border-gray-200/60 rounded-full shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                    {user?.Name?.charAt(0)}
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-14 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-3 border-b border-gray-50">
                                        <p className="text-sm font-semibold text-gray-900">Signed in as</p>
                                        <p className="text-xs text-gray-500 truncate">{user?.Email}</p>
                                    </div>
                                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors text-left">
                                        <Settings className="w-4 h-4" /> Company Settings
                                    </button>
                                    <div className="h-px bg-gray-50 my-1"></div>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto animate-fade-in-up">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default CompanyLayout;
