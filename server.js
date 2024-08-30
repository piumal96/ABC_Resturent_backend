const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import your route handlers
const restaurantRoutes = require('./routes/restaurant');
const reservationRoutes = require('./routes/reservation');
const serviceRoutes = require('./routes/service');
const offerRoutes = require('./routes/offer');
const queryRoutes = require('./routes/query');
const reportRoutes = require('./routes/reports');
const paymentRoutes = require('./routes/payment');
const galleryRoutes = require('./routes/gallery'); // New gallery routes
const searchRoutes = require('./routes/search');

// Initialize the Express application
const app = express();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Simplified connection without deprecated options
    console.log('MongoDB connected successfully');

    // Start the server
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

    module.exports = server; 
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); 
  }
})();


// CORS configuration with allowed origins
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));

// Middleware to parse JSON
app.use(express.json());

// Session middleware configuration with MongoDB store
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    autoRemove: 'interval',
    autoRemoveInterval: 10
  }),
  cookie: { 
    maxAge: 180 * 60 * 1000, 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
}));

// Error handling for session store
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI
});

sessionStore.on('error', function(e) {
  console.error('SESSION STORE ERROR', e);
});

// Define API routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));  
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reservations', reservationRoutes); 
app.use('/api/services', serviceRoutes);  
app.use('/api/offers', offerRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/gallery', galleryRoutes); // New gallery routes
app.use('/api/search', searchRoutes);

// Serve static files from the "uploads" directory (if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ success: false, message: 'Server Error' });
});
