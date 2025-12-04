// src/Routes/PrivateRoute.jsx
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../Contexts/AuthContext/AuthProvider";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, role, loading } = useContext(AuthContext);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!user) return <Navigate to="/auth/login" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

export default PrivateRoute;
