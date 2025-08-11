import dotenv from 'dotenv';
dotenv.config();

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy } from 'passport-jwt';

import { User } from '../models/user.model.js';

// Google OAuth strategy for authentication
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {

                // Check if the user already exists in the database
                const email = profile.emails[0].value;

                let user = await User.findOne({ email });
                if (!user) {
                    user = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email,
                        profilePicture: profile.photos[0].value,
                        password: 'GOOGLE_OAUTH_USER', // dummy password
                        isVerified: true,
                    });
                }
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);


// jwt strategy for authentication
const cookieExtractor = (req) => req?.cookies && req.cookies.token ? req.cookies.token : null;
// console.log("JWT Strategy:", cookieExtractor);
const opts = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET
};

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {

            const user = await User.findById(jwt_payload.userId);
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        } catch (err) {
            done(err, false);
        }
    }));

