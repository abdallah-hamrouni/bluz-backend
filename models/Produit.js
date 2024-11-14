const mongoose = require('mongoose');


const ProduitSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },image:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true,
        trim:true
    }
})


const Produit = mongoose.model('produit', ProduitSchema);
module.exports = Produit;
