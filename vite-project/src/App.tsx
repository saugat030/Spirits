import "./App.css";
import ProductsPage from "./pages/ProductsPage";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Authentication from "./pages/Authentication";
import ProductFullView from "./pages/ProductFullView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductFullView />} />
        <Route path="/login" element={<Authentication pageType="login" />} />
        <Route path="/signup" element={<Authentication pageType="signup" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
