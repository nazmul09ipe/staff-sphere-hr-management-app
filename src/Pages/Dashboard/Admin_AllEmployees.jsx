// src/Pages/Dashboard/Admin_AllEmployees.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Contexts/AuthContext/AuthProvider";
import axios from "axios";

const Admin_AllEmployees = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [editingSalaryId, setEditingSalaryId] = useState(null);
  const [salaryInput, setSalaryInput] = useState("");

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  // Make HR
  const handleMakeHR = async (uid) => {
    try {
      await axios.patch(`${API_URL}/users/make-hr/${uid}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Fire user
  const handleFire = async (uid) => {
    if (!window.confirm("Are you sure you want to fire this user?")) return;
    try {
      await axios.patch(`${API_URL}/users/fire/${uid}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Update Salary
  const handleUpdateSalary = async (uid) => {
    try {
      await axios.patch(
        `${API_URL}/users/salary/${uid}`,
        { salary: salaryInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingSalaryId(null);
      setSalaryInput("");
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Employees & HRs</h2>
      <table className="min-w-full border border-collapse">
        <thead>
          <tr>
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Designation</th>
            <th className="border px-3 py-2">Role</th>
            <th className="border px-3 py-2">Salary</th>
            <th className="border px-3 py-2">Make HR</th>
            <th className="border px-3 py-2">Fire</th>
            <th className="border px-3 py-2">Adjust Salary</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid}>
              <td className="border px-3 py-2">{user.name}</td>
              <td className="border px-3 py-2">{user.designation || "-"}</td>
              <td className="border px-3 py-2">{user.role}</td>
              <td className="border px-3 py-2">
                {editingSalaryId === user.uid ? (
                  <input
                    type="number"
                    value={salaryInput}
                    onChange={(e) => setSalaryInput(e.target.value)}
                    className="border px-2 py-1 w-24"
                  />
                ) : (
                  user.salary || "-"
                )}
              </td>
              <td className="border px-3 py-2">
                {user.role === "employee" ? (
                  <button
                    onClick={() => handleMakeHR(user.uid)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Make HR
                  </button>
                ) : (
                  "-"
                )}
              </td>
              <td className="border px-3 py-2">
                {user.fired ? (
                  "Fired"
                ) : (
                  <button
                    onClick={() => handleFire(user.uid)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Fire
                  </button>
                )}
              </td>
              <td className="border px-3 py-2">
                {editingSalaryId === user.uid ? (
                  <>
                    <button
                      onClick={() => handleUpdateSalary(user.uid)}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setEditingSalaryId(null)}
                      className="bg-gray-500 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditingSalaryId(user.uid);
                      setSalaryInput(user.salary || "");
                    }}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
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

export default Admin_AllEmployees;
