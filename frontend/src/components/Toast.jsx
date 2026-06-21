import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-finbisku-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    info: <Info className="h-5 w-5 text-finbisku-gold-500" />,
  };

  const bgColors = {
    success: 'bg-finbisku-green-100 border-finbisku-green-300',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-finbisku-neutral-50 border-finbisku-neutral-200',
  };

  return (
    <div className={`fixed bottom-4 right-4 z-[100] flex items-center p-4 border-[1.5px] rounded-2xl shadow-md animate-in slide-in-from-right font-display ${bgColors[type]}`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="ml-3 mr-8 text-sm font-semibold text-finbisku-neutral-800">{message}</div>
      <button onClick={onClose} className="p-1 hover:bg-finbisku-neutral-100/50 rounded-btn transition-colors">
        <X className="h-4 w-4 text-finbisku-neutral-500" />
      </button>
    </div>
  );
};

export default Toast;
