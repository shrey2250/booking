import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/homepage.css";

function Homepage() {
  const navigate = useNavigate();

  const [searchForm, setSearchForm] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: "1",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    // ✅ Basic validation
    if (!searchForm.destination) {
      alert("Please enter destination");
      return;
    }

    // ✅ Pass data to hotels page
    navigate("/hotels", { state: searchForm });
  };

  const handleFeaturedClick = (hotel) => {
    navigate('/hotels', { state: { destination: hotel.location } });
  };

  const featuredHotels = [
    {
      id: 1,
      name: "Luxe Paradise Hotel",
      location: "Maldives",
      price: "₹9,000",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
      amenities: ["Pool", "Spa", "Beach Access"]
    },
    {
      id: 2,
      name: "Mountain View Resort",
      location: "Swiss Alps",
      price: "₹12,000",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      amenities: ["Mountain View", "Ski Access", "Restaurant"]
    },
    {
      id: 3,
      name: "Urban Luxury Suites",
      location: "New York City",
      price: "₹15,000",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      amenities: ["City View", "Gym", "Concierge"]
    },
    {
      id: 4,
      name: "Tropical Beach Resort",
      location: "Bali, Indonesia",
      price: "₹8,500",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
      amenities: ["Beachfront", "Pool", "Spa"]
    },
  ];

  const destinations = [
    {
      name: "Paris",
      properties: 1203,
      image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop",
    },
    {
      name: "Dubai",
      properties: 742,
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop",
    },
    {
      name: "Tokyo",
      properties: 856,
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
    },
    {
      name: "London",
      properties: 934,
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop",
    },
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Find your next stay</h1>
          <p>Search deals on hotels, homes, and much more...</p>

          <div className="search-container">
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-inputs">
                <div className="search-field">
                  <label>Where</label>
                  <div className="input-with-icon">
                    <span className="field-icon">📍</span>
                    <input
                      type="text"
                      name="destination"
                      placeholder="Search destinations"
                      value={searchForm.destination}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="search-field">
                  <label>Check-in</label>
                  <div className="input-with-icon">
                    <span className="field-icon">📅</span>
                    <input
                      type="date"
                      name="checkIn"
                      value={searchForm.checkIn}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="search-field">
                  <label>Check-out</label>
                  <div className="input-with-icon">
                    <span className="field-icon">📅</span>
                    <input
                      type="date"
                      name="checkOut"
                      value={searchForm.checkOut}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="search-field">
                  <label>Guests</label>
                  <div className="input-with-icon">
                    <span className="field-icon">👥</span>
                    <select
                      name="guests"
                      value={searchForm.guests}
                      onChange={handleInputChange}
                    >
                      <option value="1">1 guest</option>
                      <option value="2">2 guests</option>
                      <option value="3">3 guests</option>
                      <option value="4">4 guests</option>
                      <option value="5">5+ guests</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="search-btn">
                  <span className="search-icon">�</span>
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Featured stays around the world</h2>
          <div className="hotels-grid">
            {featuredHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="hotel-card"
                onClick={() => handleFeaturedClick(hotel)}
                style={{ cursor: 'pointer' }}
              >
                <div className="hotel-image-container">
                  <img src={hotel.image} alt={hotel.name} />
                  <div className="hotel-rating">
                    <span className="star">⭐</span>
                    <span>{hotel.rating}</span>
                  </div>
                </div>
                <div className="hotel-info">
                  <h3 className="hotel-name">{hotel.name}</h3>
                  <p className="hotel-location">{hotel.location}</p>
                  <div className="hotel-amenities">
                    {hotel.amenities.slice(0, 2).join(" • ")}
                  </div>
                  <div className="hotel-price">
                    <span className="price">{hotel.price}</span>
                    <span className="per-night"> per night</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="destinations-section">
        <div className="container">
          <h2 className="section-title">Explore nearby</h2>
          <div className="destinations-grid">
            {destinations.map((destination, index) => (
              <div key={index} className="destination-card">
                <img src={destination.image} alt={destination.name} />
                <div className="destination-overlay">
                  <h3>{destination.name}</h3>
                  <p>{destination.properties} properties</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to start your journey?</h2>
            <p>Join millions of travelers who trust StayFinder for their perfect stay.</p>
            <div className="cta-buttons">
              <button className="cta-btn primary" onClick={() => navigate('/hotels')}>
                Explore Hotels
              </button>
              <button className="cta-btn secondary" onClick={() => navigate('/register')}>
                Join Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Homepage;