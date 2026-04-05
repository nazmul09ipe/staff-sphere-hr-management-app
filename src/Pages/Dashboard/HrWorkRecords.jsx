import { Fragment, useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Listbox, Transition } from "@headlessui/react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const formatDate = (date) => {
  if (!date) return "N/A";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

const HrWorkRecords = () => {
  const axiosSecure = useAxiosSecure();

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [searchParams, setSearchParams] = useState(null);

  // ======== Fetch Employees ========
  const { data: employeeData, refetch: refetchEmployees } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users?role=employee");
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 min cache
  });

  const employees = useMemo(() => employeeData?.employees || [], [employeeData]);

  useEffect(() => {
    refetchEmployees();
  }, []);

  // ======== Fetch Work Records ========
  const { data: worksData = [], isLoading, isFetching } = useQuery({
    queryKey: ["works", searchParams],
    enabled: !!searchParams,
    queryFn: async () => {
      const res = await axiosSecure.get("/works", {
        params: {
          email: searchParams?.email || "",
          month: searchParams?.month || "",
        },
      });
      return res.data;
    },
  });

  const totalHours = useMemo(() => worksData.reduce((sum, w) => sum + (w.hours || 0), 0), [worksData]);

  const handleSearch = () => {
    setSearchParams({
      email: selectedEmployee?.email || "",
      month: selectedMonth,
    });
  };

  return (
    <div className="bg-slate-100 dark:bg-[#0f172a] min-h-screen p-4 sm:p-6 text-gray-800 dark:text-gray-100">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold">Employee Work Records</h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
          Filter by employee and month to view detailed work logs
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4 mb-6">

        {/* Employee Selector */}
        <Listbox value={selectedEmployee} onChange={setSelectedEmployee}>
          <div className="relative w-64 sm:w-72">
            <Listbox.Button className="w-full bg-white dark:bg-[#1e293b] border dark:border-gray-700 rounded-lg px-3 sm:px-4 py-2 text-left shadow flex justify-between items-center">
              <span>{selectedEmployee?.name || "All Employees"}</span>
              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
            </Listbox.Button>

            <Transition as={Fragment}>
              <Listbox.Options className="absolute z-10 w-full bg-white dark:bg-[#1e293b] shadow rounded mt-1 max-h-60 overflow-auto">
                <Listbox.Option
                  value={null}
                  className="px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  All Employees
                </Listbox.Option>
                {employees.map(emp => (
                  <Listbox.Option
                    key={emp._id}
                    value={emp}
                    className="px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
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
          <div className="relative w-48 sm:w-52">
            <Listbox.Button className="w-full bg-white dark:bg-[#1e293b] border dark:border-gray-700 rounded-lg px-3 sm:px-4 py-2 text-left shadow flex justify-between items-center">
              <span>{selectedMonth}</span>
              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
            </Listbox.Button>

            <Transition as={Fragment}>
              <Listbox.Options className="absolute z-10 w-full bg-white dark:bg-[#1e293b] shadow rounded mt-1 max-h-60 overflow-auto">
                {months.map(month => (
                  <Listbox.Option
                    key={month}
                    value={month}
                    className="px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2 rounded-lg shadow transition flex items-center gap-2 disabled:opacity-50"
          disabled={isFetching}
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
          {isFetching ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Summary */}
      {searchParams && (
        <div className="mb-4 bg-white dark:bg-[#1e293b] p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <span className="text-gray-600 dark:text-gray-300">
            Showing results for <strong>{selectedMonth}</strong>
          </span>
          <span className="font-semibold text-green-600 dark:text-green-400">
            Total Hours: {totalHours}
          </span>
        </div>
      )}

      {/* Table */}
      <div className="bg-blue-100 dark:bg-[#1e293b] rounded-xl shadow overflow-x-auto">
        <table className="min-w-[700px] sm:min-w-full table-fixed text-sm sm:text-base">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
              <th className="py-2 px-3 text-left">Name</th>
              <th className="px-3 text-left break-all">Email</th>
              <th className="px-3 text-left">Task</th>
              <th className="px-3 text-right">Hours</th>
              <th className="px-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500 dark:text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : worksData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500 dark:text-gray-400">
                  No work records found
                </td>
              </tr>
            ) : (
              worksData.map(work => (
                <tr
                  key={work._id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#334155] transition"
                >
                  <td className="py-2 px-3 font-medium">{work.name}</td>
                  <td className="px-3 text-gray-600 dark:text-gray-300 break-all">{work.email}</td>
                  <td className="px-3 text-gray-600 dark:text-gray-300">{work.task}</td>
                  <td className="px-3 text-right font-semibold">{work.hours}</td>
                  <td className="px-3 text-gray-600 dark:text-gray-300">{formatDate(work.date)}</td>
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