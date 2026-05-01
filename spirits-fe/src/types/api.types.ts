export type AuthResponse = {
  success: boolean;
  message: string;
}
export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone_number: string | null;
  country: string | null;
  address: string | null;
  is_verified: boolean;
  is_active: boolean;
}
export interface LoginPayload {
  email: string;
  password: string;
}
export interface SignupPayload extends LoginPayload {
  username: string;
}

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
  filters?: Filters
};
export interface Category {
  id: string;
  category_name: string;
  category_image_url: string;
}

export type Filters = {
  type: string | null;
  name: string | null;
  minPrice: number | null;
  maxPrice: number | null;
}

export interface ImageType {
  url: string;
  alt_text: string;
}

export interface Promotion {
  id: string;
  name: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  endDate: string;
}


export interface ProductVariant {
  liquorId: string;
  id: string;
  size: string;
  sku: string;
  price: number;
  inventoryQuantity: number;
  variantImage: ImageType;
  promotions: Promotion[];
  discountedPrice: number;
}

export interface Product {
  id: string;
  name: string;
  thumbnail_url: string;
  images: ImageType[];
  description: string;
  categoryId: string;
  categoryName: string;
  variants: ProductVariant[];
  minDiscountedPrice: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'stripe' | 'esewa' | 'paypal';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  originalPrice: number;
  priceAtPurchase: number;
  discountAmount: number;
  appliedPromotionId?: string;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}
export interface OrderWithDetails extends Order {
  items: OrderItem[];
}
export interface CreateOrderRequest {
  items: { variantId: string; quantity: number }[];
  shippingAddress: string;
  paymentMethod: PaymentMethod;
}

export interface UpdateProfileRequest {
  name?: string;
  phone_number?: string;
  country?: string;
  address?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
  is_verified?: boolean;
  is_active?: boolean;
  phone_number?: string;
  country?: string;
  address?: string;
}

export interface NetSalesResponse {
  success: boolean;
  netSales: number;
}

export interface TotalProductsResponse {
  success: boolean;
  totalProducts: number;
}

export interface ProductSalesDetails {
  productId: string;
  productName: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export interface ProductSalesDetailsResponse {
  success: boolean;
  data: ProductSalesDetails[];
}