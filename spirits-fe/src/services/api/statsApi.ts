import { useQuery } from "@tanstack/react-query";
import API from "../axiosInstance";
import { AxiosError } from "axios";
import {
  NetSalesResponse,
  TotalProductsResponse,
  ProductSalesDetailsResponse,
} from "../../types/api.types";

export const useGetNetSales = () => {
  return useQuery<NetSalesResponse, AxiosError<{ message?: string }>>({
    queryKey: ["stats", "netSales"],
    queryFn: async (): Promise<NetSalesResponse> => {
      const response = await API.get("/stats/admin/net");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });
};

export const useGetTotalProducts = () => {
  return useQuery<TotalProductsResponse, AxiosError<{ message?: string }>>({
    queryKey: ["stats", "totalProducts"],
    queryFn: async (): Promise<TotalProductsResponse> => {
      const response = await API.get("/stats/admin/total");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });
};

export const useGetProductSalesDetails = () => {
  return useQuery<ProductSalesDetailsResponse, AxiosError<{ message?: string }>>({
    queryKey: ["stats", "productSalesDetails"],
    queryFn: async (): Promise<ProductSalesDetailsResponse> => {
      const response = await API.get("/stats/admin/product-details");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });
};
