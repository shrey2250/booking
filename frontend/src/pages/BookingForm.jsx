import { useState, useEffect } from 'react';
import { bookingAPI, hotelAPI } from '../api/axios.js';

const BookingForm = ({ hotelId, hotelPrice }) => {
  const [hotel, setHotel] = useState(null);
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    numberOfRooms: 1,
    guestName: '',
    phoneNumber: '',
    specialRequests: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch hotel details
  useEffect(() => {
    const fetchHotel = async () => {
      if (hotelId) {
        try {
          const response = await hotelAPI.getById(hotelId);
          setHotel(response.data);
        } catch (err) {
          setError('Failed to load hotel details');
        }
      }
    };
    fetchHotel();
  }, [hotelId]);

  // Enhanced: local date validation
  const validateDates = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return false;
    return new Date(formData.checkInDate) < new Date(formData.checkOutDate);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    // Auto-calculate rooms based on guests if hotel data is available
    if (name === 'numberOfGuests' && hotel) {
      const guests = parseInt(value) || 1;
      const maxGuestsPerRoom = hotel.maxGuestsPerRoom || 2;
      const calculatedRooms = Math.ceil(guests / maxGuestsPerRoom);
      updatedData.numberOfRooms = calculatedRooms;
    }

    setFormData(updatedData);
  };

  // Improved: safer total computation
  const calculateTotal = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const nights = Math.max(1, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)));
    return hotelPrice * formData.numberOfRooms * nights;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Local validations
    if (!validateDates()) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to make a booking.");
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await bookingAPI.create(
        {
          hotelId,
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Booking created successfully!');
      setFormData({
        checkInDate: '',
        checkOutDate: '',
        numberOfGuests: 1,
        numberOfRooms: 1,
        guestName: '',
        phoneNumber: '',
        specialRequests: '',
      });

    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid token. Please login again.");
        // Optionally redirect to login
      } else {
        setError(err.response?.data?.msg || 'Booking failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Book this Hotel</h2>

      <div style={styles.field}>
        <label htmlFor="checkInDate">Check-in Date</label>
        <input
          type="date"
          id="checkInDate"
          name="checkInDate"
          value={formData.checkInDate}
          min={(new Date()).toISOString().split('T')[0]}
          onChange={handleChange}
          required
        />
      </div>

      <div style={styles.field}>
        <label htmlFor="checkOutDate">Check-out Date</label>
        <input
          type="date"
          id="checkOutDate"
          name="checkOutDate"
          value={formData.checkOutDate}
          min={formData.checkInDate}
          onChange={handleChange}
          required
        />
      </div>

      <div style={styles.field}>
        <label htmlFor="numberOfGuests">Number of Guests</label>
        <input
          type="number"
          id="numberOfGuests"
          name="numberOfGuests"
          min="1"
          max="20"
          value={formData.numberOfGuests}
          onChange={handleChange}
          required
        />
        {hotel && (
          <small style={styles.helpText}>
            Each room accommodates up to {hotel.maxGuestsPerRoom || 2} guests
          </small>
        )}
      </div>

      <div style={styles.field}>
        <label htmlFor="numberOfRooms">Number of Rooms</label>
        <input
          type="number"
          id="numberOfRooms"
          name="numberOfRooms"
          min="1"
          value={formData.numberOfRooms}
          onChange={handleChange}
          required
        />
        <small style={styles.helpText}>
          Auto-calculated based on guests and room capacity
        </small>
      </div>

      <div style={styles.field}>
        <label htmlFor="guestName">Guest Name</label>
        <input
          type="text"
          id="guestName"
          name="guestName"
          placeholder="Guest Name"
          value={formData.guestName}
          onChange={handleChange}
          required
        />
      </div>

      <div style={styles.field}>
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          placeholder="Phone Number"
          pattern="[0-9]{10,15}"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
      </div>

      <div style={styles.field}>
        <label htmlFor="specialRequests">Special Requests</label>
        <textarea
          id="specialRequests"
          name="specialRequests"
          placeholder="Special Requests"
          value={formData.specialRequests}
          onChange={handleChange}
          rows={3}
        />
      </div>

      {error && <div className="error" style={styles.error}>{error}</div>}
      {success && <div className="success" style={styles.success}>{success}</div>}

      <div style={styles.total}>
        <strong>Total:</strong> ₹{calculateTotal().toFixed(2)}
      </div>

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? 'Booking...' : 'Confirm Booking'}
      </button>
    </form>
  );
};

const styles = {
  form: {
    maxWidth: 420,
    margin: "2rem auto",
    padding: "2rem",
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  },
  field: {
    margin: "1rem 0 1.4rem 0",
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem"
  },
  helpText: {
    fontSize: "0.85rem",
    color: "#666",
    fontStyle: "italic"
  },
  total: {
    margin: "1.5rem 0",
    fontSize: "1.15em",
    textAlign: "center"
  },
  button: {
    width: "100%",
    padding: "0.7em",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontWeight: "bold"
  },
  error: { color: "crimson", textAlign: "center", marginBottom: 10 },
  success: { color: "seagreen", textAlign: "center", marginBottom: 10 }
};

export default BookingForm;