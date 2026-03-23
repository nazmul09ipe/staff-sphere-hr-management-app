import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AdminPaymentApproval = () => {
  const axiosSecure = useAxiosSecure();

  // ✅ Pagination state
  const [page, setPage] = useState(1);
  const limit = 8;

  // ✅ Fetch data with pagination
  const { data = {}, refetch, isLoading } = useQuery({
    queryKey: ["adminPayments", page],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/admin/payroll?page=${page}&limit=${limit}`
      );
      return res.data;
    },
  });

  const payments = data.payments || [];
  const totalPages = data.totalPages || 1;

  // ✅ Handle payment
  const handlePay = async (pay) => {
    const result = await Swal.fire({
      title: "Confirm Payment?",
      text: `Pay ${pay.salary} to ${pay.name || pay.email}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Pay",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.patch(`/admin/pay/${pay._id}`);

        Swal.fire({
          icon: "success",
          title: "Payment Successful!",
          timer: 1500,
          showConfirmButton: false,
        });

        refetch(); // ✅ refresh data
      } catch (error) {
        Swal.fire("Error", "Payment failed!", "error");
      }
    }
  };

  // ✅ Loading state
  if (isLoading) {
    return (
      <p className="text-center py-10 text-gray-500">
        Loading payments...
      </p>
    );
  }

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Payment Approval</h2>

      {/* ✅ Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Salary</th>
              <th>Month</th>
              <th>Year</th>
              <th>Payment Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p) => (
              <tr key={p._id}>
                <td>{p.name || "—"}</td>
                <td>{p.email}</td>
                <td>${p.salary}</td>
                <td>{p.month}</td>
                <td>{p.year}</td>

                <td>
                  {p.paymentDate
                    ? new Date(p.paymentDate).toLocaleDateString()
                    : "—"}
                </td>

                <td>
                  {p.paid ? (
                    <span className="text-green-600 font-semibold">
                      Paid
                    </span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">
                      Pending
                    </span>
                  )}
                </td>

                <td>
                  <button
                    disabled={p.paid}
                    onClick={() => handlePay(p)}
                    className={`btn btn-xs ${
                      p.paid
                        ? "btn-disabled"
                        : "btn-success text-white"
                    }`}
                  >
                    {p.paid ? "Paid" : "Pay"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="btn btn-sm"
        >
          Prev
        </button>

        {[...Array(totalPages).keys()].map((p) => (
          <button
            key={p}
            onClick={() => setPage(p + 1)}
            className={`btn btn-sm ${
              page === p + 1 ? "btn-primary text-white" : ""
            }`}
          >
            {p + 1}
          </button>
        ))}

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="btn btn-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminPaymentApproval;