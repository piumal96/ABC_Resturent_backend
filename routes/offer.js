const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const auth = require('../middlewares/auth');

// @route   POST api/offers
// @desc    Add a new offer
// @access  Private/Admin
router.post('/', auth, offerController.addOffer);

// @route   GET api/offers
// @desc    Get all offers
// @access  Public
router.get('/', offerController.getAllOffers);

// @route   PUT api/offers
// @desc    Update an offer
// @access  Private/Admin
router.put('/', auth, offerController.updateOffer);

// @route   DELETE api/offers
// @desc    Delete an offer
// @access  Private/Admin
router.delete('/', auth, offerController.deleteOffer);

module.exports = router;
