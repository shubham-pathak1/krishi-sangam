import type { LucideIcon } from 'lucide-react';

interface StatusBadgeProps {
    status: string | boolean;
    className?: string;
    icon?: LucideIcon;
}

const StatusBadge = ({ status, className = "", icon: Icon }: StatusBadgeProps) => {
    const s = String(status).toLowerCase();

    const colors: Record<string, string> = {
        'active': 'bg-emerald-50 text-emerald-700 border-emerald-100/50',
        'true': 'bg-emerald-50 text-emerald-700 border-emerald-100/50',
        'completed': 'bg-emerald-50 text-emerald-700 border-emerald-100/50',
        '1': 'bg-emerald-50 text-emerald-700 border-emerald-100/50',
        'pending': 'bg-amber-50 text-amber-700 border-amber-100/50',
        'false': 'bg-amber-50 text-amber-700 border-amber-100/50',
        '0': 'bg-amber-50 text-amber-700 border-amber-100/50',
        'cancelled': 'bg-red-50 text-red-700 border-red-100/50',
        'default': 'bg-zinc-50 text-zinc-600 border-zinc-100/50'
    };

    const style = colors[s] || colors['default'];

    return (
        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border flex items-center gap-1.5 w-fit ${style} ${className}`}>
            {Icon && <Icon className="w-3 h-3" />}
            {s === 'true' || s === '1' ? 'Completed' : (s === 'false' || s === '0' ? 'Pending' : status)}
        </span>
    );
};

export default StatusBadge;
