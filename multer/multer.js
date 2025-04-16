const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../cloudinaryConfig'); // <- ton fichier de config Cloudinary

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads', // dossier sur Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

const uploadColors = (req, res, next) => {
    const colorFields = [];
    const numOfColors = 10;

    for (let i = 0; i < numOfColors; i++) {
        colorFields.push({ name: `colors[${i}][images]`, maxCount: 10 });
    }

    upload.fields(colorFields)(req, res, next);
};

module.exports = { upload, uploadColors };
