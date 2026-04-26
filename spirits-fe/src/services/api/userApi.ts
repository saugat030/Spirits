import { useMutation } from "@tanstack/react-query";
import { ApiResponse, UpdateProfileRequest, UserProfile } from "../../types/api.types";
import API from "../axiosInstance";
import { AxiosError } from "axios";

export const useUpdateProfile = () => {
  return useMutation<
    ApiResponse<UserProfile>,
    AxiosError<{ message?: string }>,
    UpdateProfileRequest
  >({
    mutationFn: async (data: UpdateProfileRequest): Promise<ApiResponse<UserProfile>> => {
      const response = await API.patch<ApiResponse<UserProfile>>(`/user/profile`, data);
      return response.data;
    },
  });
};
