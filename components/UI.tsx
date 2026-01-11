
import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
    {children}
  </div>
);

/* Fixed: Added disabled property to Button component props */
export const Button: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}> = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input: React.FC<{
  label?: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}> = ({ label, type = 'text', value, onChange, placeholder, required }) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    />
  </div>
);

export const Select: React.FC<{
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}> = ({ label, value, onChange, options, placeholder }) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'danger' | 'neutral' }> = ({ children, variant = 'neutral' }) => {
  const styles = {
    success: 'bg-emerald-100 text-emerald-700',
    danger: 'bg-rose-100 text-rose-700',
    neutral: 'bg-slate-100 text-slate-700',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[variant]}`}>
      {children}
    </span>
  );
};
