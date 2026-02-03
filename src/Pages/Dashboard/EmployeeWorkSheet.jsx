// src/Pages/Dashboard/EmployeeWorkSheet.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Contexts/AuthContext/AuthProvider";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EmployeeWorkSheet = () => {
  const { user, token } = useContext(AuthContext); // Firebase user & JWT token
  const [task, setTask] = useState("Sales");
  const [hoursWorked, setHoursWorked] = useState(0);
  const [date, setDate] = useState(new Date());
  const [workRecords, setWorkRecords] = useState([]);
  const [editId, setEditId] = useState(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchWork = async () => {
    try {
      const res = await axios.get(`${API_URL}/work`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user && token) fetchWork();
  }, [user, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newWork = {
      task,
      hoursWorked,
      date: date.toISOString(),
      month: date.getMonth() + 1,
    };

    try {
      if (editId) {
        // Update existing work
        await axios.patch(`${API_URL}/work/${editId}`, newWork, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditId(null);
      } else {
        // Add new work
        const res = await axios.post(`${API_URL}/work`, newWork, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkRecords([res.data, ...workRecords]);
      }
      setTask("Sales");
      setHoursWorked(0);
      setDate(new Date());
      fetchWork();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (record) => {
    setEditId(record._id);
    setTask(record.task);
    setHoursWorked(record.hoursWorked);
    setDate(new Date(record.date));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/work/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkRecords(workRecords.filter((w) => w._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Work Sheet</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-4 mb-6 flex-wrap"
      >
        <div>
          <label>Task</label>
          <select
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="border px-2 py-1 rounded ml-2"
          >
            <option>Sales</option>
            <option>Support</option>
            <option>Content</option>
            <option>Paper-work</option>
          </select>
        </div>

        <div>
          <label>Hours Worked</label>
          <input
            type="number"
            value={hoursWorked}
            onChange={(e) => setHoursWorked(Number(e.target.value))}
            className="border px-2 py-1 rounded ml-2 w-20"
          />
        </div>

        <div>
          <label>Date</label>
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            className="border px-2 py-1 rounded ml-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editId ? "Update" : "Add"}
        </button>
      </form>

      {/* Table */}
      <table className="min-w-full border border-collapse">
        <thead>
          <tr>
            <th className="border px-3 py-2">Task</th>
            <th className="border px-3 py-2">Hours</th>
            <th className="border px-3 py-2">Date</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {workRecords.map((rec) => (
            <tr key={rec._id}>
              <td className="border px-3 py-2">{rec.task}</td>
              <td className="border px-3 py-2">{rec.hoursWorked}</td>
              <td className="border px-3 py-2">
                {new Date(rec.date).toLocaleDateString()}
              </td>
              <td className="border px-3 py-2 flex gap-2">
                <button
                  onClick={() => handleEdit(rec)}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(rec._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeWorkSheet;
