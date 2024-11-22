const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User'); 
const jwt = require('jsonwebtoken');


const register = router.post('/register', async (req, res) => {
    const { name, email, password, phone } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        phone
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json({ message: 'Utilisateur créé avec succès', user: savedUser });
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur', error: err });
    }
});

const login = router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Identifiants invalides' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Identifiants invalides' });
        }
        const payload = {
            userId: user._id, 
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { algorithm: 'HS256' },{
            expiresIn: '1h', 
        });
        
        res.status(200).json({ message: 'Connexion réussie', token });
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur', error: err });
    }
});

module.exports = { register, login };
