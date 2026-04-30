import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useResetPassword } from "../services/api/authApi";
import { toast } from "react-toastify";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // retrieve email if routed from forgot-password
  const initialEmail = location.state?.email || "";
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const { mutate: resetPasswordMutate, isPending } = useResetPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp || !newPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    resetPasswordMutate({ email, otp, newPassword }, {
      onSuccess: () => {
        toast.success("Password reset successfully! You can now login.");
        navigate("/login");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to reset password");
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Reset Password</h2>
        <p className="text-gray-600 text-center mb-6">
          Enter the code sent to your email and your new password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your email"
              disabled={isPending}
            />
          </div>

          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              Reset Code (OTP)
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter code"
              disabled={isPending}
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter new password"
              disabled={isPending}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors mt-6 disabled:opacity-50"
          >
            {isPending ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
