import axios from "axios";
import { create } from "zustand";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

export type UserData = {
  name: string;
  role: string;
  isAccountVerified: boolean;
  email: string;
};

type AuthState = {
  isLoggedin: boolean;
  userData: UserData | null;
  setIsLoggedin: (value: boolean) => void;
  setUserData: (data: UserData | null) => void;
  getUserData: () => Promise<void>;
  getAuthState: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedin: false,
  userData: null,
  setIsLoggedin: (value: boolean) => set({ isLoggedin: value }),
  setUserData: (data: UserData | null) => set({ userData: data }),
  getAuthState: async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/auth/isAuth`
      );
      console.log(data);
      if (data.success) {
        set({ isLoggedin: true });
        useAuthStore.getState().getUserData();
      } else {
        console.log(
          "Error happened while trying to check the auth state. ",
          data.message
        );
        toast.error("Error while checking the auth state: " + data.message);
      }
    } catch (err: any) {
      console.log(err.message);
    }
  },
  getUserData: async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/auth/user/data`
      );
      data.success ? set({ userData: data.userData }) : toast.error(data.message);
    } catch (err: any) {
      console.error(err.message);
      toast.error(err.message);
    }
  },
}));
