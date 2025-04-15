const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');  // Import routes
const cors = require('cors');

dotenv.config();

const app = express();

app.use(express.json());  // Middleware to parse JSON requests
app.use(cors());  // Enable CORS

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Register routes
app.use('/api', authRoutes);  // Prefix API routes with '/api'

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
