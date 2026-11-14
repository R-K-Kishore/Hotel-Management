// App.jsx
// Sets up routing and wraps the app with the Redux store and HelmetProvider

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import store from './redux/store';
import Navbar from './components/Navbar';
import HotelList from './pages/HotelList';
import HotelDetails from './pages/HotelDetails';
import AddHotel from './pages/AddHotel';
import EditHotel from './pages/EditHotel';
import './styles/App.css';

function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HotelList />} />
            <Route path="/hotels/:id" element={<HotelDetails />} />
            <Route path="/add-hotel" element={<AddHotel />} />
            <Route path="/edit-hotel/:id" element={<EditHotel />} />
          </Routes>
        </Router>
      </HelmetProvider>
    </Provider>
  );
}

export default App;
