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

  /* ================= FETCH EMPLOYEES ================= */

  const { data: employees = [], refetch } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users?role=employee");
      return res.data;
    },
  });

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
      status: "pending",
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

                {/* VERIFIED */}
                <td>
                  <button onClick={() => toggleVerify(emp)}>
                    {emp.isVerified === true ? (
                      <FaCheck className="text-green-500 text-xl" />
                    ) : (
                      <FaTimes className="text-red-500 text-xl" />
                    )}
                  </button>
                </td>

                {/* BANK */}
                <td>{emp.bank_account_no}</td>

                {/* SALARY */}
                <td>${emp.salary}</td>

                {/* PAY */}
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

                {/* DETAILS */}
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
