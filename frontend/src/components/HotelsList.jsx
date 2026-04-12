import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { hotelAPI } from '../api/axios.js';
import './HotelListItem.css';

const HotelsList = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [displayCount, setDisplayCount] = useState(6);
  const [sortBy, setSortBy] = useState('recommended');
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
  });

  // Debounce filters to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHotels();
    }, 350);

    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [JSON.stringify(filters)]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await hotelAPI.getAll(filters);
      setHotels(response.data || []);
      setDisplayCount(6);
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch hotels';
      setError(errorMessage);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
    });
  }, []);

  const isFilterActive = Object.values(filters).some((val) => val !== '');

  const sortedHotels = [...hotels].sort((a, b) => {
    const aPrice = a.pricePerNight || 0;
    const bPrice = b.pricePerNight || 0;
    const aRating = a.rating || 0;
    const bRating = b.rating || 0;

    switch (sortBy) {
      case 'priceLow':
        return aPrice - bPrice;
      case 'priceHigh':
        return bPrice - aPrice;
      case 'rating':
        return bRating - aRating;
      case 'recommended':
      default:
        return 0;
    }
  });

  const displayedHotels = sortedHotels.slice(0, displayCount);
  const hasMore = displayedHotels.length < sortedHotels.length;

  const handleViewDetails = (hotelId) => {
    navigate(`/hotels/${hotelId}`);
  };

  const handleLoadMore = useCallback(() => {
    setDisplayCount((prev) => prev + 6);
  }, []);

  return (
    <div className="hotels-list-wrapper">
      {/* Filters Section */}
      <div className="filters-section">
        <h2 className="filters-title">Filter Hotels</h2>
        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="location-filter">Location</label>
            <input
              id="location-filter"
              type="text"
              name="location"
              placeholder="Enter location"
              aria-label="Filter by location"
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="min-price-filter">Min Price (₹)</label>
            <input
              id="min-price-filter"
              type="number"
              name="minPrice"
              min={0}
              placeholder="Min"
              aria-label="Filter by minimum price"
              value={filters.minPrice}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="max-price-filter">Max Price (₹)</label>
            <input
              id="max-price-filter"
              type="number"
              name="maxPrice"
              min={0}
              placeholder="Max"
              aria-label="Filter by maximum price"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="rating-filter">Min Rating</label>
            <input
              id="rating-filter"
              type="number"
              name="rating"
              min={1}
              max={5}
              placeholder="1-5"
              aria-label="Filter by minimum rating"
              value={filters.rating}
              onChange={handleFilterChange}
            />
          </div>
        </div>
        <div className="filter-buttons">
          <button
            className="clear-filters-btn"
            onClick={handleClearFilters}
            disabled={!isFilterActive}
            aria-label="Clear all filters"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Sorting & Controls */}
      {!loading && hotels.length > 0 && (
        <div className="controls-bar">
          <div>
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
              aria-label="Sort hotels by"
            >
              <option value="recommended">Recommended</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>
          <span className="results-counter" aria-live="polite">
            {sortedHotels.length} hotel{sortedHotels.length !== 1 ? 's' : ''} found
          </span>
        </div>
      )}

      {/* Loading State */}
      {loading && <div className="loading-message" aria-live="polite">Loading hotels...</div>}

      {/* Error State */}
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {/* Hotels Grid */}
      {!loading && !error && (
        <>
          {sortedHotels.length === 0 ? (
            <div className="empty-message">No hotels found. Try adjusting your filters.</div>
          ) : (
            <>
              <div className="hotels-list">
                {displayedHotels.map((hotel) => (
                  <article key={hotel._id} className="hotel-card">
                    <div className="hotel-image-preview">
                      <img
                        src={hotel.images && hotel.images.length > 0 ? hotel.images[0] : (hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop')}
                        alt={hotel.name}
                        className="hotel-card-image"
                      />
                      {hotel.images && hotel.images.length > 1 && (
                        <div className="image-count-badge">
                          📷 +{hotel.images.length - 1} more
                        </div>
                      )}
                    </div>
                    <h3>{hotel.name || 'Hotel'}</h3>
                    <div className="hotel-details">
                      <span>
                        <span className="detail-icon">📍</span>
                        {hotel.location || 'Location not available'}
                      </span>
                      <span>
                        <span className="detail-icon">💰</span>
                        ₹{hotel.pricePerNight ? hotel.pricePerNight.toLocaleString() : 'N/A'}/night
                      </span>
                      <span>
                        <span className="detail-icon">⭐</span>
                        {hotel.rating ? `${hotel.rating}/5` : 'No rating'}
                      </span>
                      <span>
                        <span className="detail-icon">🛏️</span>
                        Available: {hotel.rooms?.available ?? 'N/A'} rooms
                      </span>
                      <span>
                        <span className="detail-icon">👥</span>
                        Max {hotel.maxGuestsPerRoom || 2} guests/room
                      </span>
                    </div>
                    <div className="button-group">
                      <button
                        className="btn view-details-btn"
                        onClick={() => handleViewDetails(hotel._id)}
                        aria-label={`View details for ${hotel.name}`}
                      >
                        View Details
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="load-more-container">
                  <button
                    className="load-more-btn"
                    onClick={handleLoadMore}
                    aria-label={`Load more hotels (${displayCount}/${sortedHotels.length} shown)`}
                  >
                    Load More Hotels
                  </button>
                </div>
              )}

              {/* Pagination Info */}
              {displayedHotels.length > 0 && (
                <div className="pagination-info" aria-live="polite">
                  Showing {displayedHotels.length} of {sortedHotels.length} hotels
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default HotelsList;