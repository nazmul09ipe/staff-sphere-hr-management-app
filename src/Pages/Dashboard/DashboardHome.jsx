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

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
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
        role === "admin" ? "/payments" : `/payments?email=${user.email}`;
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

  // ================= SUMMARY (HR + EMPLOYEE) =================
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
        Loading dashboard data...
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

  // HR / Employee
  const totalEmployeesPaid = summaryData.totalEmployeesPaid || 0;
  const totalEmployeesToBePaid = summaryData.totalPending || 0;
  const totalPaidAmountHR = summaryData.totalPaidAmount || 0;

  // ADMIN CALCULATION
  const payrollList = payrollData?.payments || [];

 const paidList = payrollList.filter(
  (p) => p.paid === true || p.paid === "true" || p.status === "paid"
);

const pendingList = payrollList.filter(
  (p) => p.paid !== true && p.paid !== "true" && p.status !== "paid"
);

  const totalPaidEmployeesAdmin = paidList.length;
  

  const totalPaidAmountAdmin = paidList.reduce(
    (sum, p) => sum + Number(p.salary || 0),
    0,
  );

  const totalPendingAmount = pendingList.reduce(
    (sum, p) => sum + Number(p.salary || 0),
    0,
  );

  const totalPayrollAmount = totalPaidAmountAdmin + totalPendingAmount;

  // ================= UI =================
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      {/* PROFILE + DATE */}
      <div className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg">
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

        <div className="text-right">
          <p>Today</p>
          <p className="text-xl font-bold">
            {currentDate.toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {role !== "employee" && (
          <div className="bg-white p-6 rounded-xl shadow flex gap-4">
            <FaUsers className="text-3xl text-blue-500" />
            <div>
              <p>Total Employees</p>
              <p className="text-xl font-bold">{totalEmployees}</p>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow flex gap-4">
          <FaMoneyCheck className="text-3xl text-green-500" />
          <div>
            <p>Total Payments</p>
            <p className="text-xl font-bold">{payments.length}</p>
          </div>
        </div>

        {role === "admin" && (
          <div className="bg-white p-6 rounded-xl shadow flex gap-4">
            <FaClipboardList className="text-3xl text-red-500" />
            <div>
              <p>Pending Approvals</p>
              <p className="text-xl font-bold">{pendingData.length}</p>
            </div>
          </div>
        )}
      </div>

      {/* HR / EMPLOYEE */}
      {(role === "hr" || role === "employee") && (
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card
            title="Work Hours"
            value={role === "hr" ? totalHours : totalWorkHours}
          />
          <Card title="Employees Paid" value={totalEmployeesPaid} />
          <Card title="Pending Salaries" value={totalEmployeesToBePaid} />
          <Card title="Paid Amount" value={`$${totalPaidAmountHR}`} />
        </div>
      )}

      {/* ADMIN */}
      {role === "admin" && (
        <>
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <Card title="Total Payroll" value={`$${totalPayrollAmount}`} />
            <Card title="Paid Employees" value={totalPaidEmployeesAdmin} />
            <Card title="Paid Amount" value={`$${totalPaidAmountAdmin}`} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Pending Approvals
            </h3>

            {pendingData.length === 0 ? (
              <p className="text-gray-500">No pending approvals</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left border-b">Email</th>
                      <th className="px-4 py-2 text-left border-b">Month</th>
                      <th className="px-4 py-2 text-left border-b">Year</th>
                      <th className="px-4 py-2 text-left border-b">Salary</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pendingData.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b">{item.email}</td>
                        <td className="px-4 py-2 border-b">{item.month}</td>
                        <td className="px-4 py-2 border-b">{item.year}</td>
                        <td className="px-4 py-2 border-b">${item.salary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// reusable card
const Card = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <p>{title}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

export default DashboardHome;
