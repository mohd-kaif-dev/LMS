import mongoose from 'mongoose';

// Define the schema for a single item in the cart
const cartItemSchema = new mongoose.Schema({
    course: {
        // Reference to the Course model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    price: {
        // The price of the course at the time it was added to the cart
        type: Number,
        required: true,
    },
});

// Define the main Cart schema
const cartSchema = new mongoose.Schema({
    user: {
        // A reference to the User model, linking the cart to a specific user
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // Each user should have only one cart
    },
    items: {
        // An array of items in the cart
        type: [cartItemSchema],
        default: [],
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
});

// Export the Cart model using ES module syntax
const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
