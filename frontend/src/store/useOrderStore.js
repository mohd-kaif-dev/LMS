import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";

const BASE_URL = import.meta.env.VITE_BACKEND_URL

export const useOrderStore = create((set) => ({
    checkoutId: null,
    order: null,
    isCheckingOut: false,
    isCreatingOrder: false,

    createCheckout: async ({ courseId }) => {
        try {
            set({ isCheckingOut: true });
            const res = await axios.post(`${BASE_URL}/api/checkout/initiate/${courseId}`, {}, { withCredentials: true });
            set({ checkout: res.data.checkoutId });
            return { success: true };
        } catch (error) {
            console.log("Error creating checkout: ", error);
            toast.error("Failed to create checkout");
            return { success: false };
        } finally {
            set({ isCheckingOut: false });
        }
    },
    createStripeCheckout: async (course) => {
        try {
            set({ isCheckingOut: true });
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/payment/create-stripe-session`,
                {
                    course: course,
                },
                {
                    withCredentials: true,
                }
            );
            return res.data;
        } catch (error) {
            console.log("Error creating checkout: ", error);
            toast.error("Failed to create checkout");
            return [];
        } finally {
            set({ isCheckingOut: false });
        }
    },
    checkoutSuccessAndCreateOrder: async (checkoutId) => {
        try {
            const res = await axios.post(`${BASE_URL}/api/checkout/success`, { checkoutId }, { withCredentials: true });
            set({ order: res.data.order })
            console.log("res", res.data);

        } catch (error) {
            console.log("Error in checkoutSuccess: ", error);
            toast.error("Failed to create order");
        }
    }
}));