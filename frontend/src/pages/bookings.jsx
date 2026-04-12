import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../components/form.css';
import './bookings.css';
import BookingForm from './BookingForm.jsx';
import ImageGallery from '../components/ImageGallery';
import { getAuthSnapshot } from '../utils/auth';

function Bookings() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = getAuthSnapshot();

  const [bookingData, setBookingData] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: "1",
    roomType: "standard",
    specialRequests: "",
  });

  const [errors, setErrors] = useState({});
  const [bookingResults, setBookingResults] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [locations, setLocations] = useState([]);
  const [existingBookings, setExistingBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    if (location.state) {
      setBookingData((prev) => ({
        ...prev,
        ...location.state,
      }));
    }

    // Fetch available locations
    const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/hotels');
        const hotels = await response.json();
        const uniqueLocations = [...new Set(hotels.map(h => h.location))];
        setLocations(uniqueLocations);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    };
    fetchLocations();

    // Fetch existing bookings if user is authenticated
    if (token) {
      fetchExistingBookings();
    }
  }, [location.state, token]);

  const fetchExistingBookings = async () => {
    if (!token) return;

    setLoadingBookings(true);
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch bookings:', response.status);
        setExistingBookings([]);
        return;
      }

      const data = await response.json();
      const bookings = Array.isArray(data) ? data : (data?.data || []);
      setExistingBookings(bookings || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setExistingBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleForm = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!bookingData.destination.trim())
      newErrors.destination = "Destination is required";

    if (!bookingData.checkIn) newErrors.checkIn = "Check-in date required";
    if (!bookingData.checkOut) newErrors.checkOut = "Check-out date required";

    if (new Date(bookingData.checkOut) <= new Date(bookingData.checkIn)) {
      newErrors.checkOut = "Check-out must be after check-in";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    // Fetch hotel by destination
    let hotel;
    try {
      const response = await fetch(`http://localhost:5000/api/hotels?location=${encodeURIComponent(bookingData.destination)}`);
      
      if (!response.ok) {
        setErrors({ destination: "Failed to fetch hotels" });
        return;
      }

      const hotels = await response.json();
      
      if (!Array.isArray(hotels) || hotels.length === 0) {
        setErrors({ destination: "No hotels found for this destination" });
        return;
      }
      
      hotel = hotels[0]; // Take the first one
      setSelectedHotel(hotel);
    } catch (error) {
      setErrors({ destination: "Failed to fetch hotels" });
      return;
    }

    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    const guests = parseInt(bookingData.guests) || 1;
    const maxGuestsPerRoom = hotel.maxGuestsPerRoom || 2;
    const calculatedRooms = Math.ceil(guests / maxGuestsPerRoom);

    const pricePerNight = hotel.pricePerNight;
    const totalPrice = nights * pricePerNight * calculatedRooms;

    setBookingResults({
      ...bookingData,
      nights,
      pricePerNight,
      totalPrice,
      hotel,
      calculatedRooms,
    });

    setErrors({});
  };

  // ✅ FINAL BACKEND CONNECTED FUNCTION
  const confirmBooking = async () => {
    if (!bookingResults || !bookingResults.hotel) {
      alert("Booking details are missing. Please search and review again.");
      setBookingResults(null);
      return;
    }

    const hotelId = bookingResults.hotel._id || bookingResults.hotel.id;
    
    if (!hotelId) {
      alert("Hotel information is incomplete. Please search again.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to confirm booking");
      navigate("/login");
      return;
    }

    try {
      // Ensure dates are properly formatted as ISO strings
      const checkInDate = new Date(bookingResults.checkIn).toISOString();
      const checkOutDate = new Date(bookingResults.checkOut).toISOString();
      
      const bookingPayload = {
        hotelId: hotelId,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        numberOfGuests: parseInt(bookingResults.guests, 10) || 1,
        numberOfRooms: parseInt(bookingResults.calculatedRooms) || 1,
        guestName: "", // Will be filled from user
        phoneNumber: "",
        specialRequests: bookingResults.specialRequests || "",
      };

      console.log("Sending booking payload:", JSON.stringify(bookingPayload, null, 2));
      console.log("Token present:", !!token);
      console.log("Token length:", token.length);
      console.log("Token preview:", token.substring(0, 50) + "...");

      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(bookingPayload),
      });

      console.log("Response status:", res.status);
      console.log("Response status text:", res.statusText);
      console.log("Response headers:", Object.fromEntries(res.headers.entries()));

      let data;
      try {
        data = await res.json();
        console.log("Response data:", JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        const textData = await res.text();
        console.log("Raw response text:", textData);
        data = { error: textData };
      }

      if (!res.ok) {
        console.error("Booking error response:", JSON.stringify(data, null, 2));
        if (res.status === 401) {
          alert("Invalid token. Please login again.");
          navigate("/login");
        } else {
          alert(`Booking failed (${res.status}): ${data.error || data.message || "Unknown error"}`);
        }
        return;
      }

      alert("✅ Booking saved to database!");

      setBookingData({
        destination: "",
        checkIn: "",
        checkOut: "",
        guests: "1",
        roomType: "standard",
        specialRequests: "",
      });

      setBookingResults(null);

    } catch (err) {
      console.error('Booking failed:', err);
      alert("Error: " + err.message);
      alert("Server error: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div className="booking-container">
      {location.state?.hotelId ? (
        <BookingForm hotelId={location.state.hotelId} hotelPrice={location.state.price} />
      ) : (
        <>
          <h1>🏨 Book Your Stay</h1>

          {!bookingResults ? (
            <form onSubmit={handleForm}>
              <div className="booking-form-grid">
                <div className="form-group">
                  <label>Where are you going?</label>
                  <input
                    type="text"
                    name="destination"
                    value={bookingData.destination}
                    onChange={handleChange}
                    list="locations"
                  />
                  <datalist id="locations">
                    {locations.map(loc => (
                      <option key={loc} value={loc} />
                    ))}
                  </datalist>
                  {errors.destination && <span>{errors.destination}</span>}
                </div>

                <div className="form-group">
                  <label>Guests</label>
                  <select
                    name="guests"
                    value={bookingData.guests}
                    onChange={handleChange}
                  >
                    {[1,2,3,4,5,6].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="booking-form-grid">
                <div className="form-group">
                  <label>Check-in</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={bookingData.checkIn}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Check-out</label>
                  <input
                    type="date"
                    name="checkOut"
                    value={bookingData.checkOut}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button type="submit">Search & Review</button>
            </form>
          ) : (
            <div className="booking-summary">
              <h2>🏨 Booking Summary</h2>

              {bookingResults?.hotel ? (
                <>
                  {/* Hotel Images */}
                  {bookingResults.hotel.images && bookingResults.hotel.images.length > 0 && (
                    <div className="hotel-images-section">
                      <h3>Hotel Photos</h3>
                      <ImageGallery
                        images={bookingResults.hotel.images}
                        hotelName={bookingResults.hotel.name}
                      />
                    </div>
                  )}

                  {/* Hotel Details */}
                  <div className="hotel-details-section">
                    <div className="hotel-header">
                      <h3>{bookingResults.hotel.name}</h3>
                      <div className="hotel-rating">
                        ⭐ {bookingResults.hotel.rating || 'N/A'}/5
                      </div>
                    </div>

                    <p className="hotel-location">📍 {bookingResults.hotel.location}</p>

                    {bookingResults.hotel.description && (
                      <p className="hotel-description">{bookingResults.hotel.description}</p>
                    )}

                    {/* Room Types */}
                    {bookingResults.hotel.roomTypes && bookingResults.hotel.roomTypes.length > 0 && (
                      <div className="room-types-section">
                        <h4>Room Types Available</h4>
                        <div className="room-types-grid">
                          {bookingResults.hotel.roomTypes.map((room, index) => (
                            <div key={index} className="room-type-card">
                              <h5>{room.name}</h5>
                              <p>{room.description}</p>
                              <p>Max Guests: {room.maxGuests}</p>
                              <p>Price: ₹{room.price}/night</p>
                              {room.amenities && room.amenities.length > 0 && (
                                <p>Amenities: {room.amenities.join(', ')}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Amenities & Facilities */}
                    <div className="amenities-facilities">
                      {bookingResults.hotel.amenities && bookingResults.hotel.amenities.length > 0 && (
                        <div className="amenities">
                          <h4>🏊 Amenities</h4>
                          <div className="amenities-list">
                            {bookingResults.hotel.amenities.map((amenity, index) => (
                              <span key={index} className="amenity-tag">{amenity}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {bookingResults.hotel.facilities && bookingResults.hotel.facilities.length > 0 && (
                        <div className="facilities">
                          <h4>🏢 Facilities</h4>
                          <div className="facilities-list">
                            {bookingResults.hotel.facilities.map((facility, index) => (
                              <span key={index} className="facility-tag">{facility}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Policies */}
                    {bookingResults.hotel.policies && (
                      <div className="policies-section">
                        <h4>📋 Hotel Policies</h4>
                        <div className="policies-grid">
                          {bookingResults.hotel.policies.checkIn && (
                            <p><strong>Check-in:</strong> {bookingResults.hotel.policies.checkIn}</p>
                          )}
                          {bookingResults.hotel.policies.checkOut && (
                            <p><strong>Check-out:</strong> {bookingResults.hotel.policies.checkOut}</p>
                          )}
                          {bookingResults.hotel.policies.cancellation && (
                            <p><strong>Cancellation:</strong> {bookingResults.hotel.policies.cancellation}</p>
                          )}
                          {bookingResults.hotel.policies.pets && (
                            <p><strong>Pets:</strong> {bookingResults.hotel.policies.pets}</p>
                          )}
                          {bookingResults.hotel.policies.smoking && (
                            <p><strong>Smoking:</strong> {bookingResults.hotel.policies.smoking}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Contact Info */}
                    {bookingResults.hotel.contactInfo && (
                      <div className="contact-section">
                        <h4>📞 Contact Information</h4>
                        {bookingResults.hotel.contactInfo.phone && (
                          <p><strong>Phone:</strong> {bookingResults.hotel.contactInfo.phone}</p>
                        )}
                        {bookingResults.hotel.contactInfo.email && (
                          <p><strong>Email:</strong> {bookingResults.hotel.contactInfo.email}</p>
                        )}
                        {bookingResults.hotel.contactInfo.website && (
                          <p><strong>Website:</strong> <a href={bookingResults.hotel.contactInfo.website} target="_blank" rel="noopener noreferrer">{bookingResults.hotel.contactInfo.website}</a></p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Booking Details */}
                  <div className="booking-details-section">
                    <h3>📅 Your Booking Details</h3>
                    <div className="booking-info-grid">
                      <p><strong>Check-in:</strong> {new Date(bookingResults.checkIn).toLocaleDateString()}</p>
                      <p><strong>Check-out:</strong> {new Date(bookingResults.checkOut).toLocaleDateString()}</p>
                      <p><strong>Nights:</strong> {bookingResults.nights}</p>
                      <p><strong>Guests:</strong> {bookingResults.guests}</p>
                      <p><strong>Rooms Required:</strong> {bookingResults.calculatedRooms}</p>
                      <p><strong>Price per Night:</strong> ₹{bookingResults.pricePerNight}</p>
                    </div>

                    <div className="total-price">
                      <h3>Total Price: ₹{bookingResults.totalPrice}</h3>
                    </div>

                    {bookingResults.specialRequests && (
                      <div className="special-requests">
                        <h4>Special Requests</h4>
                        <p>{bookingResults.specialRequests}</p>
                      </div>
                    )}
                  </div>

                  <div className="booking-actions">
                    <button onClick={() => setBookingResults(null)} className="back-btn">
                      ← Back to Search
                    </button>
                    <button 
                      onClick={confirmBooking} 
                      className="confirm-btn"
                    >
                      ✅ Confirm Booking
                    </button>
                  </div>
                </>
              ) : (
                <p style={{ textAlign: 'center', color: '#666' }}>Loading booking details...</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Bookings;