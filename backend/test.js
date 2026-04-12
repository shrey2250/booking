const mongoose = require('mongoose');
const Booking = require('./models/Booking.js');

async function test() {
  try {
    await mongoose.connect('mongodb://localhost:27017/hotel-booking');

    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, '$totalPrice', 0] } }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    console.log('Monthly bookings:', JSON.stringify(monthlyBookings, null, 2));

    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    console.log('Total revenue:', totalRevenue);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

test();