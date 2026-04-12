import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../components/admin.css';
import { hotelAPI } from '../api/axios';
import { getAuthSnapshot, clearAuthSession } from '../utils/auth';

const AdminHotels = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hotels, setHotels] = useState([]);
  const [newHotel, setNewHotel] = useState({ name: '', location: '', price: '', rating: '', amenities: '', image: '' });
  const [editingHotel, setEditingHotel] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const { token, role } = getAuthSnapshot();

    if (!token || role !== 'admin') {
      navigate('/admin/login', { replace: true });
      return;
    }

    const fetchHotels = async () => {
      try {
        const { data } = await hotelAPI.getAll();
        setHotels(data);
      } catch (error) {
        console.error('Failed to fetch hotels:', error);
        setError('Unable to load hotel list.');
      }
    };

    fetchHotels();
  }, [navigate]);

  const updateHotelForm = (e) => {
    const { name, value } = e.target;
    setNewHotel((prev) => ({ ...prev, [name]: value }));
  };

  const addHotel = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const hotelData = {
        name: newHotel.name,
        location: newHotel.location,
        pricePerNight: Number(newHotel.price),
        rating: Number(newHotel.rating),
        amenities: newHotel.amenities.split(',').map((a) => a.trim()).filter(Boolean),
        rooms: { available: 10, total: 10 }, // Default
        description: 'Added by admin',
        image: newHotel.image || '',
      };

      await hotelAPI.create(hotelData);

      // Refresh hotels
      const { data } = await hotelAPI.getAll();
      setHotels(data);
      setNewHotel({ name: '', location: '', price: '', rating: '', amenities: '', image: '' });
      setError(null);
    } catch (error) {
      console.error('Failed to add hotel:', error);
      setError(error.response?.data?.error || 'Failed to add hotel');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (hotel) => {
    setEditingHotel(hotel);
    setNewHotel({
      name: hotel.name,
      location: hotel.location,
      price: hotel.pricePerNight,
      rating: hotel.rating,
      amenities: hotel.amenities?.join(', ') || '',
      image: hotel.image || '',
    });
  };

  const updateHotel = async (e) => {
    e.preventDefault();
    if (!editingHotel) return;

    setIsSubmitting(true);

    try {
      const hotelData = {
        name: newHotel.name,
        location: newHotel.location,
        pricePerNight: Number(newHotel.price),
        rating: Number(newHotel.rating),
        amenities: newHotel.amenities.split(',').map((a) => a.trim()).filter(Boolean),
        image: newHotel.image || '',
      };

      await hotelAPI.update(editingHotel._id, hotelData);

      // Refresh hotels
      const { data } = await hotelAPI.getAll();
      setHotels(data);
      cancelEdit();
      setError(null);
    } catch (error) {
      console.error('Failed to update hotel:', error);
      setError(error.response?.data?.error || 'Failed to update hotel');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteHotel = async (hotelId) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return;

    try {
      await hotelAPI.delete(hotelId);
      setHotels(hotels.filter(hotel => hotel._id !== hotelId));
      setError(null);
    } catch (error) {
      console.error('Failed to delete hotel:', error);
      setError(error.response?.data?.error || 'Failed to delete hotel');
    }
  };

  const cancelEdit = () => {
    setEditingHotel(null);
    setNewHotel({ name: '', location: '', price: '', rating: '', amenities: '', image: '' });
  };

  const logout = () => {
    clearAuthSession();
    navigate('/admin/login', { replace: true });
  };

  const currentPath = location.pathname;

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="admin-sidebar-nav">
          <a href="/admin/dashboard" className={`admin-sidebar-link ${currentPath === '/admin/dashboard' ? 'active' : ''}`}>
            <span className="admin-sidebar-icon">📊</span>
            Dashboard
          </a>
          <a href="/admin/users" className={`admin-sidebar-link ${currentPath === '/admin/users' ? 'active' : ''}`}>
            <span className="admin-sidebar-icon">👥</span>
            Users
          </a>
          <a href="/admin/hotels" className={`admin-sidebar-link ${currentPath === '/admin/hotels' ? 'active' : ''}`}>
            <span className="admin-sidebar-icon">🏨</span>
            Hotels
          </a>
          <a href="/admin/bookings" className={`admin-sidebar-link ${currentPath === '/admin/bookings' ? 'active' : ''}`}>
            <span className="admin-sidebar-icon">📅</span>
            Bookings
          </a>
          <a href="/admin/analytics" className={`admin-sidebar-link ${currentPath === '/admin/analytics' ? 'active' : ''}`}>
            <span className="admin-sidebar-icon">📈</span>
            Analytics
          </a>
        </nav>
        <div className="admin-sidebar-footer">
          <button onClick={logout} className="admin-logout-btn">
            <span className="admin-sidebar-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>

      <div className="admin-main-content">
        <div className="admin-header">
          <h1>Hotel Management</h1>
          <p className="admin-subtitle">Add, edit, and manage hotel listings on your platform.</p>
          {error && (
            <div className="admin-error-message" style={{ marginTop: '16px', padding: '14px 20px', borderRadius: '14px', background: '#fee2e2', color: '#991b1b' }}>
              {error}
            </div>
          )}
        </div>

        {/* Add/Edit Hotel Form */}
        <div className="admin-card">
          <h2><i>{editingHotel ? '✏️' : '➕'}</i>{editingHotel ? 'Edit Hotel' : 'Add New Hotel'}</h2>

          <form className="admin-form" onSubmit={editingHotel ? updateHotel : addHotel}>
            <div className="form-group">
              <label>Hotel Name</label>
              <input
                type="text"
                name="name"
                value={newHotel.name}
                placeholder="Enter hotel name"
                onChange={updateHotelForm}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={newHotel.location}
                placeholder="Enter location"
                onChange={updateHotelForm}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label>Price per Night (₹)</label>
              <input
                type="number"
                name="price"
                value={newHotel.price}
                placeholder="Enter price"
                onChange={updateHotelForm}
                min="0"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label>Rating (1-5)</label>
              <input
                type="number"
                name="rating"
                value={newHotel.rating}
                placeholder="Enter rating"
                onChange={updateHotelForm}
                min="1"
                max="5"
                step="0.1"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label>Amenities</label>
              <input
                type="text"
                name="amenities"
                value={newHotel.amenities}
                placeholder="Pool, Spa, WiFi (comma separated)"
                onChange={updateHotelForm}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                name="image"
                value={newHotel.image}
                placeholder="https://example.com/image.jpg"
                onChange={updateHotelForm}
                disabled={isSubmitting}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                type="submit"
                className="admin-button primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    {editingHotel ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <i>{editingHotel ? '💾' : '➕'}</i>
                    {editingHotel ? 'Update Hotel' : 'Add Hotel'}
                  </>
                )}
              </button>

              {editingHotel && (
                <button
                  type="button"
                  className="admin-button secondary"
                  onClick={cancelEdit}
                  disabled={isSubmitting}
                >
                  <i>❌</i>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Hotels List */}
        <div className="admin-card">
          <h2><i>🏨</i>All Hotels ({hotels.length})</h2>

          {hotels.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>
              <i style={{ fontSize: '3rem', marginBottom: '16px', display: 'block' }}>🏨</i>
              <p>No hotels found. Add your first hotel above!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hotels.map((hotel) => (
                    <tr key={hotel._id}>
                      <td>
                        <img
                          src={hotel.image || 'https://via.placeholder.com/60x40?text=No+Image'}
                          alt={hotel.name}
                        />
                      </td>
                      <td style={{ fontWeight: '600' }}>{hotel.name}</td>
                      <td>{hotel.location}</td>
                      <td>₹{hotel.pricePerNight ? Number(hotel.pricePerNight).toLocaleString() : 'N/A'}</td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          ⭐ {hotel.rating ?? '—'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn edit"
                            onClick={() => startEdit(hotel)}
                          >
                            Edit
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => deleteHotel(hotel._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHotels;