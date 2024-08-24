// routes/offer.js

const express = require('express');
const router = express.Router();
const OfferController = require('../controllers/offerController');
const { ensureAuthenticated, ensureAdmin } = require('../middlewares/roleMiddleware');

// Public route - Get All Offers
router.get('/', OfferController.getAllOffers);

// Public route - Get a Single Offer by ID
router.get('/:id', OfferController.getOfferById);

// Admin route - Create a New Offer
router.post('/', ensureAuthenticated, ensureAdmin, OfferController.createOffer);

// Admin route - Update an Offer
router.put('/:id', ensureAuthenticated, ensureAdmin, OfferController.updateOffer);

// Admin route - Delete an Offer
router.delete('/:id', ensureAuthenticated, ensureAdmin, OfferController.deleteOffer);

module.exports = router;
