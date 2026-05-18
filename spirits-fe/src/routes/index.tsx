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
import { MainLayout } from "../layouts/MainLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import AdminDashboardPage from "../pages/admin/DashboardPage";
import AdminUsersPage from "../pages/admin/UsersPage";
import AdminCategoriesPage from "../pages/admin/CategoriesPage";
import AdminProductsPage from "../pages/admin/ProductsPage";
import AdminOrdersPage from "../pages/admin/OrdersPage";
import AdminPromotionsPage from "../pages/admin/PromotionsPage";
import AdminOthersPage from "../pages/admin/OthersPage";
import AdminVariantsPage from "../pages/admin/VariantsPage";

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
        <AdminLayout />
      </RoleGuard>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: "users",
        element: <AdminUsersPage />,
      },
      {
        path: "categories",
        element: <AdminCategoriesPage />,
      },
      {
        path: "products",
        element: <AdminProductsPage />,
      },
      {
        path: "products/:productId/variants",
        element: <AdminVariantsPage />,
      },
      {
        path: "orders",
        element: <AdminOrdersPage />,
      },
      {
        path: "promotions",
        element: <AdminPromotionsPage />,
      },
      {
        path: "others",
        element: <AdminOthersPage />,
      },
    ],
  },
]);
