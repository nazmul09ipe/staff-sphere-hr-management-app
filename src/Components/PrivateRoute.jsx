import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../Contexts/AuthContext/AuthProvider";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>; // ⭐ FIX

  if (!user) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/unauthorized" />;

  return <Outlet />;
};

export default PrivateRoute;
