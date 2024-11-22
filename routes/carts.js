const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const Cart = require('../models/Cart'); 
const Produit = require('../models/Produit');

router.post('/addToCart', verifyToken, async (req, res) => {

  console.log('Authenticated user:', req.user); 
  const { productId, quantity } = req.body;

  const userId = req.user?.sub || req.user?.userId;

  try {
    const product = await Produit.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    let cartItem = await Cart.findOne({ userId, productId });
    
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new Cart({ userId, productId, quantity });
      await cartItem.save();
    }

    res.json({ message: 'Product added to cart', cartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/', verifyToken, async (req, res) => {
  const userId = req.user?.sub || req.user?.userId;
  console.log(userId);
  try {
    const cartItems = await Cart.find({ userId }).populate('productId'); 
    res.json({ cart: cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;