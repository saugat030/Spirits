import { useQuery } from "@tanstack/react-query";
import { ApiResponse, ProductData } from "../../types/api.types";
import API from "../axiosInstance";

//If no type or name provided , it returns all the products
export const useGetProducts = ({
  type,
  name,
  page = 1,
  limit = 12,
}: {
  type?: string | null;
  name?: string | null;
  page?: number | null;
  limit?: number | null;
}) => {
  return useQuery<ApiResponse<ProductData[]>, Error>({
    queryKey: ["products", { name, type, page, limit }],
    queryFn: async (): Promise<ApiResponse<ProductData[]>> => {
      const params = new URLSearchParams();

      if (type) params.append("type", type);
      if (name) params.append("name", name);
      if (page !== null) params.append("page", page.toString());
      if (limit !== null) params.append("limit", limit.toString());

      const queryString = params.toString();
      const url = `/products?${queryString}`;

      console.log("Fetching products with:", { type, name, page, limit });

      try {
        const response = await API.get(url);

        if (!response.data) {
          throw new Error("No data received from server");
        }

        console.log("Product data:", response.data);
        return response.data;
      } catch (error) {
        //Axios catches all the responses with status 200 bahek as error and the axios error is an object that contains a message , response etc fields. To access the backend's message , error.response.data.message
        //throwing that error makes it so that the error is caught by the useQuery's "error".
        console.log("Error fetching Products", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });
};

export const useGetProductById = (id: string | null) => {
  return useQuery<ApiResponse<ProductData>, Error>({
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

//utility function for fetching by ID since this needs to be used in the cart page to fetch multiple IDs.
export const getProductById = async (
  id: string
): Promise<ApiResponse<ProductData>> => {
  if (!id) {
    throw new Error("Product ID is required");
  }

  const url = `/products/${id}`;
  console.log("Fetching product with ID:", id);

  try {
    const response = await API.get(url);
    if (!response.data) {
      throw new Error("No data received from server");
    }
    console.log("Product by ID data:", response.data);
    return response.data;
  } catch (error: any) {
    // axios catches all the responses with status 200 bahek as error and the axios error is an object that contains a message, response etc fields. To access the backend's message, error.response.data.message
    // throwing that error makes it so that the error is caught by the useQuery's "error".
    console.log("Error fetching Product by ID", error);
    throw new Error(
      error.response.data.message || "Error fetching the product"
    );
  }
};
