const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to the User model
    required: true 
  },
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', // Reference to the Product model
    required: true 
  },
  quantity: { 
    type: Number, 
    default: 1 
  },
}, {
  timestamps: true, // Automatically create createdAt and updatedAt fields
});

module.exports = mongoose.model('Cart', CartSchema);