import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, UpdateProfileRequest, UserProfile, UpdateUserRequest } from "../../types/api.types";
import API from "../axiosInstance";
import { AxiosError } from "axios";

export const useUpdateProfile = () => {
  return useMutation<
    ApiResponse<UserProfile>,
    AxiosError<{ message?: string }>,
    UpdateProfileRequest
  >({
    mutationFn: async (data: UpdateProfileRequest): Promise<ApiResponse<UserProfile>> => {
      const response = await API.patch<ApiResponse<UserProfile>>(`/users/profile`, data);
      return response.data;
    },
  });
};

export const useGetUsers = () => {
  return useQuery<ApiResponse<UserProfile[]>, AxiosError<{ message?: string }>>({
    queryKey: ["users"],
    queryFn: async (): Promise<ApiResponse<UserProfile[]>> => {
      const response = await API.get<ApiResponse<UserProfile[]>>(`/users/admin`);
      return response.data;
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<UserProfile>,
    AxiosError<{ message?: string }>,
    { id: string; data: UpdateUserRequest }
  >({
    mutationFn: async ({ id, data }): Promise<ApiResponse<UserProfile>> => {
      const response = await API.patch<ApiResponse<UserProfile>>(`/users/admin/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useSoftDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<UserProfile>, AxiosError<{ message?: string }>, string>({
    mutationFn: async (id: string): Promise<ApiResponse<UserProfile>> => {
      const response = await API.delete<ApiResponse<UserProfile>>(`/users/admin/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useHardDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, AxiosError<{ message?: string }>, string>({
    mutationFn: async (id: string): Promise<ApiResponse<null>> => {
      const response = await API.delete<ApiResponse<null>>(`/users/admin/${id}/hard`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
