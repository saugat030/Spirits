import "./App.css";
import ProductsPage from "./pages/ProductsPage";
import HomePage from "./pages/HomePage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Authentication from "./pages/Authentication";
import ProductFullView from "./pages/ProductFullView";
import CartPage from "./pages/CartPage";
import { ShoppingCartProvider } from "./Context/ShoppingCartContext";
import AdminDashBoard from "./pages/AdminDashBoard";

function App() {
  return (
    <ShoppingCartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductFullView />} />
          <Route path="/login" element={<Authentication />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin/dashboard" element={<AdminDashBoard />} />
        </Routes>
      </BrowserRouter>
    </ShoppingCartProvider>
  );
}

export default App;
