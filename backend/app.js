// Main Express application entry point

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const hotelRoutes = require('./routes/hotelRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---

// Allow requests from the React frontend (running on a different port)
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files
// A file stored at backend/uploads/image.jpg will be accessible at:
// http://localhost:5000/uploads/image.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Routes ---
app.use('/api/hotels', hotelRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Hotel Management API is running.' });
});

// --- Error handling middleware ---
// Placed after all route handlers to catch Multer and unexpected server errors
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Image file is too large. Maximum allowed size is 5MB.' });
  }
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({ message: err.message });
  }
  console.error('Unexpected error:', err.message);
  res.status(500).json({ message: 'An unexpected server error occurred.' });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});

