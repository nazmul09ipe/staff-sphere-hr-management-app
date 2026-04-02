import { Fragment, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Listbox, Transition } from "@headlessui/react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const HrWorkRecords = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [searchParams, setSearchParams] = useState(null);

  // ================= EMPLOYEES =================
  const { data, refetch: refetchEmployees } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users?role=employee");
      return res.data;
    },
    staleTime: 0, // always fetch fresh data
  });

  const employees = data?.employees || [];

  // Automatically refetch employees whenever the component mounts
  useEffect(() => {
    refetchEmployees();
  }, []);

  // ================= WORK RECORDS =================
  const { data: works = [], isLoading, isFetching } = useQuery({
    queryKey: ["works", searchParams],
    enabled: !!searchParams,
    queryFn: async () => {
      const res = await axiosSecure.get("/works", {
        params: {
          email: searchParams?.email,
          month: searchParams?.month,
        },
      });
      return res.data;
    },
  });

  const totalHours = works.reduce((sum, w) => sum + (w.hours || 0), 0);

  const handleSearch = () => {
    setSearchParams({
      email: selectedEmployee?.email || "",
      month: selectedMonth,
    });
  };

  return (
    <div className="bg-slate-100 dark:bg-[#0f172a] min-h-screen p-6 text-gray-800 dark:text-gray-100">
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-semibold">Employee Work Records</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Filter by employee and month to view detailed work logs
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4 mb-6">

        {/* Employee Selector */}
        <Listbox value={selectedEmployee} onChange={setSelectedEmployee}>
          <div className="relative w-64">
            <Listbox.Button className="w-full bg-white dark:bg-[#1e293b] border dark:border-gray-700 rounded-lg px-4 py-2 text-left shadow flex justify-between items-center">
              <span>{selectedEmployee?.name || "All Employees"}</span>
              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
            </Listbox.Button>

            <Transition as={Fragment}>
              <Listbox.Options className="absolute z-10 w-full bg-white dark:bg-[#1e293b] shadow rounded mt-1 max-h-60 overflow-auto">
                <Listbox.Option
                  value={null}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  All Employees
                </Listbox.Option>
                {employees.map(emp => (
                  <Listbox.Option
                    key={emp._id}
                    value={emp}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {emp.name}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>

        {/* Month Selector */}
        <Listbox value={selectedMonth} onChange={setSelectedMonth}>
          <div className="relative w-48">
            <Listbox.Button className="w-full bg-white dark:bg-[#1e293b] border dark:border-gray-700 rounded-lg px-4 py-2 text-left shadow flex justify-between items-center">
              <span>{selectedMonth}</span>
              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
            </Listbox.Button>

            <Transition as={Fragment}>
              <Listbox.Options className="absolute z-10 w-full bg-white dark:bg-[#1e293b] shadow rounded mt-1 max-h-60 overflow-auto">
                {months.map(month => (
                  <Listbox.Option
                    key={month}
                    value={month}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {month}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition flex items-center gap-2 disabled:opacity-50"
          disabled={isFetching}
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
          {isFetching ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Summary */}
      {searchParams && (
        <div className="mb-4 bg-white dark:bg-[#1e293b] p-4 rounded-lg shadow flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">
            Showing results for <strong>{selectedMonth}</strong>
          </span>
          <span className="font-semibold text-green-600 dark:text-green-400">
            Total Hours: {totalHours}
          </span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow overflow-x-auto">
        <table className="min-w-full table-fixed text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="px-4 text-left">Email</th>
              <th className="px-4 text-left">Task</th>
              <th className="px-4 text-right">Hours</th>
              <th className="px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500 dark:text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : works.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500 dark:text-gray-400">
                  No work records found
                </td>
              </tr>
            ) : (
              works.map(work => (
                <tr
                  key={work._id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#334155] transition"
                >
                  <td className="py-3 px-4 font-medium">{work.name}</td>
                  <td className="px-4 text-gray-600 dark:text-gray-300">{work.email}</td>
                  <td className="px-4 text-gray-600 dark:text-gray-300">{work.task}</td>
                  <td className="px-4 text-right font-semibold">{work.hours}</td>
                  <td className="px-4 text-gray-600 dark:text-gray-300">{formatDate(work.date)}</td>
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