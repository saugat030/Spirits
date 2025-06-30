import { useQuery } from "@tanstack/react-query";
import { ApiResponse, ProductData } from "../../types/api.types";
import API from "../axiosInstance";

export const useGetProducts = ({
  type,
  name,
}: {
  type?: string;
  name?: string;
}) => {
  return useQuery<ApiResponse<ProductData[]>, Error>({
    queryKey: ["products", name, type],
    queryFn: async (): Promise<ApiResponse<ProductData[]>> => {
      const params = new URLSearchParams();
      if (type) {
        params.append("type", type);
      }
      if (name) {
        params.append("name", name);
      }
      const queryString = params.toString();
      const url = queryString ? `/products?${queryString}` : "/products";

      console.log(
        "Log from getProducts hook Fetching products.....",
        type,
        name
      );

      try {
        const response = await API.get(url);
        // Validate response structure
        if (!response.data) {
          throw new Error("No data received from server");
        }
        console.log("Product data:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching Products", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 10 * 60 * 1000, // 10 min
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: true,
  });
};
