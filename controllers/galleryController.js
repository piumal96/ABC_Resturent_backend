const GalleryImage = require('../models/GalleryImage');

// Upload a New Image (Admin Only)
exports.uploadImage = async (req, res) => {
  const { title, description, imageUrl } = req.body;

  try {
    const image = new GalleryImage({
      title,
      description,
      imageUrl,  
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

    await image.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting image:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
