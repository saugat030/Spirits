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

export type Filters = {
  type: string | null;
  name: string | null;
  minPrice: number | null;
  maxPrice: number | null;
}

export type Product = {
  id: string;
  name: string;
  sku?: string;
  imageLink: string;
  description: string;
  quantity: number;
  typeId: number;
  typeName: string;
  price: number;
};
