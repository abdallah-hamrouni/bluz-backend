const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const Cart = require('../models/Cart'); // Import your Cart model
const Product = require('../models/Produit'); // Import your Product model
const Produit = require('../models/Produit');

// Add product to cart
router.post('/addToCart', verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    // Check if the product exists
    const product = await Produit.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Check if the item already exists in the cart
    let cartItem = await Cart.findOne({ userId, productId });
    
    if (cartItem) {
      // Update quantity if product already exists in cart
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Create a new cart item
      cartItem = new Cart({ userId, productId, quantity });
      await cartItem.save();
    }

    res.json({ message: 'Product added to cart', cartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get cart items for a user
router.get('/', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const cartItems = await Cart.find({ userId }).populate('productId'); // Populate product details
    res.json({ cart: cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;