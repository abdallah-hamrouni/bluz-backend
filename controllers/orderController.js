// controllers/orderController.js
const Order = require('../models/Order');

// Créer une nouvelle commande
const createOrder = async (req, res) => {
  try {
    const { name, email, phone, product, quantity, total } = req.body;

    const newOrder = new Order({
      name,
      email,
      phone,
      product,
      quantity,
      total,
    });

    await newOrder.save();

    // Répondre avec la commande créée
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la création de la commande.' });
  }
};

module.exports = { createOrder };
