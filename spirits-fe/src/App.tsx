import "./App.css";
import ProductsPage from "./pages/ProductsPage";
import HomePage from "./pages/HomePage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Authentication from "./pages/Authentication";
import ProductFullView from "./pages/ProductFullView";
import CartPage from "./pages/CartPage";
import { ShoppingCartProvider } from "./context/ShoppingCartContext";
import AdminDashBoard from "./pages/AdminDashBoard";
import Users from "./components/protected/Users";
import AdminProducts from "./components/protected/AdminProducts";
import Settings from "./components/protected/Settings";
import Orders from "./components/protected/Orders";
import Dashboard from "./components/protected/Dashboard";
import AddProducts from "./components/protected/AddProducts";
import ProtectedRoute from "./components/protected/protectedRoute";
import { AuthContextProvider } from "./context/AuthContext";
import OrdersPage from "./pages/OrdersPage";

function App() {
  return (
    <AuthContextProvider>
      <ShoppingCartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductFullView />} />
            <Route path="/login" element={<Authentication />} />

            <Route path="/cart" element={<CartPage />} />
            {/* Protected routes that require login */}
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            {/* Admin Routes - Role-based protection */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashBoard />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/add" element={<AddProducts />} />
              <Route path="settings" element={<Settings />} />
              <Route path="orders" element={<Orders />} />
            </Route>

            {/* Fallback routes */}
            <Route
              path="/unauthorized"
              element={<div>Unauthorized Access</div>}
            />
            <Route
              path="/verify-account"
              element={<div>Please verify your account</div>}
            />
          </Routes>
        </BrowserRouter>
      </ShoppingCartProvider>
    </AuthContextProvider>
  );
}

export default App;
