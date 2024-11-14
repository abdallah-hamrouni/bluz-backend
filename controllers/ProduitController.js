const Produit = require('../models/Produit'); 

const createProduit = async (req, res) => {
    try {
        const { name, price, category } = req.body;
        const image = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : '';  // Get the uploaded file path
        
        const newProduit = new Produit({ name, price, image, category });
        const savedProduit = await newProduit.save();

        res.status(201).json(savedProduit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProduits = async (req, res) => {
    try {
        const { category } = req.query;  // Extract category from query parameters
        let filter = {};

        // If category is passed in the query, filter by category
        if (category) {
            filter.category = category;
        }
        const produits = await Produit.find(filter);
        res.status(200).json(produits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProduitById = async (req, res) => {
    try {
        const produit = await Produit.findById(req.params.id);
        if (!produit) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(produit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduit = async (req, res) => {
    try {
        const { name, price, image, category } = req.body;
        const updatedProduit = await Produit.findByIdAndUpdate(
            req.params.id,
            { name, price, image, category },
            { new: true, runValidators: true }
        );
        if (!updatedProduit) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduit = async (req, res) => {
    try {
        const produit = await Produit.findByIdAndDelete(req.params.id);
        if (!produit) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createProduit,
    getProduits,
    getProduitById,
    updateProduit,
    deleteProduit
};
