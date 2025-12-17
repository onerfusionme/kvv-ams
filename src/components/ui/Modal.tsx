'use client';

import { ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    footer?: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, size = 'md', footer }: ModalProps) {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-6xl',
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className={`relative w-full ${sizeClasses[size]} bg-slate-900 rounded-2xl shadow-2xl border border-white/10 transform transition-all`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                        <h3 className="text-lg font-semibold text-white">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">{children}</div>

                    {/* Footer */}
                    {footer && (
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-slate-800/50 rounded-b-2xl">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
