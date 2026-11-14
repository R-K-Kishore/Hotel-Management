// Hotel Controller
// Contains all the business logic for hotel CRUD operations

const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

// Helper: delete an image file from the uploads folder
function deleteImageFile(imagePath) {
  if (!imagePath) return;
  // The imagePath stored in DB is like "uploads/filename.jpg"
  const fullPath = path.join(__dirname, '..', imagePath);
  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, (err) => {
      if (err) console.error('Error deleting image file:', err.message);
    });
  }
}

// Helper: validate hotel input fields
function validateHotelInput({ title, description, latitude, longitude, price }) {
  const errors = [];

  if (!title || title.trim() === '') {
    errors.push('Title is required.');
  } else if (title.trim().length > 150) {
    errors.push('Title must not exceed 150 characters.');
  }

  if (!description || description.trim() === '') {
    errors.push('Description is required.');
  }

  const lat = parseFloat(latitude);
  if (latitude === undefined || latitude === null || latitude === '') {
    errors.push('Latitude is required.');
  } else if (isNaN(lat) || lat < -90 || lat > 90) {
    errors.push('Latitude must be a number between -90 and 90.');
  }

  const lon = parseFloat(longitude);
  if (longitude === undefined || longitude === null || longitude === '') {
    errors.push('Longitude is required.');
  } else if (isNaN(lon) || lon < -180 || lon > 180) {
    errors.push('Longitude must be a number between -180 and 180.');
  }

  const p = parseFloat(price);
  if (price === undefined || price === null || price === '') {
    errors.push('Price is required.');
  } else if (isNaN(p) || p <= 0) {
    errors.push('Price must be a positive number.');
  }

  return errors;
}

// GET /api/hotels
// Fetch all hotels with optional search, price filter and pagination
async function getHotels(req, res) {
  try {
    const { search, minPrice, maxPrice, page = 1, limit = 5 } = req.query;

    const pageNumber = parseInt(page);
    const pageLimit = parseInt(limit);
    const offset = (pageNumber - 1) * pageLimit;

    // Build the WHERE clause dynamically
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (search && search.trim() !== '') {
      conditions.push(`title ILIKE $${paramIndex}`);
      values.push(`%${search.trim()}%`);
      paramIndex++;
    }

    if (minPrice && !isNaN(parseFloat(minPrice))) {
      conditions.push(`price >= $${paramIndex}`);
      values.push(parseFloat(minPrice));
      paramIndex++;
    }

    if (maxPrice && !isNaN(parseFloat(maxPrice))) {
      conditions.push(`price <= $${paramIndex}`);
      values.push(parseFloat(maxPrice));
      paramIndex++;
    }

    const whereClause =
      conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    // Count total matching records for pagination
    const countQuery = `SELECT COUNT(*) FROM hotels ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const totalRecords = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalRecords / pageLimit);

    // Fetch paginated records
    const dataQuery = `
      SELECT * FROM hotels
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const dataValues = [...values, pageLimit, offset];
    const dataResult = await pool.query(dataQuery, dataValues);

    res.status(200).json({
      hotels: dataResult.rows,
      totalRecords,
      totalPages,
      currentPage: pageNumber,
      limit: pageLimit,
    });
  } catch (error) {
    console.error('Error fetching hotels:', error.message);
    res.status(500).json({ message: 'Failed to fetch hotels. Please try again.' });
  }
}

// GET /api/hotels/:id
// Fetch a single hotel by ID along with its gallery images
async function getHotelById(req, res) {
  try {
    const { id } = req.params;

    // Validate the ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid hotel ID.' });
    }

    const result = await pool.query('SELECT * FROM hotels WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Hotel not found.' });
    }

    const hotel = result.rows[0];

    // Fetch associated gallery images if available
    const imagesResult = await pool.query(
      'SELECT id, category, image_url, caption, source_info FROM hotel_images WHERE hotel_id = $1 ORDER BY id ASC',
      [id]
    );
    hotel.images = imagesResult.rows;

    res.status(200).json(hotel);
  } catch (error) {
    console.error('Error fetching hotel:', error.message);
    res.status(500).json({ message: 'Failed to fetch hotel. Please try again.' });
  }
}

