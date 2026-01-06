import React from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CarritoProvider } from "./context/CarritoContext";
import { ToastProvider } from "./context/ToastContext";

import router from "./pages/router";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CarritoProvider> 
          <RouterProvider router={router} />
        </CarritoProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
