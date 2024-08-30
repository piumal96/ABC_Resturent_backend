const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { GridFSBucket } = require('mongodb');
const multer = require('multer');
const path = require('path');

// Initialize GridFS
let gfs, gridFSBucket;
mongoose.connection.once('open', () => {
  gridFSBucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads',
  });
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
  console.log('GridFS initialized');
});

// Set up multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('file');

// Upload a New Image (Admin Only)
exports.uploadImage = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err.message);
      return res.status(400).json({ success: false, message: err.message });
    }

    const { title, description } = req.body;

    const uploadStream = gridFSBucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: { title, description },
    });

    uploadStream.end(req.file.buffer, (uploadErr) => {
      if (uploadErr) {
        console.error('Upload stream error:', uploadErr);
        return res.status(500).json({ success: false, message: 'File upload failed' });
      }

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        fileId: uploadStream.id,
      });
    });
  });
};

// Get All Images (Public)
exports.getAllImages = async (req, res) => {
  try {
    const images = await gfs.files.find().toArray();
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

// Get a Specific Image (Public)
exports.getImage = async (req, res) => {
  try {
    const file = await gfs.files.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    const readStream = gridFSBucket.openDownloadStream(file._id);
    res.set('Content-Type', file.contentType);
    readStream.pipe(res);
  } catch (err) {
    console.error('Error fetching image:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete an Image (Admin Only)
exports.deleteImage = async (req, res) => {
  try {
    await gridFSBucket.delete(mongoose.Types.ObjectId(req.params.id));
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
