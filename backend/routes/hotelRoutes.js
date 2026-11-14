// Hotel Routes
// Defines all the API endpoints for hotel operations

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} = require('../controllers/hotelController');

// GET  /api/hotels        — fetch all hotels (with search, filter, pagination)
router.get('/', getHotels);

// GET  /api/hotels/:id    — fetch a single hotel by ID
router.get('/:id', getHotelById);

// POST /api/hotels        — create a new hotel (with image upload)
router.post('/', upload.single('image'), createHotel);

// PUT  /api/hotels/:id    — update a hotel (with optional image replacement)
router.put('/:id', upload.single('image'), updateHotel);

// DELETE /api/hotels/:id  — delete a hotel
router.delete('/:id', deleteHotel);

module.exports = router;

