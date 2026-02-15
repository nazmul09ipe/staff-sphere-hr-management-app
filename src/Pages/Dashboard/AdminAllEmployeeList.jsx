import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { FaUserShield, FaFire } from "react-icons/fa";
import Swal from "sweetalert2";
import { useState } from "react";

const AdminAllEmployeeList = () => {
  const axiosSecure = useAxiosSecure();

  const [page, setPage] = useState(1);
  const limit = 8;

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["adminEmployees", page],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/admin/employees?page=${page}&limit=${limit}`,
      );
      return res.data;
    },
  });

  const employees = data?.employees || [];
  const totalPages = data?.totalPages || 1;
  // MAKE HR
  const makeHR = async (id) => {
    await axiosSecure.patch(`/users/make-hr/${id}`);
    refetch();
  };

  // FIRE
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
    <div className="p-6 bg-slate-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">All Employees</h2>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Designation</th>
              <th>Make HR</th>
              <th>Fire</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="text-center py-10">
                  Loading...
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-500">
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.name}</td>
                  <td className="capitalize">{emp.role}</td>

                  {/* MAKE HR */}
                  <td>
                    {emp.role === "hr" ? (
                      "HR"
                    ) : (
                      <button
                        onClick={() => makeHR(emp._id)}
                        className="btn btn-xs btn-primary"
                      >
                        <FaUserShield />
                      </button>
                    )}
                  </td>

                  {/* FIRE */}
                  <td>
                    {emp.isFired ? (
                      <span className="text-red-500 font-semibold">Fired</span>
                    ) : (
                      <button
                        onClick={() => fireUser(emp)}
                        className="btn btn-xs btn-error text-white"
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
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          className="btn btn-sm"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          className="btn btn-sm"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminAllEmployeeList;
