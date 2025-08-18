import { User } from '../models/user.model.js';
import { generateToken } from '../utils/generateToken.js';



export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters long' });

    const userExists = await User.findOne({ email });

    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });

    if (!user) return res.status(400).json({ message: 'User not created' });

    user.password = undefined;
    const token = generateToken(user._id, res);

    res.status(201).json({
        user,
        token
    });
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);

    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id, res);

    user.password = undefined;

    res.status(200).json({
        user,
        token
    });
};

export const getUser = async (req, res) => {
    try {

        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }


        res.json({
            user: req.user
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });

    }
};

export const googleCallback = (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const token = generateToken(user._id, res);

        // 👉 Redirect with token (for frontend to capture via query param)
        res.redirect(`${process.env.CLIENT_URL}/success-login?token=${token}`);
    } catch (error) {
        console.error("Error during Google OAuth callback:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logout successful' });
}

export const checkAuth = (req, res) => {
    try {
        console.log("req.user", req?.user);
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        res.status(200).json({ message: 'User is authenticated', user: req.user });
    } catch (error) {
        console.error("Error checking authentication:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}