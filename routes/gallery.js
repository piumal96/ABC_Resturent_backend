// routes/gallery.js

const express = require('express');
const router = express.Router();
const GalleryController = require('../controllers/galleryController');
const { ensureAuthenticated, ensureAdmin } = require('../middlewares/roleMiddleware');

// Admin route - Upload a New Image
router.post('/', ensureAuthenticated, ensureAdmin, GalleryController.uploadImage);

// Public route - Get All Images
router.get('/', GalleryController.getAllImages);

// Admin route - Delete an Image
router.delete('/:id', ensureAuthenticated, ensureAdmin, GalleryController.deleteImage);

module.exports = router;
