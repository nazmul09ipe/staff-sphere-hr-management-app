import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import PaymentModal from "./PaymentModal";

const AdminPaymentApproval = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedPay, setSelectedPay] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 8;

  // Fetch payments
  const { data = {}, refetch, isLoading } = useQuery({
    queryKey: ["adminPayments", page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/admin/payroll?page=${page}&limit=${limit}`);
      return res.data;
    },
  });

  const payments = data.payments || [];
  const totalPages = data.totalPages || 1;

  const handlePay = (pay) => setSelectedPay(pay);

  if (isLoading) {
    return (
      <p className="text-center py-10 text-gray-500 dark:text-gray-400">
        Loading payments...
      </p>
    );
  }

  return (
    <div className="p-6 bg-slate-100 dark:bg-[#0f172a] min-h-screen text-gray-800 dark:text-gray-100">
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
          Payment Approval
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Review and approve employee payments
        </p>
      </div>

      {/* Table */}
      <div className="bg-blue-100 dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-left">
              <th className="py-3 px-4 w-[20%]">Name</th>
              <th className="px-4 w-[20%]">Email</th>
              <th className="px-4 w-[10%]">Salary</th>
              <th className="px-4 w-[10%]">Month</th>
              <th className="px-4 w-[10%]">Year</th>
              <th className="px-4 w-[15%]">Payment Date</th>
              <th className="px-4 w-[10%] text-center">Status</th>
              <th className="px-4 w-[15%] text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-10 text-gray-500 dark:text-gray-400"
                >
                  No payments found
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr
                  key={p._id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#334155] transition"
                >
                  <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-100">
                    {p.name || "—"}
                  </td>
                  <td className="px-4 text-gray-600 dark:text-gray-300">{p.email}</td>
                  <td className="px-4">${p.salary}</td>
                  <td className="px-4">{p.month}</td>
                  <td className="px-4">{p.year}</td>
                  <td className="px-4">
                    {p.paymentDate
                      ? new Date(p.paymentDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 text-center">
                    {p.paid ? (
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        Paid
                      </span>
                    ) : (
                      <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 text-center">
                    <button
                      disabled={p.paid}
                      onClick={() => handlePay(p)}
                      className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-sm font-medium transition
                        ${
                          p.paid
                            ? "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                        }`}
                    >
                      {p.paid ? "Paid" : "Pay"}
                    </button>
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

      {/* Payment Modal */}
      {selectedPay && (
        <PaymentModal
          payData={selectedPay}
          closeModal={() => setSelectedPay(null)}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default AdminPaymentApproval;