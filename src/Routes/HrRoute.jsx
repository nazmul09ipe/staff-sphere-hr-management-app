import { Navigate, useLocation } from "react-router";
import { useContext } from "react";
import AuthContext from "../Contexts/AuthContext/AuthContext";
import useRole from "../Hooks/useRole";

const HRRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const { role, roleLoading } = useRole();
  const location = useLocation();

  // ⏳ Wait for auth + role
  if (loading || roleLoading) {
    return <p className="text-center mt-10">Checking access...</p>;
  }

  // 🔐 Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🚫 Not HR
  if (role !== "hr") {
    return <Navigate to="/forbidden" replace />;
  }

  // ✅ Allowed
  return children;
};

export default HRRoute;
