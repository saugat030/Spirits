import { useEffect, useRef, useCallback } from "react";
import { useGoogleLogin } from "../services/api/authApi";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GoogleSignInButton = () => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const setIsLoggedin = useAuthStore((s) => s.setIsLoggedin);
  const getProfileData = useAuthStore((s) => s.getProfileData);
  const { mutate: googleLoginMutate } = useGoogleLogin();

  const handleCredentialResponse = useCallback(
    (response: { credential: string }) => {
      googleLoginMutate(
        { idToken: response.credential },
        {
          onSuccess: async (data) => {
            console.log("Google login successful:", data.message);
            setIsLoggedin(true);
            toast.success(data.message || "Logged in with Google!");
            await getProfileData();
            const role = useAuthStore.getState().userData?.role;
            navigate(role === "admin" ? "/admin" : "/");
          },
          onError: (error) => {
            console.error("Google login failed:", error);
            const msg =
              error.response?.data?.message || "Google login failed. Please try again.";
            toast.error(msg);
          },
        }
      );
    },
    [googleLoginMutate, setIsLoggedin, getProfileData, navigate]
  );

  useEffect(() => {
    // the gsi script loads async
    const initializeGsi = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        width: "400",
        logo_alignment: "center",
      });
    };

    // if the script is already loaded initialize immediately
    if (window.google?.accounts?.id) {
      initializeGsi();
      return;
    }

    // otherwise, poll until it's available (the script has async defer)
    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(interval);
        initializeGsi();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [handleCredentialResponse]);

  return (
    <div className="flex justify-center">
      <div ref={buttonRef} id="google-signin-button" />
    </div>
  );
};

export default GoogleSignInButton;
