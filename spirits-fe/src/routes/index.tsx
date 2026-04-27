import { createBrowserRouter, Outlet } from "react-router-dom";
import ProductsPage from "../pages/ProductsPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ProductFullView from "../pages/ProductFullView";
import CartPage from "../pages/CartPage";
import ProtectedRoute from "../components/protected/protectedRoute";
import OrdersPage from "../pages/OrdersPage";
import CheckoutPage from "../pages/CheckoutPage";
import ProfilePage from "../pages/ProfilePage";
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
          <ProtectedRoute>
            {/* since protected route component expects children, we feed it the outlet so it gets the children from the route */}
            <Outlet /> 
          </ProtectedRoute>
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
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/unauthorized",
    element: <div>Unauthorized Access</div>,
  },
  {
    path: "/verify-account",
    element: <div>Please verify your account</div>,
  },
]);