import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';
import User from '../models/User.js';

export const createBooking = async (req, res) => {
  try {
    console.log('createBooking called with:');
    console.log('  req.user:', JSON.stringify(req.user, null, 2));
    console.log('  req.body:', JSON.stringify(req.body, null, 2));

    const {
      hotelId,
      destination,
      checkInDate,
      checkOutDate,
      numberOfGuests = 1,
      numberOfRooms: requestedRooms,
      guestName,
      phoneNumber,
      specialRequests,
      totalPrice: providedTotalPrice,
    } = req.body;

    // Validate user is authenticated
    if (!req.user || !req.user.id) {
      console.error('User not authenticated or user ID missing', req.user);
      return res.status(401).json({ error: 'User authentication failed' });
    }

    let hotel = null;

    if (hotelId) {
      console.log('Looking for hotel by ID:', hotelId);
      hotel = await Hotel.findById(hotelId);
      console.log('Hotel found by ID:', hotel ? hotel.name : 'NOT FOUND');
    } else if (destination) {
      const search = new RegExp(destination, 'i');
      console.log('Looking for hotel by destination:', destination);
      hotel = await Hotel.findOne({
        $or: [
          { name: search },
          { location: search },
        ],
      });
      console.log('Hotel found by destination:', hotel ? hotel.name : 'NOT FOUND');
    }

    if (!hotel) {
      console.log('No hotel found for booking');
      return res.status(404).json({ error: 'Hotel not found for booking destination' });
    }

    const guests = Number(numberOfGuests) || 1;
    const maxGuestsPerRoom = hotel.maxGuestsPerRoom || 2;

    // Calculate required rooms based on guest count and room capacity
    const calculatedRooms = Math.ceil(guests / maxGuestsPerRoom);
    const roomsRequested = requestedRooms ? Number(requestedRooms) : calculatedRooms;

    // Validate that requested rooms can accommodate the guests
    if (roomsRequested * maxGuestsPerRoom < guests) {
      return res.status(400).json({
        error: `Not enough rooms for ${guests} guests. Each room accommodates up to ${maxGuestsPerRoom} guests.`
      });
    }

    if (roomsRequested > hotel.rooms.available) {
      return res.status(400).json({ error: 'Not enough rooms available' });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    const totalPrice = providedTotalPrice || hotel.pricePerNight * roomsRequested * nights;

    const booking = new Booking({
      user: req.user.id,
      hotel: hotel._id,
      checkInDate,
      checkOutDate,
      numberOfRooms: roomsRequested,
      numberOfGuests: guests,
      totalPrice,
      guestName: guestName || req.user.name,
      phoneNumber,
      specialRequests,
      status: 'confirmed',
    });

    console.log('Creating booking with data:', JSON.stringify({
      user: req.user.id,
      hotel: hotel._id,
      checkInDate,
      checkOutDate,
      numberOfRooms: roomsRequested,
      numberOfGuests: guests,
      totalPrice,
      guestName: guestName || req.user.name,
      phoneNumber,
      specialRequests,
      status: 'confirmed',
    }, null, 2));

    await booking.save();
    console.log('Booking saved successfully with ID:', booking._id);

    // Update available rooms
    console.log('Updating hotel rooms. Current available:', hotel.rooms.available, 'Requested:', roomsRequested);
    hotel.rooms.available -= roomsRequested;
    await hotel.save();
    console.log('Hotel updated successfully');

    // Add booking to user (optional - don't fail if this fails)
    try {
      console.log('Attempting to add booking to user bookings array');
      const userUpdateResult = await User.findByIdAndUpdate(
        req.user.id,
        { $push: { bookings: booking._id } },
        { new: true }
      );
      console.log(`Booking ${booking._id} added to user ${req.user.id}. User update result:`, userUpdateResult ? 'SUCCESS' : 'NULL');
    } catch (userError) {
      console.error('Warning: Could not add booking to user bookings array:', userError.message);
      console.error('User error stack:', userError.stack);
      // Don't fail the booking response if we can't add to user's bookings array
      // The booking is already saved in the database
    }

    console.log('Booking creation completed successfully');
    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('Error in createBooking:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const getBookings = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const bookings = await Booking.find({ user: req.user.id })
      .populate('hotel', 'name location pricePerNight')
      .sort('-createdAt');

    res.json(bookings || []);
  } catch (error) {
    console.error('Error in getBookings:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const booking = await Booking.findById(req.params.id)
      .populate('user')
      .populate('hotel');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (!booking.user || booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error in getBookingById:', error);
    res.status(500).json({ error: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (!booking.user || booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Restore available rooms
    const hotel = await Hotel.findById(booking.hotel);
    hotel.rooms.available += booking.numberOfRooms;
    await hotel.save();

    res.json({
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    console.error('Error in cancelBooking:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('hotel', 'name location')
      .sort('-createdAt');

    res.json(bookings || []);
  } catch (error) {
    console.error('Error in getAllBookings:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const totalHotels = await Hotel.countDocuments();

    // Calculate total revenue from confirmed bookings
    const confirmedBookingsList = await Booking.find({ status: 'confirmed' });
    const totalRevenue = confirmedBookingsList.reduce((sum, booking) => sum + booking.totalPrice, 0);

    // Calculate monthly bookings for the last 12 months
    const monthlyBookings = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const monthKey = `${year}-${month.toString().padStart(2, '0')}`;

      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 1);

      const monthBookings = await Booking.find({
        createdAt: { $gte: startOfMonth, $lt: endOfMonth },
        status: 'confirmed'
      });

      const monthRevenue = monthBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

      monthlyBookings.push({
        _id: monthKey,
        count: monthBookings.length,
        revenue: monthRevenue
      });
    }

    // Calculate top performing hotels
    const hotelStats = await Booking.aggregate([
      {
        $match: { status: 'confirmed' }
      },
      {
        $group: {
          _id: '$hotel',
          bookingCount: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      },
      {
        $lookup: {
          from: 'hotels',
          localField: '_id',
          foreignField: '_id',
          as: 'hotelInfo'
        }
      },
      {
        $unwind: '$hotelInfo'
      },
      {
        $project: {
          name: '$hotelInfo.name',
          totalRevenue: 1,
          bookingCount: 1
        }
      },
      {
        $sort: { totalRevenue: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.json({
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      totalHotels,
      totalRevenue,
      monthlyBookings,
      topHotels: hotelStats,
    });
  } catch (error) {
    console.error('Error in getBookingStats:', error);
    res.status(500).json({ error: error.message });
  }
};
