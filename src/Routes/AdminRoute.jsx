import { Navigate, useLocation } from "react-router";
import { useContext } from "react";
import AuthContext from "../Contexts/AuthContext/AuthContext";
import useRole from "../Hooks/useRole";

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const { role, roleLoading } = useRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return <p className="text-center mt-10">Checking access...</p>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default AdminRoute;
