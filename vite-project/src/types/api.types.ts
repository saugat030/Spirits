export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export type ProductData = {
  id: number;
  name: string;
  image_link: string;
  description: string;
  quantity: number;
  type_id: number;
  type_name: string;
  price: number;
};
