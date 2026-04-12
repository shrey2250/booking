import User from './models/User.js';
import Hotel from './models/Hotel.js';
import connectDB from './db.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Hotel.deleteMany({});

    // Hash passwords
    const hashedPassword123 = await bcrypt.hash('password123', 10);
    const hashedAdmin123 = await bcrypt.hash('admin123', 10);

    // Create sample users
    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword123,
        phoneNumber: '+1234567890',
        role: 'user',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword123,
        phoneNumber: '+0987654321',
        role: 'user',
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedAdmin123,
        phoneNumber: '+1111111111',
        role: 'admin',
      },
    ]);

    // Create sample hotels
    const hotels = await Hotel.insertMany([
      {
        name: 'Luxury Paris Hotel',
        description: 'A 5-star hotel in the heart of Paris with excellent amenities, featuring elegant rooms with Eiffel Tower views and world-class dining.',
        location: 'Paris, France',
        rating: 4.8,
        pricePerNight: 250,
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Parking', 'Room Service', 'Concierge'],
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=400&fit=crop'
        ],
        roomTypes: [
          { name: 'Deluxe Room', description: 'Spacious room with city view', maxGuests: 2, price: 250, amenities: ['King Bed', 'Balcony', 'Mini Bar'] },
          { name: 'Suite', description: 'Luxurious suite with separate living area', maxGuests: 4, price: 450, amenities: ['King Bed', 'Living Room', 'Jacuzzi'] }
        ],
        facilities: ['Fitness Center', 'Business Center', 'Valet Parking', '24/7 Security'],
        policies: {
          checkIn: '3:00 PM',
          checkOut: '11:00 AM',
          cancellation: 'Free cancellation up to 24 hours before check-in',
          pets: 'Pets allowed with additional fee',
          smoking: 'Non-smoking property'
        },
        contactInfo: {
          phone: '+33 1 42 56 78 90',
          email: 'info@luxuryparishotel.com',
          website: 'https://luxuryparishotel.com'
        },
        rooms: { available: 10, total: 20 },
        maxGuestsPerRoom: 2,
        owner: users[0]._id,
      },
      {
        name: 'Budget London Inn',
        description: 'An affordable hotel near London city center, perfect for budget travelers seeking comfort and convenience.',
        location: 'London, UK',
        rating: 4.2,
        pricePerNight: 80,
        amenities: ['WiFi', 'Breakfast', 'Gym', 'Shared Kitchen'],
        images: [
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop'
        ],
        roomTypes: [
          { name: 'Standard Room', description: 'Comfortable room for 1-2 guests', maxGuests: 2, price: 80, amenities: ['Double Bed', 'Shared Bathroom'] },
          { name: 'Family Room', description: 'Spacious room for families', maxGuests: 4, price: 120, amenities: ['Bunk Beds', 'Private Bathroom'] }
        ],
        facilities: ['Laundry Service', 'Luggage Storage', 'Tour Desk'],
        policies: {
          checkIn: '2:00 PM',
          checkOut: '10:00 AM',
          cancellation: 'Free cancellation up to 48 hours before check-in',
          pets: 'No pets allowed',
          smoking: 'Non-smoking property'
        },
        contactInfo: {
          phone: '+44 20 7946 0958',
          email: 'info@budgetlondoninn.com',
          website: 'https://budgetlondoninn.com'
        },
        rooms: { available: 15, total: 25 },
        maxGuestsPerRoom: 2,
        owner: users[0]._id,
      },
      {
        name: 'Beach Resort Dubai',
        description: 'Beautiful beachfront resort with stunning sea views, offering luxury accommodations and water sports activities.',
        location: 'Dubai, UAE',
        rating: 4.9,
        pricePerNight: 350,
        amenities: ['Beach', 'Pool', 'Spa', 'Water Sports', 'Fine Dining', 'Kids Club'],
        images: [
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1596178060810-fb4bd482ee2c?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=400&fit=crop'
        ],
        roomTypes: [
          { name: 'Ocean View Room', description: 'Room with direct beach access', maxGuests: 2, price: 350, amenities: ['King Bed', 'Balcony', 'Ocean View'] },
          { name: 'Family Suite', description: 'Large suite perfect for families', maxGuests: 6, price: 650, amenities: ['Multiple Rooms', 'Kitchen', 'Private Pool Access'] }
        ],
        facilities: ['Water Sports Center', 'Kids Activities', 'Spa & Wellness', 'Multiple Restaurants'],
        policies: {
          checkIn: '4:00 PM',
          checkOut: '12:00 PM',
          cancellation: 'Free cancellation up to 72 hours before check-in',
          pets: 'Pets allowed in designated areas',
          smoking: 'Designated smoking areas available'
        },
        contactInfo: {
          phone: '+971 4 331 33 33',
          email: 'reservations@beachresortdubai.com',
          website: 'https://beachresortdubai.com'
        },
        rooms: { available: 8, total: 15 },
        maxGuestsPerRoom: 4,
        owner: users[1]._id,
      },
      {
        name: 'Mountain Retreat Tokyo',
        description: 'Peaceful mountain hotel with traditional Japanese style, featuring onsen baths and serene garden views.',
        location: 'Tokyo, Japan',
        rating: 4.5,
        pricePerNight: 180,
        amenities: ['Onsen', 'Restaurant', 'Garden', 'WiFi', 'Traditional Rooms'],
        images: [
          'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1596178060810-fb4bd482ee2c?w=800&h=400&fit=crop'
        ],
        roomTypes: [
          { name: 'Traditional Room', description: 'Authentic Japanese-style room', maxGuests: 2, price: 180, amenities: ['Tatami Mats', 'Futon', 'Tea Ceremony'] },
          { name: 'Western Style Room', description: 'Modern room with Western amenities', maxGuests: 3, price: 220, amenities: ['Queen Bed', 'Western Bathroom', 'Mini Fridge'] }
        ],
        facilities: ['Hot Springs', 'Meditation Garden', 'Tea Ceremony Room', 'Library'],
        policies: {
          checkIn: '3:00 PM',
          checkOut: '10:00 AM',
          cancellation: 'Free cancellation up to 24 hours before check-in',
          pets: 'No pets allowed',
          smoking: 'Non-smoking property'
        },
        contactInfo: {
          phone: '+81 3-1234-5678',
          email: 'info@mountainretreat.jp',
          website: 'https://mountainretreat.jp'
        },
        rooms: { available: 12, total: 18 },
        maxGuestsPerRoom: 3,
        owner: users[1]._id,
      },
      {
        name: 'Modern Times New York',
        description: 'Contemporary hotel in Times Square, offering modern amenities and convenient access to NYC attractions.',
        location: 'New York, USA',
        rating: 4.4,
        pricePerNight: 220,
        amenities: ['Gym', 'Library', 'Bar', 'Business Center', 'WiFi', 'Room Service'],
        images: [
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=400&fit=crop'
        ],
        roomTypes: [
          { name: 'City View Room', description: 'Room with Times Square views', maxGuests: 2, price: 220, amenities: ['Queen Bed', 'City View', 'Work Desk'] },
          { name: 'Executive Suite', description: 'Spacious suite for business travelers', maxGuests: 4, price: 380, amenities: ['Separate Living Area', 'Kitchen', 'Business Amenities'] }
        ],
        facilities: ['Executive Lounge', 'Fitness Center', 'Business Services', 'Concierge'],
        policies: {
          checkIn: '3:00 PM',
          checkOut: '11:00 AM',
          cancellation: 'Free cancellation up to 48 hours before check-in',
          pets: 'Service animals only',
          smoking: 'Non-smoking property'
        },
        contactInfo: {
          phone: '+1 212-555-1234',
          email: 'reservations@moderntimesny.com',
          website: 'https://moderntimesny.com'
        },
        rooms: { available: 20, total: 30 },
        maxGuestsPerRoom: 2,
        owner: users[0]._id,
      },
    ]);

    console.log('Database seeded successfully!');
    console.log(`Created ${users.length} users and ${hotels.length} hotels`);
    console.log('\nTest credentials:');
    console.log('Email: john@example.com, Password: password123');
    console.log('Email: admin@example.com, Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
