import { Router } from 'express';
// Assuming you have an authentication middleware to protect routes
import { protect } from '../middlewares/auth.middleware.js';
import {
    getOrders,
    getOrderById
} from '../controllers/order.controller.js';

const router = Router();

// @desc    Get all orders for the logged-in user
// @route   GET /api/orders
// @access  Private
router.get('/', protect, getOrders);

// @desc    Get a single order by ID
// @route   GET /api/orders/:orderId
// @access  Private
router.get('/:orderId', protect, getOrderById);

export default router;
