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