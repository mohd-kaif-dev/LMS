import { Router } from 'express';
// Assuming you have authentication and admin-specific authorization middleware
import { protect, isAdmin } from '../middlewares/auth.middleware.js';
import {
    getAllUsers,
    getAllCourses,
    getAllOrders,
    deleteUser,
    deleteCourse,
    updateCourse,
} from '../controllers/admin.controller.js';

const router = Router();

// All admin routes are protected and require admin role
router.use(protect, isAdmin);

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
router.get('/users', getAllUsers);

// @desc    Get all courses
// @route   GET /api/admin/courses
// @access  Admin
router.get('/courses', getAllCourses);

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Admin
router.get('/orders', getAllOrders);

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Admin
router.delete('/users/:id', deleteUser);

// @desc    Delete a course
// @route   DELETE /api/admin/courses/:id
// @access  Admin
router.delete('/courses/:id', deleteCourse);

// @desc    Update a course
// @route   PUT /api/admin/courses/:id
// @access  Admin
router.put('/courses/:id', updateCourse);

export default router;
