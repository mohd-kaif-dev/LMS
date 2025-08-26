import User from '../models/user.model.js';
import Course from '../models/course.model.js';
import Order from '../models/order.model.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const users = await User.find({ _id: { $ne: req.user._id } })
            .select('-password')
            .skip((page - 1) * limit)
            .limit(limit);
        const total = await User.countDocuments({ _id: { $ne: req.user._id } });
        res.status(200).json({
            success: true,
            users,
            pagination: {
                page,
                limit,
                total,
            },
        });

    } catch (error) {
        console.log("Error in getAllUsers: ", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all courses
// @route   GET /api/admin/courses
// @access  Admin
export const getAllCourses = async (req, res) => {
    try {
        const { page = 1, limit = 10, searchQuery = "" } = req.query;
        const query = searchQuery ? {
            $or: [
                { title: { $regex: searchQuery, $options: "i" } },
                { category: { $regex: searchQuery, $options: "i" } },
                { description: { $regex: searchQuery, $options: "i" } },
            ],
        } : {};
        const courses = await Course.find(query)
            .populate('instructor', 'name')
            .skip((page - 1) * limit)
            .limit(limit);
        const total = await Course.countDocuments(query);
        res.status(200).json({
            success: true,
            courses,
            pagination: {
                page,
                limit,
                total,
            },
        });
    } catch (error) {
        console.log("Error in getAllCourses: ", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Admin
export const getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const orders = await Order.find({})
            .populate('user', 'name email')
            .skip((page - 1) * limit)
            .limit(limit);
        const total = await Order.countDocuments({});
        res.status(200).json({
            success: true,
            orders,
            pagination: {
                page,
                limit,
                total,
            },
        });
    } catch (error) {
        console.log("Error in getAllOrders: ", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // You might want to consider deleting related data (e.g., courses, orders)
        // before deleting the user. This is a simple deletion for now.
        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        console.log("Error in deleteUser: ", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a course
// @route   DELETE /api/admin/courses/:id
// @access  Admin
export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            res.status(404);
            throw new Error('Course not found');
        }

        await Course.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully',
        });
    } catch (error) {
        console.log("Error in deleteCourse: ", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// // @desc    Update a course
// // @route   PUT /api/admin/courses/:id
// // @access  Admin
// export const updateCourse = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updateData = req.body;

//         const updatedCourse = await Course.findByIdAndUpdate(id, updateData, {
//             new: true,
//             runValidators: true,
//         });

//         if (!updatedCourse) {
//             res.status(404);
//             throw new Error('Course not found');
//         }

//         res.status(200).json({
//             success: true,
//             data: updatedCourse,
//         });
//     } catch (error) {
//         console.log("Error in updateCourse: ", error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

