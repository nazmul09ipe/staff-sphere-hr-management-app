import React, { useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import AuthContext from "../../Contexts/AuthContext/AuthContext";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

// ✅ Utility: Format Date Safely
const formatDate = (date) => {
  if (!date) return "N/A";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

const EmployeePaymentHistory = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["payments", user?.email],
    enabled: !!user?.email,
    staleTime: 5 * 60 * 1000, // ✅ cache for 5 minutes
    queryFn: async () => {
      const email = user.email.toLowerCase();
      const res = await axiosSecure.get(`/payments?email=${email}`);
      return res.data;
    },
  });

  // ✅ Memoized safe data extraction
  const payments = useMemo(() => data?.payments || [], [data]);

  if (authLoading || isLoading) {
    return (
      <p className="text-center py-10 text-gray-500 dark:text-gray-400">
        Loading payment history...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-center py-10 text-red-500">
        Error fetching payments: {error?.message || "Something went wrong"}
      </p>
    );
  }

  if (!payments.length) {
    return (
      <p className="text-center py-10 text-gray-500 dark:text-gray-400">
        No payment records found.
      </p>
    );
  }

  return (
    <div className="bg-slate-100 dark:bg-gray-900 p-6 rounded-xl min-h-screen">
      
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Employee Payment History
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Review all your salary payments and transaction records.
        </p>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow">
        <table className="table w-full text-left">
          
          {/* TABLE HEAD */}
          <thead className="bg-gray-200 dark:bg-gray-700 dark:text-white">
            <tr>
              <th className="px-4 py-3">Month</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Payment Date</th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>
            {payments.map((pay) => (
              <tr
                key={pay._id}
                className="border-b border-gray-200 dark:border-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="px-4 py-3 capitalize">
                  {pay.month || "N/A"}
                </td>

                <td className="px-4 py-3">
                  {pay.year || "N/A"}
                </td>

                <td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">
                  ${pay.salary ?? 0}
                </td>

                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 break-all">
                  {pay.transactionId || "N/A"}
                </td>

                {/* ✅ DATE COLUMN */}
                <td className="px-4 py-3">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-sm">
                    {formatDate(pay.createdAt)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default EmployeePaymentHistory;