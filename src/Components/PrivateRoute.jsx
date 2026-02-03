// src/Routes/PrivateRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../Contexts/AuthContext/AuthProvider";

const PrivateRoute = ({ allowedRoles, children }) => {
  const { user, role, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  if (!user) return <Navigate to="/auth/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children; // FIXED!!!
};

export default PrivateRoute;
