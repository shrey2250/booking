import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../components/hotels.css';
import { hotelAPI } from '../api/axios';
import { getAuthSnapshot } from '../utils/auth';

const Hotels = () => {
  const [sortBy, setSortBy] = useState('recommended');
  const [allHotels, setAllHotels] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const destinationFromState = location.state?.destination;
    if (destinationFromState) {
      setLocationFilter(destinationFromState);
    }

    const fetchHotels = async () => {
      try {
        const params = {};
        if (destinationFromState) {
          params.location = destinationFromState;
        }
        const { data } = await hotelAPI.getAll(params);
        setAllHotels(data);
      } catch (error) {
        console.error('Failed to fetch hotels:', error);
      }
    };
    fetchHotels();
  }, [location.state]);

  const sortedHotels = useMemo(() => {
    const list = [...allHotels];
    if (sortBy === 'priceLow') return list.sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (sortBy === 'priceHigh') return list.sort((a, b) => b.pricePerNight - a.pricePerNight);
    if (sortBy === 'rating') return list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [sortBy, allHotels]);

  const handleBooking = (hotel) => {
    const { token } = getAuthSnapshot();

    // ✅ Require login
    if (!token) {
      alert("Please login to book");
      navigate("/login");
      return;
    }

    // ✅ Send hotel data to booking page
    navigate("/bookings", {
      state: {
        hotelId: hotel._id,
        hotelName: hotel.name,
        price: hotel.pricePerNight,
      },
    });
  };

  return (
    <div className="hotels-page">
      {locationFilter && (
        <div className="filtered-message">
          Showing results for <strong>{locationFilter}</strong>
        </div>
      )}
      {/* Hero Section */}
      <section className="hotels-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Find Your Perfect Stay</h1>
          <p>Explore our curated collection of amazing hotels</p>

          <div className="sort-controls">
            <div className="sort-group">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="recommended">Recommended</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>
            <div className="results-count">
              {sortedHotels.length} hotels found
            </div>
          </div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="hotels-section">
        <div className="container">
          {sortedHotels.length === 0 ? (
            <div className="no-results">
              <h2>No hotels found</h2>
              <p>Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="hotels-grid">
              {sortedHotels.map((hotel) => (
                <div key={hotel._id} className="hotel-card">
                  <div className="hotel-image-container">
                    <img
                      src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'}
                      alt={hotel.name}
                      className="hotel-image"
                    />
                    <div className="hotel-rating">
                      <span className="star">⭐</span>
                      <span>{hotel.rating}</span>
                    </div>
                  </div>

                  <div className="hotel-content">
                    <div className="hotel-header">
                      <h3 className="hotel-name">{hotel.name}</h3>
                      <div className="hotel-location">
                        <span className="location-icon">📍</span>
                        {hotel.location}
                      </div>
                    </div>

                    <p className="hotel-description">
                      {hotel.description || 'A wonderful place to stay with excellent amenities.'}
                    </p>

                    <div className="hotel-amenities">
                      {hotel.amenities && hotel.amenities.slice(0, 3).map((amenity, i) => (
                        <span key={i} className="amenity-tag">{amenity}</span>
                      ))}
                    </div>

                    <div className="hotel-footer">
                      <div className="price-info">
                        <span className="price">₹{hotel.pricePerNight.toLocaleString()}</span>
                        <span className="per-night">per night</span>
                      </div>

                      <button
                        className="book-btn"
                        onClick={() => handleBooking(hotel)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Hotels;