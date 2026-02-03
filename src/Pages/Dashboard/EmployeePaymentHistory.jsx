// src/Pages/Dashboard/EmployeePaymentHistory.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Contexts/AuthContext/AuthProvider";
import axios from "axios";

const EmployeePaymentHistory = () => {
  const { user, token } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${API_URL}/payroll`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter only current user's records
      const userPayments = res.data.filter(
        (p) => p.employeeId === user.uid
      );

      // Sort by year & month ascending
      userPayments.sort(
        (a, b) =>
          new Date(a.year, a.month - 1) - new Date(b.year, b.month - 1)
      );

      setPayments(userPayments);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user && token) fetchPayments();
  }, [user, token]);

  // Pagination
  const paginatedPayments = payments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(payments.length / itemsPerPage);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Payment History</h2>

      <table className="min-w-full border border-collapse">
        <thead>
          <tr>
            <th className="border px-3 py-2">Month</th>
            <th className="border px-3 py-2">Year</th>
            <th className="border px-3 py-2">Amount</th>
            <th className="border px-3 py-2">Transaction Id</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPayments.map((p) => (
            <tr key={p._id}>
              <td className="border px-3 py-2">{p.month}</td>
              <td className="border px-3 py-2">{p.year}</td>
              <td className="border px-3 py-2">${p.amount}</td>
              <td className="border px-3 py-2">{p.transactionId || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-3 py-1 border rounded ${
                page === currentPage ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeePaymentHistory;
