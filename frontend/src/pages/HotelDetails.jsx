// HotelDetails page
// Shows full details of a single hotel including address, facilities, image galleries, and a Leaflet map

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getHotelById, clearSelectedHotel } from '../redux/hotelSlice';
import { getImageUrl, FALLBACK_IMAGE } from '../utils/imageUrl';
import 'leaflet/dist/leaflet.css';

// Fix missing Leaflet default marker icon in React/Vite builds
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Gallery category definitions in logical display order
const GALLERY_CATEGORIES = [
  { key: 'Reception and Lobby', label: 'Reception & Lobby Gallery' },
  { key: 'Rooms', label: 'Bedroom & Room Interior Gallery' },
  { key: 'Swimming Pool', label: 'Swimming Pool Gallery' },
  { key: 'Garden and Outdoor', label: 'Garden & Outdoor Gallery' },
  { key: 'Restaurant and Dining', label: 'Restaurant & Dining Gallery' },
  { key: 'Other Facilities', label: 'Other Facilities Gallery' }
];

function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedHotel, detailLoading, error } = useSelector((state) => state.hotels);

  useEffect(() => {
    dispatch(getHotelById(id));

    // Clean up selected hotel when leaving this page
    return () => {
      dispatch(clearSelectedHotel());
    };
  }, [dispatch, id]);

  // Format price into Indian Rupees (INR)
  function formatPrice(price) {
    const num = parseFloat(price);
    if (isNaN(num)) return price;
    return `₹${num.toLocaleString('en-IN')}`;
  }

  const fullLocation = selectedHotel
    ? [selectedHotel.address, selectedHotel.city, selectedHotel.state, selectedHotel.country]
        .filter(Boolean)
        .join(', ')
    : '';

  return (
    <>
      {selectedHotel && (
        <Helmet>
          <title>{selectedHotel.title} - Hotel Management</title>
          <meta
            name="description"
            content={`View details for ${selectedHotel.title}. Price: ${formatPrice(selectedHotel.price)} per night.`}
          />
        </Helmet>
      )}

      <div className="main-content">
        <button className="back-link" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* Loading state */}
        {detailLoading && (
          <div className="loading-wrapper">
            <div className="spinner" />
          </div>
        )}

        {/* Error state */}
        {!detailLoading && error && (
          <div className="message-box error">
            {error}
          </div>
        )}

        {/* Hotel details */}
        {!detailLoading && selectedHotel && (
          <div className="hotel-details-wrapper">
            {/* 1. Main Hotel Exterior Image */}
            <img
              src={getImageUrl(selectedHotel.image)}
              alt={selectedHotel.title}
              className="hotel-details-image"
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE;
              }}
            />

            {/* 2. Hotel Name & Address */}
            <h1 className="hotel-details-title">{selectedHotel.title}</h1>
            
            {fullLocation && (
              <p className="hotel-details-address">
                <span className="location-icon">📍</span> {fullLocation}
              </p>
            )}

            {/* 3. Price & Description */}
            <p className="hotel-details-price">
              {formatPrice(selectedHotel.price)} <span className="price-sub">/ night</span>
            </p>

            <p className="hotel-details-desc">{selectedHotel.description}</p>

            {/* Facilities and Amenities (where verified) */}
            {selectedHotel.facilities && (
              <div className="hotel-facilities-section">
                <h3 className="hotel-section-title">Verified Facilities & Amenities</h3>
                <div className="hotel-facilities-tags">
                  {selectedHotel.facilities.split(',').map((fac, idx) => (
                    <span key={idx} className="hotel-facility-tag">
                      ✓ {fac.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 4 to 8. Categorized Hotel Image Galleries */}
            {selectedHotel.images && selectedHotel.images.length > 0 && (
              <div className="hotel-galleries-container">
                <h2 className="hotel-galleries-main-title">Hotel Image Galleries</h2>
                {GALLERY_CATEGORIES.map((cat) => {
                  const categoryImages = selectedHotel.images.filter(
                    (img) => img.category === cat.key
                  );
                  if (categoryImages.length === 0) return null;

                  return (
                    <div key={cat.key} className="hotel-gallery-section">
                      <h3 className="hotel-gallery-title">{cat.label}</h3>
                      <div className="hotel-gallery-grid">
                        {categoryImages.map((img) => (
                          <div key={img.id || img.image_url} className="hotel-gallery-card">
                            <img
                              src={getImageUrl(img.image_url)}
                              alt={img.caption || cat.label}
                              className="hotel-gallery-image"
                              onError={(e) => {
                                e.target.src = FALLBACK_IMAGE;
                              }}
                            />
                            {img.caption && (
                              <div className="hotel-gallery-card-body">
                                <p className="hotel-gallery-caption">{img.caption}</p>
                                {img.source_info && (
                                  <span className="hotel-gallery-source">
                                    Source: {img.source_info}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* GPS Metadata */}
            <div className="hotel-details-meta">
              <span>
                <strong>Latitude:</strong> {selectedHotel.latitude}
              </span>
              <span>
                <strong>Longitude:</strong> {selectedHotel.longitude}
              </span>
            </div>

            {/* 9. Existing Leaflet Map */}
            <div className="map-container">
              <MapContainer
                center={[parseFloat(selectedHotel.latitude), parseFloat(selectedHotel.longitude)]}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker
                  position={[parseFloat(selectedHotel.latitude), parseFloat(selectedHotel.longitude)]}
                >
                  <Popup>
                    <strong>{selectedHotel.title}</strong>
                    <br />
                    {selectedHotel.city || ''}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/edit-hotel/${selectedHotel.id}`)}
              >
                Edit Hotel
              </button>
              <button
                className="btn btn-outline"
                onClick={() => navigate('/')}
              >
                Back to List
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default HotelDetails;
