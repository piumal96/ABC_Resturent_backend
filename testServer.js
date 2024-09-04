const express = require('express');
const session = require('express-session');
const { ensureAuthenticated, ensureAdmin, ensureStaffOrAdmin } = require('./middlewares/roleMiddleware'); // Correct the path

const app = express();

// Setup session for testing
app.use(session({
  secret: 'test-secret',
  resave: false,
  saveUninitialized: true
}));

app.use(express.json()); // Add middleware to parse JSON

// Mock login route for testing
app.post('/login', (req, res) => {
  req.session.user = req.body.user; // Set the user role in session
  res.status(200).send('Logged in');
});

// Route protected by ensureAuthenticated
app.get('/authenticated', ensureAuthenticated, (req, res) => {
  res.status(200).json({ msg: 'Authenticated' });
});

// Route protected by ensureAdmin
app.get('/admin', ensureAdmin, (req, res) => {
  res.status(200).json({ msg: 'Admin Access' });
});

// Route protected by ensureStaffOrAdmin
app.get('/staff-or-admin', ensureStaffOrAdmin, (req, res) => {
  res.status(200).json({ msg: 'Staff or Admin Access' });
});

module.exports = app;
