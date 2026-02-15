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

const HrEmployeeList = () => {
  const axiosSecure = useAxiosSecure();
  const [payUser, setPayUser] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const [page, setPage] = useState(1);
  const limit = 8;

  /* ================= FETCH EMPLOYEES ================= */

  const { data = {}, refetch } = useQuery({
    queryKey: ["employees", page],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users?role=employee&page=${page}&limit=${limit}`,
      );
      return res.data;
    },
  });

  const employees = data.employees || [];
  const totalPages = Math.ceil((data.total || 0) / limit);

  /* ================= TOGGLE VERIFY ================= */

  const toggleVerify = async (user) => {
    await axiosSecure.patch(`/users/verify/${user._id}`, {
      isVerified: !user.isVerified,
    });

    refetch();
  };

  /* ================= PAY SUBMIT ================= */

  const onPay = async (data) => {
    const payroll = {
  employeeId: payUser._id,
  name: payUser.name,
  email: payUser.email,
  salary: payUser.salary,
  month: data.month,
  year: data.year,
  paid: false,
  createdAt: new Date(),
};


    await axiosSecure.post("/payroll", payroll);


    reset();
    setPayUser(null);
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
                    <FaInfoCircle className="text-xl cursor-pointer text-blue-500" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}

      <div className="flex items-center justify-center gap-2 mt-8">
        {/* Previous */}

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-2 rounded-lg border transition
      ${
        page === 1
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600 text-white border-blue-300"
      }
    `}
        >
          Prev
        </button>

        {/* Page Numbers */}

        {[...Array(totalPages).keys()].map((num) => (
          <button
            key={num}
            onClick={() => setPage(num + 1)}
            className={`w-8 h-8 rounded-full transition font-semibold
        ${
          page === num + 1
            ? "bg-blue-600 text-white shadow"
            : "bg-white border hover:bg-blue-50"
        }
      `}
          >
            {num + 1}
          </button>
        ))}

        {/* Next */}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className={`px-4 py-2 rounded-lg border transition
      ${
        page === totalPages
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }
    `}
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

            <input
              {...register("month")}
              placeholder="Month"
              required
              className="input input-bordered w-full"
            />
            <input
              {...register("year")}
              placeholder="Year"
              required
              className="input input-bordered w-full"
            />

            <button className="btn btn-primary w-full">Pay</button>

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
