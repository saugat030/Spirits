import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiResponse, CreateOrderRequest, Order, OrderWithDetails } from "../../types/api.types";
import API from "../axiosInstance";
import { AxiosError } from "axios";

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
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to create order";
        throw new Error(message);
      }
    },
  });
};

export const useGetMyOrders = () => {
  return useQuery<ApiResponse<Order[]>, AxiosError<{ message?: string }>>({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const response = await API.get<ApiResponse<Order[]>>("/orders/my-orders");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
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

export const useGetAdminOrders = (page: number = 1, limit: number = 10, status?: string) => {
  return useQuery<ApiResponse<Order[]>, AxiosError<{ message?: string }>>({
    queryKey: ["admin-orders", page, limit, status],
    queryFn: async () => {
      let url = `/orders/admin?page=${page}&limit=${limit}`;
      if (status && status !== 'all') {
        url += `&status=${status}`;
      }
      const response = await API.get<ApiResponse<Order[]>>(url);
      return response.data;
    },
    staleTime: 60 * 1000, // 1 minute
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
