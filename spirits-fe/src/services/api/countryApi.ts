import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../../types/api.types";
import API from "../axiosInstance";
import { AxiosError } from "axios";

export interface Country {
  id: string;
  name: string;
  phone_code: string;
}

export const useGetCountries = () => {
  return useQuery<ApiResponse<Country[]>, AxiosError<{ message?: string }>>({
    queryKey: ["countries"],
    queryFn: async (): Promise<ApiResponse<Country[]>> => {
      const url = `/countries`;
      const response = await API.get(url);
      return response.data;
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });
};