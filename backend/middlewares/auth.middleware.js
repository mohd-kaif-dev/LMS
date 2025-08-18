import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const protect = async (req, res, next) => {
    let token;
    try {
        if (req.cookies?.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) return res.status(401).json({ message: 'Unauthorized - No Token Provided' });


        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) return res.status(401).json({ message: 'Unauthorized - Invalid Token' });

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) return res.status(401).json({ message: 'Unauthorized - User Not Found' });
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protect middleware:", error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }

};

export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin')
        return res.status(403).json({ message: 'Access denied' });
    next();
};

export const isInstructor = (req, res, next) => {
    if (req.user.role !== 'instructor')
        return res.status(403).json({ message: 'Access denied' });
    next();
};
