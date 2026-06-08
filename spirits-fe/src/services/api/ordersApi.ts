import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiResponse, CreateOrderRequest, Order, OrderWithDetails, OrdersData } from "../../types/api.types";
import API from "../axiosInstance";
import axios, { AxiosError } from "axios";

export const useCreateOrder = () => {
  return useMutation<
    ApiResponse<Order>,
    Error,
    CreateOrderRequest
  >({
    mutationFn: async (data: CreateOrderRequest) => {
      try {
        const response = await API.post<ApiResponse<Order>>("/orders", data);
        return response.data;
      } catch (err: unknown) {
        let message = "Failed to create order";
        if (axios.isAxiosError(err)) {
          message = err.response?.data?.message || err.message || message;
        } else if (err instanceof Error) {
          message = err.message;
        }
        throw new Error(message);
      }
    },
  });
};

export const useGetMyOrders = (
  page: number = 1,
  limit: number = 10,
  status?: string,
  search?: string,
  sortBy?: "date" | "status",
  sortOrder?: "asc" | "desc",
  dateFrom?: string,
  dateTo?: string
) => {
  return useQuery<ApiResponse<OrdersData>, AxiosError<{ message?: string }>>({
    queryKey: ["my-orders", page, limit, status, search, sortBy, sortOrder, dateFrom, dateTo],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (status && status !== "all") params.set("status", status);
      if (search) params.set("search", search);
      if (sortBy) params.set("sortBy", sortBy);
      if (sortOrder) params.set("sortOrder", sortOrder);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      const response = await API.get<ApiResponse<OrdersData>>(`/orders/my-orders?${params.toString()}`);
      return response.data;
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useGetOrderById = (orderId: string | null) => {
  return useQuery<ApiResponse<OrderWithDetails>, AxiosError<{ message?: string }>>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const response = await API.get<ApiResponse<OrderWithDetails>>(`/orders/${orderId}`);
      return response.data;
    },
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });
};

export const useGetAdminOrders = (
  page: number = 1,
  limit: number = 10,
  status?: string,
  search?: string,
  sortBy?: "date" | "status",
  sortOrder?: "asc" | "desc"
) => {
  return useQuery<ApiResponse<OrdersData>, AxiosError<{ message?: string }>>({
    queryKey: ["admin-orders", page, limit, status, search, sortBy, sortOrder],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (status && status !== "all") params.set("status", status);
      if (search) params.set("search", search);
      if (sortBy) params.set("sortBy", sortBy);
      if (sortOrder) params.set("sortOrder", sortOrder);
      const response = await API.get<ApiResponse<OrdersData>>(`/orders/admin?${params.toString()}`);
      return response.data;
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useGetAdminOrderById = (orderId: string | null) => {
  return useQuery<ApiResponse<OrderWithDetails>, AxiosError<{ message?: string }>>({
    queryKey: ["admin-order", orderId],
    queryFn: async () => {
      const response = await API.get<ApiResponse<OrderWithDetails>>(`/orders/admin/${orderId}`);
      return response.data;
    },
    enabled: !!orderId,
    staleTime: 60 * 1000,
  });
};

export const useUpdateOrderStatus = () => {
  return useMutation<
    ApiResponse<Order>,
    AxiosError<{ message?: string }>,
    { orderId: string; status: string }
  >({
    mutationFn: async ({ orderId, status }) => {
      const response = await API.patch<ApiResponse<Order>>(`/orders/admin/${orderId}/status`, { status });
      return response.data;
    },
  });
};
