const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');
const auth = require('../middlewares/auth');

// @route   POST api/queries
// @desc    Submit a query
// @access  Private
router.post('/', auth, queryController.submitQuery);

// @route   GET api/queries
// @desc    Get all queries (Admin/Staff)
// @access  Private/Admin/Staff
router.get('/', auth, queryController.getAllQueries);

// @route   PUT api/queries
// @desc    Respond to a query (Admin/Staff)
// @access  Private/Admin/Staff
router.put('/', auth, queryController.respondToQuery);

// @route   GET api/queries/user
// @desc    Get user queries (Customer)
// @access  Private
router.get('/user', auth, queryController.getUserQueries);

module.exports = router;
