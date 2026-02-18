import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import AuthContext from "../../Contexts/AuthContext/AuthContext";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import {
  FaUsers,
  FaMoneyCheck,
  FaClipboardList,
  FaFileAlt,
} from "react-icons/fa";
import useRole from "../../Hooks/useRole";

const DashboardHome = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const { role, roleLoading } = useRole();

  // Fetch users count (for admin/HR)
  const { data: usersData = {}, isLoading: usersLoading } = useQuery({
    queryKey: ["users-count"],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // Fetch payments
  const { data: paymentsData = {}, isLoading: paymentsLoading } = useQuery({
    queryKey: ["payments", user?.email, role], // ✅ include role
    enabled: !!user?.email && !!role, // ✅ wait for role
    queryFn: async () => {
      const endpoint =
        role === "admin" ? "/admin/payroll" : `/payments?email=${user.email}`;

      const res = await axiosSecure.get(endpoint);
      return res.data;
    },
  });

  if (authLoading || roleLoading || usersLoading || paymentsLoading) {
    return (
      <p className="text-center py-10 text-gray-500">
        Loading dashboard data...
      </p>
    );
  }

  // Ensure payments array
  const payments = Array.isArray(paymentsData)
    ? paymentsData
    : paymentsData?.payments || [];

  const totalEmployees = usersData.total || 0;
  const lastPayments = payments.slice(-5).reverse(); // last 5 payments

  return (
    <div className="bg-slate-100 min-h-screen p-6">
      <h2 className="text-3xl font-bold mb-6">
        Welcome, {user?.displayName || user?.email}
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {user.role !== "employee" && (
          <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
            <FaUsers className="text-4xl text-blue-500" />
            <div>
              <p className="text-gray-500">Total Employees</p>
              <p className="text-2xl font-semibold">{totalEmployees}</p>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <FaMoneyCheck className="text-4xl text-green-500" />
          <div>
            <p className="text-gray-500">Total Payments</p>
            <p className="text-2xl font-semibold">{payments.length}</p>
          </div>
        </div>

        {user.role === "hr" && (
          <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
            <FaClipboardList className="text-4xl text-purple-500" />
            <div>
              <p className="text-gray-500">Work Records</p>
              <p className="text-2xl font-semibold">Check HR Panel</p>
            </div>
          </div>
        )}

        {user.role === "employee" && (
          <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
            <FaFileAlt className="text-4xl text-yellow-500" />
            <div>
              <p className="text-gray-500">Your Work Summary</p>
              <p className="text-2xl font-semibold">
                {payments.length} Payments
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Last Payments Table */}
      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Last 5 Payments</h3>
        {payments.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No payment records found.
          </p>
        ) : (
          <table className="table w-full">
            <thead>
              <tr>
                {user.role === "admin" && <th>Email</th>}
                <th>Month</th>
                <th>Year</th>
                <th>Amount</th>
                <th>Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {lastPayments.map((pay) => (
                <tr key={pay._id || pay.transactionId}>
                  {user.role === "admin" && <td>{pay.email}</td>}
                  <td>{pay.month}</td>
                  <td>{pay.year}</td>
                  <td>${pay.salary}</td>
                  <td>{pay.transactionId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
