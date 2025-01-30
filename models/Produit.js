const mongoose = require('mongoose');

const ProduitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    colors: [{
        name: { type: String, required: true },
        images: { type: [String], required: true } 
    }]
});

const Produit = mongoose.model('produit', ProduitSchema);
module.exports = Produit;