import { ApiResponse, Product } from "./api.types";

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
  type: string;
  id: string;
};

export type ClientsType = {
  name: string;
  profileImageSrc: string;
  role: string;
  review: string;
};

export type ShopByCategsProps = {
  category: string;
  setCateg: (value: string) => void;
};

export type MostPopularProps = {
  title: string;
  products: ApiResponse<Product[]> | undefined;
  error: any;
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
};
