import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import AuthContext from "../../Contexts/AuthContext/AuthContext";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useRole from "../../Hooks/useRole";

import { FaUsers, FaMoneyCheck, FaClipboardList } from "react-icons/fa";
import BarChartBox from "../../Components/Charts/BarChartBox";
import DonutChart from "../../Components/Charts/DonutChart";
import StatCard from "../../Components/Charts/StatCard";

// helper
const formatMoney = (amount) => `$${Number(amount || 0).toLocaleString()}`;

const DashboardHome = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const { role, roleLoading } = useRole();

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();

  // ================= USERS =================
  const { data: usersData = {}, isLoading: usersLoading } = useQuery({
    queryKey: ["users-count"],
    enabled: !!user?.email,
    queryFn: async () => (await axiosSecure.get("/users")).data,
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
      return (await axiosSecure.get(endpoint)).data;
    },
  });

  // ================= SUMMARY =================
  const { data: summaryData = {}, isLoading: summaryLoading } = useQuery({
    queryKey: ["summary", currentMonth, currentYear],
    enabled: role === "hr" || role === "employee",
    queryFn: async () =>
      (
        await axiosSecure.get(
          `/hr/payroll-summary?month=${currentMonth}&year=${currentYear}`,
        )
      ).data,
  });

  // ================= ADMIN PAYROLL =================
  const { data: payrollData = {}, isLoading: payrollLoading } = useQuery({
    queryKey: ["admin-payroll", currentMonth, currentYear],
    enabled: role === "admin",
    queryFn: async () =>
      (
        await axiosSecure.get(
          `/admin/payroll?month=${currentMonth}&year=${currentYear}`,
        )
      ).data,
  });

  // ✅ ADMIN PENDING REQUESTS (REAL SOURCE)
  const { data: pendingData = [], isLoading: pendingLoading } = useQuery({
    queryKey: ["pending-approvals"],
    enabled: role === "admin",
    queryFn: async () => (await axiosSecure.get("/admin/payments")).data,
  });

  if (
    authLoading ||
    roleLoading ||
    usersLoading ||
    paymentsLoading ||
    summaryLoading ||
    payrollLoading ||
    pendingLoading
  ) {
    return <p className="text-center py-10">Loading...</p>;
  }

  // ================= DATA =================

  const totalRequests = summaryData.totalRequests || 0;
  const totalPaidEmployeesHR = summaryData.totalEmployeesPaid || 0;
  const totalPendingHR = summaryData.totalPending || 0;
  const totalPaidAmountHR = summaryData.totalPaidAmount || 0;

  const payments = paymentsData?.payments || [];
  const totalEmployees = usersData.total || 0;

  const totalPaidEmployees = payments.filter((p) => p.paid).length;
  const totalPendingEmployees = payments.filter((p) => !p.paid).length;

  const payrollList = Array.isArray(payrollData)
    ? payrollData
    : payrollData?.payments || [];

  const paidList = payrollList.filter((p) => p.paid);

  const totalPaid = paidList.reduce((s, p) => s + Number(p.salary || 0), 0);
  const totalPending = payrollList
    .filter((p) => !p.paid)
    .reduce((s, p) => s + Number(p.salary || 0), 0);

  const totalEmployeeEarnings = payments.reduce(
    (s, p) => s + Number(p.salary || 0),
    0,
  );

  const totalPendingApprovals = Array.isArray(pendingData)
    ? pendingData.length
    : 0;

  // ================= CHART DATA =================
  const donutDataAdmin = [
    { name: "Paid", value: totalPaid },
    { name: "Pending", value: totalPending },
  ];

  const donutDataHR = [
    { name: "Paid", value: totalPaidEmployeesHR },
    { name: "Pending", value: totalPendingHR },
  ];

  // Optional: clean minimal bar chart (based on current month only)
  const hrBarData = [
    {
      name: currentMonth,
      value: totalPaidAmountHR,
    },
  ];
  const donutDataEmployee = [
    { name: "Earned", value: totalEmployeeEarnings },
    { name: "Pending", value: summaryData.totalPending || 0 },
  ];

  // Admin Bar Chart
  const adminBarData = [...payrollList]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .reverse()
    .map((p, i) => ({
      name: `Txn ${i + 1}`,
      value: Number(p.salary || 0),
    }));

  // HR Bar Chart (last 3 months paid salaries)

  // Employee Bar Chart
  const employeeBarData = Object.values(
    payments.reduce((acc, curr) => {
      const date = new Date(curr.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!acc[key]) {
        acc[key] = {
          name: date.toLocaleString("default", { month: "short" }),
          value: 0,
        };
      }
      acc[key].value += Number(curr.salary || 0);
      return acc;
    }, {}),
  ).slice(-5);

  // ================= UI =================
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0f172a] dark:to-[#020617]">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow">
        <div className="flex items-center gap-4">
          <img
            src={user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
            className="w-16 h-16 rounded-full border-2 border-gray-300 dark:border-gray-600"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {user?.displayName || "User"}
            </h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="inline-block mt-1 px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 capitalize">
              {role}
            </span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 text-sm text-gray-500">
          {currentDate.toLocaleDateString()}
        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6">
        {/* Admin */}
        {role === "admin" && (
          <>
            <StatCard
              title="Employees"
              value={totalEmployees}
              icon={<FaUsers />}
              color="text-blue-500"
            />
            <StatCard
              title="Paid"
              value={formatMoney(totalPaid)}
              icon={<FaMoneyCheck />}
              color="text-green-500"
            />
            <StatCard
              title="Pending Salary"
              value={formatMoney(totalPending)}
              icon={<FaMoneyCheck />}
              color="text-yellow-500"
            />
            <StatCard
              title="Pending Approvals"
              value={totalPendingApprovals}
              icon={<FaClipboardList />}
              color="text-red-500"
            />
          </>
        )}

        {/* HR */}
        {role === "hr" && (
          <>
            <StatCard
              title="Total Requests"
              value={totalRequests}
              icon={<FaClipboardList />}
              color="text-blue-500"
            />
            <StatCard
              title="Paid Employees"
              value={totalPaidEmployeesHR}
              icon={<FaUsers />}
              color="text-green-500"
            />
            <StatCard
              title="Pending Requests"
              value={totalPendingHR}
              icon={<FaUsers />}
              color="text-yellow-500"
            />
            <StatCard
              title="Total Paid Amount"
              value={formatMoney(totalPaidAmountHR)}
              icon={<FaMoneyCheck />}
              color="text-purple-500"
            />
          </>
        )}

        {/* Employee */}
        {role === "employee" && (
          <>
            <StatCard
              title="Payments"
              value={payments.length}
              icon={<FaMoneyCheck />}
              color="text-green-500"
            />
            <StatCard
              title="Earnings"
              value={formatMoney(totalEmployeeEarnings)}
              icon={<FaMoneyCheck />}
              color="text-blue-500"
            />
          </>
        )}
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        {/* Donut Charts */}
        {role === "admin" && <DonutChart data={donutDataAdmin} />}
        {role === "hr" && (
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow">
            <h3 className="mb-4 font-semibold">Employee Payment Status</h3>
            <DonutChart data={donutDataHR} />
          </div>
        )}
        {role === "employee" && <DonutChart data={donutDataEmployee} />}

        {/* Bar Charts */}
        {role === "admin" && <BarChartBox data={adminBarData} />}
        {role === "hr" && (
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow">
            <h3 className="mb-4 font-semibold">
              Recent Salaries (Last 3 Months)
            </h3>
            <BarChartBox data={hrBarData} />
          </div>
        )}
        {role === "employee" && <BarChartBox data={employeeBarData} />}
      </div>
    </div>
  );
};

export default DashboardHome;
