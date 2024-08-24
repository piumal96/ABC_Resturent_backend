// controllers/GalleryController.js

const GalleryImage = require('../models/GalleryImage');

// Upload a New Image (Admin Only)
exports.uploadImage = async (req, res) => {
  const { title, description, imageUrl } = req.body;

  try {
    const image = new GalleryImage({
      title,
      description,
      imageUrl,  // Assuming imageUrl is the path or URL to the uploaded image
    });

    await image.save();
    res.status(201).json(image);
  } catch (err) {
    console.error('Error uploading image:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get All Images (Public)
exports.getAllImages = async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ uploadedAt: -1 });
    res.status(200).json(images);
  } catch (err) {
    console.error('Error fetching images:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete an Image (Admin Only)
exports.deleteImage = async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ msg: 'Image not found' });
    }

    await image.deleteOne();
    res.status(200).json({ msg: 'Image deleted successfully' });
  } catch (err) {
    console.error('Error deleting image:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};
