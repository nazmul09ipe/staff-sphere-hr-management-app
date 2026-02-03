// src/Pages/Dashboard/HR_Progress.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Contexts/AuthContext/AuthProvider";
import axios from "axios";

const HR_Progress = () => {
  const { token } = useContext(AuthContext);
  const [works, setWorks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch all work records
  const fetchWorks = async () => {
    try {
      const res = await axios.get(`${API_URL}/work-records`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch all employees (for dropdown filter)
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
    if (token) {
      fetchWorks();
      fetchEmployees();
    }
  }, [token]);

  // Filtered works
  const filteredWorks = works.filter((work) => {
    let matchEmployee = true;
    let matchMonth = true;

    if (selectedEmployee) matchEmployee = work.uid === selectedEmployee;
    if (selectedMonth) {
      const workMonth = new Date(work.date).getMonth() + 1;
      matchMonth = workMonth === Number(selectedMonth);
    }

    return matchEmployee && matchMonth;
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Employee Work Progress</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <div>
          <label>Employee: </label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="">All</option>
            {employees.map((emp) => (
              <option key={emp.uid} value={emp.uid}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Month: </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="">All</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full border border-collapse">
        <thead>
          <tr>
            <th className="border px-3 py-2">Employee</th>
            <th className="border px-3 py-2">Task</th>
            <th className="border px-3 py-2">Hours Worked</th>
            <th className="border px-3 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredWorks.map((work) => {
            const employee = employees.find((e) => e.uid === work.uid);
            return (
              <tr key={work._id}>
                <td className="border px-3 py-2">{employee?.name || work.uid}</td>
                <td className="border px-3 py-2">{work.task}</td>
                <td className="border px-3 py-2">{work.hoursWorked}</td>
                <td className="border px-3 py-2">
                  {new Date(work.date).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default HR_Progress;
