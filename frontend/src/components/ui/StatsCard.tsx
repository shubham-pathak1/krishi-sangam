import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    imageSrc?: string;
    trend?: {
        label: string;
        icon?: LucideIcon;
        isNeutral?: boolean;
    };
    color?: string;
    description?: string;
}

const StatsCard = ({ label, value, icon: Icon, imageSrc, trend, color = "text-zinc-900", description }: StatsCardProps) => {
    return (
        <div className="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 p-8 group overflow-hidden relative transition-[background-color] duration-500 hover:bg-white/60 cursor-pointer will-change-transform translate-z-0">
            {/* Background Accent - Frosted Neutral Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-900/5 rounded-full -mr-16 -mt-16 group-hover:bg-zinc-900/10 transition-colors duration-700 blur-3xl pointer-events-none" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-white/80 rounded-2xl border border-white flex items-center justify-center transition-[background-color,shadow] duration-500 shadow-sm group-hover:bg-white group-hover:shadow-md">
                        {imageSrc ? (
                            <img src={imageSrc} alt={label} className="w-8 h-8 object-contain" />
                        ) : (
                            <Icon className="w-6 h-6 text-zinc-900 transition-transform duration-500 group-hover:scale-110" />
                        )}
                    </div>
                    {trend && (
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-tight shadow-sm border ${trend.isNeutral ? 'bg-zinc-100/50 text-zinc-500 border-zinc-100/50' : 'bg-zinc-950 text-white border-zinc-950'}`}>
                            {trend.icon && <trend.icon className="w-3 h-3" />}
                            {trend.label}
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{label}</p>
                    <h3 className={`text-3xl font-black tracking-tightest font-display ${color}`}>{value}</h3>
                    {description && (
                        <p className="text-[13px] text-zinc-500 font-medium leading-relaxed mt-2 tracking-tight">{description}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
