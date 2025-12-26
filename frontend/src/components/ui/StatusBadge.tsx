import type { LucideIcon } from 'lucide-react';

interface StatusBadgeProps {
    status: string | boolean;
    className?: string;
    icon?: LucideIcon;
}

const StatusBadge = ({ status, className = "", icon: Icon }: StatusBadgeProps) => {
    const s = String(status).toLowerCase();

    const colors: Record<string, string> = {
        'active': 'bg-zinc-950 text-white border-zinc-950 shadow-sm',
        'true': 'bg-zinc-950 text-white border-zinc-950 shadow-sm',
        'completed': 'bg-zinc-950 text-white border-zinc-950 shadow-sm',
        '1': 'bg-zinc-950 text-white border-zinc-950 shadow-sm',
        'pending': 'bg-zinc-100 text-zinc-600 border-zinc-200',
        'false': 'bg-zinc-100 text-zinc-600 border-zinc-200',
        '0': 'bg-zinc-100 text-zinc-600 border-zinc-200',
        'cancelled': 'bg-zinc-400 text-white border-zinc-400 shadow-sm',
        'default': 'bg-zinc-50 text-zinc-400 border-zinc-100/50'
    };

    const style = colors[s] || colors['default'];

    return (
        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border flex items-center gap-1.5 w-fit shadow-sm ${style} ${className}`}>
            {Icon && <Icon className="w-3 h-3" />}
            {s === 'true' || s === '1' ? 'Completed' : (s === 'false' || s === '0' ? 'Pending' : status)}
        </span>
    );
};

export default StatusBadge;
