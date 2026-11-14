// Multer middleware for handling image uploads
// Stores uploaded images in the backend/uploads/ folder

const multer = require('multer');
const path = require('path');

// Define where to store uploaded files and what to name them
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    // Create a unique filename using the current timestamp
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueName + extension);
  },
});

// Only allow image file types (JPEG, JPG, PNG, GIF, WEBP)
function fileFilter(req, file, cb) {
  const allowedMimeTypes = /^image\/(jpeg|jpg|png|gif|webp)$/i;
  const allowedExtensions = /^\.(jpe?g|png|gif|webp)$/i;

  const isValidMimeType = allowedMimeTypes.test(file.mimetype);
  const isValidExtension = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (isValidMimeType && isValidExtension) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF and WEBP are allowed.'));
  }
}

// Set a maximum file size of 5MB
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

module.exports = upload;

