
import { useContext } from "react";
import AuthContext from "../Contexts/AuthContext/AuthContext";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useRole = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const { isLoading: roleLoading, data: role = "employee" } = useQuery({
    enabled: !!user?.email,
    queryKey: ["user-role", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data.user?.role || "employee";
    },
  });

  return { role, roleLoading };
};

export default useRole;
