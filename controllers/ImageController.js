const multer = require('multer');
const path = require('path');
const GalleryImage = require('../models/GalleryImage');

// Set up storage engine for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const destPath = path.join(__dirname, '../uploads/gallery/');
      console.log('Saving file to:', destPath); // Debugging line
      cb(null, destPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  

// Initialize upload
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // Accepted file types
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
}).single('image');

// Upload Gallery Image
exports.uploadGalleryImage = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err,
            });
        }

        try {
            const newImage = new GalleryImage({
                filename: req.file.filename,
                path: req.file.path,
                contentType: req.file.mimetype,
                size: req.file.size,
                description: req.body.description || '',
            });
            await newImage.save();

            res.status(200).json({
                success: true,
                message: 'Image uploaded to gallery successfully',
                data: {
                    imageUrl: req.file.path,
                }
            });
        } catch (err) {
            console.error('Error during gallery image upload:', err.message);
            res.status(500).json({
                success: false,
                message: 'Server error',
            });
        }
    });
};
