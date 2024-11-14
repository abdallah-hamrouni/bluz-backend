const express = require('express');
const router = express.Router();
const { upload } = require('../multer/multer');  

const {
    createProduit,
    getProduits,
    getProduitById,
    updateProduit,
    deleteProduit
} = require('../controllers/ProduitController'); 


router.post('/', upload.single('image'), createProduit);
router.get('/', getProduits);
router.get('/:id', getProduitById);
router.patch('/:id', updateProduit);
router.delete('/:id', deleteProduit);

module.exports = router;
