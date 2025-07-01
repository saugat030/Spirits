import axios from "axios";
import { createContext, ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";

type userDataType = {
  name: string;
  role: string;
  isAccountVerified: boolean;
  email: string;
};

type userContext = {
  isLoggedin: boolean;
  setIsLoggedin: React.Dispatch<React.SetStateAction<boolean>>;
  userData: userDataType | null;
  setUserData: React.Dispatch<React.SetStateAction<userDataType | null>>;
  getUserData: () => Promise<void>;
};

export const AuthContext = createContext<userContext | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  axios.defaults.withCredentials = true;
  const [isLoggedin, setIsLoggedin] = useState<boolean>(false);
  const [userData, setUserData] = useState<userDataType | null>(null);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/auth/isAuth");
      console.log(data);
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
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
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/auth/user/data"
      );
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (err: any) {
      console.error(err.message);
      alert(err.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value: userContext = {
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
