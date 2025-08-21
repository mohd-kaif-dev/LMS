import { Router } from 'express';
// Assuming you have an authentication middleware to protect routes
import { protect } from '../middlewares/auth.middleware.js';
import {
    initiateCheckout,
    handleSuccess,
    handleFailure
} from '../controllers/checkout.controller.js';

const router = Router();

// @desc    Initiate a new checkout session
// @route   POST /api/checkout/initiate
// @access  Private
router.post('/initiate/:courseId', protect, initiateCheckout);

// @desc    Handle successful payment (e.g., from a payment gateway webhook)
// @route   POST /api/checkout/success
// @access  Public (or webhook-specific authentication)
router.post('/success', handleSuccess);

// @desc    Handle failed payment
// @route   POST /api/checkout/failure
// @access  Public (or webhook-specific authentication)
router.post('/failure', handleFailure);

export default router;
