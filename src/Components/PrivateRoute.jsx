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

  const {
    data: dbUser,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dbUser", user?.email],
    enabled: !!user?.email,
    retry: false, // 🔥 prevent infinite retry on 403
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data.user;
    },
  });

  // 🔥 STEP 1: Wait for Firebase auth
  if (loading) {
    return <Loading />;
  }

  // 🔥 STEP 2: Not logged in → redirect
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // 🔥 STEP 3: Wait for DB user
  if (isLoading) {
    return <Loading />;
  }

  // 🔥 STEP 4: Handle error (403 / not found)
  if (isError || !dbUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg font-medium">
        Unauthorized access. User not found in database.
      </div>
    );
  }

  // 🔥 STEP 5: Fired user block
  if (dbUser?.isFired) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl font-semibold">
        Your account has been terminated.
      </div>
    );
  }

  // ✅ STEP 6: Allow access
  return children;
};

export default PrivateRoute;