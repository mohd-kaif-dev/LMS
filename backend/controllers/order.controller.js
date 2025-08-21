import Order from '../models/order.model.js';

// @desc    Get all orders for the logged-in user
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('courses.courseId');
        if (!orders) {
            res.status(404);
            throw new Error('No orders found for this user');
        }
        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        console.log("Error in getOrders controller: ", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a single order by ID
// @route   GET /api/orders/:orderId
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findOne({ _id: orderId, user: req.user._id }).populate('courses.courseId');

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.log("Error in getOrderById controller: ", error);
        res.status(500).json({ message: 'Server error' });
    }
};
