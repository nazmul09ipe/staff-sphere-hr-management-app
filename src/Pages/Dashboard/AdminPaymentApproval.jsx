import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AdminPaymentApproval = () => {
  const axiosSecure = useAxiosSecure();

  const { data = {}, refetch } = useQuery({
    queryKey: ["adminPayments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/payroll");
      return res.data;
    },
  });

  const payments = data.payments || [];

  const handlePay = async (pay) => {
    Swal.fire({
      title: "Confirm Payment?",
      text: `Pay ${pay.salary} to ${pay.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Pay",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axiosSecure.patch(`/admin/pay/${pay._id}`);
        refetch();
      }
    });
  };

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Payment Approval</h2>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Salary</th>
              <th>Month</th>
              <th>Year</th>
              <th>Payment Date</th>
              <th>Pay</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.salary}</td>
                <td>{p.month}</td>
                <td>{p.year}</td>

                <td>
                  {p.paymentDate
                    ? new Date(p.paymentDate).toLocaleDateString()
                    : "—"}
                </td>

                <td>
                  {p.paid ? (
                    <span className="text-green-600 font-semibold">Paid</span>
                  ) : (
                    <button
                      disabled={p.paid}
                      onClick={() => handlePay(p)}
                      className={`btn btn-xs ${
                        p.paid ? "btn-disabled" : "btn-success text-white"
                      }`}
                    >
                      Pay
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPaymentApproval;
