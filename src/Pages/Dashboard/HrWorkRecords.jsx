import { Fragment, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Listbox, Transition } from "@headlessui/react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const HrWorkRecords = () => {
  const axiosSecure = useAxiosSecure();

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()]
  );

  /* ================= EMPLOYEES ================= */

  const { data } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users?role=employee");
      return res.data;
    },
  });

  const employees = data?.employees || [];

  /* ================= WORK RECORDS ================= */

  const { data: works = [], isLoading } = useQuery({
    queryKey: ["works", selectedEmployee?.email, selectedMonth],
    queryFn: async () => {
      const res = await axiosSecure.get("/works", {
        params: {
          email: selectedEmployee?.email,
          month: selectedMonth,
        },
      });
      return res.data;
    },
  });

  return (
    <div className="bg-slate-100 min-h-screen p-6">

      <h2 className="text-2xl font-bold mb-6">Employee Work Records</h2>

      {/* FILTERS */}
      <div className="flex gap-4 mb-6">

        {/* EMPLOYEE */}
        <Listbox value={selectedEmployee} onChange={setSelectedEmployee}>
          <div className="relative w-64">
            <Listbox.Button className="w-full bg-white border rounded-lg px-4 py-2 text-left shadow">
              {selectedEmployee?.name || "All Employees"}
            </Listbox.Button>

            <Transition as={Fragment}>
              <Listbox.Options className="absolute z-10 w-full bg-white shadow rounded mt-1">
                <Listbox.Option value={null} className="px-4 py-2 hover:bg-gray-100">
                  All Employees
                </Listbox.Option>

                {employees.map(emp => (
                  <Listbox.Option
                    key={emp._id}
                    value={emp}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {emp.name}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>

        {/* MONTH */}
        <Listbox value={selectedMonth} onChange={setSelectedMonth}>
          <div className="relative w-48">
            <Listbox.Button className="w-full bg-white border rounded-lg px-4 py-2 text-left shadow">
              {selectedMonth}
            </Listbox.Button>

            <Transition as={Fragment}>
              <Listbox.Options className="absolute z-10 w-full bg-white shadow rounded mt-1 max-h-60 overflow-auto">
                {months.map(month => (
                  <Listbox.Option
                    key={month}
                    value={month}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {month}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Task</th>
              <th>Hours</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-10">Loading...</td>
              </tr>
            ) : works.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  No work records found
                </td>
              </tr>
            ) : (
              works.map(work => (
                <tr key={work._id}>
                  <td>{work.name}</td>
                  <td>{work.email}</td>
                  <td>{work.task}</td>
                  <td>{work.hours}</td>
                  <td>{new Date(work.date).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default HrWorkRecords;
