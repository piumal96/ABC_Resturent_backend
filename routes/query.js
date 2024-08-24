// routes/query.js

const express = require('express');
const router = express.Router();
const QueryController = require('../controllers/queryController');
const { ensureAuthenticated, ensureAdmin, ensureStaffOrAdmin } = require('../middlewares/roleMiddleware');

// Customer route - Submit a New Query
router.post('/', ensureAuthenticated, QueryController.submitQuery);

// Staff/Admin route - Get All Queries
router.get('/', ensureAuthenticated, ensureStaffOrAdmin, QueryController.getAllQueries);

// Staff/Admin route - Get a Single Query by ID
router.get('/:id', ensureAuthenticated, ensureStaffOrAdmin, QueryController.getQueryById);

// Staff/Admin route - Respond to a Query
router.put('/:id/respond', ensureAuthenticated, ensureStaffOrAdmin, QueryController.respondToQuery);

// Admin route - Delete a Query
router.delete('/:id', ensureAuthenticated, ensureAdmin, QueryController.deleteQuery);

module.exports = router;
