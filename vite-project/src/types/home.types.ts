import { ApiResponse, ProductData } from "./api.types";

export type NavType = {
  page: string;
};
export type WhyUsProps = {
  details: string;
  description: string;
};
export type ProductCardPropType = {
  imgSrc: string;
  name: string;
  price: number;
  id: number;
};
export type ClientsType = {
  name: string;
  imgid: number;
  role: string;
  review: string;
};
export type ShopByCategsProps = {
  category: string;
  setCateg: (value: string) => void;
};
export type MostPopularProps = {
  title: string;
  products: ApiResponse<ProductData[]> | undefined;
  error: any;
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
};
