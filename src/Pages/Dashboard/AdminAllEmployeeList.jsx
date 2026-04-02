import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { FaUserShield, FaFire } from "react-icons/fa";
import Swal from "sweetalert2";

const AdminAllEmployeeList = () => {
  const axiosSecure = useAxiosSecure();

  const [page, setPage] = useState(1);
  const limit = 8;

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["adminEmployees", page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/admin/employees?page=${page}&limit=${limit}`);
      return res.data;
    },
  });

  const employees = data?.employees || [];
  const totalPages = data?.totalPages || 1;

  // Make HR
  const makeHR = async (id) => {
    await axiosSecure.patch(`/users/make-hr/${id}`);
    refetch();
  };

  // Fire user
  const fireUser = async (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Fire ${user.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Fire",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axiosSecure.patch(`/users/fire/${user._id}`);
        refetch();
      }
    });
  };

  return (
    <div className="p-6 bg-slate-100 dark:bg-[#0f172a] min-h-screen text-gray-800 dark:text-gray-100">
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
          All Employees
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage employee roles and status
        </p>
      </div>

      {/* Table */}
      <div className="bg-blue-100 dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-left">
              <th className="py-3 px-4 w-[35%]">Name</th>
              <th className="px-4 w-[25%]">Designation</th>
              <th className="px-4 w-[20%] text-center">Make HR</th>
              <th className="px-4 w-[20%] text-center">Fire</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-500 dark:text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-500 dark:text-gray-400">
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr
                  key={emp._id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#334155] transition"
                >
                  <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-100">{emp.name}</td>
                  <td className="px-4 capitalize text-gray-600 dark:text-gray-300">{emp.role}</td>

                  {/* Make HR */}
                  <td className="px-4 text-center">
                    {emp.role === "hr" ? (
                      <span className="text-green-600 dark:text-green-400 font-semibold">HR</span>
                    ) : (
                      <button
                        onClick={() => makeHR(emp._id)}
                        className="inline-flex items-center justify-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition"
                      >
                        <FaUserShield />
                      </button>
                    )}
                  </td>

                  {/* Fire */}
                  <td className="px-4 text-center">
                    {emp.isFired ? (
                      <span className="text-red-500 dark:text-red-400 font-semibold">Fired</span>
                    ) : (
                      <button
                        onClick={() => fireUser(emp)}
                        className="inline-flex items-center justify-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition"
                      >
                        <FaFire />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={`px-4 py-2 rounded-md text-sm font-medium transition
            ${
              page === 1
                ? "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            }`}
        >
          Prev
        </button>

        {[...Array(totalPages).keys()].map((p) => (
          <button
            key={p}
            onClick={() => setPage(p + 1)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition
              ${
                page === p + 1
                  ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
          >
            {p + 1}
          </button>
        ))}

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded-md text-sm font-medium transition
            ${
              page === totalPages
                ? "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminAllEmployeeList;