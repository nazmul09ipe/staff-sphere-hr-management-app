import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import {
  FaCheck,
  FaTimes,
  FaMoneyCheckAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { Link } from "react-router";
import Swal from "sweetalert2";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const HrEmployeeList = () => {
  const axiosSecure = useAxiosSecure();
  const [payUser, setPayUser] = useState(null);
  const { register, handleSubmit, reset, watch } = useForm();
  const [page, setPage] = useState(1);
  const limit = 8;

  const selectedYear = watch("year");
  const selectedMonth = watch("month");

  const { data = {}, refetch } = useQuery({
    queryKey: ["employees", page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?role=employee&page=${page}&limit=${limit}`);
      return res.data;
    },
  });

  const employees = data.employees || [];
  const totalPages = Math.ceil((data.total || 0) / limit);

  const { data: payrollHistory = [] } = useQuery({
    queryKey: ["payroll-history", payUser?._id],
    enabled: !!payUser,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payroll/${payUser._id}`);
      return res.data;
    },
  });

  const paidMonths = payrollHistory
    .filter((p) => p.year === Number(selectedYear))
    .map((p) => p.month);

  const isDuplicate = payrollHistory.some(
    (p) => p.month === selectedMonth && p.year === Number(selectedYear)
  );

  const toggleVerify = async (user) => {
    const action = user.isVerified ? "Unverify" : "Verify";
    const result = await Swal.fire({
      title: `${action} Employee?`,
      text: `Are you sure you want to ${action.toLowerCase()} this employee?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
    });

    if (result.isConfirmed) {
      await axiosSecure.patch(`/users/verify/${user._id}`, {
        isVerified: !user.isVerified,
      });
      refetch();
      Swal.fire({ icon: "success", title: `${action}d!`, timer: 1200, showConfirmButton: false });
    }
  };

  const onPay = async (formData) => {
    if (payrollHistory.some(p => p.month === formData.month && p.year === Number(formData.year))) {
      return Swal.fire({
        icon: "warning",
        title: "Duplicate!",
        text: "Salary already requested for this month & year",
      });
    }

    const payroll = {
      employeeId: payUser._id,
      name: payUser.name,
      email: payUser.email,
      salary: payUser.salary,
      month: formData.month,
      year: Number(formData.year),
      paid: false,
      createdAt: new Date(),
    };

    try {
      await axiosSecure.post("/payroll", payroll);
      Swal.fire({ icon: "success", title: "Request Sent!", text: "Salary payment request sent to admin." });
      reset();
      setPayUser(null);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Oops...", text: err.response?.data?.message || "Something went wrong!" });
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-[#0f172a] p-6 min-h-screen text-gray-800 dark:text-gray-100 rounded-xl">
      <h2 className="text-3xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Employee List</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Manage employee verification and salary requests</p>

      <div className="overflow-x-auto bg-white dark:bg-[#1e293b] rounded-xl shadow">
        <table className="min-w-full text-sm table-fixed bg-blue-100 dark:bg-[#1e293b]">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
              <th className="py-3 px-4 text-left w-[20%]">Name</th>
              <th className="px-4 w-[25%] text-left">Email</th>
              <th className="px-4 w-[10%] text-center">Verified</th>
              <th className="px-4 w-[10%] text-left">Bank</th>
              <th className="px-4 w-[10%] text-right">Salary</th>
              <th className="px-4 w-[10%] text-center">Pay</th>
              <th className="px-4 w-[10%] text-center">Details</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp._id}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#334155] transition"
              >
                <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-100">{emp.name}</td>
                <td className="px-4 text-gray-600 dark:text-gray-300">{emp.email}</td>
                <td className="px-4 text-center">
                  <button onClick={() => toggleVerify(emp)}>
                    {emp.isVerified ? (
                      <FaCheck className="text-green-500 text-xl" />
                    ) : (
                      <FaTimes className="text-red-500 text-xl" />
                    )}
                  </button>
                </td>
                <td className="px-4">{emp.bank_account_no}</td>
                <td className="px-4 text-right">${emp.salary}</td>
                <td className="px-4 text-center">
                  <button
                    disabled={!emp.isVerified}
                    onClick={() => setPayUser(emp)}
                    className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-sm font-medium transition ${
                      emp.isVerified
                        ? "bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                    }`}
                  >
                    <FaMoneyCheckAlt />
                  </button>
                </td>
                <td className="px-4 text-center">
                  <Link to={`/dashboard/employee-details/${emp.email}`}>
                    <FaInfoCircle className="text-xl text-blue-500 dark:text-blue-400" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6 flex-wrap">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            page === 1
              ? "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          }`}
        >
          Prev
        </button>

        {[...Array(totalPages).keys()].map((num) => (
          <button
            key={num}
            onClick={() => setPage(num + 1)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              page === num + 1
                ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white"
                : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {num + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            page === totalPages
              ? "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>

      {/* Pay Modal */}
      {payUser && (
        <dialog open className="modal">
          <form
            onSubmit={handleSubmit(onPay)}
            className="modal-box space-y-4 bg-white dark:bg-[#1e293b] text-gray-800 dark:text-gray-100 rounded-xl"
          >
            <h3 className="font-bold text-lg">Pay Salary</h3>
            <input
              value={payUser.salary}
              readOnly
              className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100"
            />
            <select
              {...register("month")}
              required
              className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Select Month</option>
              {months.map((m) => (
                <option key={m} value={m} disabled={paidMonths.includes(m)}>
                  {m} {paidMonths.includes(m) ? "(Paid)" : ""}
                </option>
              ))}
            </select>
            <input
              {...register("year")}
              placeholder="Year (e.g. 2025)"
              required
              className="input input-bordered w-full dark:bg-gray-700 dark:text-gray-100"
            />
            {isDuplicate && <p className="text-red-500 text-sm">Salary already requested for this month & year</p>}
            <button
              disabled={isDuplicate}
              className={`btn w-full ${isDuplicate ? "btn-disabled" : "btn-primary text-white"}`}
            >
              {isDuplicate ? "Already Requested" : "Payment Request to Admin"}
            </button>
            <button type="button" onClick={() => setPayUser(null)} className="btn w-full mt-2">
              Close
            </button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default HrEmployeeList;