// POST /api/hotels
// Create a new hotel
async function createHotel(req, res) {
  try {
    const { title, description, latitude, longitude, price } = req.body;

    // Validate input fields
    const errors = validateHotelInput({ title, description, latitude, longitude, price });
    if (errors.length > 0) {
      // If a file was uploaded but validation failed, delete it
      if (req.file) {
        deleteImageFile('uploads/' + req.file.filename);
      }
      return res.status(400).json({ message: errors.join(' ') });
    }

    // Build the image path if a file was uploaded
    const imagePath = req.file ? 'uploads/' + req.file.filename : null;

    const result = await pool.query(
      `INSERT INTO hotels (image, title, description, latitude, longitude, price, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [
        imagePath,
        title.trim(),
        description.trim(),
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(price),
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating hotel:', error.message);
    if (req.file) {
      deleteImageFile('uploads/' + req.file.filename);
    }
    res.status(500).json({ message: 'Failed to create hotel. Please try again.' });
  }
}

// PUT /api/hotels/:id
// Update an existing hotel
async function updateHotel(req, res) {
  try {
    const { id } = req.params;

    // Validate the ID
    if (!id || isNaN(parseInt(id))) {
      if (req.file) deleteImageFile('uploads/' + req.file.filename);
      return res.status(400).json({ message: 'Invalid hotel ID.' });
    }

    // Check if the hotel exists
    const existing = await pool.query('SELECT * FROM hotels WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      if (req.file) deleteImageFile('uploads/' + req.file.filename);
      return res.status(404).json({ message: 'Hotel not found.' });
    }

    const { title, description, latitude, longitude, price } = req.body;

    // Validate input fields
    const errors = validateHotelInput({ title, description, latitude, longitude, price });
    if (errors.length > 0) {
      if (req.file) deleteImageFile('uploads/' + req.file.filename);
      return res.status(400).json({ message: errors.join(' ') });
    }

    const existingHotel = existing.rows[0];

    // Determine the image path to use
    let imagePath = existingHotel.image; // keep old image by default
    if (req.file) {
      // A new image was uploaded — first update the DB, then delete the old image
      imagePath = 'uploads/' + req.file.filename;
    }

    const result = await pool.query(
      `UPDATE hotels
       SET image = $1, title = $2, description = $3, latitude = $4, longitude = $5, price = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [
        imagePath,
        title.trim(),
        description.trim(),
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(price),
        id,
      ]
    );

    // Now that the DB update succeeded, delete the old image if it was replaced
    if (req.file && existingHotel.image) {
      deleteImageFile(existingHotel.image);
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating hotel:', error.message);
    if (req.file) deleteImageFile('uploads/' + req.file.filename);
    res.status(500).json({ message: 'Failed to update hotel. Please try again.' });
  }
}

// DELETE /api/hotels/:id
// Delete a hotel by ID
async function deleteHotel(req, res) {
  try {
    const { id } = req.params;

    // Validate the ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid hotel ID.' });
    }

    // Check if the hotel exists
    const existing = await pool.query('SELECT * FROM hotels WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Hotel not found.' });
    }

    const hotel = existing.rows[0];

    // Delete the hotel record from the database
    await pool.query('DELETE FROM hotels WHERE id = $1', [id]);

    // Delete the associated image file if it exists
    if (hotel.image) {
      deleteImageFile(hotel.image);
    }

    res.status(200).json({ message: 'Hotel deleted successfully.' });
  } catch (error) {
    console.error('Error deleting hotel:', error.message);
    res.status(500).json({ message: 'Failed to delete hotel. Please try again.' });
  }
}

module.exports = {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
};

