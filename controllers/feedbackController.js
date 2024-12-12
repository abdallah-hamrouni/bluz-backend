const Feedback = require('../models/Feedback');

// Fonction pour soumettre un feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Création d'un nouvel objet feedback
    const feedback = new Feedback({
      name,
      email,
      message
    });

    // Sauvegarde dans la base de données
    await feedback.save();

    // Retourner une réponse de succès
    res.status(201).json({ message: 'Feedback soumis avec succès!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la soumission du feedback' });
  }
};
