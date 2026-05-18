import { useQuery } from "@tanstack/react-query";
import API from "../axiosInstance";
import { AxiosError } from "axios";
import {
  NetSalesResponse,
  TotalProductsResponse,
  ProductSalesDetailsResponse,
  RevenueTrendsResponse,
  OrderStatusDistributionResponse,
  CategoryStatsResponse
} from "../../types/api.types";

export const useGetNetSales = (period: string = '30d') => {
  return useQuery<NetSalesResponse, AxiosError<{ message?: string }>>({
    queryKey: ["stats", "netSales", period],
    queryFn: async (): Promise<NetSalesResponse> => {
      const response = await API.get(`/stats/admin/net?period=${period}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });
};

export const useGetTotalProducts = (period: string = '30d') => {
  return useQuery<TotalProductsResponse, AxiosError<{ message?: string }>>({
    queryKey: ["stats", "totalProducts", period],
    queryFn: async (): Promise<TotalProductsResponse> => {
      const response = await API.get(`/stats/admin/total?period=${period}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });
};

export const useGetProductSalesDetails = (period: string = '30d') => {
  return useQuery<ProductSalesDetailsResponse, AxiosError<{ message?: string }>>({
    queryKey: ["stats", "productSalesDetails", period],
    queryFn: async (): Promise<ProductSalesDetailsResponse> => {
      const response = await API.get(`/stats/admin/product-details?period=${period}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });
};

export const useGetRevenueTrends = (period: string = '30d') => {
  return useQuery<RevenueTrendsResponse, AxiosError<{ message?: string }>>({
    queryKey: ["stats", "revenueTrends", period],
    queryFn: async (): Promise<RevenueTrendsResponse> => {
      const response = await API.get(`/stats/admin/revenue-trends?period=${period}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });
};

export const useGetOrderStatusDistribution = (period: string = '30d') => {
  return useQuery<OrderStatusDistributionResponse, AxiosError<{ message?: string }>>({
    queryKey: ["stats", "orderStatusDistribution", period],
    queryFn: async (): Promise<OrderStatusDistributionResponse> => {
      const response = await API.get(`/stats/admin/order-stats?period=${period}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });
};

export const useGetCategoryStats = () => {
  return useQuery<CategoryStatsResponse, AxiosError<{ message?: string }>>({
    queryKey: ["stats", "categoryStats"],
    queryFn: async (): Promise<CategoryStatsResponse> => {
      const response = await API.get(`/stats/admin/category-stats`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });
};
