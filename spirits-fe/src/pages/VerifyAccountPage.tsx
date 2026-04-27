import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useVerifyEmail, useSendVerificationOtp } from "../services/api/authApi";
import { toast } from "react-toastify";

const VerifyAccountPage = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const getProfileData = useAuthStore((state) => state.getProfileData);
  const userData = useAuthStore((state) => state.userData);

  const { mutate: verifyMutate, isPending: verifyPending } = useVerifyEmail();
  const { mutate: sendOtpMutate, isPending: sendOtpPending } = useSendVerificationOtp();

  useEffect(() => {
    // if user is already verified redirect to profile
    if (userData?.is_verified) {
      navigate("/profile");
    }
  }, [userData, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the verification code");
      return;
    }

    verifyMutate({ otp }, {
      onSuccess: async () => {
        toast.success("Account verified successfully!");
        await getProfileData();
        navigate("/profile");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to verify account");
      }
    });
  };

  const handleResendOtp = () => {
    sendOtpMutate(undefined, {
      onSuccess: () => {
        toast.success("Verification code sent to your email!");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to send verification code");
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Verify Your Account</h2>
        <p className="text-gray-600 text-center mb-6">
          Please enter the verification code sent to your email address.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter OTP"
              disabled={verifyPending}
            />
          </div>

          <button
            type="submit"
            disabled={verifyPending}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors disabled:opacity-50"
          >
            {verifyPending ? "Verifying..." : "Verify Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleResendOtp}
            disabled={sendOtpPending}
            className="text-yellow-600 hover:text-yellow-700 font-medium transition-colors disabled:opacity-50"
          >
            {sendOtpPending ? "Sending..." : "Resend Verification Code"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccountPage;
