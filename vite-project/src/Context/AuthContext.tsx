import axios from "axios";
import { createContext, ReactNode, useEffect, useState } from "react";
type userDataType = {
  name: string;
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
      const { data } = await axios.get("http://localhost:3000/isAuth");
      console.log(data.success);
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };
  const getUserData = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/user/data");
      //Yo userData afaile backend ma set gareko ho.
      data.success ? setUserData(data.userData) : alert(data.message);
    } catch (err: any) {
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
