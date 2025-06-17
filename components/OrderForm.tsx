'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Phone } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { submitOrder } from '@/lib/api';
import { savePhoneToStorage, loadPhoneFromStorage, clearStorageData } from '@/lib/storage';
import toast from 'react-hot-toast';

interface OrderFormProps {
  onOrderSuccess: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ onOrderSuccess }) => {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    const savedPhone = loadPhoneFromStorage();
    setPhone(savedPhone);
  }, []);

  useEffect(() => {
    savePhoneToStorage(phone);
  }, [phone]);

  const validatePhone = (phoneNumber: string): boolean => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    return cleanPhone.length === 11;
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 11);
    if (limited.length === 0) return '';
    if (limited.length <= 1) return `+${limited}`;
    if (limited.length <= 4) return `+${limited.slice(0, 1)} (${limited.slice(1)}`;
    if (limited.length <= 7) return `+${limited.slice(0, 1)} (${limited.slice(1, 4)}) ${limited.slice(4)}`;
    if (limited.length <= 9) return `+${limited.slice(0, 1)} (${limited.slice(1, 4)}) ${limited.slice(4, 7)}-${limited.slice(7)}`;
    return `+${limited.slice(0, 1)} (${limited.slice(1, 4)}) ${limited.slice(4, 7)}-${limited.slice(7, 9)}-${limited.slice(9)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatPhone(inputValue);
    setPhone(formatted);
    
    if (phoneError) {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Корзина пуста. Добавьте товары для оформления заказа.');
      return;
    }

    if (!validatePhone(phone)) {
      setPhoneError('Введите корректный номер телефона');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        phone: phone.replace(/\D/g, ''),
        cart: items.map(item => ({
          id: item.productId,
          quantity: item.quantity
        }))
      };

      const result = await submitOrder(orderData);

      if (result.success) {
        toast.success('Заказ успешно отправлен!');
        
        clearCart();
        clearStorageData();
        setPhone('');
        
        onOrderSuccess();
      } else {
        toast.error(result.error || 'Произошла ошибка при отправке заказа');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Ошибка соединения с сервером');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Добавленные товары
      </h2>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700">Товаров в корзине:</span>
          <span className="font-semibold">{totalItems} шт.</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Общая стоимость:</span>
          <span className="text-xl font-bold text-blue-600">
            {totalPrice.toLocaleString('ru-RU')} ₽
          </span>
        </div>
      </div>

      {items.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Ваши товары:</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {items.map(item => (
              <div key={item.productId} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.product.title}</h4>
                  <p className="text-gray-600 text-xs">
                    {item.product.price.toLocaleString('ru-RU')} ₽ × {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-semibold">
                    {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="inline mr-1" size={16} />
            Номер телефона *
          </label>
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              phoneError ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+7 (___) ___-__-__"
            id="phone"
          />
          {phoneError && (
            <p className="mt-1 text-sm text-red-600">{phoneError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || items.length === 0}
          className={`w-full py-3 px-4 rounded font-semibold text-white transition-colors duration-200 uppercase text-sm ${
            isSubmitting || items.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gray-900 hover:bg-gray-800'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Отправка заказа...
            </div>
          ) : (
            'заказать'
          )}
        </button>
      </form>

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
          <p>Корзина пуста</p>
          <p className="text-sm">Добавьте товары для оформления заказа</p>
        </div>
      )}
    </div>
  );
}; 