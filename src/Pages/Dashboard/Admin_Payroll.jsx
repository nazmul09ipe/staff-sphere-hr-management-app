// src/Pages/Dashboard/Admin_Payroll.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Contexts/AuthContext/AuthProvider";
import axios from "axios";

const Admin_Payroll = () => {
  const { token } = useContext(AuthContext);
  const [payrolls, setPayrolls] = useState([]);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch all payroll requests
  const fetchPayrolls = async () => {
    try {
      const res = await axios.get(`${API_URL}/payroll`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayrolls(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchPayrolls();
  }, [token]);

  // Approve payment
  const handlePay = async (payrollId) => {
    try {
      await axios.patch(`${API_URL}/payroll/pay/${payrollId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPayrolls();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Payroll Approvals</h2>
      <table className="min-w-full border border-collapse">
        <thead>
          <tr>
            <th className="border px-3 py-2">Employee Name</th>
            <th className="border px-3 py-2">Salary</th>
            <th className="border px-3 py-2">Month</th>
            <th className="border px-3 py-2">Year</th>
            <th className="border px-3 py-2">Payment Date</th>
            <th className="border px-3 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {payrolls.map((pay) => (
            <tr key={pay._id}>
              <td className="border px-3 py-2">{pay.employeeName || pay.employeeId}</td>
              <td className="border px-3 py-2">{pay.amount}</td>
              <td className="border px-3 py-2">{pay.month}</td>
              <td className="border px-3 py-2">{pay.year}</td>
              <td className="border px-3 py-2">
                {pay.paid ? new Date(pay.paymentDate).toLocaleDateString() : "-"}
              </td>
              <td className="border px-3 py-2">
                {pay.paid ? (
                  "Paid"
                ) : (
                  <button
                    onClick={() => handlePay(pay._id)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Pay
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin_Payroll;
