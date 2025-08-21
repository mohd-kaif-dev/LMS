import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import passport from 'passport';
import session from 'express-session';
import './config/passport.js'; // Importing passport configuration

import connectDB from "./config/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import courseRoutes from "./routes/course.route.js";
import paymentRoutes from "./routes/payment.route.js";
import checkoutRoutes from "./routes/checkout.route.js";
import orderRoutes from "./routes/order.route.js";
import adminRoutes from "./routes/admin.route.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

// // ✅ Allowed origins (no trailing slash!)
// const allowedOrigins = [
//     process.env.CLIENT_URL || "http://localhost:5173",
//     "https://fdac48dc50df.ngrok-free.app"
// ];
// const ngrokRegex = /\.ngrok-free\.app$/;



// ✅ Apply CORS globally
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));



// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to store and parse cookies
app.use(cookieParser());

app.use(session({
    secret: 'temporary', // can be anything, not for JWT
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to LMS API!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});
