import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import AuthContext from "../../Contexts/AuthContext/AuthContext";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const EmployeePaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const { data: payments = [] } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
  });

  return (
    <div className="bg-slate-100 p-6 rounded-xl">

      <h2 className="text-2xl font-semibold mb-4">Payment History</h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Year</th>
              <th>Amount</th>
              <th>Transaction ID</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((pay) => (
              <tr key={pay._id}>
                <td>{pay.month}</td>
                <td>{pay.year}</td>
                <td>${pay.amount}</td>
                <td>{pay.transactionId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default EmployeePaymentHistory;
