const express = require('express');
const feedbackController = require('../controllers/feedbackController');
const router = express.Router();

// Route pour soumettre un feedback
router.post('/feedback', feedbackController.submitFeedback);

module.exports = router;
