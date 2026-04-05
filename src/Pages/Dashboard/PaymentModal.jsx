import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const PaymentModal = ({ payData, closeModal, refetch }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

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

    if (!stripe || !elements) {
      Swal.fire("Error", "Stripe is not loaded. Please try again later.", "error");
      return;
    }

    setLoading(true);

    try {
      const { clientSecret } = await createPaymentIntent();

      if (!clientSecret) {
        Swal.fire("Error", "Failed to create payment intent.", "error");
        setLoading(false);
        return;
      }

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        Swal.fire("Error", "Card element not found.", "error");
        setLoading(false);
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        Swal.fire("Payment Error", result.error.message, "error");
        setLoading(false);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        const transactionId = result.paymentIntent.id;

        if (!transactionId) {
          Swal.fire("Error", "Transaction ID missing!", "error");
          setLoading(false);
          return;
        }

        await axiosSecure.patch(`/admin/pay/${payData._id}`, { transactionId });

        Swal.fire("Success!", "Salary Paid Successfully!", "success");

        refetch();
        closeModal();
      } else {
        Swal.fire("Error", "Payment was not successful.", "error");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      Swal.fire("Error", err.response?.data?.message || "Payment failed!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4"
      onClick={closeModal}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md space-y-5 shadow-lg relative"
        onClick={(e) => e.stopPropagation()} // Prevent modal close on form click
      >
        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Salary Payment
        </h2>

        {/* Employee Info */}
        <div className="space-y-1">
          <p className="text-gray-700 dark:text-gray-300">
            Employee: <span className="font-semibold">{payData.name}</span>
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Amount: <span className="font-semibold">${payData.salary}</span>
          </p>
        </div>

        {/* Stripe Card Input */}
        <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-700">
          <CardElement options={{ hidePostalCode: true }} />
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={!stripe || !elements || loading}
            className={`w-full px-4 py-2 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </button>

          <button
            type="button"
            onClick={closeModal}
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentModal;