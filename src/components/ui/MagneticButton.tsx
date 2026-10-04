import React, { useState } from 'react';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'glass' | 'glow';
  strength?: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  onClick,
  disabled,
  ...props
}) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    setClicked(true);
    setTimeout(() => setClicked(false), 200);
    if (onClick) {
      onClick(e);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] border border-cyan-400/40 hover:border-cyan-300';
      case 'secondary':
        return 'bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.55)] border border-violet-400/40 hover:border-violet-300';
      case 'glow':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] hover:bg-emerald-500/30';
      case 'glass':
      default:
        return 'bg-slate-900/80 hover:bg-slate-800 text-slate-100 border border-white/10 hover:border-cyan-400/40 backdrop-blur-xl shadow-lg';
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`group relative overflow-hidden rounded-xl font-medium tracking-wide transition-all duration-200 ease-out transform cursor-pointer select-none active:scale-[0.97] hover:scale-[1.02] ${
        clicked ? 'scale-[0.97]' : ''
      } ${
        disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
      } ${getVariantStyles()} ${className}`}
      {...props}
    >
      {/* Subtle shine sweep on hover */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};

