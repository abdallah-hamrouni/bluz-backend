const mongoose = require('mongoose');

// Schéma utilisateur
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    phone: {
        type: Number,
        required: false
    }
}, {
    timestamps: true 
});

const User = mongoose.model('user', userSchema);

module.exports = User;