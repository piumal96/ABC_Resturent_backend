// controllers/OfferController.js

const Offer = require('../models/Offer');

// Create a New Offer (Admin Only)
exports.createOffer = async (req, res) => {
  const { title, description, discountPercentage, validFrom, validTo } = req.body;

  try {
    const offer = new Offer({
      title,
      description,
      discountPercentage,
      validFrom,
      validTo,
    });

    await offer.save();
    res.status(201).json(offer);
  } catch (err) {
    console.error('Error creating offer:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get All Offers
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find();
    res.status(200).json(offers);
  } catch (err) {
    console.error('Error fetching offers:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get a Single Offer by ID
exports.getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ msg: 'Offer not found' });
    }
    res.status(200).json(offer);
  } catch (err) {
    console.error('Error fetching offer:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update an Offer (Admin Only)
exports.updateOffer = async (req, res) => {
  const { title, description, discountPercentage, validFrom, validTo } = req.body;

  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ msg: 'Offer not found' });
    }

    if (title) offer.title = title;
    if (description) offer.description = description;
    if (discountPercentage) offer.discountPercentage = discountPercentage;
    if (validFrom) offer.validFrom = validFrom;
    if (validTo) offer.validTo = validTo;

    await offer.save();
    res.status(200).json(offer);
  } catch (err) {
    console.error('Error updating offer:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete an Offer (Admin Only)
exports.deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ msg: 'Offer not found' });
    }

    await offer.deleteOne();
    res.status(200).json({ msg: 'Offer deleted successfully' });
  } catch (err) {
    console.error('Error deleting offer:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};
