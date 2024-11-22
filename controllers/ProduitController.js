const Produit = require('../models/Produit'); 

const createProduit = async (req, res) => {
    try {
        const { name, price, category,description } = req.body;
/*         const image = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : '';  // Get the uploaded file path
 */        const images = req.files 
            ? req.files.map(file => `http://localhost:5000/uploads/${file.filename}`) 
            : [];
            
        const newProduit = new Produit({ name, price, images, category ,description});
        const savedProduit = await newProduit.save();

        res.status(201).json(savedProduit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProduits = async (req, res) => {
    try {
        const { category } = req.query;  
        let filter = {};

        if (category) {
            filter.category = category;
        }
        const produits = await Produit.find(filter);
        const produitsWithSingleImage = produits.map(produit => ({
            _id: produit._id,
            name: produit.name,
            price: produit.price,
            image: produit.images[0], 
            category: produit.category,
            description:produit.description
        }));
        res.status(200).json(produitsWithSingleImage);
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
         const produitWithSingleImage = {
            _id: produit._id,
            name: produit.name,
            price: produit.price,
            image: produit.images[0], // Include only the first image
            images: produit.images,  // Full array of images
            category: produit.category,
            description:produit.description
        };
        res.status(200).json(produitWithSingleImage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduit = async (req, res) => {
    try {
        const { name, price, image, category,description } = req.body;
        const updatedProduit = await Produit.findByIdAndUpdate(
            req.params.id,
            { name, price, image, category ,description},
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
