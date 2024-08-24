// controllers/QueryController.js

const Query = require('../models/Query');

// Submit a New Query (Customer)
exports.submitQuery = async (req, res) => {
  const { subject, message } = req.body;
  const customerId = req.session.user._id;  // Use session data

  try {
    const query = new Query({
      customer: customerId,
      subject,
      message,
    });

    await query.save();
    res.status(201).json(query);
  } catch (err) {
    console.error('Error submitting query:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get All Queries (Staff/Admin)
exports.getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find()
      .populate('customer', 'name email')
      .populate('respondedBy', 'name');
    res.status(200).json(queries);
  } catch (err) {
    console.error('Error fetching queries:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get a Single Query by ID (Staff/Admin)
exports.getQueryById = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('respondedBy', 'name');
    if (!query) {
      return res.status(404).json({ msg: 'Query not found' });
    }
    res.status(200).json(query);
  } catch (err) {
    console.error('Error fetching query:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Respond to a Query (Staff/Admin)
exports.respondToQuery = async (req, res) => {
  const { response } = req.body;
  const staffId = req.session.user._id;  // Use session data

  try {
    const query = await Query.findById(req.params.id);
    if (!query) {
      return res.status(404).json({ msg: 'Query not found' });
    }

    query.response = response;
    query.status = 'Resolved';
    query.respondedBy = staffId;
    query.updatedAt = Date.now();

    await query.save();
    res.status(200).json(query);
  } catch (err) {
    console.error('Error responding to query:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete a Query (Admin Only)
exports.deleteQuery = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) {
      return res.status(404).json({ msg: 'Query not found' });
    }

    await query.deleteOne();
    res.status(200).json({ msg: 'Query deleted successfully' });
  } catch (err) {
    console.error('Error deleting query:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};
