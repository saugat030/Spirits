import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useLogin, useSignup } from "../services/api/authApi";
import { toast } from "react-hot-toast";
import GoogleSignInButton from "../components/GoogleSignInButton";

const Login = () => {
  const [state, setState] = useState<"Login" | "Sign Up">("Login");
  const navigate = useNavigate();
  // const userData = useAuthStore((state) => state.userData);
  const setIsLoggedin = useAuthStore((state) => state.setIsLoggedin);
  const getProfileData = useAuthStore((state) => state.getProfileData);

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
          await getProfileData();
          // fetch the role from store
          const role = useAuthStore.getState().userData?.role;
          navigate(role === "admin" ? "/admin" : "/");
        },
        onError: (error) => {
          console.error("Login failed:", error.message);
          toast.error("Login Failed");
          setValidationError(error.message);
        },
      },
    );
  };

  const handleSignup = () => {
    signupMutate(
      { username, email, password },
      {
        onSuccess: async (data) => {
          console.log("Signup successful:", data.message);
          setIsLoggedin(true);
          await getProfileData();
          toast.success("Sign in successful");
          navigate("/verify-account");
        },
        onError: (error) => {
          console.error("Signup failed:", error.message);
          toast.error("Signup Failed");
          setValidationError(error.message);
        },
      },
    );
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setValidationError("");
    if (state === "Login") {
      if (!email || !password) {
        setValidationError(
          "Please fill all the credentials before submitting.",
        );
        return;
      }
      handleLogin();
    } else {
      if (!email || !password || !username) {
        setValidationError(
          "Please fill all the credentials before submitting.",
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
    <div className="bg-slate-900 bg-loginBg h-screen bg-cover flex items-center justify-center font-poppins p-4">
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto">
        {/* Logo and Brand */}
        <div className="flex items-center justify-start mb-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="cursor-pointer"
          >
            <img
              src="/static/Logo.png"
              alt="Logo"
              className="w-12 h-12 object-contain"
            />
          </button>
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
              <div className="absolute inset-0 rounded-xl bg-linear-to-r from-yellow-400/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
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
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

          {/* divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>
          <GoogleSignInButton />
          {/* switch state */}
          <div className="text-center space-y-3">
            <div>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors duration-200"
              >
                Forgot Password?
              </button>
            </div>
            <div>
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
            <div>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
