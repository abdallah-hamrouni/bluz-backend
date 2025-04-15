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
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la création de la commande.' });
  }
};

// Récupérer toutes les commandes
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des commandes." });
  }
};

// Supprimer une commande par ID
const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ error: "Commande non trouvée." });
    }
    res.status(200).json({ message: "Commande supprimée avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la suppression de la commande." });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  deleteOrder,
};
