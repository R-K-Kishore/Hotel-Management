// HotelForm component
// Reusable form for both adding and editing a hotel

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addHotel, editHotel } from '../redux/hotelSlice';
import { getImageUrl, FALLBACK_IMAGE } from '../utils/imageUrl';

// Allowed image MIME types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

function HotelForm({ existingHotel }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.hotels);

  // Form field values
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  // Field-level validation errors
  const [fieldErrors, setFieldErrors] = useState({});
  // General submission error (from API)
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Track if the form has been submitted (to prevent duplicates)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(existingHotel);

  // Pre-fill the form when editing an existing hotel
  useEffect(() => {
    if (existingHotel) {
      setTitle(existingHotel.title || '');
      setDescription(existingHotel.description || '');
      setLatitude(existingHotel.latitude !== undefined ? String(existingHotel.latitude) : '');
      setLongitude(existingHotel.longitude !== undefined ? String(existingHotel.longitude) : '');
      setPrice(existingHotel.price !== undefined ? String(existingHotel.price) : '');

      // Show the existing image as a preview
      if (existingHotel.image) {
        setImagePreviewUrl(getImageUrl(existingHotel.image));
      }
    }
  }, [existingHotel]);

  // Handle image file selection
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setFieldErrors((prev) => ({
        ...prev,
        image: 'Invalid file type. Please upload a JPEG, PNG, GIF or WEBP image.',
      }));
      e.target.value = '';
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFieldErrors((prev) => ({
        ...prev,
        image: `File is too large. Maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`,
      }));
      e.target.value = '';
      return;
    }

    // Clear any previous image error and set the preview
    setFieldErrors((prev) => ({ ...prev, image: '' }));
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  }

  // Validate all fields and return an errors object
  function validateFields() {
    const errors = {};

    if (!title.trim()) {
      errors.title = 'Title is required.';
    } else if (title.trim().length > 150) {
      errors.title = 'Title must not exceed 150 characters.';
    }

    if (!description.trim()) {
      errors.description = 'Description is required.';
    }

    const lat = parseFloat(latitude);
    if (latitude === '') {
      errors.latitude = 'Latitude is required.';
    } else if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.latitude = 'Latitude must be between -90 and 90.';
    }

    const lon = parseFloat(longitude);
    if (longitude === '') {
      errors.longitude = 'Longitude is required.';
    } else if (isNaN(lon) || lon < -180 || lon > 180) {
      errors.longitude = 'Longitude must be between -180 and 180.';
    }

    const p = parseFloat(price);
    if (price === '') {
      errors.price = 'Price is required.';
    } else if (isNaN(p) || p <= 0) {
      errors.price = 'Price must be a positive number.';
    }

    // Image is required only when adding a new hotel
    if (!isEditing && !imageFile) {
      errors.image = 'Please select an image for the hotel.';
    }

    return errors;
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting) return;

    setSubmitError('');
    setSubmitSuccess('');

    // Run client-side validation
    const errors = validateFields();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);

    // Build FormData (required for file upload)
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('price', price);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    let result;
    if (isEditing) {
      result = await dispatch(editHotel({ id: existingHotel.id, formData }));
    } else {
      result = await dispatch(addHotel(formData));
    }

    setIsSubmitting(false);

    if (result.error) {
      // The error message comes from the rejected thunk (set by rejectWithValue)
      setSubmitError(result.payload || 'Something went wrong. Please try again.');
      return;
    }

    setSubmitSuccess(isEditing ? 'Hotel updated successfully!' : 'Hotel added successfully!');

    // Redirect to the home page after a short delay
    setTimeout(() => {
      navigate('/');
    }, 1000);
  }

  return (
    <div className="form-wrapper">
      <h1 className="page-title">{isEditing ? 'Edit Hotel' : 'Add Hotel'}</h1>

      {submitError && (
        <div className="message-box error">{submitError}</div>
      )}
      {submitSuccess && (
        <div className="message-box success">{submitSuccess}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Hotel Image */}
        <div className="form-group">
          <label htmlFor="image">
            Hotel Image {!isEditing && <span className="required">*</span>}
          </label>
          <input
            id="image"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleImageChange}
            className={`form-input ${fieldErrors.image ? 'invalid' : ''}`}
          />
          {fieldErrors.image && (
            <span className="form-error">{fieldErrors.image}</span>
          )}
          {isEditing && !imageFile && (
            <span className="form-hint">Leave empty to keep the existing image.</span>
          )}
          {imagePreviewUrl && (
            <img
              src={imagePreviewUrl}
              alt="Hotel preview"
              className="image-preview"
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE;
              }}
            />
          )}
        </div>

        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">
            Hotel Title <span className="required">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Grand Palace Hotel"
            maxLength={150}
            className={`form-input ${fieldErrors.title ? 'invalid' : ''}`}
          />
          {fieldErrors.title && (
            <span className="form-error">{fieldErrors.title}</span>
          )}
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">
            Description <span className="required">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the hotel..."
            rows={4}
            className={`form-input ${fieldErrors.description ? 'invalid' : ''}`}
          />
          {fieldErrors.description && (
            <span className="form-error">{fieldErrors.description}</span>
          )}
        </div>

        {/* Latitude */}
        <div className="form-group">
          <label htmlFor="latitude">
            Latitude <span className="required">*</span>
          </label>
          <input
            id="latitude"
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="e.g. 48.8566"
            className={`form-input ${fieldErrors.latitude ? 'invalid' : ''}`}
          />
          {fieldErrors.latitude && (
            <span className="form-error">{fieldErrors.latitude}</span>
          )}
          <span className="form-hint">Must be between -90 and 90.</span>
        </div>

        {/* Longitude */}
        <div className="form-group">
          <label htmlFor="longitude">
            Longitude <span className="required">*</span>
          </label>
          <input
            id="longitude"
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="e.g. 2.3522"
            className={`form-input ${fieldErrors.longitude ? 'invalid' : ''}`}
          />
          {fieldErrors.longitude && (
            <span className="form-error">{fieldErrors.longitude}</span>
          )}
          <span className="form-hint">Must be between -180 and 180.</span>
        </div>

        {/* Price */}
        <div className="form-group">
          <label htmlFor="price">
            Price per Night (₹) <span className="required">*</span>
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 150.00"
            className={`form-input ${fieldErrors.price ? 'invalid' : ''}`}
          />
          {fieldErrors.price && (
            <span className="form-error">{fieldErrors.price}</span>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || loading}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Hotel' : 'Add Hotel'}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/')}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default HotelForm;

