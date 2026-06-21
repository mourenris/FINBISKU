import React from 'react';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action, // optional action button
  className = ''
}) => {
  return (
    <div className={`text-center p-12 bg-white rounded-card border-2 border-dashed border-neutral-200 ${className}`}>
      {Icon && (
        <div className="mx-auto w-16 h-16 bg-finbisku-gold-100 text-finbisku-gold-600 rounded-full flex items-center justify-center mb-4">
          <Icon className="h-8 w-8" />
        </div>
      )}
      <h3 className="text-lg font-bold font-display text-neutral-700 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-400 max-w-xs mx-auto leading-relaxed mb-4">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
