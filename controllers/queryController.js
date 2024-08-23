const Query = require('../models/Query');
const User = require('../models/User');

// @desc Submit a query
exports.submitQuery = async (req, res) => {
  const { query_text } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const query = new Query({
      user_id: req.user.id,
      query: query_text,
    });

    await query.save();
    res.json({ query });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc Get all queries (Admin/Staff)
exports.getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find().populate('user_id');
    res.json(queries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc Respond to a query (Admin/Staff)
exports.respondToQuery = async (req, res) => {
  const { query_id, response_text } = req.body;

  try {
    let query = await Query.findById(query_id);
    if (!query) {
      return res.status(400).json({ msg: 'Query not found' });
    }

    query.response = response_text;
    query.status = 'Answered';
    await query.save();

    res.json(query);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc Get user queries (Customer)
exports.getUserQueries = async (req, res) => {
  try {
    const queries = await Query.find({ user_id: req.user.id });
    res.json(queries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
