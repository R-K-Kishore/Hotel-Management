// AddHotel page
// Renders the HotelForm component for adding a new hotel

import { Helmet } from 'react-helmet-async';
import HotelForm from '../components/HotelForm';
import '../styles/Hotel.css';

function AddHotel() {
  return (
    <>
      <Helmet>
        <title>Add Hotel - Hotel Management</title>
        <meta name="description" content="Add a new hotel to the Hotel Management system." />
      </Helmet>

      <div className="main-content">
        {/* No existingHotel prop = form is in "add" mode */}
        <HotelForm />
      </div>
    </>
  );
}

export default AddHotel;

