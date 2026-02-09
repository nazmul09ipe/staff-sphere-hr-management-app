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
    <div className="space-y-6 bg-slate-100 dark:bg-gray-900 p-4 rounded-xl shadow">
      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-4 items-center flex-wrap bg-white p-4 rounded-xl shadow"
      >
        <select {...register("task")} className="select select-bordered">
          <option>Sales</option>
          <option>Support</option>
          <option>Content</option>
          <option>Paper-work</option>
        </select>

        <input
          type="number"
          {...register("hours")}
          placeholder="Hours"
          className="input input-bordered"
          required
        />

        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="input input-bordered"
        />

        <button className="btn btn-primary">Add</button>
      </form>

      {/* TABLE */}

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Hours</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {works.map((w) => (
              <tr key={w._id}>
                <td>{w.task}</td>
                <td>{w.hours}</td>
                <td>
                  {w.date ? new Date(w.date).toLocaleDateString() : "N/A"}
                </td>
                <td className="flex gap-3">
                  <FaEdit
                    className="cursor-pointer text-blue-500"
                    onClick={() => setEditItem(w)}
                  />

                  <FaTrash
                    className="cursor-pointer text-red-500"
                    onClick={() => handleDelete(w._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}

      {editItem && (
        <dialog open className="modal">
          <form className="modal-box space-y-4" onSubmit={handleUpdate}>
            <h3 className="font-bold text-lg">Edit Work</h3>

            <select
              value={editItem.task}
              onChange={(e) =>
                setEditItem({ ...editItem, task: e.target.value })
              }
              className="select select-bordered w-full"
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
              className="input input-bordered w-full"
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
