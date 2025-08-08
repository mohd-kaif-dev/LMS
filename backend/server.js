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


const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());
// Middleware to parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));
// Middleware to handle CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
// Middleware to store and parse cookies
app.use(cookieParser())

app.use(session({
    secret: 'temporary', // can be anything, not for JWT
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


app.get("/", (req, res) => {
    res.send("Welcome to LMS API!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    connectDB();
});