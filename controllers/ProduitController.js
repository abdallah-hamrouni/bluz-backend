const Produit = require('../models/Produit'); 

const createProduit = async (req, res) => {
    try {
        console.log("Files received:", req.files);  // Debugging files
        console.log("Body data received:", req.body);  // Debugging other fields

        const { name, price, category, description, colors } = req.body;

        // Iterate over the colors array and match the files to each color
        const updatedColors = colors.map((color, index) => {
            // Get the files for the current color
            const colorFiles = req.files[`colors[${index}][images]`];

            // If there are files, map the file data to image URLs
            const colorImages = colorFiles ? colorFiles.map(file => `https://bluz-backend.onrender.com/uploads/${file.filename}`) : [];

            return {
                name: color.name,
                images: colorImages
            };
        });

        // Create a new product
        const newProduit = new Produit({ name, price, category, description, colors: updatedColors });
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
        const produitsWithDetails = produits.map(produit => ({
            _id: produit._id,
            name: produit.name,
            price: produit.price,
            colors: produit.colors.map(color => ({
                name: color.name,
                image: color.images[0] 
            })),
            category: produit.category,
            description: produit.description
        }));
        res.status(200).json(produitsWithDetails);
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
        // Extract the fields from the request body
        const { name, price, category, description, colors } = req.body;
        const product = await Produit.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update the fields that are provided in the request body
        if (name) product.name = name;
        if (price) product.price = price;
        if (category) product.category = category;
        if (description) product.description = description;

        
            colors.forEach((color,index) => {
                const existingColor = product.colors.find(c => c.name.toLowerCase() === color.name.toLowerCase());

                if (existingColor) {
                     const colorFiles = req.files[`colors[${index}][images]`] ||[] ;

                    const newImages = colorFiles.map((file) => 
                        `http://localhost:5000/uploads/${file.filename}`
                    );

                    // Add new images to the existing color's images
                    if (newImages.length > 0) {
                        existingColor.images.push(...newImages);
                    }
                    
                    
                } else {
                    const colorFiles = req.files[`colors[${index}][images]`];
                    const colorImages = colorFiles ? colorFiles.map(file => `http://localhost:5000/uploads/${file.filename}`) : [];
                    product.colors.push({ name: color.name, images: colorImages });
                }
            });
        

        // Save the updated product
        const updatedProduit = await product.save();

        // Return the updated product
        res.status(200).json(updatedProduit);
    } catch (error) {
        console.error(error);
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

/*  
const Produit = require('../models/Produit'); 

    const createProduit = async (req, res) => {
        try {
            console.log("Files received:", req.files);  // Debugging files
            console.log("Body data received:", req.body);  // Debugging other fields

            const { name, price, category,description } = req.body;
    /*         const image = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : '';  // Get the uploaded file path
           const images = req.files ? req.files.map(file => `http://localhost:5000/uploads/${file.filename}`) : [];
                console.log(req.files);
                
                
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
*/