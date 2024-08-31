const multer = require('multer');
const path = require('path');
const GalleryImage = require('../models/GalleryImage');

// Set up storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/gallery/'); // Directory where gallery images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the file name
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

// Upload a New Image (Admin Only)
exports.uploadImage = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    const { title, description } = req.body;

    try {
      const image = new GalleryImage({
        title,
        description,
        imageUrl: req.file.path,  // Save the path of the uploaded image
      });

      await image.save();
      res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        image: {
          id: image._id,
          title: image.title,
          description: image.description,
          imageUrl: image.imageUrl,
          uploadedAt: image.uploadedAt,
        }
      });
    } catch (err) {
      console.error('Error uploading image:', err.message);
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  });
};

// Get All Images (Public)
exports.getAllImages = async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ uploadedAt: -1 });
    res.status(200).json({
      success: true,
      message: 'Images fetched successfully',
      images,
    });
  } catch (err) {
    console.error('Error fetching images:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete an Image (Admin Only)
exports.deleteImage = async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    // Delete the image file from the filesystem
    const fs = require('fs');
    fs.unlink(image.imageUrl, async (err) => {
      if (err) {
        console.error('Error deleting image file:', err.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to delete image file',
        });
      }

      await image.deleteOne();
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
      });
    });
  } catch (err) {
    console.error('Error deleting image:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
