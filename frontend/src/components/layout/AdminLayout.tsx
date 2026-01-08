import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Users, Building2, FileText, CreditCard,
    LogOut, ChevronDown, Bell, Settings, Search
} from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    onSearch?: (query: string) => void;
}

const AdminLayout = ({ children, title, subtitle, onSearch }: AdminLayoutProps) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (onSearch) onSearch(value);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            navigate('/login');
        }
    };

    const navItems = [
        { path: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
        { path: '/admin/farmers', label: 'Farmers', icon: Users },
        { path: '/admin/companies', label: 'Companies', icon: Building2 },
        { path: '/admin/contracts', label: 'Contracts', icon: FileText },
        { path: '/admin/transactions', label: 'Transactions', icon: CreditCard },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-[#FCFAF8] flex flex-col lg:flex-row relative">
            {/* Background Atmosphere - Deep Institutional Vibe */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {/* Deep Forest/Blackish Green Atmosphere */}
                <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-[#05150D]/10 rounded-full blur-[160px]"></div>

                {/* Primary Brand Glow */}
                <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] bg-primary-500/15 rounded-full blur-[120px] animate-pulse duration-[10s]"></div>

                {/* Warm Secondary Accent */}
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-[120px]"></div>

                {/* Mid-range Structural Depth */}
                <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] bg-primary-900/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Desktop Sidebar - High Fidelity Glass Island */}
            <aside className="hidden lg:flex flex-col w-fit bg-white/40 backdrop-blur-3xl border border-white/60 h-[calc(100vh-3rem)] sticky top-6 ml-6 my-6 rounded-[3rem] z-50 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
                <div className="p-10 pb-6">
                    <Link to="/admin/dashboard" className="flex items-center gap-4 group">
                        <img src="/src/assets/images/l.png" alt="Logo" className="w-10 h-10 object-contain" />
                        <span className="text-xl font-bold font-display tracking-tightest text-zinc-900 whitespace-nowrap">
                            Krishi Sangam
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 px-8 space-y-2 mt-8">
                    <div className="px-3 mb-6">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] whitespace-nowrap opacity-70">Main Registry</p>
                    </div>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-500 group relative ${isActive(item.path)
                                ? 'bg-white/80 border border-white text-zinc-950 shadow-md scale-[1.02]'
                                : 'text-zinc-500 hover:text-zinc-950 hover:bg-white/30'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 transition-all duration-500 ${isActive(item.path) ? 'text-zinc-950 stroke-[2.5px]' : 'text-zinc-400 group-hover:text-zinc-950'
                                }`} />
                            <span className="text-[14px] font-semibold tracking-tight whitespace-nowrap pr-8">{item.label}</span>
                            {isActive(item.path) && (
                                <div className="absolute right-4 w-1.5 h-1.5 bg-zinc-950 rounded-full"></div>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Administrator Profile Entity */}
                <div className="p-6 mt-auto">
                    <div className="p-4 bg-zinc-950/[0.03] backdrop-blur-3xl rounded-[2.2rem] border border-white/40 group cursor-pointer hover:bg-zinc-950/[0.06] transition-all duration-700 shadow-premium-sm hover:shadow-premium relative overflow-hidden">
                        {/* Inner Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-[1.2rem] bg-zinc-950 flex items-center justify-center font-black text-white shadow-2xl transition-all duration-700 group-hover:scale-110 overflow-hidden border border-white/10">
                                {user?.Name?.charAt(0) || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[14px] font-black text-zinc-900 truncate tracking-tightest leading-tight group-hover:translate-x-0.5 transition-transform duration-700">{user?.Name || 'Administrator'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Navbar - Glass Pill */}
            <div className="lg:hidden flex items-center justify-between mx-6 mt-6 p-6 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[2.5rem] sticky top-6 z-50 shadow-xl overflow-hidden">
                <Link to="/admin/dashboard" className="flex items-center gap-3">
                    <img src="/src/assets/images/l.png" alt="Logo" className="w-8 h-8 object-contain" />
                    <span className="text-lg font-bold font-display tracking-tightest text-zinc-900 leading-none">Krishi Sangam</span>
                </Link>
                <div className="flex items-center gap-4">
                    <button className="w-10 h-10 rounded-2xl bg-white/40 border border-white flex items-center justify-center text-zinc-600 hover:text-zinc-950 transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 rounded-2xl bg-zinc-950 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {user?.Name?.charAt(0)}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
                {/* Desktop Header - Glassmorphic Search */}
                <header className="hidden lg:flex h-24 bg-transparent px-10 items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-8 flex-1">
                        <div className="flex items-center bg-white/40 backdrop-blur-md rounded-[1.5rem] px-6 py-4 w-full max-w-xl border border-white/60 focus-within:bg-white/80 focus-within:border-zinc-950 transition-all duration-500 group shadow-sm focus-within:shadow-xl">
                            <Search className="w-4.5 h-4.5 text-zinc-400 mr-3 group-focus-within:text-zinc-950 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search system logs, records or entities..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="bg-transparent border-none focus:ring-0 text-sm w-full text-zinc-900 placeholder-zinc-400 font-medium tracking-tight outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="p-3.5 rounded-[1.2rem] bg-white/40 border border-white/60 backdrop-blur-md hover:bg-white/80 text-zinc-400 hover:text-zinc-950 transition-all relative group shadow-sm hover:shadow-md">
                            <Bell className="w-5 h-5 transition-colors" />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-zinc-950 rounded-full border-2 border-white group-hover:scale-125 transition-transform"></span>
                        </button>

                        <div className="h-8 w-px bg-zinc-200/30 mx-2"></div>

                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-3 p-1.5 pr-5 bg-white/40 backdrop-blur-3xl hover:bg-white/90 border border-white rounded-[1.5rem] shadow-premium-sm transition-all duration-500 group hover:shadow-premium hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <div className="w-11 h-11 rounded-[1.1rem] bg-zinc-950 flex items-center justify-center font-black text-white text-[12px] shadow-2xl group-hover:scale-105 transition-transform duration-700 border border-white/20">
                                    {user?.Name?.charAt(0)}
                                </div>
                                <div className="hidden sm:block text-left pr-1">
                                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-all duration-700 ${profileOpen ? 'rotate-180 text-zinc-950 scale-110' : 'group-hover:text-zinc-600'}`} />
                                </div>
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-18 w-64 bg-white/80 backdrop-blur-3xl rounded-[2rem] shadow-2xl border border-white py-4 animate-in fade-in zoom-in-95 duration-500 z-[60]">
                                    <div className="px-6 py-3 border-b border-zinc-100/50 mb-2">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Administrative Protocols</p>
                                    </div>
                                    <button className="w-full flex items-center gap-4 px-6 py-3.5 text-sm text-zinc-600 hover:bg-white/50 transition-colors text-left font-semibold tracking-tight hover:text-zinc-950">
                                        <Settings className="w-4 h-4" /> System Settings
                                    </button>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-3.5 text-sm text-red-500 hover:bg-red-50/50 transition-colors text-left font-semibold tracking-tight">
                                        <LogOut className="w-4 h-4" /> Finalize Session
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 lg:p-10 pb-32 lg:pb-10">
                    <div className="max-w-7xl mx-auto space-y-8 lg:space-y-12">
                        {(title || subtitle) && (
                            <div className="space-y-3">
                                {title && <h1 className="text-4xl lg:text-5xl font-black text-zinc-900 font-display tracking-tightest leading-tight">{title}</h1>}
                                {subtitle && <p className="text-sm lg:text-lg text-zinc-500 font-medium tracking-tight max-w-2xl">{subtitle}</p>}
                            </div>
                        )}
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            {/* Glassmorphic Mobile Floating Navigation */}
            <div className="fixed bottom-8 inset-x-8 z-[1000] lg:hidden">
                <nav className="bg-white/60 backdrop-blur-3xl rounded-[2.5rem] h-20 flex items-center justify-around px-6 shadow-[0_24px_48px_rgba(0,0,0,0.15)] border border-white/80 overflow-hidden">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-500 relative ${isActive(item.path)
                                ? 'bg-white border border-white text-zinc-950 shadow-lg scale-110'
                                : 'text-zinc-400 hover:text-zinc-600'
                                }`}
                        >
                            <item.icon className={`w-6 h-6 transition-all duration-500 ${isActive(item.path) ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                            {isActive(item.path) && (
                                <div className="absolute -bottom-1 w-1 h-1 bg-zinc-950 rounded-full animate-pulse"></div>
                            )}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default AdminLayout;
