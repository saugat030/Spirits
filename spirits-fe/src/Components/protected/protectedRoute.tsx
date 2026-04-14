import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-toastify";

type ProtectedRouteProps = {
  children: ReactNode;
  requiredRole?: string;
  requireVerified?: boolean;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requireVerified = false,
}) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  const isLoggedin = useAuthStore((state) => state.isLoggedin);
  const userData = useAuthStore((state) => state.userData);

  useEffect(() => {
    // If not logged in
    if (!isLoggedin) {
      toast.error("You must be logged in to perform that action");
      navigate("/login", { replace: true });
      return;
    }

    // Wait until user data is loaded
    if (!userData) return;

    // If verification is required and user is not verified
    if (requireVerified && !userData.isAccountVerified) {
      toast.error("You must be verified to perform that action");
      navigate("/verify-account", { replace: true });
      return;
    }

    // If role doesn't match
    if (requiredRole && userData.role !== requiredRole) {
      toast.error("You are unauthorized to perform that action");
      navigate("/unauthorized", { replace: true });
      return;
    }

    // All checks passed
    setIsChecking(false);
  }, [isLoggedin, userData, requiredRole, requireVerified, navigate]);

  if (isChecking) return null; // prevent children from flashing during redirect

  return <>{children}</>;
};

export default ProtectedRoute;
