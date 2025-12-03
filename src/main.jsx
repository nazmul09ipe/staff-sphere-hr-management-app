import { StrictMode } from "react";
import "./index.css";



import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./Contexts/AuthContext/AuthProvider";
import router from "./Routes/Router";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ style: { zIndex: 9999 } }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
