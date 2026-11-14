// HotelCard component
// Displays a single hotel as a card on the listing page

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeHotel, getHotels } from '../redux/hotelSlice';
import { getImageUrl, FALLBACK_IMAGE } from '../utils/imageUrl';

function HotelCard({ hotel, currentFilters }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Navigate to the hotel details page
  function handleViewDetails() {
    navigate(`/hotels/${hotel.id}`);
  }

  // Navigate to the edit page
  function handleEdit() {
    navigate(`/edit-hotel/${hotel.id}`);
  }

  // Ask for confirmation before deleting
  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${hotel.title}"?`
    );
    if (!confirmed) return;

    const result = await dispatch(removeHotel(hotel.id));

    // If deletion was successful, re-fetch the hotels list
    if (!result.error) {
      dispatch(getHotels(currentFilters));
    }
  }

  return (
    <div className="hotel-card">
      <img
        src={getImageUrl(hotel.image)}
        alt={hotel.title}
        className="hotel-card-image"
        onError={(e) => {
          e.target.src = FALLBACK_IMAGE;
        }}
      />

      <div className="hotel-card-body">
        <h3 className="hotel-card-title">{hotel.title}</h3>
        {hotel.city && (
          <p className="hotel-card-location" style={{ fontSize: '0.82rem', color: '#1a56db', fontWeight: 500, margin: '2px 0 4px' }}>
            📍 {hotel.city}{hotel.state ? `, ${hotel.state}` : ''}
          </p>
        )}
        <p className="hotel-card-desc">{hotel.description}</p>
        <p className="hotel-card-price">₹{parseFloat(hotel.price).toLocaleString('en-IN')} / night</p>
      </div>

      <div className="hotel-card-actions">
        <button className="btn btn-primary" onClick={handleViewDetails}>
          View Details
        </button>
        <button className="btn btn-outline" onClick={handleEdit}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default HotelCard;

