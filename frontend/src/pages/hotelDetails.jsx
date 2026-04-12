import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hotelAPI, bookingAPI } from '../api/axios';
import { getAuthSnapshot } from '../utils/auth';
import ImageGallery from '../components/ImageGallery';
import '../components/hotelDetails.css';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        setLoading(true);
        const response = await hotelAPI.getById(id);
        setHotel(response.data);
        setError('');
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Failed to load hotel details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHotelDetails();
    }
  }, [id]);

  const handleBooking = () => {
    const { token } = getAuthSnapshot();

    if (!token) {
      alert('Please login to book');
      navigate('/login');
      return;
    }

    navigate('/bookings', {
      state: {
        hotelId: hotel._id,
        hotelName: hotel.name,
        price: hotel.pricePerNight,
      },
    });
  };

  if (loading) {
    return <div className="hotel-details-loading">Loading hotel details...</div>;
  }

  if (error || !hotel) {
    return (
      <div className="hotel-details-error">
        <div className="error-message">
          {error || 'Hotel not found'}
        </div>
        <button className="back-button" onClick={() => navigate('/hotels')}>
          ← Back to Hotels
        </button>
      </div>
    );
  }

  return (
    <div className="hotel-details-container">
      <button className="back-button" onClick={() => navigate('/hotels')} aria-label="Go back to hotels list">
        ← Back to Hotels
      </button>

      <div className="hotel-details-header">
        <div className="hotel-image-section">
          <ImageGallery
            images={hotel.images && hotel.images.length > 0 ? hotel.images : [hotel.image]}
            hotelName={hotel.name}
          />
        </div>

        <div className="hotel-info-section">
          <div className="hotel-header-info">
            <h1>{hotel.name || 'Hotel'}</h1>
            <div className="rating-badge">
              <span className="star">⭐</span>
              <span className="rating">{hotel.rating ? `${hotel.rating}/5` : 'No rating'}</span>
            </div>
          </div>
          <div className="hotel-meta">
            <span className="location">📍 {hotel.location || 'Location not available'}</span>
          </div>

          <div className="price-section">
            <span className="price">₹{hotel.pricePerNight ? hotel.pricePerNight.toLocaleString() : 'N/A'}</span>
            <span className="per-night">per night</span>
          </div>

          <div className="booking-info">
            <p>Available Rooms: <strong>{hotel.rooms?.available ?? 'N/A'}</strong> of {hotel.rooms?.total ?? 'N/A'}</p>
            <p>Max Guests per Room: <strong>{hotel.maxGuestsPerRoom || 2}</strong></p>
          </div>

          <button className="book-button" onClick={handleBooking}>
            Book Now
          </button>
        </div>
      </div>

      <div className="hotel-details-content">
        {/* Description */}
        {hotel.description && (
          <section className="detail-section">
            <h2>About This Hotel</h2>
            <p>{hotel.description}</p>
          </section>
        )}

        {/* Room Types */}
        {hotel.roomTypes && hotel.roomTypes.length > 0 && (
          <section className="detail-section">
            <h2>Room Types</h2>
            <div className="room-types-grid">
              {hotel.roomTypes.map((roomType, idx) => (
                <div key={idx} className="room-type-card">
                  <h3>{roomType.name}</h3>
                  <p className="room-description">{roomType.description}</p>
                  <div className="room-details">
                    <span className="room-price">₹{roomType.price?.toLocaleString() || 'N/A'}/night</span>
                    <span className="room-capacity">Max {roomType.maxGuests} guests</span>
                  </div>
                  {roomType.amenities && roomType.amenities.length > 0 && (
                    <div className="room-amenities">
                      <h4>Amenities:</h4>
                      <ul>
                        {roomType.amenities.map((amenity, amenityIdx) => (
                          <li key={amenityIdx}>{amenity}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Amenities */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <section className="detail-section">
            <h2>Amenities</h2>
            <div className="amenities-grid">
              {hotel.amenities.map((amenity, idx) => (
                <div key={idx} className="amenity-item">
                  <span className="amenity-icon">✓</span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Facilities */}
        {hotel.facilities && hotel.facilities.length > 0 && (
          <section className="detail-section">
            <h2>Facilities</h2>
            <div className="facilities-grid">
              {hotel.facilities.map((facility, idx) => (
                <div key={idx} className="facility-item">
                  <span className="facility-icon">🏢</span>
                  <span>{facility}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Policies */}
        {hotel.policies && (
          <section className="detail-section">
            <h2>Hotel Policies</h2>
            <div className="policies-grid">
              {hotel.policies.checkIn && (
                <div className="policy-item">
                  <span className="policy-icon">🕐</span>
                  <div>
                    <strong>Check-in:</strong> {hotel.policies.checkIn}
                  </div>
                </div>
              )}
              {hotel.policies.checkOut && (
                <div className="policy-item">
                  <span className="policy-icon">🕐</span>
                  <div>
                    <strong>Check-out:</strong> {hotel.policies.checkOut}
                  </div>
                </div>
              )}
              {hotel.policies.cancellation && (
                <div className="policy-item">
                  <span className="policy-icon">📋</span>
                  <div>
                    <strong>Cancellation:</strong> {hotel.policies.cancellation}
                  </div>
                </div>
              )}
              {hotel.policies.pets && (
                <div className="policy-item">
                  <span className="policy-icon">🐕</span>
                  <div>
                    <strong>Pets:</strong> {hotel.policies.pets}
                  </div>
                </div>
              )}
              {hotel.policies.smoking && (
                <div className="policy-item">
                  <span className="policy-icon">🚭</span>
                  <div>
                    <strong>Smoking:</strong> {hotel.policies.smoking}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Contact Information */}
        {hotel.contactInfo && (
          <section className="detail-section">
            <h2>Contact Information</h2>
            <div className="contact-info">
              {hotel.contactInfo.phone && (
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <a href={`tel:${hotel.contactInfo.phone}`}>{hotel.contactInfo.phone}</a>
                </div>
              )}
              {hotel.contactInfo.email && (
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <a href={`mailto:${hotel.contactInfo.email}`}>{hotel.contactInfo.email}</a>
                </div>
              )}
              {hotel.contactInfo.website && (
                <div className="contact-item">
                  <span className="contact-icon">🌐</span>
                  <a href={hotel.contactInfo.website} target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Reviews */}
        {hotel.reviews && hotel.reviews.length > 0 && (
          <section className="detail-section">
            <h2>Guest Reviews ({hotel.reviews.length})</h2>
            <div className="reviews-list">
              {hotel.reviews.map((review, idx) => (
                <div key={idx} className="review-item">
                  <div className="review-header">
                    <span className="review-rating">⭐ {review.rating || 'N/A'}/5</span>
                    <span className="review-date">
                      {review.date ? new Date(review.date).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                  <p className="review-comment">{review.comment || 'No comment provided'}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default HotelDetails;