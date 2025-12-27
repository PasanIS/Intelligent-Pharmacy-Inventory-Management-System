import React from 'react';

interface InputProps {
  id?: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  min?: string;
  step?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  min,
  step,
  disabled = false,
  required = false,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        step={step}
        disabled={disabled}
        required={required}
        className={`w-full px-4 py-3 rounded-lg border bg-slate-800/50 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 ${error
            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-700/50 focus:border-cyan-500 focus:ring-cyan-500/20 hover:border-slate-600'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
      {error && <span className="text-xs text-red-400 mt-1 block">{error}</span>}
    </div>
  );
};

export default Input;