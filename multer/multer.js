const multer = require('multer');
const path = require('path');

// Set storage destination and file naming convention
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');  // Define where the files should be stored
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);  // Get file extension
        const fileName = Date.now() + ext;  // Generate unique filename based on current timestamp
        cb(null, fileName);  // Set the file name to be saved
    }
});

// Initialize multer with storage settings
const upload = multer({ storage });

const uploadColors = (req, res, next) => {
    const colorFields = [];
    const numOfColors = 10;  // Set the maximum number of colors

    // Generate the expected field names dynamically
    for (let i = 0; i < numOfColors; i++) {
        colorFields.push({ name: `colors[${i}][images]`, maxCount: 10 }); // Dynamic field names
    }

    // Use multer to handle file uploads based on dynamic fields
    try {
        upload.fields(colorFields)(req, res, next);
    } catch (err) {
        next(err);  // Pass the error to the error-handling middleware
    }
};


// Export the upload handler
module.exports = { upload, uploadColors };
