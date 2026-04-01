import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const PaymentModal = ({ payData, closeModal, refetch }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();

  // ✅ Create payment intent
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
      // 1️⃣ Get clientSecret
      const { clientSecret } = await createPaymentIntent();

      // 2️⃣ Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      // ❌ Stripe error
      if (result.error) {
        Swal.fire("Error", result.error.message, "error");
        return;
      }

      // ✅ Payment success
      if (result.paymentIntent?.status === "succeeded") {
        const transactionId = result.paymentIntent.id;

        if (!transactionId) {
          Swal.fire("Error", "Transaction ID missing!", "error");
          return;
        }

        await axiosSecure.patch(`/admin/pay/${payData._id}`, {
          transactionId,
        });

        Swal.fire("Success!", "Salary Paid!", "success");

        refetch();
        closeModal();
      }
    } catch (err) {
      console.error("Payment Error:", err);
      Swal.fire("Error", "Payment failed!", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-96 space-y-4"
      >
        <h2 className="text-xl font-bold">Pay Salary: ${payData.salary}</h2>

        <CardElement />

        <button className="btn btn-success w-full text-white">
          Confirm Payment
        </button>

        <button
          type="button"
          onClick={closeModal}
          className="btn btn-ghost w-full"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default PaymentModal;
