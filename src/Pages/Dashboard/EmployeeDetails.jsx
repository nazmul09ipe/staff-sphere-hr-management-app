import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const EmployeeDetails = () => {
  const { email } = useParams(); // employee email passed in URL
  const axiosSecure = useAxiosSecure();

  // Fetch employee + payroll data
  const { data = {}, isLoading, isError } = useQuery({
    queryKey: ["employeeDetails", email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${email}`);
      return res.data;
    },
  });

  const { user, payroll } = data;

  // Loading state
  if (isLoading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  // Error state
  if (isError || !user)
    return (
      <p className="text-center mt-10 text-red-500">
        Employee not found or something went wrong.
      </p>
    );

  return (
    <div className="bg-slate-100 p-6 min-h-screen">
      {/* PROFILE */}
      <div className="flex items-center gap-6 bg-white p-6 rounded-xl shadow">
        <img
          src={user.photoURL || "/default-avatar.png"} // fallback image
          alt={user.name || "Employee"}
          className="w-28 h-28 rounded-full object-cover"
        />

        <div>
          <h2 className="text-2xl font-bold">{user.name || "Unknown"}</h2>
          <p className="text-gray-500">{user.designation || "N/A"}</p>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
      </div>

      {/* SALARY HISTORY */}
      <div className="bg-white mt-6 p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Salary History</h3>

        {payroll && payroll.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={payroll}>
              <XAxis dataKey="monthYear" label={{ value: "Month-Year", position: "insideBottom", offset: -5 }} />
              <YAxis label={{ value: "Salary ($)", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Bar dataKey="salary" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center mt-10">No payroll history found.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetails;
