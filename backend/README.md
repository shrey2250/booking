# Hotel Booking Backend

Complete backend API for hotel booking application with MongoDB and Express.

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

**Environment Variables:**
- `MONGODB_URI` or `MONGO_URI` - MongoDB connection string (default: mongodb://localhost:27017/hotel-booking)
- `JWT_SECRET` - JWT secret key for authentication
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

### 3. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string and add to `.env`
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hotel-booking
```

### 4. Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

### Hotels
- `GET /api/hotels` - Get all hotels (with filters)
- `GET /api/hotels/:id` - Get hotel details
- `POST /api/hotels` - Create hotel (requires auth)
- `PUT /api/hotels/:id` - Update hotel (requires auth)
- `DELETE /api/hotels/:id` - Delete hotel (requires auth)
- `POST /api/hotels/:id/reviews` - Add review (requires auth)

### Bookings
- `POST /api/bookings` - Create booking (requires auth)
- `GET /api/bookings` - Get user bookings (requires auth)
- `GET /api/bookings/:id` - Get booking details (requires auth)
- `PUT /api/bookings/:id/cancel` - Cancel booking (requires auth)
- `GET /api/bookings/admin/all` - Get all bookings (requires admin)
- `GET /api/bookings/admin/stats` - Get booking stats (requires admin)

## Database Models

### User
- name, email, password, role, phoneNumber, address, bookings[]

### Hotel
- name, description, location, rating, pricePerNight, amenities, image, rooms, reviews[], owner

### Booking
- user, hotel, checkInDate, checkOutDate, numberOfRooms, totalPrice, status, guestName, phoneNumber, specialRequests

## Sample Requests

### Register
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "+1234567890"
}
```

### Login
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Search Hotels
```
GET /api/hotels?location=Paris&minPrice=50&maxPrice=200&rating=4
```

### Create Booking
```json
{
  "hotelId": "hotel_id",
  "checkInDate": "2024-04-01",
  "checkOutDate": "2024-04-05",
  "numberOfRooms": 2,
  "guestName": "John Doe",
  "phoneNumber": "+1234567890",
  "specialRequests": "Early check-in if possible"
}
```

## Frontend Integration

Use the provided `src/api/axios.js` for API calls:

```javascript
import { authAPI, hotelAPI, bookingAPI } from './api/axios.js';

// Login
const response = await authAPI.login({ email, password });
localStorage.setItem('token', response.data.token);

// Get hotels
const hotels = await hotelAPI.getAll({ location: 'Paris' });

// Create booking
const booking = await bookingAPI.create({
  hotelId,
  checkInDate,
  checkOutDate,
  numberOfRooms
});
```
