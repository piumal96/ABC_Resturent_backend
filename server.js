const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

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
app.use('/api/auth', require('./routes/authRoutes'));  // Add this line for auth routes

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = server;  // Export the server instance
