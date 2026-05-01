import { createBrowserRouter, Outlet } from "react-router-dom";
import ProductsPage from "../pages/ProductsPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ProductFullView from "../pages/ProductFullView";
import CartPage from "../pages/CartPage";
import RoleGuard from "../components/protected/RoleGuard";
import OrdersPage from "../pages/OrdersPage";
import CheckoutPage from "../pages/CheckoutPage";
import ProfilePage from "../pages/ProfilePage";
import VerifyAccountPage from "../pages/VerifyAccountPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import { MainLayout } from "../layouts/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/products",
        element: <ProductsPage />,
      },
      {
        path: "/products/:id",
        element: <ProductFullView />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        element: (
          <RoleGuard requireVerified={true} blockRole="admin">
            {/* since protected route component expects children, we feed it the outlet so it gets the children from the route */}
            <Outlet />
          </RoleGuard>
        ),
        children: [
          {
            path: "/orders",
            element: <OrdersPage />,
          },
          {
            path: "/checkout",
            element: <CheckoutPage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
        ],
      },
      {
        path: "/verify-account",
        element: <VerifyAccountPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "/unauthorized",
        element: <UnauthorizedPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: (
      <RoleGuard requiredRole="admin">
        <AdminDashboardPage />
      </RoleGuard>
    ),
  },
]);
