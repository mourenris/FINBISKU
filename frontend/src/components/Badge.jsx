import React from 'react';

const Badge = ({ children, variant = 'neutral', className = '' }) => {
  const variants = {
    neutral: 'bg-neutral-200 text-neutral-800 border border-neutral-300/50',
    gold: 'bg-[#d4a830] text-[#0f3d2b] border border-[#d4a830]/30 font-bold shadow-sm',
    green: 'bg-[#1a5c38] text-white border border-[#1a5c38]/30 font-bold shadow-sm',
    red: 'bg-[#fdecea] text-[#dc2626] border border-[#dc2626]/30 font-bold',
    blue: 'bg-blue-600 text-white border border-blue-700/30 font-bold shadow-sm',
    // compatibility aliases
    gray: 'bg-neutral-200 text-neutral-800 border border-neutral-300/50',
    primary: 'bg-[#d4a830] text-[#0f3d2b] border border-[#d4a830]/40 font-bold shadow-sm',
    success: 'bg-[#1a5c38] text-white border border-[#1a5c38]/40 font-bold shadow-sm',
    danger: 'bg-red-650 bg-[#dc2626] text-white border border-[#dc2626]/30 font-bold shadow-sm',
    warning: 'bg-[#d4a830] text-[#0f3d2b] border border-[#d4a830]/40 font-bold shadow-sm',
    
    // Explicit high-contrast solid/semi-solid variants for category tagging
    'gold-solid': 'bg-[#d4a830] text-white border border-[#d4a830]/50 font-bold shadow-md backdrop-blur-md',
    'green-solid': 'bg-[#1a5c38] text-white border border-[#1a5c38]/50 font-bold shadow-md backdrop-blur-md',
    'blue-solid': 'bg-[#0284c7] text-white border border-[#0284c7]/50 font-bold shadow-md backdrop-blur-md',
    'purple-solid': 'bg-[#7c3aed] text-white border border-[#7c3aed]/50 font-bold shadow-md backdrop-blur-md',
    'amber-solid': 'bg-[#d97706] text-white border border-[#d97706]/50 font-bold shadow-md backdrop-blur-md',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${variants[variant] || variants.neutral} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
