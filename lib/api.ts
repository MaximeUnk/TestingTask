import { Product, ProductsResponse, Review, OrderData } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchProducts(page: number = 1, pageSize: number = 20): Promise<ProductsResponse> {
  try {
    const response = await fetch(`${API_BASE}/products?page=${page}&page_size=${pageSize}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
    throw error;
  }
}

export async function fetchReviews(): Promise<Review[]> {
  try {
    const response = await fetch(`${API_BASE}/reviews`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка при загрузке отзывов:', error);
    throw error;
  }
}

export async function submitOrder(orderData: OrderData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    const data = await response.json();
    
    if (data.success === 1) {
      return { success: true };
    } else {
      return { success: false, error: data.error || 'Произошла ошибка при отправке заказа' };
    }
  } catch (error) {
    console.error('Ошибка при отправке заказа:', error);
    return { success: false, error: 'Ошибка соединения с сервером' };
  }
} 