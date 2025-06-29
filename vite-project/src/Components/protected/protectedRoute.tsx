import { useContext, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
type ProtectedRouteProps = {
  children: ReactNode;
  requiredRole?: string; // Optional role-based protection
  requireVerified?: boolean; // Optional verification requirement
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requireVerified = false,
}) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("ProtectedRoute must be used within AuthContextProvider");
  }

  const { isLoggedin, userData } = authContext;

  // Check if user is logged in
  if (!isLoggedin) {
    return <Navigate to="/login" replace />;
  }

  // Check if user data is loaded
  if (!userData) {
    return <div>Loading...</div>; // Or your loading component
  }

  // Check if account verification is required
  if (requireVerified && !userData.isAccountVerified) {
    return <Navigate to="/verify-account" replace />;
  }

  // Check role-based access
  if (requiredRole && userData.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
