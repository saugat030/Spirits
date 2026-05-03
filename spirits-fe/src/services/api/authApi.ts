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

// sends verification email to the user and creates a new user in the database with isVerified set to false. The user will be able to login but will have limited access until they verify their email
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

// route to verify the email.
export const useVerifyEmail = () => {
  return useMutation<AuthResponse, AxiosError<{ message?: string }>, { otp: string }>({
    mutationFn: async (data: { otp: string }): Promise<AuthResponse> => {
      const response = await axiosInstance.post(`/auth/verify-email`, {
        otp: data.otp,
      });
      return response.data;
    },
  });
};

// route to request a new verification OTP manually
export const useSendVerificationOtp = () => {
  return useMutation<AuthResponse, AxiosError<{ message?: string }>, void>({
    mutationFn: async (): Promise<AuthResponse> => {
      const response = await axiosInstance.post(`/auth/send-verification-otp`);
      return response.data;
    },
  });
};

export const useForgotPassword = () => {
  return useMutation<AuthResponse, AxiosError<{ message?: string }>, { email: string }>({
    mutationFn: async (data: { email: string }): Promise<AuthResponse> => {
      const response = await axiosInstance.post(`/auth/forgot-password`, {
        email: data.email,
      });
      return response.data;
    },
  });
};

export const useResetPassword = () => {
  return useMutation<
    AuthResponse,
    AxiosError<{ message?: string }>,
    { email: string; otp: string; newPassword: string }
  >({
    mutationFn: async (data): Promise<AuthResponse> => {
      const response = await axiosInstance.post(`/auth/reset-password`, data);
      return response.data;
    },
  });
};

export const useChangePassword = () => {
  return useMutation<AuthResponse, AxiosError<{ message?: string }>, { currentPassword: string; newPassword: string }>({
    mutationFn: async (data): Promise<AuthResponse> => {
      const response = await axiosInstance.post(`/auth/change-password`, data);
      return response.data;
    },
  });
};

export const useGoogleLogin = () => {
  return useMutation<AuthResponse, AxiosError<{ message?: string }>, { idToken: string }>({
    mutationFn: async (data): Promise<AuthResponse> => {
      const response = await axiosInstance.post(`/auth/google`, data);
      return response.data;
    },
  });
};
