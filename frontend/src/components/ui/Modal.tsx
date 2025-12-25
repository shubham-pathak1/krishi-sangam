import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
}

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-2xl" }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Content */}
            <div className={`relative w-full ${maxWidth} bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden animate-in zoom-in-95 duration-300`}>
                <div className="px-8 py-6 border-b border-zinc-50 flex items-center justify-between">
                    <h3 className="text-xl font-bold font-display tracking-tight text-zinc-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-50 rounded-xl transition-colors text-zinc-400 hover:text-zinc-900"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
