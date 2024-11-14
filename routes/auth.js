const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User'); 
const client = new OAuth2Client('891812901211-2ahi02tm34vmtqta2599ipkpoc13ii6u.apps.googleusercontent.com'); 

const verifyGoogleToken = async (token) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '891812901211-2ahi02tm34vmtqta2599ipkpoc13ii6u.apps.googleusercontent.com', 
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        return { googleId, email, name, picture };
    } catch (error) {
        console.error('Error verifying token:', error);
        throw new Error('Invalid Google token');
    }
};

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
    }
};

router.post('/register', register);
router.post('/login', login);

router.post('/google-login', async (req, res) => {
    try {
        const { token } = req.body;
        
        const { googleId, email, name } = await verifyGoogleToken(token);

        const user = await addGoogleUser(googleId, email, name);

        res.status(200).json({ message: 'User logged in successfully', user });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router;