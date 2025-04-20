import axios from "axios";
import { createContext, ReactNode, useEffect, useState } from "react";
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
type AuthContextProviderProps = {
  children: ReactNode;
};
export const AuthContext = createContext<userContext | undefined>(undefined);

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  axios.defaults.withCredentials = true;
  const [isLoggedin, setIsLoggedin] = useState<boolean>(false);
  const [userData, setUserData] = useState<userDataType | null>(null);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/auth/isAuth");
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
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
      data.success ? setUserData(data.userData) : alert(data.message);
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
