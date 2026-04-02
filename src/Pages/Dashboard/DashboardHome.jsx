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

// ================= HELPER =================
const formatMoney = (amount) => `$${Number(amount || 0).toLocaleString()}`;

// ================= CARD =================
const Card = ({ title, value, icon, color }) => (
  <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 p-6 rounded-xl flex items-center gap-4 transition hover:shadow-md">
    <div className={`text-3xl ${color}`}>{icon}</div>
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
      <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        {value}
      </p>
    </div>
  </div>
);

const DashboardHome = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const { role, roleLoading } = useRole();

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", {
    month: "long",
  });
  const currentYear = currentDate.getFullYear();

  // ================= USERS =================
  const { data: usersData = {}, isLoading: usersLoading } = useQuery({
    queryKey: ["users-count"],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // ================= PAYMENTS =================
  const { data: paymentsData = {}, isLoading: paymentsLoading } = useQuery({
    queryKey: ["payments", user?.email, role],
    enabled: !!user?.email && !!role,
    queryFn: async () => {
      const endpoint =
        role === "admin" || role === "hr"
          ? "/payments"
          : `/payments?email=${user.email}`;
      const res = await axiosSecure.get(endpoint);
      return res.data;
    },
  });

  // ================= ADMIN PENDING =================
  const { data: pendingData = [], isLoading: pendingLoading } = useQuery({
    queryKey: ["pending-payments"],
    enabled: role === "admin",
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/payments");
      return res.data;
    },
  });

  // ================= EMPLOYEE WORK =================
  const { data: empWorkData = [], isLoading: empWorkLoading } = useQuery({
    queryKey: ["employee-work", user?.email, currentMonth],
    enabled: role === "employee",
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/works?email=${user.email}&month=${currentMonth}`,
      );
      return res.data;
    },
  });

  // ================= HR WORK =================
  const { data: workData = {}, isLoading: workLoading } = useQuery({
    queryKey: ["work-summary", currentMonth],
    enabled: role === "hr",
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/hr/work-summary?month=${currentMonth}`,
      );
      return res.data;
    },
  });

  // ================= SUMMARY =================
  const { data: summaryData = {}, isLoading: summaryLoading } = useQuery({
    queryKey: ["payroll-summary", currentMonth, currentYear],
    enabled: role === "hr" || role === "employee",
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/hr/payroll-summary?month=${currentMonth}&year=${currentYear}`,
      );
      return res.data;
    },
  });

  // ================= ADMIN PAYROLL =================
  const { data: payrollData = {}, isLoading: payrollLoading } = useQuery({
    queryKey: ["admin-payroll", currentMonth, currentYear],
    enabled: role === "admin",
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/admin/payroll?month=${currentMonth}&year=${currentYear}`,
      );
      return res.data;
    },
  });

  // ================= LOADING =================
  if (
    authLoading ||
    roleLoading ||
    usersLoading ||
    paymentsLoading ||
    pendingLoading ||
    workLoading ||
    empWorkLoading ||
    summaryLoading ||
    payrollLoading
  ) {
    return (
      <p className="text-center py-10 text-gray-500 dark:text-gray-300">
        Loading dashboard...
      </p>
    );
  }

  // ================= DATA =================
  const payments = paymentsData?.payments || [];
  const totalEmployees = usersData.total || 0;

  const totalHours = workData.totalHours || 0;
  const totalWorkHours = empWorkData.reduce(
    (sum, w) => sum + Number(w.hours || 0),
    0,
  );

  // Employee earnings
  const totalEmployeeEarnings = payments.reduce(
    (sum, p) => sum + Number(p.salary || 0),
    0,
  );

  // HR summary
  const totalEmployeesPaid = summaryData.totalEmployeesPaid || 0;
  const totalEmployeesToBePaid = summaryData.totalPending || 0;
  const totalPaidAmountHR = summaryData.totalPaidAmount || 0;

  // ADMIN
  const payrollList = Array.isArray(payrollData)
    ? payrollData
    : payrollData?.payments || [];

  const lastFivePayments = [...payrollList]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const paidList = payrollList.filter((p) => p.paid === true);
  const pendingList = payrollList.filter((p) => !p.paid);

  const totalPaidAmountAdmin = paidList.reduce(
    (sum, p) => sum + Number(p.salary || 0),
    0,
  );

  const totalPendingAmount = pendingList.reduce(
    (sum, p) => sum + Number(p.salary || 0),
    0,
  );

  const totalPayrollAmount = totalPaidAmountAdmin + totalPendingAmount;
  console.log(lastFivePayments);
  // ================= UI =================
  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-[#0f172a]">
      {/* PROFILE */}
      <div className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-xl shadow-sm">
  <div className="flex items-center gap-4">
    <img
      src={user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
      className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-600"
    />

    <div>
      {/* NAME */}
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        {user?.displayName}
      </h2>

      {/* EMAIL */}
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        {user?.email}
      </p>

      {/* ROLE BADGE */}
      <span className="inline-block mt-1 text-xs px-2 py-1 rounded bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 capitalize">
        {role}
      </span>
    </div>
  </div>

  {/* DATE */}
  <div>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      {currentDate.toLocaleDateString()}
    </p>
  </div>
</div>

      {/* ADMIN */}
      {role === "admin" && (
        <div className="grid md:grid-cols-5 gap-6">
          <Card
            title="Employees"
            value={totalEmployees}
            icon={<FaUsers />}
            color="text-blue-500"
          />
          <Card
            title="Total Payroll"
            value={formatMoney(totalPayrollAmount)}
            icon={<FaMoneyCheck />}
            color="text-green-500"
          />
          <Card
            title="Paid"
            value={formatMoney(totalPaidAmountAdmin)}
            icon={<FaMoneyCheck />}
            color="text-emerald-500"
          />
          <Card
            title="Pending"
            value={formatMoney(totalPendingAmount)}
            icon={<FaMoneyCheck />}
            color="text-yellow-500"
          />
          <Card
            title="Approvals"
            value={pendingData.length}
            icon={<FaClipboardList />}
            color="text-red-500"
          />
        </div>
      )}
      {role === "admin" && (
  <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
    <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
      Last 5 Payments
    </h3>

    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
            <th className="py-2">Name</th>
            <th>Email</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Txn ID</th>
          </tr>
        </thead>

        <tbody>
          {lastFivePayments.map((payment, index) => (
            <tr
              key={index}
              className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              {/* NAME */}
              <td className="py-2 font-medium text-gray-800 dark:text-gray-100">
                {payment.name}
              </td>

              {/* EMAIL */}
              <td className="text-gray-600 dark:text-gray-300">
                {payment.email}
              </td>

              {/* AMOUNT */}
              <td className="text-gray-700 dark:text-gray-200">
                {formatMoney(payment.salary)}
              </td>

              {/* STATUS */}
              <td>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    payment.paid
                      ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {payment.paid ? "Paid" : "Pending"}
                </span>
              </td>

              {/* DATE */}
              <td className="text-gray-500 dark:text-gray-400">
                {payment.createdAt
                  ? new Date(payment.createdAt).toLocaleDateString()
                  : "N/A"}
              </td>

              {/* TRANSACTION ID */}
              <td
                className={`text-xs font-mono ${
                  payment.paid
                    ? "text-green-500 dark:text-green-400"
                    : "text-gray-400"
                }`}
              >
                {payment.paid
                  ? payment.transactionId || "Missing"
                  : "Not Paid"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

      {/* HR */}
      {role === "hr" && (
        <div className="grid md:grid-cols-5 gap-6">
          <Card
            title="Work Hours"
            value={totalHours}
            icon={<FaClipboardList />}
            color="text-indigo-500"
          />
          <Card
            title="Employees Paid"
            value={totalEmployeesPaid}
            icon={<FaUsers />}
            color="text-green-500"
          />
          <Card
            title="Pending Salaries"
            value={totalEmployeesToBePaid}
            icon={<FaUsers />}
            color="text-yellow-500"
          />
          <Card
            title="Salary Paid"
            value={formatMoney(totalPaidAmountHR)}
            icon={<FaMoneyCheck />}
            color="text-emerald-500"
          />
          <Card
            title="Avg Salary"
            value={
              totalEmployeesPaid
                ? formatMoney(totalPaidAmountHR / totalEmployeesPaid)
                : "$0"
            }
            icon={<FaFileAlt />}
            color="text-purple-500"
          />
        </div>
      )}

      {/* EMPLOYEE */}
      {role === "employee" && (
        <div className="grid md:grid-cols-4 gap-6">
          <Card
            title="Work Hours"
            value={totalWorkHours}
            icon={<FaClipboardList />}
            color="text-indigo-500"
          />
          <Card
            title="Payments"
            value={payments.length}
            icon={<FaMoneyCheck />}
            color="text-green-500"
          />
          <Card
            title="Earnings"
            value={formatMoney(totalEmployeeEarnings)}
            icon={<FaMoneyCheck />}
            color="text-emerald-500"
          />
          <Card
            title="Pending"
            value={totalEmployeesToBePaid}
            icon={<FaUsers />}
            color="text-yellow-500"
          />
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
