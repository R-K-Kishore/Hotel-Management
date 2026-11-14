// HotelList page
// Main page that shows all hotels, search/filter bar, and pagination

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { getHotels } from '../redux/hotelSlice';
import HotelCard from '../components/HotelCard';
import Pagination from '../components/Pagination';
import '../styles/Hotel.css';

function HotelList() {
  const dispatch = useDispatch();
  const { hotels, loading, error, totalPages, currentPage, totalRecords } = useSelector(
    (state) => state.hotels
  );

  // Filter and search state (not sent to API until "Apply" is clicked)
  const [searchInput, setSearchInput] = useState('');
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');

  // Applied filters (sent to the API)
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    page: 1,
    limit: 5,
  });

  // Fetch hotels whenever the applied filters change
  useEffect(() => {
    dispatch(getHotels(appliedFilters));
  }, [dispatch, appliedFilters]);

  // Apply the current search and price inputs
  function handleApplyFilters() {
    setAppliedFilters({
      search: searchInput.trim(),
      minPrice: minPriceInput,
      maxPrice: maxPriceInput,
      page: 1, // Reset to page 1 when filters change
      limit: 5,
    });
  }

  // Clear all filters and reset the search inputs
  function handleClearFilters() {
    setSearchInput('');
    setMinPriceInput('');
    setMaxPriceInput('');
    setAppliedFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      page: 1,
      limit: 5,
    });
  }

  // Change the page
  function handlePageChange(newPage) {
    setAppliedFilters((prev) => ({ ...prev, page: newPage }));
  }

  // Allow pressing Enter in search/filter inputs to apply
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  }

  return (
    <>
      <Helmet>
        <title>Hotel Management - GrandStay</title>
        <meta
          name="description"
          content="Browse and manage all hotels. Search by name, filter by price, and view hotel details."
        />
      </Helmet>

      <div className="main-content">
        <h1 className="page-title">GrandStay</h1>

        {/* Search and filter bar */}
        <div className="filter-bar">
          <div className="filter-group">
            <label htmlFor="search">Search by Name</label>
            <input
              id="search"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search hotels..."
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="minPrice">Min Price (₹)</label>
            <input
              id="minPrice"
              type="number"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Min"
              min="0"
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="maxPrice">Max Price (₹)</label>
            <input
              id="maxPrice"
              type="number"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Max"
              min="0"
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>&nbsp;</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-primary" onClick={handleApplyFilters}>
                Apply
              </button>
              <button className="btn btn-outline" onClick={handleClearFilters}>
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="message-box error">
            {error}
          </div>
        )}

        {/* Loading spinner */}
        {loading && (
          <div className="loading-wrapper">
            <div className="spinner" />
          </div>
        )}

        {/* Hotel cards */}
        {!loading && !error && (
          <>
            {hotels.length === 0 ? (
              <div className="empty-state">
                <p>
                  {appliedFilters.search || appliedFilters.minPrice || appliedFilters.maxPrice
                    ? 'No hotels match your search or filter criteria.'
                    : 'No hotels found. Click "Add Hotel" to get started.'}
                </p>
                {(appliedFilters.search || appliedFilters.minPrice || appliedFilters.maxPrice) && (
                  <button className="btn btn-outline" onClick={handleClearFilters}>
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <p style={{ marginBottom: '16px', color: '#6b7280', fontSize: '0.9rem' }}>
                  Showing {hotels.length} of {totalRecords} hotel{totalRecords !== 1 ? 's' : ''}
                </p>

                <div className="hotel-grid">
                  {hotels.map((hotel) => (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      currentFilters={appliedFilters}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default HotelList;

