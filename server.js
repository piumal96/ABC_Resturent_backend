const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');
const cors = require('cors');

// Import your route handlers
const restaurantRoutes = require('./routes/restaurant');
const reservationRoutes = require('./routes/reservation');
const serviceRoutes = require('./routes/service');
const offerRoutes = require('./routes/offer');
const queryRoutes = require('./routes/query');
const reportRoutes = require('./routes/reports');
const paymentRoutes = require('./routes/payment');
const galleryRoutes = require('./routes/gallery');
const searchRoutes = require('./routes/search');
const path = require('path');


// Initialize the Express application
const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration with allowed origins
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
}));


// Middleware to parse JSON
app.use(express.json());

// Session middleware configuration with MongoDB store
app.use(session({
  secret: process.env.SESSION_SECRET, // Replace with your generated secret
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // Make sure to use your MongoDB connection string
    autoRemove: 'interval', // Optional, removes expired sessions
    autoRemoveInterval: 10 // Removes expired sessions every 10 minutes
  }),
  cookie: { 
    maxAge: 180 * 60 * 1000, // 3-hour session expiry
    httpOnly: true, // Protects against XSS attacks
    secure: process.env.NODE_ENV === 'production', // Ensures cookies are sent only over HTTPS in production
    sameSite: 'lax' // Helps with CSRF protection
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
app.use('/api/gallery', galleryRoutes);
app.use('/api/search', searchRoutes);
// Serve static files from the 'uploads' directory
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = server;  // Export the server instance
