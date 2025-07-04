import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthContextProvider } from "./Context/AuthContext.tsx";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <ToastContainer
          theme="colored"
          autoClose={1000}
          draggable={true}
          toastClassName="font-Poppins"
          limit={4}
        />
        <App />
      </AuthContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
