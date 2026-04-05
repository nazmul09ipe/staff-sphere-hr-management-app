import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useQuery } from "@tanstack/react-query";
import { FaTrash, FaEdit } from "react-icons/fa";
import AuthContext from "../../Contexts/AuthContext/AuthContext";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const EmployeeWorkSheet = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editItem, setEditItem] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  // ================= FETCH DATA =================
  const { data: works = [], refetch } = useQuery({
    queryKey: ["works", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/works?email=${user.email}`);
      return res.data;
    },
  });

  // ================= ADD =================
  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        name: user.displayName,
        hours: Number(data.hours),
        date: selectedDate.toISOString(),
        email: user.email,
      };

      await axiosSecure.post("/works", payload);
      reset();
      refetch();
    } catch (err) {
      console.error(err);
      alert("Failed to add work entry.");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await axiosSecure.delete(`/works/${id}`);
      refetch();
    } catch (err) {
      console.error(err);
      alert("Failed to delete work entry.");
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosSecure.patch(`/works/${editItem._id}`, editItem);
      setEditItem(null);
      refetch();
    } catch (err) {
      console.error(err);
      alert("Failed to update work entry.");
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6 bg-slate-100 dark:bg-gray-900">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          Employee Work Sheet & Daily Task Records
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          Track your daily tasks, log work hours, and manage records efficiently.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row gap-4 items-center bg-white dark:bg-[#1e293b] p-4 rounded-xl shadow flex-wrap"
      >
        <select
          {...register("task")}
          className="select select-bordered w-full sm:w-40 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          required
        >
          <option>Sales</option>
          <option>Support</option>
          <option>Content</option>
          <option>Paper-work</option>
        </select>

        <input
          type="number"
          {...register("hours")}
          placeholder="Hours"
          min={0}
          className="input input-bordered w-full sm:w-20 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          required
        />

        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="input input-bordered w-full sm:w-40 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
        />

        <button
          type="submit"
          className="btn btn-primary w-full sm:w-auto mt-2 sm:mt-0"
        >
          Add
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-[#1e293b] rounded-xl shadow">
        <table className="min-w-full table-auto text-left text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700 dark:text-white">
            <tr>
              <th className="px-4 py-2">Task</th>
              <th className="px-4 py-2">Hours</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {works.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500 dark:text-white">
                  No work records found
                </td>
              </tr>
            ) : (
              works.map((w) => (
                <tr
                  key={w._id}
                  className="border-b border-gray-200 dark:border-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-[#334155] transition"
                >
                  <td className="px-4 py-2">{w.task}</td>
                  <td className="px-4 py-2">{w.hours}</td>
                  <td className="px-4 py-2">
                    {w.date ? new Date(w.date).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-4 py-2 flex gap-3">
                    <FaEdit
                      className="cursor-pointer text-blue-500 hover:text-blue-600"
                      onClick={() => setEditItem(w)}
                    />
                    <FaTrash
                      className="cursor-pointer text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(w._id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center px-4"
          onClick={() => setEditItem(null)}
        >
          <form
            className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md space-y-4"
            onSubmit={handleUpdate}
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
          >
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
              Edit Work Entry
            </h3>

            <select
              value={editItem.task}
              onChange={(e) =>
                setEditItem({ ...editItem, task: e.target.value })
              }
              className="select select-bordered w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            >
              <option>Sales</option>
              <option>Support</option>
              <option>Content</option>
              <option>Paper-work</option>
            </select>

            <input
              type="number"
              value={editItem.hours}
              min={0}
              onChange={(e) =>
                setEditItem({ ...editItem, hours: Number(e.target.value) })
              }
              className="input input-bordered w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <button type="submit" className="btn btn-primary w-full sm:w-auto">
                Update
              </button>
              <button
                type="button"
                onClick={() => setEditItem(null)}
                className="btn w-full sm:w-auto"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmployeeWorkSheet;