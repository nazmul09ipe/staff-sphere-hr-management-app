// src/Pages/Dashboard/HR_Employee_List.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Contexts/AuthContext/AuthProvider";
import axios from "axios";

const HR_Employee_List = () => {
  const { token } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchEmployees();
  }, [token]);

  // Toggle verification
  const toggleVerification = async (id, currentStatus) => {
    try {
      await axios.patch(
        `${API_URL}/users/${id}/verify`,
        { isVerified: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === id ? { ...emp, isVerified: !currentStatus } : emp
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Submit payroll request
  const submitPayroll = async () => {
    if (!selectedEmployee) return;
    try {
      await axios.post(
        `${API_URL}/payroll`,
        {
          employeeId: selectedEmployee.uid,
          month,
          year,
          amount: selectedEmployee.salary,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Payment request submitted successfully!");
      setSelectedEmployee(null); // close modal
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Employee List</h2>
      <table className="min-w-full border border-collapse">
        <thead>
          <tr>
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2">Verified</th>
            <th className="border px-3 py-2">Bank Account</th>
            <th className="border px-3 py-2">Salary</th>
            <th className="border px-3 py-2">Pay</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td className="border px-3 py-2">{emp.name}</td>
              <td className="border px-3 py-2">{emp.email}</td>
              <td className="border px-3 py-2 text-center">
                <button
                  onClick={() => toggleVerification(emp._id, emp.isVerified)}
                  className="px-2 py-1 border rounded"
                >
                  {emp.isVerified ? "✅" : "❌"}
                </button>
              </td>
              <td className="border px-3 py-2">{emp.bank_account_no || "-"}</td>
              <td className="border px-3 py-2">${emp.salary}</td>
              <td className="border px-3 py-2">
                <button
                  onClick={() => setSelectedEmployee(emp)}
                  disabled={!emp.isVerified}
                  className={`px-2 py-1 rounded ${
                    emp.isVerified
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Pay
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for payroll */}
      {selectedEmployee && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-4 rounded w-96">
            <h3 className="text-lg font-bold mb-2">
              Pay {selectedEmployee.name}
            </h3>
            <div className="flex flex-col gap-2">
              <div>
                <label>Month: </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label>Year: </label>
                <input
                  type="number"
                  min="2000"
                  max="2100"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label>Amount: </label>
                <input
                  type="number"
                  value={selectedEmployee.salary}
                  readOnly
                  className="border px-2 py-1 rounded bg-gray-100"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={submitPayroll}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Submit
                </button>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HR_Employee_List;
