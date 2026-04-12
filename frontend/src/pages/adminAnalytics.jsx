import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/admin.css';
import { bookingAPI } from '../api/axios';
import { getAuthSnapshot, clearAuthSession } from '../utils/auth';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({
    totalHotels: 0,
    totalBookings: 0,
    totalRevenue: 0,
    averageBookingValue: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    monthlyBookings: [],
    topHotels: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { token, role } = getAuthSnapshot();

    if (!token || role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const { data } = await bookingAPI.getStats();
        console.log('Analytics data received:', data);
        console.log('Monthly bookings:', data.monthlyBookings);
        console.log('Top hotels:', data.topHotels);
        setAnalytics({
          totalHotels: data.totalHotels,
          totalBookings: data.totalBookings,
          totalRevenue: data.totalRevenue.toFixed(2),
          averageBookingValue: data.totalBookings > 0 ? (data.totalRevenue / data.totalBookings).toFixed(2) : 0,
          confirmedBookings: data.confirmedBookings,
          cancelledBookings: data.cancelledBookings,
          monthlyBookings: data.monthlyBookings || [],
          topHotels: data.topHotels || [],
        });
        console.log('Analytics state set:', {
          totalHotels: data.totalHotels,
          totalBookings: data.totalBookings,
          monthlyBookings: data.monthlyBookings || [],
          topHotels: data.topHotels || [],
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        setAnalytics((prev) => ({
          ...prev,
          monthlyBookings: [],
          topHotels: [],
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  // Debug: log when analytics state changes
  useEffect(() => {
    console.log('Analytics state changed:', analytics);
  }, [analytics]);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="admin-sidebar">
          <div className="admin-sidebar-header">
            <h2>Admin Panel</h2>
          </div>
          <nav className="admin-sidebar-nav">
            <a href="/admin/dashboard" className="admin-sidebar-link">
              <span className="admin-sidebar-icon">📊</span>
              Dashboard
            </a>
            <a href="/admin/users" className="admin-sidebar-link">
              <span className="admin-sidebar-icon">👥</span>
              Users
            </a>
            <a href="/admin/hotels" className="admin-sidebar-link">
              <span className="admin-sidebar-icon">🏨</span>
              Hotels
            </a>
            <a href="/admin/bookings" className="admin-sidebar-link">
              <span className="admin-sidebar-icon">📅</span>
              Bookings
            </a>
            <a href="/admin/analytics" className="admin-sidebar-link active">
              <span className="admin-sidebar-icon">📈</span>
              Analytics
            </a>
          </nav>
        </div>
        <div className="admin-main-content">
          <div className="admin-loading">
            <div className="admin-spinner"></div>
            <p>Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="admin-sidebar-nav">
          <a href="/admin/dashboard" className="admin-sidebar-link">
            <span className="admin-sidebar-icon">📊</span>
            Dashboard
          </a>
          <a href="/admin/users" className="admin-sidebar-link">
            <span className="admin-sidebar-icon">👥</span>
            Users
          </a>
          <a href="/admin/hotels" className="admin-sidebar-link">
            <span className="admin-sidebar-icon">🏨</span>
            Hotels
          </a>
          <a href="/admin/bookings" className="admin-sidebar-link">
            <span className="admin-sidebar-icon">📅</span>
            Bookings
          </a>
          <a href="/admin/analytics" className="admin-sidebar-link active">
            <span className="admin-sidebar-icon">📈</span>
            Analytics
          </a>
        </nav>
        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-btn">
            <span className="admin-sidebar-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>

      <div className="admin-main-content">
        <div className="admin-header">
          <h1>Analytics Dashboard</h1>
          <p className="admin-subtitle">Comprehensive insights into your hotel booking platform performance</p>
        </div>

        <div className="admin-stats-grid analytics-grid">
          <div className="admin-stat-card analytics-card">
            <div className="admin-stat-icon">🏨</div>
            <div className="admin-stat-content">
              <h3>{analytics.totalHotels}</h3>
              <p>Total Hotels</p>
              <span className="admin-stat-trend positive">+12% this month</span>
            </div>
          </div>
          <div className="admin-stat-card analytics-card">
            <div className="admin-stat-icon">📅</div>
            <div className="admin-stat-content">
              <h3>{analytics.totalBookings}</h3>
              <p>Total Bookings</p>
              <span className="admin-stat-trend positive">+8% this month</span>
            </div>
          </div>
          <div className="admin-stat-card analytics-card revenue-card">
            <div className="admin-stat-icon">💰</div>
            <div className="admin-stat-content">
              <h3>₹{parseFloat(analytics.totalRevenue).toLocaleString()}</h3>
              <p>Total Revenue</p>
              <span className="admin-stat-trend positive">+15% this month</span>
            </div>
          </div>
          <div className="admin-stat-card analytics-card">
            <div className="admin-stat-icon">📊</div>
            <div className="admin-stat-content">
              <h3>₹{parseFloat(analytics.averageBookingValue).toLocaleString()}</h3>
              <p>Avg Booking Value</p>
              <span className="admin-stat-trend neutral">+2% this month</span>
            </div>
          </div>
        </div>

        <div className="admin-analytics-charts">
          <div className="admin-content-section">
            <div className="admin-section-header">
              <h2>Performance Overview</h2>
            </div>

            <div className="admin-chart-container">
              <div className="admin-chart-wrapper">
                <h3>Monthly Bookings & Revenue</h3>
                <div key={JSON.stringify(analytics.monthlyBookings)}>
                    <Line
                    data={{
                      labels: analytics.monthlyBookings.map(item => item._id),
                      datasets: [
                        {
                          label: 'Bookings',
                          data: analytics.monthlyBookings.map(item => item.count),
                          borderColor: 'rgb(75, 192, 192)',
                          backgroundColor: 'rgba(75, 192, 192, 0.2)',
                          yAxisID: 'y',
                        },
                        {
                          label: 'Revenue (₹)',
                          data: analytics.monthlyBookings.map(item => item.revenue),
                          borderColor: 'rgb(255, 99, 132)',
                          backgroundColor: 'rgba(255, 99, 132, 0.2)',
                          yAxisID: 'y1',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      interaction: {
                        mode: 'index',
                        intersect: false,
                      },
                      stacked: false,
                      plugins: {
                        title: {
                          display: true,
                          text: 'Monthly Bookings and Revenue Trends',
                        },
                      },
                      scales: {
                        y: {
                          type: 'linear',
                          display: true,
                          position: 'left',
                        },
                        y1: {
                          type: 'linear',
                          display: true,
                          position: 'right',
                          grid: {
                            drawOnChartArea: false,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="admin-analytics-grid">
            <div className="admin-analytics-card">
              <h3>Top Performing Hotels</h3>
              <div className="admin-analytics-list">
                {(analytics.topHotels && analytics.topHotels.length > 0 ? analytics.topHotels : [{name: 'No data', totalRevenue: 0}]).map((hotel, index) => (
                  <div key={index} className="admin-analytics-item">
                    <span>{hotel.name}</span>
                    <span className="admin-analytics-value">₹{(hotel.totalRevenue / 100000).toFixed(1)}L</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-analytics-card">
              <h3>Booking Status Distribution</h3>
              <div className="admin-analytics-chart">
                <Pie
                  data={{
                    labels: ['Confirmed', 'Cancelled', 'Pending'],
                    datasets: [
                      {
                        data: [
                          analytics.confirmedBookings,
                          analytics.cancelledBookings,
                          analytics.totalBookings - analytics.confirmedBookings - analytics.cancelledBookings
                        ],
                        backgroundColor: [
                          'rgba(75, 192, 192, 0.6)',
                          'rgba(255, 99, 132, 0.6)',
                          'rgba(255, 205, 86, 0.6)',
                        ],
                        borderColor: [
                          'rgb(75, 192, 192)',
                          'rgb(255, 99, 132)',
                          'rgb(255, 205, 86)',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${label}: ${value} (${percentage}%)`;
                          }
                        }
                      }
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="admin-content-section">
          <div className="admin-section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="admin-quick-actions">
            <button className="admin-btn-primary">
              <span className="admin-btn-icon">📊</span>
              Generate Report
            </button>
            <button className="admin-btn-secondary">
              <span className="admin-btn-icon">📤</span>
              Export Data
            </button>
            <button className="admin-btn-secondary">
              <span className="admin-btn-icon">⚙️</span>
              Configure Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;