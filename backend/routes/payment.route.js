import express from "express";
import { stripe } from "../config/stripe.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-stripe-session", protect, async (req, res) => {
    try {
        const { course } = req.body;

        if (!course || !course.price || !course.title) {
            return res.status(400).json({ message: "Invalid course data" });
        }

        // Convert price to cents for Stripe
        const amount = Math.round(course.price * 100);

        const lineItem = {
            price_data: {
                currency: "usd",
                product_data: {
                    name: course.title,
                    images: course.thumbnailUrl ? [course.thumbnailUrl] : [],
                },
                unit_amount: amount,
            },
            quantity: 1,
        };

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [lineItem],
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
            metadata: {
                userId: req.user._id.toString(),
                course: JSON.stringify({
                    id: course._id,
                    quantity: 1,
                    price: course.price,
                }),
            },
        });

        res.status(200).json({
            id: session.id,
            url: session.url,
            totalAmount: course.price, // Keep original price in dollars
        });
    } catch (error) {
        console.error("Error processing checkout:", error);
        res.status(500).json({
            message: "Error processing checkout",
            error: error.message,
        });
    }
});

export default router;
