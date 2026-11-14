// EditHotel page
// Loads the existing hotel from the backend and passes it to HotelForm

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { getHotelById, clearSelectedHotel } from '../redux/hotelSlice';
import HotelForm from '../components/HotelForm';
import '../styles/Hotel.css';

function EditHotel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedHotel, detailLoading, error } = useSelector((state) => state.hotels);

  useEffect(() => {
    dispatch(getHotelById(id));

    return () => {
      dispatch(clearSelectedHotel());
    };
  }, [dispatch, id]);

  return (
    <>
      <Helmet>
        <title>Edit Hotel - Hotel Management</title>
        <meta name="description" content="Edit hotel information." />
      </Helmet>

      <div className="main-content">
        {/* Loading state */}
        {detailLoading && (
          <div className="loading-wrapper">
            <div className="spinner" />
          </div>
        )}

        {/* Error state */}
        {!detailLoading && error && (
          <>
            <div className="message-box error">{error}</div>
            <button className="btn btn-outline" onClick={() => navigate('/')}>
              Back to Hotels
            </button>
          </>
        )}

        {/* Edit form — rendered only after the hotel is loaded */}
        {!detailLoading && selectedHotel && (
          <HotelForm existingHotel={selectedHotel} />
        )}
      </div>
    </>
  );
}

export default EditHotel;

