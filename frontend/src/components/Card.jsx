import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle, 
  footer, 
  badge, 
  badgeColor = 'gold', // gold, green, red, blue
  className = '', 
  noPadding = false 
}) => {
  const badgeColors = {
    gold: 'bg-finbisku-gold-100 text-finbisku-gold-600',
    green: 'bg-finbisku-green-100 text-finbisku-green-600',
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600'
  };

  return (
    <div className={`bg-white rounded-card border border-neutral-200 hover:shadow-md transition-shadow duration-200 ${noPadding ? '' : 'p-5'} ${className} relative`}>
      {badge && (
        <div className="absolute top-5 right-5">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeColors[badgeColor] || badgeColors.gold}`}>
            {badge}
          </span>
        </div>
      )}
      
      {(title || subtitle) && (
        <div className={`border-b border-neutral-100 pb-3 mb-4 ${badge ? 'pr-16' : ''}`}>
          {title && <h3 className="text-lg font-bold font-display text-neutral-800">{title}</h3>}
          {subtitle && <p className="text-sm text-neutral-400 mt-0.5">{subtitle}</p>}
        </div>
      )}
      
      <div>
        {children}
      </div>
      
      {footer && (
        <div className="border-t border-neutral-100 pt-4 mt-4 text-sm text-neutral-500">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
