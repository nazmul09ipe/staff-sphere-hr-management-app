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
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex items-center gap-4 hover:shadow-lg transition">
    <div className={`text-3xl ${color}`}>{icon}</div>
    <div>
      <p className="text-gray-500 dark:text-gray-300">{title}</p>
      <p className="text-xl font-bold text-gray-800 dark:text-white">{value}</p>
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
    <div className="min-h-screen p-6 bg-gradient-to-b from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      {/* PROFILE */}
      <div className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
        <div className="flex items-center gap-4">
          <img
            src={user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h2 className="text-xl font-bold">{user?.displayName}</h2>
            <p>{user?.email}</p>
            <span className="text-xs bg-blue-100 px-2 py-1 rounded">
              {role}
            </span>
          </div>
        </div>

        <div>
          <p>{currentDate.toLocaleDateString()}</p>
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
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
            Last 5 Payments
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="border-b dark:border-gray-700">
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
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-2">{payment.name}</td>
                    <td>{payment.email}</td>
                    <td>{formatMoney(payment.salary)}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          payment.paid
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {payment.paid ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td>
                      {payment.createdAt
                        ? new Date(payment.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td
                      className={`text-xs ${
                        payment.paid ? "text-green-500" : "text-gray-400"
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
