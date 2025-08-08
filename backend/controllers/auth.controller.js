import { User } from '../models/user.model.js';
import { generateToken } from '../utils/generateToken.js';



export const register = async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists)
        return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id, user.role);

    res.status(201).json({
        user,
        token
    });
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
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
        const token = generateToken(user._id, user.role);

        // Store the token in a cookie
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
        });

        // 👉 Redirect with token (for frontend to capture via query param)
        res
            .redirect(`${process.env.CLIENT_URL}/success-login?token=${token}`);
    } catch (error) {
        console.error("Error during Google OAuth callback:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax',
    });
    res.status(200).json({ message: 'Logout successful' });
}