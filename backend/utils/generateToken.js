import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    // Store the token in a cookie
    res.cookie('token', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // millisecond
        httpOnly: true, // prevent XSS attacks, (cross-site scripting) attacks
        secure: process.env.NODE_ENV === 'production' ? true : false, // set secure to true if in production
        sameSite: 'strict', // CSRF attacks (cross-site request forgery)
    });
    console.log("Cookie stored:", res.cookie?.value)

    return token;
};


// The issue is that the `secure` option is set to `true` in development mode, which means the cookie will only be sent over HTTPS.
// To fix this, set `secure` to `false` in development mode.

