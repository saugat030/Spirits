import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import { AuthResponse, LoginPayload, SignupPayload } from "../../types/api.types";
import { AxiosError } from "axios";


export const useLogin = () => {
  return useMutation<AuthResponse, AxiosError<{ message?: string }>, LoginPayload>({
    mutationFn: async (data: LoginPayload): Promise<AuthResponse> => {
      const response = await axiosInstance.post(`/auth/login`, {
        email: data.email,
        password: data.password,
      });
      return response.data;
    },
  });
};

export const useSignup = () => {
  return useMutation<AuthResponse, AxiosError<{ message?: string }>, SignupPayload>({
    mutationFn: async (data: SignupPayload): Promise<AuthResponse> => {
      const response = await axiosInstance.post(`/auth/signup`, {
        name: data.username,
        email: data.email,
        password: data.password,
      });
      return response.data;
    },
  });
};
