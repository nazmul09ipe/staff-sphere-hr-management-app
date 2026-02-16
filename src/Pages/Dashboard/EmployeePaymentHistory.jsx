import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import AuthContext from "../../Contexts/AuthContext/AuthContext";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const EmployeePaymentHistory = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  // Wait for user to exist before querying
  const {
    data = {},
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["payments", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const email = user.email.toLowerCase(); // normalize
      console.log("Fetching payments for:", email);
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      console.log("Payments data:", res.data);
      return res.data;
    },
  });

  const payments = data.payments || [];

  // Loading states
  if (authLoading || isLoading) {
    return (
      <p className="text-center py-10 text-gray-500">
        Loading payment history...
      </p>
    );
  }

  // Error state
  if (isError) {
    return (
      <p className="text-center py-10 text-red-500">
        Error fetching payments: {error.message}
      </p>
    );
  }

  // No payments
  if (payments.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">
        No payment records found.
      </p>
    );
  }

  return (
    <div className="bg-slate-100 p-6 rounded-xl min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Payment History</h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Year</th>
              <th>Amount</th>
              <th>Transaction ID</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((pay) => (
              <tr key={pay._id}>
                <td>{pay.month.charAt(0).toUpperCase() + pay.month.slice(1)}</td>
                <td>{pay.year}</td>
                <td>${pay.salary}</td>
                <td>{pay.transactionId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeePaymentHistory;
