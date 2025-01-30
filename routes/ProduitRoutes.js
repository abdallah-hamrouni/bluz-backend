const express = require('express');
const router = express.Router();
const { uploadColors } = require('../multer/multer');

const {
    createProduit,
    getProduits,
    getProduitById,
    updateProduit,
    deleteProduit
} = require('../controllers/ProduitController'); 

router.post('/', uploadColors, createProduit);
router.get('/', getProduits);
router.get('/:id', getProduitById);
router.patch('/:id', uploadColors, updateProduit);
router.delete('/:id', deleteProduit);

module.exports = router;
