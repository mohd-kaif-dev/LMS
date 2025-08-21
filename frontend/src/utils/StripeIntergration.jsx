import { loadStripe } from "@stripe/stripe-js";

import { useOrderStore } from "../store/useOrderStore";
import { Loader2 } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const StripeIntegration = ({ course, isCheckingOut }) => {
  const { createStripeCheckout } = useOrderStore();

  const makePayment = async () => {
    try {
      const stripe = await stripePromise;
      const session = await createStripeCheckout(course);

      if (session) {
        console.log("Runs");
        localStorage.setItem("stripeId", session.id);
      }
      await stripe.redirectToCheckout({
        sessionId: session.id,
      });
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <div className="mt-5">
      <button
        onClick={makePayment}
        className="w-full py-3 rounded-full bg-green-500 text-black font-semibold text-lg hover:bg-green-600 transition-colors duration-200 shadow-lg mb-4 flex items-center justify-center"
      >
        {isCheckingOut ? (
          <Loader2 size={16} className="animate-spin text-white" />
        ) : (
          "Proceed To Checkout"
        )}
      </button>
    </div>
  );
};

export default StripeIntegration;
