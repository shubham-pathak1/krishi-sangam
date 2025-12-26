import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Leaf, Package, CheckCircle, Search, Activity, AlertOctagon } from 'lucide-react';
import FarmerLayout from '../../components/layout/FarmerLayout';
import StatsCard from '../../components/ui/StatsCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';

interface Crop {
    id: string;
    name: string;
    quantity: number;
    details: string;
    status: 'available' | 'sold-out';
    lastUpdated: string;
}

const FarmerCrops = () => {
    const [language] = useState<'en' | 'gu'>('en');

    // Initial Data
    const [crops, setCrops] = useState<Crop[]>([]);
    const [filteredCrops, setFilteredCrops] = useState<Crop[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters & Sorting
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        sortBy: 'quantity-desc'
    });

    const [stats, setStats] = useState({
        total: 0,
        totalQty: 0,
        available: 0
    });

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCrop, setCurrentCrop] = useState<Partial<Crop>>({});

    useEffect(() => {
        const fetchInventory = async () => {
            setLoading(true);
            try {
                // In Phase 3, we move to high-fidelity list views. 
                // We keep the state management but prepare it for farmer.service calls.
                const mockCrops: Crop[] = [
                    { id: '1', name: 'Premium Basmati', quantity: 1200, details: 'Long grain, grade A', status: 'available', lastUpdated: new Date().toISOString() },
                    { id: '2', name: 'Organic Wheat', quantity: 850, details: 'Sarvati variety', status: 'available', lastUpdated: new Date().toISOString() },
                    { id: '3', name: 'Yellow Corn', quantity: 2000, details: 'High yield hybrid', status: 'sold-out', lastUpdated: new Date().toISOString() },
                ];
                setCrops(mockCrops);
            } catch (error) {
                console.error('Failed to sync inventory registry');
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, []);

    useEffect(() => {
        filterAndSortCrops();
        calculateStats();
    }, [crops, filters]);

    const calculateStats = () => {
        setStats({
            total: crops.length,
            totalQty: crops.reduce((acc, curr) => acc + curr.quantity, 0),
            available: crops.filter(c => c.status === 'available').length
        });
    };

    const filterAndSortCrops = () => {
        let result = [...crops];

        if (filters.search) {
            const term = filters.search.toLowerCase();
            result = result.filter(c =>
                c.name.toLowerCase().includes(term) ||
                c.details.toLowerCase().includes(term)
            );
        }

        if (filters.status !== 'all') {
            result = result.filter(c => c.status === filters.status);
        }

        result.sort((a, b) => {
            switch (filters.sortBy) {
                case 'quantity-desc': return b.quantity - a.quantity;
                case 'quantity-asc': return a.quantity - b.quantity;
                case 'updated-desc': return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
                case 'updated-asc': return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
                default: return 0;
            }
        });

        setFilteredCrops(result);
    };

    const handleAddCrop = () => {
        setEditMode(false);
        setCurrentCrop({
            name: '',
            quantity: 0,
            status: 'available',
            details: ''
        });
        setIsModalOpen(true);
    };

    const handleEditCrop = (crop: Crop) => {
        setEditMode(true);
        setCurrentCrop(crop);
        setIsModalOpen(true);
    };

    const handleDeleteCrop = (id: string) => {
        if (window.confirm('Are you sure you want to remove this inventory record?')) {
            setCrops(crops.filter(c => c.id !== id));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editMode) {
            setCrops(crops.map(c => c.id === currentCrop.id ? { ...c, ...currentCrop } as Crop : c));
        } else {
            const newCrop: Crop = {
                ...currentCrop,
                id: Math.random().toString(36).substr(2, 9),
                lastUpdated: new Date().toISOString()
            } as Crop;
            setCrops([...crops, newCrop]);
        }
        setIsModalOpen(false);
    };

    const t = {
        en: {
            title: 'Inventory Center',
            subtitle: 'Secure management of harvested assets and real-time stock levels.',
            stats: {
                total: 'Commodity Types',
                volume: 'Gross Weight (MT)',
                status: 'Live Availability'
            },
            status: {
                available: 'In Stock',
                'sold-out': 'Exhausted'
            }
        },
        gu: {
            title: 'ઇન્વેન્ટરી સેન્ટર',
            subtitle: 'લણણી કરેલ અસ્કયામતો અને રિયલ-ટાઇમ સ્ટોક લેવલનું સુરક્ષિત સંચાલન.',
            stats: {
                total: 'પાક ના પ્રકાર',
                volume: 'કુલ વજન (MT)',
                status: 'લાઇવ ઉપલબ્ધતા'
            },
            status: {
                available: 'સ્ટોકમાં છે',
                'sold-out': 'ખતમ'
            }
        }
    };

    const text = (t as any)[language];

    return (
        <FarmerLayout title={text.title} subtitle={text.subtitle}>
            <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatsCard
                        label={text.stats.total}
                        value={stats.total}
                        icon={Leaf}
                        imageSrc="/src/assets/images/crops.png"
                        trend={{ label: 'Active Assets', icon: Activity }}
                    />
                    <StatsCard
                        label={text.stats.volume}
                        value={`${stats.totalQty.toLocaleString('en-IN')} MT`}
                        icon={Package}
                        imageSrc="/src/assets/images/ccontract.png"
                    />
                    <StatsCard
                        label={text.stats.status}
                        value={stats.available}
                        icon={CheckCircle}
                        imageSrc="/src/assets/images/fmanage.png"
                        trend={{ label: 'Live Stock', icon: Activity }}
                    />
                </div>

                <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/60 shadow-premium flex flex-col lg:flex-row gap-10 items-center justify-between">
                    <div className="relative w-full lg:max-w-xl group">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Locate commodity protocols..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full pl-14 pr-6 py-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-950 placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-950/5 focus:bg-white transition-all font-semibold tracking-tight h-16"
                        />
                    </div>

                    <div className="flex items-center gap-6 w-full lg:w-auto">
                        <div className="flex gap-2 bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-white">
                            {['all', 'available', 'sold-out'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFilters({ ...filters, status: s })}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${filters.status === s
                                        ? 'bg-zinc-950 text-white shadow-lg'
                                        : 'text-zinc-400 hover:text-zinc-950'
                                        }`}
                                >
                                    {s === 'all' ? 'All' : text.status[s as keyof typeof text.status]}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleAddCrop}
                            className="h-16 px-8 bg-zinc-950 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] tracking-[0.2em] shadow-lg hover:scale-105 active:scale-95 transition-all"
                        >
                            <Plus className="w-5 h-5" /> REPLENISH
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="py-32 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 border-t-2 border-black rounded-full animate-spin mb-6"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Synchronizing Vault</p>
                    </div>
                ) : filteredCrops.length === 0 ? (
                    <div className="py-32 flex flex-col items-center justify-center text-center bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                        <AlertOctagon className="w-12 h-12 text-gray-200 mb-6" />
                        <p className="text-xl font-black text-gray-900 mb-2">Inventory Empty</p>
                        <p className="text-sm text-gray-400 font-medium">No recorded assets found in the selected matrix.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredCrops.map((crop) => (
                            <div
                                key={crop.id}
                                className="group bg-white/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/60 transition-all duration-500 flex flex-col shadow-premium hover:-translate-y-2 hover:shadow-2xl hover:bg-white/60 cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center text-zinc-950 font-black text-xl border border-white shadow-sm transition-all duration-500 group-hover:bg-zinc-950 group-hover:text-white group-hover:shadow-lg group-hover:-rotate-3">
                                        <Leaf className="w-6 h-6" />
                                    </div>
                                    <StatusBadge status={crop.status === 'available' ? 'active' : 'inactive'} />
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-3xl font-black text-zinc-950 font-display mb-2 tracking-tightest leading-tight">{crop.name}</h3>
                                    <p className="text-[14px] text-zinc-400 font-medium tracking-tight line-clamp-2 leading-relaxed">
                                        {crop.details || 'No additional specification provided for this commodity record.'}
                                    </p>
                                </div>

                                <div className="pt-10 border-t border-white/40 flex items-center justify-between mt-auto">
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.25em] mb-1.5">Current Volume</p>
                                        <p className="text-3xl font-black text-zinc-950 tracking-tightest leading-none">{crop.quantity.toLocaleString('en-IN')} MT</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleEditCrop(crop)}
                                            className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/60 text-zinc-400 hover:text-zinc-950 hover:bg-white hover:shadow-md transition-all border border-white active:scale-90"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCrop(crop.id)}
                                            className="h-12 w-12 flex items-center justify-center rounded-2xl bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 transition-all border border-red-100 active:scale-90"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editMode ? 'Update Commodity Registry' : 'Replenish Inventory Protocol'}
            >
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Commodity Identifier</label>
                        <input
                            type="text"
                            required
                            value={currentCrop.name}
                            onChange={(e) => setCurrentCrop({ ...currentCrop, name: e.target.value })}
                            className="input-premium"
                            placeholder="e.g. Premium Sona Masuri"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Volume (MT)</label>
                            <input
                                type="number"
                                required
                                value={currentCrop.quantity}
                                onChange={(e) => setCurrentCrop({ ...currentCrop, quantity: parseInt(e.target.value) })}
                                className="input-premium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Availability Protocol</label>
                            <select
                                value={currentCrop.status}
                                onChange={(e) => setCurrentCrop({ ...currentCrop, status: e.target.value as 'available' | 'sold-out' })}
                                className="input-premium appearance-none"
                            >
                                <option value="available">Live (In Stock)</option>
                                <option value="sold-out">Exhausted (Sold Out)</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Technical Specifications</label>
                        <textarea
                            rows={4}
                            value={currentCrop.details}
                            onChange={(e) => setCurrentCrop({ ...currentCrop, details: e.target.value })}
                            className="input-premium min-h-[120px] resize-none"
                            placeholder="Enter grading info, moisture content, harvest data..."
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="btn-premium w-full py-5 text-sm"
                    >
                        {editMode ? 'COMMIT REGISTRY UPDATES' : 'AUTHORIZE ASSET ENTRY'}
                    </button>
                </form>
            </Modal>
        </FarmerLayout>
    );
};

export default FarmerCrops;
