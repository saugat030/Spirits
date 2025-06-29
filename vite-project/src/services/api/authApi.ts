import { useQuery } from "@tanstack/react-query";
import { ApiResponse, ProductData } from "../../types/api.types";
import API from "../axiosInstance";

export const useGetExpensesOverview = ({
  type,
  name,
}: {
  type?: string;
  name?: string;
}) => {
  return useQuery<ApiResponse<ProductData>, Error>({
    queryKey: ["products", name, type],
    queryFn: async (): Promise<ApiResponse<ProductData>> => {
      const params = new URLSearchParams();
      if (type && name) {
        params.append("type", type);
        params.append("name", name);
      }

      const queryString = params.toString();
      console.log("Fetching products.....", type, name);

      try {
        const response = await API.get(`/products?type,name`);
        // Validate response structure
        if (!response.data) {
          throw new Error("No data received from server");
        }
        console.log("Product data:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching expenses overview:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
