import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a hotel name'],
    },
    description: String,
    location: {
      type: String,
      required: [true, 'Please provide location'],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Please provide price per night'],
    },
    amenities: [String],
    images: [String], // Multiple images for gallery
    image: String, // Keep for backward compatibility
    roomTypes: [{
      name: String,
      description: String,
      maxGuests: Number,
      price: Number,
      amenities: [String]
    }],
    facilities: [String], // Additional facilities beyond amenities
    policies: {
      checkIn: String,
      checkOut: String,
      cancellation: String,
      pets: String,
      smoking: String
    },
    contactInfo: {
      phone: String,
      email: String,
      website: String
    },
    rooms: {
      available: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
    maxGuestsPerRoom: {
      type: Number,
      default: 2,
      min: 1,
      max: 10,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now },
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Hotel', hotelSchema);
