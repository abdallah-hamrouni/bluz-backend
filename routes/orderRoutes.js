// routes/orderRoutes.js
const express = require('express');
const { createOrder,getAllOrders } = require('../controllers/orderController');
const router = express.Router();

// Définir la route POST pour créer une commande
router.post('/', createOrder);
router.get('/', getAllOrders);


module.exports = router;
