import Cart from '../models/cart.model.js';
import Course from '../models/course.model.js'; // Assuming a Course model exists

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
    try {
        // Find the cart for the logged-in user
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.course');

        // If cart doesn't exist, create a new one
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (error) {
        console.log("Error in getCart controller: ", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a course to cart
// @route   POST /api/cart/add
// @access  Private
export const addItemToCart = async (req, res, next) => {
    try {
        const { courseId } = req.body;

        console.log("Course ID:", courseId);

        // Find the course to get its price and details
        const course = await Course.findById(courseId).populate("instructor", "name");
        if (!course) {
            res.status(404);
            throw new Error('Course not found');
        }

        // Find the user's cart
        let cart = await Cart.findOne({ user: req.user._id });

        // If no cart exists, create one
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        // Check if the course is already in the cart
        const existingItem = cart.items.find(
            (item) => item.course.toString() === courseId
        );

        if (existingItem) {
            res.status(400);
            throw new Error('Course is already in the cart');
        }

        // Add the new course to the cart with its current price
        cart.items.push({
            course: course._id,
            price: course.price,
        });

        await cart.save()

        // Populate afterwards
        await cart.populate({
            path: "items.course",
            select: "title thumbnailUrl instructor rating instructor",
            populate: {
                path: "instructor",
                select: "name email"
            }
        });


        res.status(201).json({
            success: true,
            message: 'Course added to cart',
            cart,
        });
    } catch (error) {
        console.log("Error in addToCart controller: ", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Remove an item from cart
// @route   DELETE /api/cart/remove/:courseId
// @access  Private
export const removeItemFromCart = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            res.status(404);
            throw new Error('Cart not found');
        }

        // Remove the item from the cart's items array
        cart.items = cart.items.filter(
            (item) => item.course.toString() !== courseId
        );

        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Course removed from cart',
            data: cart,
        });
    } catch (error) {
        console.log("Error in removeFromCart controller: ", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Clear the entire cart
// @route   DELETE /api/cart/clear
// @access  Private
export const clearCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            res.status(404);
            throw new Error('Cart not found');
        }

        // Set the items array to empty
        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            data: cart,
        });
    } catch (error) {
        console.log("Error in clearCart controller: ", error);
        res.status(500).json({ message: 'Server error' });
    }
};
