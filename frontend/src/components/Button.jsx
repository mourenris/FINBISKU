import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  loading = false, 
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-display font-semibold rounded-btn transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const isDisabled = disabled || loading;

  const variants = {
    primary: 'bg-finbisku-gold-400 hover:bg-finbisku-gold-500 text-white focus:ring-finbisku-gold-300',
    secondary: 'bg-finbisku-green-400 hover:bg-finbisku-green-500 text-white focus:ring-finbisku-green-300',
    outline: 'border-2 border-finbisku-gold-300 text-finbisku-gold-600 hover:bg-finbisku-gold-50 focus:ring-finbisku-gold-300',
    ghost: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600 focus:ring-neutral-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
  };

  const buttonStyle = isDisabled
    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
    : variants[variant] || variants.primary;

  return (
    <button
      type={type}
      className={`${baseStyles} ${buttonStyle} ${sizes[size]} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
