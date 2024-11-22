const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const HS256_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = '891812901211-2ahi02tm34vmtqta2599ipkpoc13ii6u.apps.googleusercontent.com';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Middleware to verify tokens (HS256 or RS256)
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token is required' });
    }

    try {
        const decodedHeader = jwt.decode(token, { complete: true }).header;
        console.log('Token algorithm:', decodedHeader.alg);

        if (decodedHeader.alg === 'HS256') {
            const decoded = jwt.verify(token, HS256_SECRET, { algorithms: ['HS256'] });
            req.user = decoded; 
            console.log(req.user);
        } else if (decodedHeader.alg === 'RS256') {
            // Verify Google token
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            req.user = {
                googleId: payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
            };
            console.log(payload);
        } else {
            throw new Error('Unsupported algorithm');
        }

        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Helper function to verify Google token
const verifyGoogleToken = async (token) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        return { googleId, email, name, picture };
    } catch (error) {
        console.error('Error verifying token:', error);
        throw new Error('Invalid Google token');
    }
};

// Add Google user if they don't exist
const addGoogleUser = async (googleId, email, name) => {
    try {
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                googleId,
                name,
                email,
            });

            await user.save();
            console.log('New user added:', user);
        }

        return user;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};

// Routes
router.post('/register', register);
router.post('/login', login);

router.post('/google-login', async (req, res) => {
    try {
        const { token } = req.body;

        const { googleId, email, name, picture } = await verifyGoogleToken(token);

        const user = await addGoogleUser(googleId, email, name);

        res.status(200).json({ message: 'User logged in successfully', user });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Example route using the middleware
router.post('/protected-route', verifyToken, (req, res) => {
    res.status(200).json({
        message: 'Access granted',
        user: req.user,
    });
});

module.exports = router;
