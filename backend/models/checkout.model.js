import mongoose from 'mongoose';

// Define the Checkout schema
const checkoutSchema = new mongoose.Schema({
    user: {
        // A reference to the User model who is checking out
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    course: {
        // A reference to the Course model being checked out
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    status: {
        // The current status of the checkout session
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending',
    },
    paymentInfo: {
        // Detailed information about the payment
        transactionId: {
            type: String,
            required: true,
        },
        paymentGateway: {
            type: String,
        },
        amount: {
            type: Number,
            required: true,
        },
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
});

// Export the Checkout model
const Checkout = mongoose.model('Checkout', checkoutSchema);

export default Checkout;
