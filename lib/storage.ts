import { CartItem } from '@/types';

const CART_KEY = 'online-store-cart';
const PHONE_KEY = 'online-store-phone';
export const saveCartToStorage = (cart: CartItem[]): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Ошибка при сохранении корзины:', error);
    }
  }
};

export const loadCartFromStorage = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Ошибка при загрузке корзины:', error);
      return [];
    }
  }
  return [];
};

export const savePhoneToStorage = (phone: string): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PHONE_KEY, phone);
    } catch (error) {
      console.error('Ошибка при сохранении телефона:', error);
    }
  }
};

export const loadPhoneFromStorage = (): string => {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(PHONE_KEY) || '';
    } catch (error) {
      console.error('Ошибка при загрузке телефона:', error);
      return '';
    }
  }
  return '';
};

export const clearStorageData = (): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(CART_KEY);
      localStorage.removeItem(PHONE_KEY);
    } catch (error) {
      console.error('Ошибка при очистке данных:', error);
    }
  }
}; 