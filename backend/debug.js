import mongoose from 'mongoose';
import Booking from './models/Booking.js';

async function test() {
  try {
    await mongoose.connect('mongodb://localhost:27017/hotel-booking');

    const bookings = await Booking.find({
      createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
    });

    console.log('Recent bookings count:', bookings.length);
    if (bookings.length > 0) {
      console.log('Sample booking:', bookings[0]);
    }

    // Simple aggregation without date operators
    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: 'all',
          count: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, '$totalPrice', 0] } }
        }
      }
    ]);

    console.log('Simple aggregation result:', monthlyBookings);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

test();