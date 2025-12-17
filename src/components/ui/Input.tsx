'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    size?: 'sm' | 'md';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, leftIcon, rightIcon, size = 'md', className = '', ...props }, ref) => {
        const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm';

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        {label}
                        {props.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`
              w-full ${sizeClasses} bg-slate-800/50 border rounded-xl text-white
              placeholder-slate-400 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10'}
              ${className}
            `}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
                {helperText && !error && <p className="mt-1 text-xs text-slate-400">{helperText}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;

