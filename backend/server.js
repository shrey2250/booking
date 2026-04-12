import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';

import authRoutes from './routes/auth.js';
import hotelRoutes from './routes/hotels.js';
import bookingRoutes from './routes/bookings.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
