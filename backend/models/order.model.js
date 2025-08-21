import mongoose from 'mongoose';

// Define the schema for a course within an order
const orderedCourseSchema = new mongoose.Schema({
    title: {
        // Snapshot of the course title
        type: String,
        required: true,
    },
    price: {
        // Snapshot of the price at the time of purchase
        type: Number,
        required: true,
    },
    instructor: {
        // Snapshot of the instructor's name
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    thumbnailUrl: {
        // Snapshot of the thumbnail URL
        type: String,
    }

});

// Define the main Order schema
const orderSchema = new mongoose.Schema({
    user: {
        // Reference to the User who made the order
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderId: {
        // A unique identifier for the order
        type: String,
        required: true,
        unique: true,
    },
    courses: {
        // An array of the courses purchased
        type: [orderedCourseSchema],
        required: true,
    },
    totalAmount: {
        // The total amount of the order
        type: Number,
        required: true,
    },
    paymentStatus: {
        // The status of the payment, 'paid' or 'refunded'
        type: String,
        enum: ['paid', 'unpaid'],
        default: 'unpaid',
    },
    paymentMethod: {
        // The payment method used, e.g., 'Stripe', 'PayPal'
        type: String,
        required: true,
    },
    status: {
        // The overall status of the order, e.g., 'completed', 'cancelled'
        type: String,
        enum: ['completed', 'cancelled', 'pending'],
        default: 'pending',
    },
    checkoutSession: {
        // Reference to the Checkout session that led to this order
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Checkout',
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
});

// Export the Order model
const Order = mongoose.model('Order', orderSchema);

export default Order;
