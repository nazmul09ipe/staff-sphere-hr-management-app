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

  // ✅ Current Month & Year
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", {
    month: "long",
  });
  const currentYear = currentDate.getFullYear();

  // ✅ Users count
  const { data: usersData = {}, isLoading: usersLoading } = useQuery({
    queryKey: ["users-count"],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // ✅ Payments
  const { data: paymentsData = {}, isLoading: paymentsLoading } = useQuery({
    queryKey: ["payments", user?.email, role],
    enabled: !!user?.email && !!role,
    queryFn: async () => {
      const endpoint =
  role === "admin"
    ? "/payments" // ✅ correct
    : `/payments?email=${user.email}`;
      const res = await axiosSecure.get(endpoint);
      return res.data;
    },
  });

  // ✅ Pending approvals (ADMIN)
  const {
    data: pendingData = [],
    isLoading: pendingLoading,
    refetch: refetchPending,
  } = useQuery({
    queryKey: ["pending-payments"],
    enabled: !!user?.email && role === "admin",
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/payments");
      return res.data;
    },
  });

  // ✅ HR: Work hours
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

  // ✅ Employee: Work hours
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

  // ✅ HR: Payroll
  const { data: payrollData = {}, isLoading: payrollLoading } = useQuery({
    queryKey: ["hr-payroll", currentMonth, currentYear],
    enabled: role === "hr",
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/admin/payroll?month=${currentMonth}&year=${currentYear}`,
      );
      return res.data;
    },
  });

  // ✅ Loading
  if (
    authLoading ||
    roleLoading ||
    usersLoading ||
    paymentsLoading ||
    pendingLoading ||
    workLoading ||
    empWorkLoading ||
    payrollLoading
  ) {
    return (
      <p className="text-center py-10 text-gray-500">
        Loading dashboard data...
      </p>
    );
  }

  // ✅ Format payments
  const payments = Array.isArray(paymentsData)
    ? paymentsData
    : paymentsData?.payments || [];

  const totalEmployees = usersData.total || 0;
  const lastPayments = payments.slice(0, 5);

  // ✅ HR calculations
  const totalHours = workData.totalHours || 0;
  const payrollList = payrollData.payments || [];
  const paidCount = payrollList.filter((p) => p.paid).length;
  const pendingCount = payrollList.filter((p) => !p.paid).length;

  // ✅ Employee calculations
  const totalWorkHours = empWorkData.reduce(
    (sum, w) => sum + Number(w.hours || 0),
    0,
  );

  const totalSalaryEarned = payments.reduce(
    (sum, p) => sum + Number(p.salary || 0),
    0,
  );

  return (
    <div className="bg-slate-100 min-h-screen p-6">
      <div className="flex items-center gap-4 mb-8 bg-white p-5 rounded-xl shadow">
        {/* Profile Image */}
        <img
          src={user?.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
          alt="User"
          className="w-16 h-16 rounded-full object-cover border"
        />

        {/* User Info */}
        <div>
          <h2 className="text-2xl font-bold">{user?.displayName || "User"}</h2>

          <p className="text-gray-500 text-sm">{user?.email}</p>

          {/* Role Badge */}
          <span
            className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
              role === "admin"
                ? "bg-red-100 text-red-600"
                : role === "hr"
                  ? "bg-purple-100 text-purple-600"
                  : "bg-blue-100 text-blue-600"
            }`}
          >
            {role?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Employees */}
        {role !== "employee" && (
          <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
            <FaUsers className="text-4xl text-blue-500" />
            <div>
              <p className="text-gray-500">Total Employees</p>
              <p className="text-2xl font-semibold">{totalEmployees}</p>
            </div>
          </div>
        )}

        {/* Payments */}
        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <FaMoneyCheck className="text-4xl text-green-500" />
          <div>
            <p className="text-gray-500">Total Payments</p>
            <p className="text-2xl font-semibold">{payments.length}</p>
          </div>
        </div>

        {/* Admin */}
        {role === "admin" && (
          <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
            <FaClipboardList className="text-4xl text-red-500" />
            <div>
              <p className="text-gray-500">Pending Approvals</p>
              <p className="text-2xl font-semibold">{pendingData.length}</p>
            </div>
          </div>
        )}

        {/* HR */}
        {role === "hr" && (
          <>
            <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
              <FaClipboardList className="text-4xl text-purple-500" />
              <div>
                <p className="text-gray-500">Work Hours ({currentMonth})</p>
                <p className="text-2xl font-semibold">{totalHours} hrs</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
              <FaMoneyCheck className="text-4xl text-green-500" />
              <div>
                <p className="text-gray-500">Salary Paid</p>
                <p className="text-2xl font-semibold">{paidCount}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
              <FaFileAlt className="text-4xl text-red-500" />
              <div>
                <p className="text-gray-500">Pending Salaries</p>
                <p className="text-2xl font-semibold">{pendingCount}</p>
              </div>
            </div>
          </>
        )}

        {/* Employee */}
        {role === "employee" && (
          <>
            <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
              <FaClipboardList className="text-4xl text-blue-500" />
              <div>
                <p className="text-gray-500">Work Hours ({currentMonth})</p>
                <p className="text-2xl font-semibold">{totalWorkHours} hrs</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
              <FaFileAlt className="text-4xl text-purple-500" />
              <div>
                <p className="text-gray-500">Total Earned</p>
                <p className="text-2xl font-semibold">${totalSalaryEarned}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ✅ Last Payments */}
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
                {role === "admin" && <th>Email</th>}
                <th>Month</th>
                <th>Year</th>
                <th>Amount</th>
                <th>Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {lastPayments.map((pay) => (
                <tr key={pay._id || pay.transactionId}>
                  {role === "admin" && <td>{pay.email}</td>}
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

      {/* ✅ Admin Pending Table */}
      {role === "admin" && (
        <div className="bg-white p-6 rounded-xl shadow overflow-x-auto mt-8">
          <h3 className="text-xl font-semibold mb-4">
            Pending Payment Approvals
          </h3>

          {pendingData.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No pending approvals 🎉
            </p>
          ) : (
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Month</th>
                  <th>Year</th>
                  <th>Salary</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingData.map((item) => (
                  <tr key={item._id}>
                    <td>{item.email}</td>
                    <td>{item.month}</td>
                    <td>{item.year}</td>
                    <td>${item.salary}</td>
                    <td>
                      <button
                        onClick={async () => {
                          await axiosSecure.patch(`/admin/pay/${item._id}`);
                          refetchPending();
                        }}
                        className="btn btn-sm btn-success"
                      >
                        Approve & Pay
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
