import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertCircle } from 'lucide-react';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Hapus', 
  cancelText = 'Batal',
  variant = 'danger',
  children
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`p-3 rounded-full ${variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-finbisku-gold-100 text-finbisku-gold-600'}`}>
          <AlertCircle className="h-6 w-6" />
        </div>
        <p className="text-neutral-600 font-body">{message}</p>
        {children}
        <div className="flex w-full space-x-3 mt-4">
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant={variant} className="flex-1" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
