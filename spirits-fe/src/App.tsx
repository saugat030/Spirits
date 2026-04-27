import "./App.css";
import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { router } from "./routes";

function App() {
  const getAuthState = useAuthStore((state) => state.getAuthState);
  useEffect(() => {
    getAuthState();
  }, [getAuthState]);

  return <RouterProvider router={router} />;
}

export default App;
