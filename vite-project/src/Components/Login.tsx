import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Logo from "../static/Logo.png";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const Login = () => {
  const [state, setState] = useState<"Login" | "Sign Up">("Login");
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within AuthContextProvider");
  }
  const { setIsLoggedin, getUserData, userData } = authContext;

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const func = async () => {
    axios.defaults.withCredentials = true;
    if (state == "Login") {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/auth/login",
          {
            email: email,
            password: password,
          }
        );
        if (response.data.success) {
          setIsLoggedin(true);
          await getUserData();
        } else {
          setValidationError(response.data.message);
        }
      } catch (error: any) {
        setValidationError(error.message);
        console.log(error.message);
      }
    } else {
      try {
        const response = await axios.post("http://localhost:3000/signup", {
          name: username,
          email: email,
          password: password,
        });
        if (response.data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        }
      } catch (error: any) {
        console.log(error.message);
      }
    }
  };
  useEffect(() => {
    if (!userData) return;
    if (userData.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  }, [userData]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state == "Login") {
      if (!email || !password) {
        setValidationError("Please fill all the credntials before submitting.");
        return;
      }
    }
    if (state == "Sign Up") {
      if (!email || !password || !username) {
        setValidationError("Please fill all the credntials before submitting.");
        return;
      }
    }

    func();
  }

  function handleState() {
    if (state == "Login") {
      setState("Sign Up");
    } else {
      setState("Login");
    }
  }
  return (
    <div className="bg-loginBg h-screen bg-cover flex justify-end font-Poppins">
      <div className="bg-white/50 h-full w-[25%] flex-col flex justify-between items-center">
        <div className="flex gap-8 flex-col w-3/4  py-10">
          <nav className="h-16 items-center text-2xl flex">
            <img src={Logo} alt="Logo" className="h-full object-contain" />
            Jhyape
          </nav>
          <h1 className="text-3xl font-semibold text-red-800">{state}</h1>
          <form
            method="post"
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 "
          >
            {state == "Sign Up" && (
              <label htmlFor="usename">
                <input
                  type="text"
                  value={username}
                  id="username"
                  name="username"
                  placeholder="Username"
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setValidationError("");
                  }}
                  className="bg-gray-100 rounded-xl p-2 text-black w-full"
                />
              </label>
            )}
            <label htmlFor="email">
              <input
                type="text"
                value={email}
                id="name"
                name="email"
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setValidationError("");
                }}
                className="bg-gray-100 rounded-xl p-2 text-black w-full"
              />
            </label>
            <label htmlFor="password">
              <input
                type="text"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setValidationError("");
                }}
                id="name"
                name="password"
                placeholder="Password"
                className="bg-gray-100 rounded-xl p-2 text-black w-full"
              />
            </label>
            {validationError && (
              <div className="text-red-500 text-sm max-w-80">
                {validationError}
              </div>
            )}
            <div className="w-full flex justify-between p-2">
              <label htmlFor="remember" className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="checked:text-yellow-600 checked:bg-yellow-600 checked:border-black rounded cursor-pointer w-4 h-4 border bg-white border-black appearance-none"
                />
                Remember Me
              </label>
              <button
                type="submit"
                className="border-2 hover:border-yellow-700 shadow-md shadow-gray-700 border-amber-700 hover:bg-transparent hover:text-black bg-yellow-600 text-white rounded-xl py-1 font-semibold px-2 w-1/3 duration-200"
              >
                {state}
              </button>
            </div>
            <h1
              className="p-2 text-blue-600 hover:underline cursor-pointer"
              onClick={handleState}
            >
              {state == "Login"
                ? "Dont have an account ? Sign Up here"
                : "Already have an account ? Login here"}
            </h1>
          </form>
        </div>
        <Footer size="sm" />
      </div>
    </div>
  );
};

export default Login;
