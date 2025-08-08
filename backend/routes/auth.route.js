import express from "express"

import passport from 'passport';

const router = express.Router()

// Importing the auth controller
import { register, login, logout, getUser, googleCallback } from "../controllers/auth.controller.js"

// Start Google Login
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google Callback
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);

router.get('/user', passport.authenticate('jwt', { session: false }), getUser);

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)

export default router;