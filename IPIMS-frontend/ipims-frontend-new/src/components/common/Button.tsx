import React from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'link' | 'danger' | 'ghost';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  variant = 'primary',
  onClick,
  disabled = false,
  children,
  className = '',
}) => {

  const baseStyles = "relative px-4 py-2 rounded-lg font-medium transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

  const variants = {
    primary: "bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30",
    secondary: "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white hover:border-slate-600",
    link: "text-cyan-400 hover:text-cyan-300 underline-offset-4 hover:underline p-0 bg-transparent shadow-none",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;