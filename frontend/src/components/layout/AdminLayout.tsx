import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Users, Building2, FileText, CreditCard,
    LogOut, Menu, ChevronDown, Bell, Settings, Search, X, Shield
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
    const [sidebarOpen, setSidebarOpen] = useState(false);
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
        <div className="min-h-screen bg-[#FAFAFA] flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-zinc-100 transform transition-transform duration-500 ease-in-out lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center">
                            <Shield className="text-emerald-400 w-6 h-6" />
                        </div>
                        <span className="text-xl font-black font-display tracking-tight text-zinc-900">KS.</span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-zinc-50 rounded-lg">
                        <X className="w-5 h-5 text-zinc-400" />
                    </button>
                </div>

                <nav className="px-4 space-y-1.5 mt-4">
                    <div className="px-4 mb-4">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">System Console</p>
                    </div>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive(item.path)
                                    ? 'bg-zinc-950 text-white shadow-xl shadow-zinc-200 translate-x-1'
                                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                                }`}
                        >
                            <item.icon className={`w-4.5 h-4.5 transition-colors ${isActive(item.path) ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-zinc-900'
                                }`} />
                            <span className="text-sm font-bold tracking-institutional">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full p-6">
                    <div className="p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100 group cursor-pointer hover:bg-zinc-100 transition-colors duration-300">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center font-bold text-zinc-900 shadow-sm">
                                {user?.Name?.charAt(0) || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-zinc-900 truncate tracking-tight">{user?.Name || 'Administrator'}</p>
                                <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">Console Admin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header */}
                <header className="h-24 bg-white/70 backdrop-blur-xl border-b border-zinc-100 px-10 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-8 flex-1">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-3 bg-zinc-50 hover:bg-zinc-100 rounded-xl transition-all">
                            <Menu className="w-6 h-6 text-zinc-900" />
                        </button>

                        <div className="hidden md:flex items-center bg-zinc-50 rounded-2xl px-6 py-3.5 w-full max-w-xl border border-zinc-100 focus-within:bg-white focus-within:ring-4 focus-within:ring-zinc-950/5 transition-all duration-300 group">
                            <Search className="w-4.5 h-4.5 text-zinc-400 mr-3 group-focus-within:text-zinc-900 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search system logs, records or entities..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="bg-transparent border-none focus:ring-0 text-sm w-full text-zinc-900 placeholder-zinc-400 font-bold tracking-institutional"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-all relative group">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform"></span>
                        </button>

                        <div className="h-8 w-px bg-zinc-100 mx-2"></div>

                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-3 p-1.5 pr-4 bg-zinc-50 hover:bg-zinc-100 rounded-2xl border border-zinc-100 transition-all group"
                            >
                                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center font-black text-zinc-900 text-sm shadow-sm border border-zinc-100">
                                    {user?.Name?.charAt(0)}
                                </div>
                                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-500 ${profileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-16 w-60 bg-white rounded-3xl shadow-2xl border border-zinc-100 py-3 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="px-5 py-3 border-b border-zinc-50 mb-2">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Administrative Protcols</p>
                                    </div>
                                    <button className="w-full flex items-center gap-4 px-5 py-3 text-sm text-zinc-600 hover:bg-zinc-50 transition-colors text-left font-bold tracking-institutional">
                                        <Settings className="w-4 h-4" /> System Settings
                                    </button>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors text-left font-bold tracking-institutional">
                                        <LogOut className="w-4 h-4" /> Finalize Session
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-10 scroll-smooth custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-10">
                        {(title || subtitle) && (
                            <div className="space-y-2">
                                {title && <h1 className="text-4xl font-black text-zinc-900 font-display tracking-tight">{title}</h1>}
                                {subtitle && <p className="text-base text-zinc-400 font-bold tracking-institutional">{subtitle}</p>}
                            </div>
                        )}
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-zinc-950/20 backdrop-blur-md lg:hidden transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminLayout;
