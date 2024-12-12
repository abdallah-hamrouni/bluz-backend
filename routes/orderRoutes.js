// routes/orderRoutes.js
const express = require('express');
const { createOrder } = require('../controllers/orderController');
const router = express.Router();

// Définir la route POST pour créer une commande
router.post('/', createOrder);

module.exports = router;
