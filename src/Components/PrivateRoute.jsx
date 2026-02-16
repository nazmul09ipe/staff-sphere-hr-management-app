import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import AuthContext from "../Contexts/AuthContext/AuthContext";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Loading from "../Components/Loading";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const axiosSecure = useAxiosSecure();

  const { data: dbUser = {}, isLoading } = useQuery({
    enabled: !!user?.email,
    queryKey: ["dbUser", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data.user;
    },
  });

  if (loading || isLoading) return <Loading />;

  // not logged in
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // 🔥 FIRED USER BLOCK
  if (dbUser?.isFired) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl font-semibold">
        Your account has been terminated.
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
