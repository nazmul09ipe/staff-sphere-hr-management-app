import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const PaymentModal = ({ payData, closeModal, refetch }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();

  const { mutateAsync: createPaymentIntent } = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post("/create-payment-intent", {
        salary: payData.salary,
        payrollId: payData._id,
      });
      return res.data;
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      const { clientSecret } = await createPaymentIntent();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        Swal.fire("Error", result.error.message, "error");
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        const transactionId = result.paymentIntent.id;

        if (!transactionId) {
          Swal.fire("Error", "Transaction ID missing!", "error");
          return;
        }

        await axiosSecure.patch(`/admin/pay/${payData._id}`, { transactionId });

        Swal.fire("Success!", "Salary Paid Successfully!", "success");

        refetch();
        closeModal();
      }
    } catch (err) {
      console.error("Payment Error:", err);
      Swal.fire("Error", "Payment failed!", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96 space-y-5 shadow-lg"
      >
        {/* PROFESSIONAL HEADING */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Salary Payment
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          Employee: <span className="font-semibold">{payData.name}</span>
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          Amount: <span className="font-semibold">${payData.salary}</span>
        </p>

        {/* STRIPE CARD INPUT */}
        <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-700">
          <CardElement options={{ hidePostalCode: true }} />
        </div>

        {/* ACTION BUTTONS */}
        <button
          type="submit"
          className="btn btn-success w-full text-white"
        >
          Confirm Payment
        </button>

        <button
          type="button"
          onClick={closeModal}
          className="btn btn-ghost w-full text-gray-700 dark:text-gray-300"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default PaymentModal;