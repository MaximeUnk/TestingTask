export interface Product {
  id: number;
  image_url: string;
  title: string;
  description: string;
  price: number;
}

export interface Review {
  id: number;
  text: string;
}

export interface ProductsResponse {
  page: number;
  amount: number;
  total: number;
  items: Product[];
}

export interface CartItem {
  productId: number;
  product: Product;
  quantity: number;
}

export interface OrderData {
  phone: string;
  cart: Array<{
    id: number;
    quantity: number;
  }>;
}

export interface ApiResponse<T> {
  success: number;
  data?: T;
  error?: string;
} 