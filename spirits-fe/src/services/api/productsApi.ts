import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, Product, ProductVariant } from "../../types/api.types";
import API from "../axiosInstance";
import { AxiosError } from "axios";

export const useGetProducts = ({
  category,
  name,
  minPrice,
  maxPrice,
  page = 1,
  limit = 12,
}: {
  category?: string | string[] | null;
  name?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  page?: number | null;
  limit?: number | null;
}) => {
  return useQuery<ApiResponse<Product[]>, AxiosError<{ message?: string }>>({
    queryKey: ["products", { name, category, minPrice, maxPrice, page, limit }],
    queryFn: async (): Promise<ApiResponse<Product[]>> => {
      const params = new URLSearchParams();
      //handle category parameter (single or multiple)
      if (category) {
        if (Array.isArray(category)) {
          category.forEach((c) => params.append("category", c));
        } else {
          params.append("category", category);
        }
      }
      if (name) params.append("name", name);
      if (minPrice !== null && minPrice !== undefined)
        params.append("minPrice", minPrice.toString());
      if (maxPrice !== null && maxPrice !== undefined)
        params.append("maxPrice", maxPrice.toString());
      if (page) params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());
      const queryString = params.toString();
      const url = `/products?${queryString}`;
      //axios catches all the responses with status 200 bahek as error and the axios error is an object that contains a message , response etc fields. To access the backend's message , error.response.data.message
      const response = await API.get(url);
      console.log("Product data:(log from query function)", response.data);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });
};

export const useGetProductById = (id: string | null) => {
  return useQuery<ApiResponse<Product>, Error>({
    queryKey: ["product", id],
    queryFn: () => getProductById(id as string),
    enabled: !!id, // Only run query if id is provided
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });
};

export const getProductById = async (
  id: string
): Promise<ApiResponse<Product>> => {
  if (!id) {
    throw new Error("Product ID is required");
  }
  const url = `/products/${id}`;
  console.log("Fetching product with ID:", id);
  const response = await API.get(url);
  console.log("Product by ID data:", response.data);
  return response.data;
};

// --- Admin Mutations ---
export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Product>, AxiosError<{ message?: string }>, FormData>({
    mutationFn: async (data: FormData) => {
      const response = await API.post("/products/admin", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Product>, AxiosError<{ message?: string }>, { id: string; data: FormData }>({
    mutationFn: async ({ id, data }) => {
      const response = await API.put(`/products/admin/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, AxiosError<{ message?: string }>, string>({
    mutationFn: async (id: string) => {
      const response = await API.delete(`/products/admin/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useAddVariant = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<ProductVariant>, AxiosError<{ message?: string }>, { productId: string; data: FormData }>({
    mutationFn: async ({ productId, data }) => {
      const response = await API.post(`/products/admin/${productId}/variants`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateVariant = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<ProductVariant>, AxiosError<{ message?: string }>, { variantId: string; productId: string; data: FormData }>({
    mutationFn: async ({ variantId, data }) => {
      const response = await API.put(`/products/admin/variants/${variantId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteVariant = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, AxiosError<{ message?: string }>, { variantId: string; productId: string }>({
    mutationFn: async ({ variantId }) => {
      const response = await API.delete(`/products/admin/variants/${variantId}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
