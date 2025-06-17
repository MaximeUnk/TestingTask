'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Product } from '@/types';
import { saveCartToStorage, loadCartFromStorage } from '@/lib/storage';

type CartAction =
  | { type: 'ADD_TO_CART'; product: Product }
  | { type: 'REMOVE_FROM_CART'; productId: number }
  | { type: 'UPDATE_QUANTITY'; productId: number; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; cart: CartItem[] };

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

interface CartContextType extends CartState {
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.productId === action.product.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map(item =>
          item.productId === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, {
          productId: action.product.id,
          product: action.product,
          quantity: 1
        }];
      }
      
      return calculateTotals(newItems);
    }
    
    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.productId !== action.productId);
      return calculateTotals(newItems);
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        const newItems = state.items.filter(item => item.productId !== action.productId);
        return calculateTotals(newItems);
      }
      
      const newItems = state.items.map(item =>
        item.productId === action.productId
          ? { ...item, quantity: action.quantity }
          : item
      );
      return calculateTotals(newItems);
    }
    
    case 'CLEAR_CART':
      return { items: [], totalItems: 0, totalPrice: 0 };
    
    case 'LOAD_CART':
      return calculateTotals(action.cart);
    
    default:
      return state;
  }
};

const calculateTotals = (items: CartItem[]): CartState => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  return { items, totalItems, totalPrice };
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const savedCart = loadCartFromStorage();
    if (savedCart.length > 0) {
      dispatch({ type: 'LOAD_CART', cart: savedCart });
    }
  }, []);

  useEffect(() => {
    saveCartToStorage(state.items);
  }, [state.items]);
  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', product });
  };

  const removeFromCart = (productId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', productId });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const value: CartContextType = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 