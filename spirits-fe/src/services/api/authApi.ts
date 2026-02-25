import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

interface AuthData {
  email: string;
  password: string;
}
interface SignupData extends AuthData {
  username: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
}

export const useLogin = () => {
  return useMutation<AuthResponse, Error, AuthData>({
    mutationFn: async (data: AuthData): Promise<AuthResponse> => {
      console.log(
        "Email and password received by the mutation function:",
        data
      );
      try {
        const response = await axiosInstance.post(`/auth/login`, {
          email: data.email,
          password: data.password,
        });
        return response.data;
      } catch (error: any) {
        //Axios catches all the responses with status 200 bahek as error and the axios error is an object that contains a message , response etc fields. To access the backend's message , error.response.data.message
        //throwing that error makes it so that the error is caught by the useQuery's "error".
        console.log("Login error from the hook:", error);
        //If the server responded with its custom error message.
        if (error.response) {
          throw new Error("Error: " + error.response.data.message);
        } else if (error.request) {
          // Request was made but no response received
          throw new Error(
            "Unable to connect to the server. Please check your internet connection and try again."
          );
        } else {
          // Something else happened
          throw new Error(
            error.message ||
              "An unexpected error occurred during login. Please try again."
          );
        }
      }
    },
  });
};

export const useSignup = () => {
  return useMutation<AuthResponse, Error, SignupData>({
    mutationFn: async (data: SignupData): Promise<AuthResponse> => {
      console.log(
        "Username, email and password received by the mutation function:",
        data
      );
      try {
        const response = await axiosInstance.post(`/auth/signup`, {
          name: data.username,
          email: data.email,
          password: data.password,
        });
        console.log(response.data);
        return response.data;
      } catch (error: any) {
        console.log("Signup error from the hook:", error);
        //If the server responded with its custom error message.
        if (error.response) {
          throw new Error("Error: " + error.response.data.message);
        } else if (error.request) {
          // Request was made but no response received
          throw new Error(
            "Unable to connect to the server. Please check your internet connection and try again."
          );
        } else {
          // Something else happened
          throw new Error(
            error.message ||
              "An unexpected error occurred during signup. Please try again."
          );
        }
      }
    },
  });
};
