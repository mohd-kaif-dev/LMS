import Checkout from '../models/checkout.model.js';
import Order from '../models/order.model.js';
import Course from '../models/course.model.js';
import User from '../models/user.model.js';

// Utility function to generate a unique order ID
const generateOrderId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `ORD-${result}`;
};

// @desc    Initiate a new checkout session
// @route   POST /api/checkout/initiate
// @access  Private
export const initiateCheckout = async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId } = req.params

        const course = await Course.findById(courseId);
        const totalAmount = course.price;

        // Create a new checkout session
        const newCheckout = await Checkout.create({
            user: userId,
            course: courseId,
            paymentInfo: {
                transactionId: `txn_${Date.now()}`, // A temporary transaction ID
                amount: totalAmount,
            },
            status: 'pending',
        });
        res.status(200).json({
            success: true,
            message: 'Checkout initiated, awaiting payment confirmation.',
            checkoutId: newCheckout._id,
        });
    } catch (error) {
        console.log("Error in initiateCheckout controller: ", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Handle successful payment
// @route   POST /api/checkout/success
// @access  Public (webhook)
export const handleSuccess = async (req, res) => {
    try {
        // In a real application, you would use data from the payment gateway webhook
        // For this example, we'll use a checkoutId passed in the body
        const { checkoutId } = req.body;



        // Find and update the checkout session
        const checkout = await Checkout.findById(checkoutId).populate({
            path: "course",
            select: "title price instructor thumbnailUrl sections",
            populate: {
                path: "instructor",
                select: "name",
            },
        });

        if (!checkout) {
            res.status(400);
            throw new Error('Invalid or already completed checkout session');
        }



        // Prepare courses data for the order, creating an immutable snapshot
        const orderedCourse = checkout.course



        // Create the final Order document
        const newOrder = await Order.create({
            user: checkout.user,
            orderId: generateOrderId(),
            courses: orderedCourse,
            totalAmount: checkout.paymentInfo.amount,
            checkoutSession: checkout._id,
            paymentStatus: 'paid',
            status: 'completed',
            paymentMethod: "Stripe",
        });





        await User.findByIdAndUpdate(
            newOrder.user,
            { $addToSet: { enrolledCourses: newOrder.courses[0]._id } },
            { new: true }
        );

        await Course.findByIdAndUpdate(newOrder.courses[0]._id, { $addToSet: { studentsEnrolled: newOrder.user } }, { new: true });

        // Update checkout session status
        checkout.status = 'completed';
        await checkout.save();

        res.status(200).json({
            success: true,
            message: 'Payment successful and order created!',
            order: newOrder,
        });
    } catch (error) {
        console.log("Error in handleSuccess controller: ", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Handle failed payment
// @route   POST /api/checkout/failure
// @access  Public (webhook)
export const handleFailure = async (req, res) => {
    try {
        const { checkoutId, message } = req.body;

        const checkout = await Checkout.findById(checkoutId);

        if (!checkout) {
            res.status(404);
            throw new Error('Checkout session not found');
        }

        // Update the checkout status to failed
        checkout.status = 'failed';
        await checkout.save();

        res.status(200).json({
            success: false,
            message: message || 'Payment failed, please try again.',
        });
    } catch (error) {
        console.log("Error in handleFailure controller: ", error);
        res.status(500).json({ message: 'Server error' });
    }
};
