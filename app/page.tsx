'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Product, Review } from '@/types';
import { fetchProducts, fetchReviews } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { ReviewCard } from '@/components/ReviewCard';
import { OrderForm } from '@/components/OrderForm';
import { SuccessModal } from '@/components/SuccessModal';
import { LoadingSpinner, LoadingCard } from '@/components/LoadingSpinner';
import { useCart } from '@/contexts/CartContext';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { totalItems, totalPrice } = useCart();
  const loadProducts = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      if (page === 1) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const response = await fetchProducts(page, 20);
      
      if (append) {
        setProducts(prev => [...prev, ...response.items]);
      } else {
        setProducts(response.items);
      }

      setHasMore(response.items.length === 20 && response.page * 20 < response.total);
      setCurrentPage(page);
    } catch (err) {
      console.error('Ошибка загрузки товаров:', err);
      setError('Ошибка при загрузке товаров. Попробуйте обновить страницу.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);
  const loadReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      setReviewsError(null);
      const reviewsData = await fetchReviews();
      setReviews(reviewsData);
    } catch (err) {
      console.error('Ошибка загрузки отзывов:', err);
      setReviewsError('Ошибка при загрузке отзывов');
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  const loadMoreProducts = useCallback(() => {
    if (!loadingMore && hasMore) {
      loadProducts(currentPage + 1, true);
    }
  }, [loadProducts, loadingMore, hasMore, currentPage]);
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop 
          >= document.documentElement.offsetHeight - 1000) {
        loadMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreProducts]);

  useEffect(() => {
    loadProducts(1);
    loadReviews();
  }, [loadProducts, loadReviews]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Интернет-магазин
            </h1>
            
            {totalItems > 0 && (
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
                <span className="font-medium">
                  В корзине: {totalItems} товар(ов) на {totalPrice.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Отзывы покупателей
              </h2>
              
              {reviewsError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {reviewsError}
                  <button 
                    onClick={loadReviews}
                    className="ml-2 underline hover:no-underline"
                  >
                    Попробовать снова
                  </button>
                </div>
              )}

              {reviewsLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                  <span className="ml-2 text-gray-600">Загружаем отзывы...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                  {reviews.map(review => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                  {reviews.length === 0 && !reviewsError && (
                    <div className="text-center text-gray-500 py-8 col-span-2">
                      Отзывов пока нет
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="lg:hidden mb-8">
              <OrderForm onOrderSuccess={() => setShowSuccessModal(true)} />
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Каталог товаров
              </h2>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                  <button 
                    onClick={() => loadProducts(1)}
                    className="ml-2 underline hover:no-underline"
          >
                    Попробовать снова
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
                
                {(loading || loadingMore) && (
                  <>
                    {Array.from({ length: loading ? 6 : 2 }).map((_, index) => (
                      <LoadingCard key={`loading-${index}`} />
                    ))}
                  </>
                )}
              </div>

              {loadingMore && (
                <div className="flex justify-center mt-6">
                  <LoadingSpinner />
                  <span className="ml-2 text-gray-600">Загружаем еще товары...</span>
                </div>
              )}

              {!hasMore && products.length > 0 && (
                <div className="text-center text-gray-500 mt-6">
                  Все товары загружены
                </div>
              )}
            </div>


          </div>

          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-4">
              <OrderForm onOrderSuccess={() => setShowSuccessModal(true)} />
            </div>
          </div>
        </div>
      </main>

              <SuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
          />
    </div>
  );
}
