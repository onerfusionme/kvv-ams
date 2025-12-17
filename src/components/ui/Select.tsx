'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, placeholder, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        {label}
                        {props.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                )}
                <select
                    ref={ref}
                    className={`
            w-full px-4 py-2.5 bg-slate-800/50 border rounded-xl text-sm text-white
            transition-all duration-200 appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10'}
            ${className}
          `}
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.75rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                    }}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';

export default Select;
