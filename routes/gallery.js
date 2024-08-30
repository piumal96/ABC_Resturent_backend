const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

// Define the routes
router.get('/images', galleryController.getAllImages);  // GET all images
router.get('/images/:id', galleryController.getImage);  // GET a specific image
router.post('/upload', galleryController.uploadImage);  // POST a new image
router.delete('/images/:id', galleryController.deleteImage);  // DELETE a specific image

module.exports = router;
