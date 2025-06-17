'use client';

import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative">
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="text-center">
            <div className="mb-4">
              <CheckCircle className="mx-auto text-green-500" size={64} />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Заказ успешно отправлен!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Спасибо за ваш заказ! Мы свяжемся с вами в ближайшее время для подтверждения.
            </p>
            
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Продолжить покупки
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 