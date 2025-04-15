const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const Cart = require('../models/Cart'); 
const Produit = require('../models/Produit');

// Ajouter au panier
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

// Récupérer les articles du panier
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

// Supprimer un article du panier
router.delete('/:id', verifyToken, async (req, res) => {
  const userId = req.user?.sub || req.user?.userId;
  const itemId = req.params.id;

  try {
    const cartItem = await Cart.findOneAndDelete({ _id: itemId, userId });
    if (!cartItem) {
      return res.status(404).json({ msg: 'Item not found in your cart' });
    }

    res.json({ message: 'Item deleted from cart', cartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
