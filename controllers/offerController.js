const Offer = require('../models/Offer');

// @desc Add a new offer
exports.addOffer = async (req, res) => {
  const { title, description, valid_until, restaurant_id } = req.body;

  try {
    const newOffer = new Offer({
      title,
      description,
      valid_until,
      restaurant_id
    });

    await newOffer.save();
    res.json(newOffer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc Get all offers
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find().populate('restaurant_id');
    res.json(offers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc Update an offer
exports.updateOffer = async (req, res) => {
  const { offer_id, title, description, valid_until, restaurant_id } = req.body;

  try {
    let offer = await Offer.findById(offer_id);
    if (!offer) {
      return res.status(400).json({ msg: 'Offer not found' });
    }

    offer.title = title || offer.title;
    offer.description = description || offer.description;
    offer.valid_until = valid_until || offer.valid_until;
    offer.restaurant_id = restaurant_id || offer.restaurant_id;

    await offer.save();
    res.json(offer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc Delete an offer
exports.deleteOffer = async (req, res) => {
  const { offer_id } = req.body;

  try {
    let offer = await Offer.findById(offer_id);
    if (!offer) {
      return res.status(400).json({ msg: 'Offer not found' });
    }

    await offer.remove();
    res.json({ msg: 'Offer removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
