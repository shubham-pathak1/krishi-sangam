import { useState, useEffect } from 'react';
import {
    FileText, CreditCard, Activity, CheckCircle2, Users, Building2
} from 'lucide-react';
import adminService from '../../services/admin.service';
import contractService from '../../services/contract.service';
import type { AdminCounts } from '../../types/admin.types';
import type { Contract } from '../../types/contract.types';
import StatsCard from '../../components/ui/StatsCard';
import StatusBadge from '../../components/ui/StatusBadge';
import AdminLayout from '../../components/layout/AdminLayout';

const AdminDashboard = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [counts, setCounts] = useState<AdminCounts>({
        Farmers: 0,
        Companies: 0,
        'Active Contracts': 0,
        'Completed Contracts': 0,
    });
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'Console — Krishi Sangam';
        const fetchData = async () => {
            setLoading(true);
            try {
                const [countsData, contractsData] = await Promise.all([
                    adminService.getCounts(),
                    contractService.getAllContracts(),
                ]);
                setCounts(countsData);
                setContracts(contractsData || []);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredContracts = contracts.filter((contract) => {
        const query = searchQuery.toLowerCase();
        return (
            (contract.product || '').toLowerCase().includes(query) ||
            (contract.company_id || '').toLowerCase().includes(query) ||
            (contract._id || '').toLowerCase().includes(query)
        );
    });

    return (
        <AdminLayout
            title="System Overview"
            subtitle="Central monitoring console for agricultural protocols and settlements."
            onSearch={setSearchQuery}
        >
            <div className="space-y-10">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatsCard
                        label="ACTIVE CONTRACTS"
                        value={counts['Active Contracts'] || 0}
                        icon={FileText}
                        trend={{ label: 'Live Protocol', icon: Activity }}
                    />
                    <StatsCard
                        label="REGISTERED FARMERS"
                        value={counts.Farmers || 0}
                        icon={Users}
                        trend={{ label: 'Verified', isNeutral: true }}
                    />
                    <StatsCard
                        label="COMPANIES ONBOARDED"
                        value={counts.Companies || 0}
                        icon={Building2}
                        trend={{ label: 'Enterprise', isNeutral: true }}
                    />
                    <StatsCard
                        label="TOTAL SETTLEMENTS"
                        value={counts['Completed Contracts'] || 0}
                        icon={CreditCard}
                        color="text-emerald-500"
                        trend={{ label: 'Finalized', icon: CheckCircle2 }}
                    />
                </div>

                {/* Contracts Table */}
                <div className="bg-white rounded-3xl border border-zinc-100 shadow-premium overflow-hidden">
                    <div className="p-10 border-b border-zinc-50 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-zinc-900 font-display tracking-tight">System Registry</h2>
                            <p className="text-sm text-zinc-400 font-bold tracking-institutional mt-1">Real-time stream of latest agricultural agreements.</p>
                        </div>
                        <button className="px-6 py-2.5 bg-zinc-50 text-zinc-900 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-zinc-950 hover:text-white transition-all border border-zinc-100">
                            VIEW FULL LEDGER
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-zinc-50/50">
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">PROTOCOL ID</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">COMMODITY</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">VOLUME</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">VALUATION</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">STATUS</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">TIMESTAMP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-10 py-20 text-center text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px]">
                                            Synchronizing Infrastructure...
                                        </td>
                                    </tr>
                                ) : filteredContracts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-10 py-20 text-center text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px]">
                                            No registry matches found for your search inquiry.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredContracts.map((contract) => (
                                        <tr key={contract._id} className="group hover:bg-zinc-50 transition-colors">
                                            <td className="px-10 py-7 text-[12px] font-bold text-zinc-400 font-mono tracking-tighter">
                                                PROTOCOL:{contract._id.slice(-6).toUpperCase()}
                                            </td>
                                            <td className="px-10 py-7 text-[15px] font-black text-zinc-900 tracking-tight">
                                                {contract.product || '—'}
                                            </td>
                                            <td className="px-10 py-7 text-sm font-bold text-zinc-500 tracking-institutional">
                                                {contract.quantity || '0'} MT
                                            </td>
                                            <td className="px-10 py-7 text-[15px] font-black text-zinc-900 tracking-tighter">
                                                ₹{(contract.price || 0).toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-10 py-7">
                                                <StatusBadge status={String(contract.status)} />
                                            </td>
                                            <td className="px-10 py-7 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                                {new Date(contract.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
