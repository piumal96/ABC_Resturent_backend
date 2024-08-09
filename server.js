const express = require('express');
const connectDB = require('./config/db'); 

const app = express();

// Init Middleware
app.use(express.json({ extended: false }));

// Connect to database and auto-insert a document on server start
const autoInsert = async () => {
  const client = await connectDB(); // Connect to the database and get the client
  if (!client) {
    console.error('Failed to connect to database.');
    return;
  }

  const db = client.db('abc-restaurant');

  try {
    const documentToInsert = {
      name: "Auto Inserted Item",
      price: 15.99,
      description: "This item was automatically inserted when the server started."
    };

    const result = await db.collection('your-collection-name').insertOne(documentToInsert); // Replace with your collection name
    console.log('Auto Inserted Document:', result);
  } catch (err) {
    console.error('Error during auto insert:', err.message);
  } finally {
    await client.close();  // Close the client connection after operations are complete
  }
};

autoInsert(); // Automatically insert a document when the server starts

app.get('/', (req, res) => res.status(404).send({ msg: 'Hello' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
