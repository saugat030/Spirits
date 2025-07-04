import { useContext, useEffect, useState } from "react";
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
    <div className="bg-loginBg h-screen bg-cover flex items-center justify-center font-Poppins p-4">
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <img
                src="/static/Logo.png"
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-white">Spirits</h1>
          </div>
          <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto"></div>
        </div>

        {/* Form Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{state}</h2>
          <p className="text-gray-300">
            {state === "Login"
              ? "Welcome back! Please sign in to your account"
              : "Create your account to get started"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field (Sign Up only) */}
          {state === "Sign Up" && (
            <div className="relative">
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
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
            </div>
          )}

          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              value={email}
              id="email"
              name="email"
              placeholder="Email Address"
              onChange={(e) => {
                setEmail(e.target.value);
                setValidationError("");
              }}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
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
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-200 text-sm backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {validationError}
              </div>
            </div>
          )}

          {/* Remember Me and Submit */}
          <div className="flex items-center justify-between">
            <label
              htmlFor="remember"
              className="flex items-center gap-2 text-gray-300 cursor-pointer"
            >
              <div className="relative">
                <input type="checkbox" id="remember" className="sr-only" />
                <div className="w-5 h-5 bg-white/10 border border-white/20 rounded flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-yellow-400 opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <span className="text-sm">Remember Me</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin w-5 h-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </div>
            ) : (
              state
            )}
          </button>

          {/* Switch State */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleState}
              className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
            >
              {state === "Login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <span className="text-yellow-400 hover:text-yellow-300 font-medium">
                {state === "Login" ? "Sign Up here" : "Login here"}
              </span>
            </button>
          </div>
        </form>

        {/* Footer */}
        {/* <div className="mt-8 pt-6 border-t border-white/10">
          <Footer />
        </div> */}
      </div>
    </div>
  );
};

export default Login;
