'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { items, addToCart, updateQuantity } = useCart();
  
  const cartItem = items.find(item => item.productId === product.id);
  const quantity = cartItem?.quantity || 0;
  
  const [inputValue, setInputValue] = useState(quantity.toString());

  React.useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);
  const handleAddToCart = () => {
    addToCart(product);
    setInputValue('1');
  };

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    updateQuantity(product.id, newQuantity);
    setInputValue(newQuantity.toString());
  };
  const handleDecrease = () => {
    const newQuantity = Math.max(0, quantity - 1);
    updateQuantity(product.id, newQuantity);
    if (newQuantity === 0) {
      setInputValue('0');
    } else {
      setInputValue(newQuantity.toString());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (/^\d*$/.test(value)) {
      setInputValue(value);
      
      const numValue = parseInt(value) || 0;
      if (numValue >= 0) {
        updateQuantity(product.id, numValue);
      }
    }
  };
  const handleInputBlur = () => {
    const numValue = parseInt(inputValue) || 0;
    setInputValue(numValue.toString());
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full bg-gray-100">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={product.image_url?.includes('placehold.co') || false}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.placeholder-content')) {
                const placeholder = document.createElement('div');
                placeholder.className = 'placeholder-content absolute inset-0 flex items-center justify-center bg-gray-100';
                placeholder.innerHTML = `
                  <div class="text-center text-gray-500">
                    <div class="text-4xl mb-2">📷</div>
                    <div class="text-sm">Изображение недоступно</div>
                  </div>
                `;
                parent.appendChild(placeholder);
              }
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📷</div>
              <div className="text-sm">Изображение недоступно</div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            {product.price.toLocaleString('ru-RU')} ₽
          </span>
          
          {quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded font-medium transition-colors duration-200 uppercase text-sm"
            >
              купить
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDecrease}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors duration-200"
              >
                <Minus size={16} />
              </button>
              
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="w-12 text-center border border-gray-300 rounded px-2 py-1 text-sm"
                min="0"
              />
              
              <button
                onClick={handleIncrease}
                className="w-8 h-8 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors duration-200"
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 