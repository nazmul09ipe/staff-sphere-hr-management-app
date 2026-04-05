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
    return (
      <p className="text-center mt-10 text-gray-500 dark:text-gray-300">
        Loading...
      </p>
    );

  // Error state
  if (isError || !user)
    return (
      <p className="text-center mt-10 text-red-500 dark:text-red-400">
        Employee not found or something went wrong.
      </p>
    );

  return (
    <div className="bg-slate-100 dark:bg-[#0f172a] p-4 sm:p-6 md:p-8 min-h-screen">
      {/* PROFILE */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <img
          src={user.photoURL || "/default-avatar.png"} // fallback image
          alt={user.name || "Employee"}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
        />

        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
            {user.name || "Unknown"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{user.designation || "N/A"}</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">{user.email}</p>
        </div>
      </div>

      {/* SALARY HISTORY */}
      <div className="bg-white dark:bg-gray-800 mt-6 p-6 rounded-xl shadow">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Salary History
        </h3>

        {payroll && payroll.length > 0 ? (
          <div className="w-full h-64 sm:h-80 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={payroll}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <XAxis
                  dataKey="monthYear"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Salary ($)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 0,
                    style: { textAnchor: "middle", fontSize: 12 },
                  }}
                />
                <Tooltip />
                <Bar dataKey="salary" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center mt-10">
            No payroll history found.
          </p>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetails;