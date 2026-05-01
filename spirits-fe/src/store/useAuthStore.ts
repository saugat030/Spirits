import axios, { AxiosError } from "axios";
import { create } from "zustand";
import { toast } from "react-hot-toast";
import { UserProfile } from "../types/api.types";

axios.defaults.withCredentials = true;

type AuthStoreState = {
  isLoggedin: boolean;
  isAuthLoading: boolean;
  userData: UserProfile | null;
  setIsLoggedin: (value: boolean) => void;
  setProfileData: (data: UserProfile | null) => void;
  getProfileData: () => Promise<void>;
  getAuthState: () => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  isLoggedin: false,
  isAuthLoading: true, // Start as true so protected routes know we are checking
  userData: null,
  setIsLoggedin: (value: boolean) => set({ isLoggedin: value }),
  setProfileData: (data: UserProfile | null) => set({ userData: data }),
  logout: () => set({ isLoggedin: false, userData: null, isAuthLoading: false }),

    getAuthState: async () => {
    set({ isAuthLoading: true });
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/auth/isAuth`
      );
      if (data.success) {
        set({ isLoggedin: true });
        await useAuthStore.getState().getProfileData();
      } else {
        // If it's not a success but no hard error is thrown, silently ignore for unauthenticated users
        console.log("Not authenticated", data.message);
      }
    } catch (err) {
      // Check if it is simply a 401 Unauthorized (which is expected when not logged in yet)
      const axiosError = err as AxiosError<{ message?: string }>;
      if (axiosError.response?.status === 401) {
        // Silently ignore - user is just not logged in.
      } else {
        const errorMessage = axiosError.response?.data.message;
        console.log(err);
        toast.error(errorMessage || "Unknown error while checking auth state");
      }
    } finally {
      set({ isAuthLoading: false });
    }
  },

  getProfileData: async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/users/profile`
      );
      data.success ? set({ userData: data.data }) : toast.error(data.message);
    } catch (err) {
      const errorMessage = (err as AxiosError<{ message?: string }>).response?.data.message;
      console.log(errorMessage);
      toast.error(errorMessage || "Unknown error while fetching profile data");
    }
  },
}));
