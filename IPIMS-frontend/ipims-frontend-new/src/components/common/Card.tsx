import React from 'react';

interface CardProps {
  title?: string;
  value?: string | number;
  icon?: string;
  children?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, children, className = '' }) => {
  if (children) {
    return (
      <div className={`glass-card rounded-xl p-6 ${className}`}>
        {title && (
          <h3 className="text-xl font-semibold text-slate-100 mb-4">{title}</h3>
        )}
        {children}
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6 flex flex-col justify-between h-full relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl pointer-events-none select-none grayscale group-hover:grayscale-0">
        {icon}
      </div>
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="p-3 bg-slate-800/50 rounded-lg group-hover:bg-slate-800 transition-colors">
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 group-hover:from-emerald-400 group-hover:to-cyan-400 transition-all">{value}</h3>
      </div>
    </div>
  );
};

export default Card;