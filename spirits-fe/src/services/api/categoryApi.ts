import { useQuery } from "@tanstack/react-query";
import { ApiResponse, Category } from "../../types/api.types";
import API from "../axiosInstance";
import { AxiosError } from "axios";

export const useGetCategories = () => {
  return useQuery<ApiResponse<Category[]>, AxiosError<{ message?: string }>>({
    queryKey: ["categories"],
    queryFn: async (): Promise<ApiResponse<Category[]>> => {
      const url = `/categories`;
      const response = await API.get(url);
      console.log("Category data:(log from query function)", response.data);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });
};

export const useGetCategoryById = (id: string | null) => {
  return useQuery<ApiResponse<Category>, Error>({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id as string),
    enabled: !!id, // Only run query if id is provided
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });
};

export const getCategoryById = async (
  id: string
): Promise<ApiResponse<Category>> => {
  if (!id) {
    throw new Error("Category ID is required");
  }
  const url = `/categories/${id}`;
  console.log("Fetching category with ID:", id);
  const response = await API.get(url);
  console.log("Category by ID data:", response.data);
  return response.data;
};
