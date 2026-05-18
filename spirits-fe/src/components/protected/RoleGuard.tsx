import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-hot-toast";

type RoleGuardProps = {
  children: ReactNode;
  requiredRole?: string;
  requireVerified?: boolean;
  blockRole?: string;
};

const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRole,
  requireVerified = false,
  blockRole,
}) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  const isLoggedin = useAuthStore((state) => state.isLoggedin);
  const userData = useAuthStore((state) => state.userData);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  useEffect(() => {
    // Wait until the initial auth check is completely finished
    if (isAuthLoading) return;

    // If not logged in after auth check completes
    if (!isLoggedin) {
      toast.error("You must be logged in to perform that action");
      navigate("/login", { replace: true });
      return;
    }

    // Wait until user data is specifically loaded for role/verification checks
    if (!userData) return;

    // If verification is required and user is not verified
    if (requireVerified && !userData.is_verified) {
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

    // If user has a blocked role
    if (blockRole && userData.role === blockRole) {
      navigate("/unauthorized", { replace: true });
      return;
    }

    // All checks passed
    setIsChecking(false);
  }, [isLoggedin, userData, isAuthLoading, requiredRole, requireVerified, blockRole, navigate]);

  if (isChecking || isAuthLoading) return null; // prevent children from flashing during redirect and loading

  return <>{children}</>;
};

export default RoleGuard;