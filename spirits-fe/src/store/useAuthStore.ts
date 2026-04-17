import axios, { AxiosError } from "axios";
import { create } from "zustand";
import { toast } from "react-toastify";
import { UserProfile } from "../types/api.types";

axios.defaults.withCredentials = true;

type AuthStoreState = {
  isLoggedin: boolean;
  userData: UserProfile | null;
  setIsLoggedin: (value: boolean) => void;
  setProfileData: (data: UserProfile | null) => void;
  getProfileData: () => Promise<void>;
  getAuthState: () => Promise<void>;
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  isLoggedin: false,
  userData: null,
  setIsLoggedin: (value: boolean) => set({ isLoggedin: value }),
  setProfileData: (data: UserProfile | null) => set({ userData: data }),

  getAuthState: async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/auth/isAuth`
      );
      if (data.success) {
        set({ isLoggedin: true });
        useAuthStore.getState().getProfileData();
      } else {
        console.log(
          "Error happened while trying to check the auth state. ",
          data.message
        );
        toast.error("Error while checking the auth state: " + data.message);
      }
    } catch (err) {
      const errorMessage = (err as AxiosError<{ message?: string }>).response?.data.message;
      console.log(err);
      toast.error(errorMessage || "Unknown error while checking auth state");
    }
  },

  getProfileData: async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/user/profile`
      );
      data.success ? set({ userData: data.userData }) : toast.error(data.message);
    } catch (err) {
      const errorMessage = (err as AxiosError<{ message?: string }>).response?.data.message;
      console.log(errorMessage);
      toast.error(errorMessage || "Unknown error while fetching profile data");
    }
  },
}));
