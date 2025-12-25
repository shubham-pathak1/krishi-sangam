import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        label: string;
        icon?: LucideIcon;
        isNeutral?: boolean;
    };
    color?: string;
    description?: string;
}

const StatsCard = ({ label, value, icon: Icon, trend, color = "text-zinc-900", description }: StatsCardProps) => {
    return (
        <div className="premium-card p-8 group overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-50 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-50/50 transition-colors duration-500" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-zinc-50 rounded-xl group-hover:bg-zinc-900 group-hover:text-white transition-all duration-300">
                        <Icon className="w-5 h-5" />
                    </div>
                    {trend && (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${trend.isNeutral ? 'bg-zinc-100 text-zinc-500' : 'bg-emerald-50 text-emerald-600'}`}>
                            {trend.icon && <trend.icon className="w-3 h-3" />}
                            {trend.label}
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</p>
                    <h3 className={`text-3xl font-bold tracking-display font-display ${color}`}>{value}</h3>
                    {description && (
                        <p className="text-xs text-zinc-400 font-medium leading-relaxed mt-2">{description}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
