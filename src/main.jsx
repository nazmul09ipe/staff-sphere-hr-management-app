import { StrictMode } from "react";
import "./index.css";

import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./Contexts/AuthContext/AuthProvider";
import router from "./Routes/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ✅ Stripe import
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const queryClient = new QueryClient();

// ✅ Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        
        <Elements stripe={stripePromise}>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{ style: { zIndex: 9999 } }}
          />
          <RouterProvider router={router} />
        </Elements>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);