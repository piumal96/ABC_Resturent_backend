const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');

const cors = require('cors');
const restaurantRoutes = require('./routes/restaurant');
const reservationRoutes = require('./routes/reservation');
const serviceRoutes = require('./routes/service');
const offerRoutes = require('./routes/offer');
const queryRoutes = require('./routes/query');
const reportRoutes = require('./routes/reports');
const paymentRoutes = require('./routes/payment');
const galleryRoutes = require('./routes/gallery');
const searchRoutes = require('./routes/search');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to enable CORS
app.use(cors({
  origin: 'http://localhost:5173',  // Adjust to match your React app's URL
  credentials: true  // This allows cookies to be sent with requests
}));

// Middleware to parse JSON
app.use(express.json());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,   // Replace with your generated secret
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,  // Make sure to use your MongoDB connection string
  }),
  cookie: { maxAge: 180 * 60 * 1000 }  // 3-hour session expiry
}));

// Define Routes
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

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = server;  // Export the server instance
