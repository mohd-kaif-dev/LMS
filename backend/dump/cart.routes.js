import { Router } from 'express';
// Assuming you have an authentication middleware to protect routes
import { protect } from '../middlewares/auth.middleware.js';
import {
    getCart,
    addItemToCart,
    removeItemFromCart,
    clearCart
} from '../controllers/cart.controller.js';

const router = Router();

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, getCart);

// @desc    Add a course to cart
// @route   POST /api/cart/add
// @access  Private
router.post('/add', protect, addItemToCart);

// @desc    Remove an item from cart
// @route   DELETE /api/cart/remove/:courseId
// @access  Private
router.delete('/remove/:courseId', protect, removeItemFromCart);

// @desc    Clear the entire cart
// @route   DELETE /api/cart/clear
// @access  Private
router.delete('/clear', protect, clearCart);

export default router;
