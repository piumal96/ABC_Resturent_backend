const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
// app.use('/api/users', require('./routes/users'));
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/restaurants', require('./routes/restaurants'));
// app.use('/api/reservations', require('./routes/reservations'));
// app.use('/api/services', require('./routes/services'));
// app.use('/api/queries', require('./routes/queries'));
// app.use('/api/offers', require('./routes/offers'));
// app.use('/api/gallery', require('./routes/gallery'));
// app.use('/api/payments', require('./routes/payments'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
