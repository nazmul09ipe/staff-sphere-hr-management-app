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

  /* ================= FETCH EMPLOYEES ================= */

  const { data = {}, refetch } = useQuery({
    queryKey: ["employees", page],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users?role=employee&page=${page}&limit=${limit}`
      );
      return res.data;
    },
  });

  const employees = data.employees || [];
  const totalPages = Math.ceil((data.total || 0) / limit);

  /* ================= FETCH PAYROLL HISTORY ================= */

  const { data: payrollHistory = [] } = useQuery({
    queryKey: ["payroll-history", payUser?._id],
    enabled: !!payUser,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payroll/${payUser._id}`);
      return res.data;
    },
  });

  /* ================= FILTER PAID MONTHS ================= */

  const paidMonths = payrollHistory
    .filter((p) => p.year === Number(selectedYear))
    .map((p) => p.month);

  /* ================= DUPLICATE CHECK ================= */

  const isDuplicate = payrollHistory.some(
    (p) =>
      p.month === selectedMonth &&
      p.year === Number(selectedYear)
  );

  /* ================= TOGGLE VERIFY ================= */

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

      Swal.fire({
        icon: "success",
        title: `${action}d!`,
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  /* ================= PAY SUBMIT ================= */

  const onPay = async (formData) => {
    // 🔒 extra safety
    const duplicateNow = payrollHistory.some(
      (p) =>
        p.month === formData.month &&
        p.year === Number(formData.year)
    );

    if (duplicateNow) {
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

      Swal.fire({
        icon: "success",
        title: "Request Sent!",
        text: "Salary payment request sent to admin.",
      });

      reset();
      setPayUser(null);

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response?.data?.message || "Something went wrong!",
      });
    }
  };

  return (
    <div className="bg-slate-100 p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Employee List</h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Verified</th>
              <th>Bank</th>
              <th>Salary</th>
              <th>Pay</th>
              <th>Details</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>

                <td>
                  <button onClick={() => toggleVerify(emp)}>
                    {emp.isVerified ? (
                      <FaCheck className="text-green-500 text-xl" />
                    ) : (
                      <FaTimes className="text-red-500 text-xl" />
                    )}
                  </button>
                </td>

                <td>{emp.bank_account_no}</td>
                <td>${emp.salary}</td>

                <td>
                  <button
                    disabled={!emp.isVerified}
                    onClick={() => setPayUser(emp)}
                    className={`btn btn-xs ${
                      emp.isVerified ? "btn-primary" : "btn-disabled"
                    }`}
                  >
                    <FaMoneyCheckAlt />
                  </button>
                </td>

                <td>
                  <Link to={`/dashboard/employee-details/${emp.email}`}>
                    <FaInfoCircle className="text-xl text-blue-500" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}

      <div className="flex justify-center gap-2 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="btn"
        >
          Prev
        </button>

        {[...Array(totalPages).keys()].map((num) => (
          <button
            key={num}
            onClick={() => setPage(num + 1)}
            className={`btn ${page === num + 1 && "btn-primary"}`}
          >
            {num + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="btn"
        >
          Next
        </button>
      </div>

      {/* PAY MODAL */}

      {payUser && (
        <dialog open className="modal">
          <form onSubmit={handleSubmit(onPay)} className="modal-box space-y-4">
            <h3 className="font-bold text-lg">Pay Salary</h3>

            <input
              value={payUser.salary}
              readOnly
              className="input input-bordered w-full"
            />

            {/* MONTH */}
            <select
              {...register("month")}
              required
              className="input input-bordered w-full"
            >
              <option value="">Select Month</option>
              {months.map((m) => (
                <option
                  key={m}
                  value={m}
                  disabled={paidMonths.includes(m)}
                >
                  {m} {paidMonths.includes(m) ? "(Paid)" : ""}
                </option>
              ))}
            </select>

            {/* YEAR */}
            <input
              {...register("year")}
              placeholder="Year (e.g. 2025)"
              required
              className="input input-bordered w-full"
            />

            {/* ⚠️ WARNING */}
            {isDuplicate && (
              <p className="text-red-500 text-sm">
                Salary already requested for this month & year
              </p>
            )}

            {/* SUBMIT */}
            <button
              disabled={isDuplicate}
              className={`btn w-full ${
                isDuplicate ? "btn-disabled" : "btn-primary"
              }`}
            >
              {isDuplicate ? "Already Requested" : "Payment Request to Admin"}
            </button>

            <button
              type="button"
              onClick={() => setPayUser(null)}
              className="btn w-full"
            >
              Close
            </button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default HrEmployeeList;