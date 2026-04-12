import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    checkInDate: {
      type: Date,
      required: [true, 'Please provide check-in date'],
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Please provide check-out date'],
    },
    numberOfRooms: {
      type: Number,
      required: [true, 'Please provide number of rooms'],
      min: 1,
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Please provide number of guests'],
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    guestName: String,
    phoneNumber: String,
    specialRequests: String,
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
