
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useQuery } from "@tanstack/react-query";
import { FaTrash, FaEdit } from "react-icons/fa";
import AuthContext from "../../Contexts/AuthContext/AuthContext";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const WorkSheet = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editItem, setEditItem] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  /* ================= FETCH DATA ================= */
  const { data: works = [], refetch } = useQuery({
    queryKey: ["works", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/works?email=${user.email}`);
      return res.data;
    },
  });

  /* ================= ADD ================= */
  const onSubmit = async (data) => {
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
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    await axiosSecure.delete(`/works/${id}`);
    refetch();
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();
    await axiosSecure.patch(`/works/${editItem._id}`, editItem);
    setEditItem(null);
    refetch();
  };

  return (
    <div className="space-y-6 bg-slate-200 dark:bg-gray-900 p-6 rounded-xl shadow min-h-screen">

      {/* PROFESSIONAL PAGE HEADING */}
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Employee Work Sheet & Daily Task Records
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Track your daily tasks, log work hours, and manage records efficiently.
      </p>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-wrap gap-4 items-center bg-white dark:bg-[#1e293b] p-4 rounded-xl shadow"
      >
        <select
          {...register("task")}
          className="select select-bordered w-40 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
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
          className="input input-bordered w-20 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          required
        />

        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="input input-bordered w-40 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
        />

        <button className="btn btn-primary">Add</button>
      </form>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white dark:bg-[#1e293b] rounded-xl shadow">
        <table className="table w-full text-left">
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
                <td colSpan="4" className="text-center py-6 text-gray-500 dark:text-white ">
                  No work records found
                </td>
              </tr>
            ) : (
              works.map((w) => (
                <tr key={w._id} className="border-b border-gray-200 dark:border-gray-700 dark:text-white">
                  <td className="px-4 py-2">{w.task}</td>
                  <td className="px-4 py-2">{w.hours}</td>
                  <td className="px-4 py-2">{w.date ? new Date(w.date).toLocaleDateString() : "N/A"}</td>
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

      {/* EDIT MODAL */}
      {editItem && (
        <dialog open className="modal">
          <form className="modal-box space-y-4" onSubmit={handleUpdate}>
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
              onChange={(e) =>
                setEditItem({ ...editItem, hours: e.target.value })
              }
              className="input input-bordered w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            />

            <button className="btn btn-primary w-full">Update</button>
            <button
              type="button"
              onClick={() => setEditItem(null)}
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

export default WorkSheet;