import express from "express"

import passport from 'passport';

const router = express.Router()

// Importing the auth controller
import { login, logout, getUser, googleCallback, checkAuth, signup } from "../controllers/auth.controller.js"
import { protect } from "../middlewares/auth.middleware.js";

// Start Google Login
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google Callback
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);

router.get('/user', passport.authenticate('jwt', { session: false }), getUser);

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.get("/check", protect, checkAuth)

export default router;