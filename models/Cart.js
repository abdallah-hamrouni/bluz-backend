const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    ref: 'User',
    required: true 
  },
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'produit', 
    required: true 
  },
  quantity: { 
    type: Number, 
    default: 1 
  },
}, {
  timestamps: true, 
});

const Cart= mongoose.model('Cart', CartSchema);
module.exports = Cart;
