import { useContext, useEffect, useState } from "react";
import Logo from "../static/Logo.png";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { useLogin, useSignup } from "../services/api/authApi";
import { toast } from "react-toastify";

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
  const { mutate: loginMutate, isPending: loginPending } = useLogin();
  const { mutate: signupMutate, isPending: signupPending } = useSignup();

  const handleLogin = () => {
    loginMutate(
      { email, password },
      {
        onSuccess: async (data) => {
          console.log("Login successful:", data.message);
          setIsLoggedin(true);
          toast.success("Logged in Successfuly.");
          await getUserData();
          // Navigation will be handled by useEffect when userData updates
        },
        onError: (error) => {
          console.error("Login failed:", error.message);
          toast.error("Login Failed");
          setValidationError(error.message);
        },
      }
    );
  };

  const handleSignup = () => {
    signupMutate(
      { username, email, password },
      {
        onSuccess: async (data) => {
          console.log("Signup successful:", data.message);
          setIsLoggedin(true);
          await getUserData();
          toast.success("Sign in successful");
          // Navigation will be handled by useEffect when userData updates
        },
        onError: (error) => {
          console.error("Signup failed:", error.message);
          toast.error("Signup Failed");
          setValidationError(error.message);
        },
      }
    );
  };

  useEffect(() => {
    if (!userData) return;
    if (userData.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  }, [userData, navigate]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Clear previous validation errors
    setValidationError("");

    if (state === "Login") {
      if (!email || !password) {
        setValidationError(
          "Please fill all the credentials before submitting."
        );
        return;
      }
      handleLogin();
    } else {
      if (!email || !password || !username) {
        setValidationError(
          "Please fill all the credentials before submitting."
        );
        return;
      }
      handleSignup();
    }
  }

  function handleState() {
    if (state === "Login") {
      setState("Sign Up");
    } else {
      setState("Login");
    }
    // Clear validation errors when switching states
    setValidationError("");
  }

  const isLoading = loginPending || signupPending;

  return (
    <div className="bg-loginBg h-screen bg-cover flex justify-end font-Poppins overflow-hidden">
      <div className="bg-white/50 h-full lg:w-[30%] w-full flex-col flex justify-between items-center">
        <div className="flex gap-8 flex-col w-3/4 py-10">
          <nav className="h-16 items-center text-2xl flex">
            <img src={Logo} alt="Logo" className="h-full object-contain" />
            Spirits
          </nav>
          <h1 className="text-3xl font-semibold text-red-800">{state}</h1>
          <form
            method="post"
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            {state === "Sign Up" && (
              <label htmlFor="username">
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
                  disabled={isLoading}
                  className="bg-gray-100 rounded-xl p-2 text-black w-full disabled:opacity-50"
                />
              </label>
            )}
            <label htmlFor="email">
              <input
                type="email"
                value={email}
                id="email"
                name="email"
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setValidationError("");
                }}
                disabled={isLoading}
                className="bg-gray-100 rounded-xl p-2 text-black w-full disabled:opacity-50"
              />
            </label>
            <label htmlFor="password">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setValidationError("");
                }}
                id="password"
                name="password"
                placeholder="Password"
                disabled={isLoading}
                className="bg-gray-100 rounded-xl p-2 text-black w-full disabled:opacity-50"
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
                disabled={isLoading}
                className="border-2 hover:border-yellow-700 shadow-md shadow-gray-700 border-amber-700 hover:bg-transparent hover:text-black bg-yellow-600 text-white rounded-xl py-1 font-semibold px-2 w-1/3 duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Loading..." : state}
              </button>
            </div>
            <h1
              className="p-2 text-blue-600 hover:underline cursor-pointer"
              onClick={handleState}
            >
              {state === "Login"
                ? "Don't have an account? Sign Up here"
                : "Already have an account? Login here"}
            </h1>
          </form>
        </div>
        <Footer size="sm" />
      </div>
    </div>
  );
};

export default Login;
