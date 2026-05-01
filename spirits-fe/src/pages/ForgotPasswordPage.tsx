import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForgotPassword } from "../services/api/authApi";
import { toast } from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { mutate: forgotPasswordMutate, isPending } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    forgotPasswordMutate({ email }, {
      onSuccess: () => {
        toast.success("Password reset instructions sent to your email");
        // pass email to the reset password page via state
        navigate("/reset-password", { state: { email } });
      },
      onError: (err) => {
        toast.error(err.message || "Failed to process request");
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Forgot Password</h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your email address and we'll send you a code to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your email"
              disabled={isPending}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors disabled:opacity-50"
          >
            {isPending ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
