const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/quoteDatabase', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Quote schema
const quoteSchema = new mongoose.Schema({
    text: String,
    author: String,
});

const Quote = mongoose.model('Quote', quoteSchema);

// Middleware
app.use(bodyParser.json());

// Handle CORS (Cross-Origin Resource Sharing) to allow requests from your front-end
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Save quote to MongoDB
app.post('/', async (req, res) => {
    const { text, author } = req.body;

    try {
        // Create a new document
        const newQuoteDocument = {
            text: text,
            author: author,
        };

        // Insert the document into the collection using insertOne
        const insertResult = await Quote.collection.insertOne(newQuoteDocument);
        console.log('Inserted post with id:', insertResult.insertedId);

        // Include ObjectId in the response
        res.status(201).json({ id: insertResult.insertedId, text: text, author: author });
    } catch (error) {
        console.error('Error saving quote to database:', error);
        res.status(500).send('Internal Server Error');
    }
});



// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
