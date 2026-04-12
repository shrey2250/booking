# Hotel Booking Application - Complete Setup

Full-stack hotel booking application with React frontend and Node.js/Express backend connected to MongoDB.

## 📁 Project Structure

```
hotel-booking/
├── src/                          # React Frontend
│   ├── components/
│   │   ├── LoginForm.jsx        # Login component with API integration
│   │   ├── HotelsList.jsx       # Hotels listing with filters
│   │   ├── BookingForm.jsx      # Booking creation form
│   │   └── ...
│   ├── pages/                   # Page components
│   ├── api/
│   │   └── axios.js             # API client with interceptors
│   ├── App.jsx
│   └── main.jsx
├── backend/                      # Express Backend
│   ├── models/
│   │   ├── User.js              # User schema with password hashing
│   │   ├── Hotel.js             # Hotel schema
│   │   └── Booking.js           # Booking schema
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints
│   │   ├── hotels.js            # Hotel endpoints
│   │   └── bookings.js          # Booking endpoints
│   ├── controllers/             # Business logic
│   │   ├── authController.js
│   │   ├── hotelController.js
│   │   └── bookingController.js
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── db.js                    # MongoDB connection
│   ├── server.js                # Express server
│   ├── seed.js                  # Database seeder
│   ├── .env                     # Environment variables
│   └── package.json
├── DATABASE_SETUP.md            # Database setup guide
└── package.json

```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB (local or Atlas account)

### 1. Install Frontend Dependencies

```bash
npm install
```

This installs: React, React Router, Axios, Vite

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

This installs: Express, Mongoose, bcryptjs, jsonwebtoken, cors, dotenv

### 3. Setup MongoDB

**Option A: Local MongoDB (Recommended for Development)**
```bash
# Install MongoDB from https://www.mongodb.com/try/download/community
# Start MongoDB:

# Windows (Command Prompt)
mongod

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster and database user
3. Get connection string
4. Update `.env` in backend folder

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed instructions.

### 4. Configure Backend

Backend `.env` file already has defaults:
```env
MONGODB_URI=mongodb://localhost:27017/hotel-booking
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NODE_ENV=development
```

Change `JWT_SECRET` for production!

### 5. Seed Sample Data (Optional)

```bash
cd backend
npm run seed
```

Creates test users and hotels:
- User: `john@example.com` / `password123`
- Admin: `admin@example.com` / `admin123`

### 6. Start Both Servers

**Terminal 1: Frontend (from project root)**
```bash
npm run dev
```
Runs on `http://localhost:5173`

**Terminal 2: Backend (from backend folder)**
```bash
npm run dev
```
Runs on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
GET    /api/auth/profile         - Get user profile (requires auth)
```

### Hotel Endpoints
```
GET    /api/hotels                - Get all hotels (with filters)
GET    /api/hotels/:id            - Get hotel details
POST   /api/hotels                - Create hotel (requires auth)
PUT    /api/hotels/:id            - Update hotel (requires auth)
DELETE /api/hotels/:id            - Delete hotel (requires auth)
POST   /api/hotels/:id/reviews    - Add review (requires auth)
```

### Booking Endpoints
```
POST   /api/bookings              - Create booking (requires auth)
GET    /api/bookings              - Get user bookings (requires auth)
GET    /api/bookings/:id          - Get booking details (requires auth)
PUT    /api/bookings/:id/cancel   - Cancel booking (requires auth)
GET    /api/bookings/admin/all    - Get all bookings (requires admin)
GET    /api/bookings/admin/stats  - Get stats (requires admin)
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Login/Register** → Get token
2. **Store token** in localStorage
3. **Send token** in Authorization header: `Bearer <token>`

Example (Frontend):
```javascript
// Login
const response = await authAPI.login({ email, password });
localStorage.setItem('token', response.data.token);

// Make authenticated requests
const api = axios.create();
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 💾 Database Models

### User Model
- `name` - User name
- `email` - Unique email address
- `password` - Hashed with bcryptjs
- `role` - "user" or "admin"
- `phoneNumber` - Contact number
- `address` - User address
- `bookings` - Array of booking references

### Hotel Model
- `name` - Hotel name
- `description` - About the hotel
- `location` - City/Area
- `rating` - 0-5 stars
- `pricePerNight` - Cost per room per night
- `amenities` - List of facilities (WiFi, Pool, etc.)
- `rooms` - Available and total rooms
- `reviews` - User reviews with ratings
- `owner` - Reference to hotel owner (User)

### Booking Model
- `user` - Reference to booking user
- `hotel` - Reference to booked hotel
- `checkInDate` - Arrival date
- `checkOutDate` - Departure date
- `numberOfRooms` - Rooms booked
- `totalPrice` - Calculated total cost
- `status` - "pending", "confirmed", or "cancelled"
- `guestName` - Name of guest
- `phoneNumber` - Guest contact
- `specialRequests` - Any special requests

## 🔄 Frontend Integration

Import and use the API client:

```javascript
import { authAPI, hotelAPI, bookingAPI } from './api/axios.js';

// Example: Login
const loginUser = async () => {
  try {
    const response = await authAPI.login({
      email: 'user@example.com',
      password: 'password123'
    });
    localStorage.setItem('token', response.data.token);
  } catch (error) {
    console.error('Login failed:', error.response.data.error);
  }
};

// Example: Get Hotels
const getHotels = async () => {
  try {
    const response = await hotelAPI.getAll({
      location: 'Paris',
      minPrice: 50,
      maxPrice: 300
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch hotels:', error);
  }
};

// Example: Create Booking
const makeBooking = async () => {
  try {
    const response = await bookingAPI.create({
      hotelId: '65abc123...',
      checkInDate: '2024-04-01',
      checkOutDate: '2024-04-05',
      numberOfRooms: 2
    });
    console.log('Booking confirmed:', response.data);
  } catch (error) {
    console.error('Booking failed:', error.response.data.error);
  }
};
```

## 🧪 Testing API with Postman/curl

### Example: Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phoneNumber": "+1234567890"
  }'
```

Response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Example: Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hotelId": "65abc456...",
    "checkInDate": "2024-04-01",
    "checkOutDate": "2024-04-05",
    "numberOfRooms": 2,
    "guestName": "John Doe",
    "phoneNumber": "+1234567890"
  }'
```

## 🔧 Development Scripts

**Frontend:**
```bash
npm run dev      # Start dev server on port 5173
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview build
```

**Backend:**
```bash
npm run dev      # Start dev server with auto-reload (requires nodemon)
npm run start    # Start production server
npm run seed     # Seed database with sample data
```

## 📊 Admin Dashboard Features

Admins can:
- View all bookings
- Get booking statistics (total, confirmed, revenue)
- Manage hotels
- User management
- System analytics

Access admin endpoints with admin role token.

## 🚨 Error Handling

The app handles common errors:
- Invalid credentials
- Duplicate email
- Hotel not found
- Insufficient rooms
- Unauthorized access
- Invalid token
- Database connection errors

All errors return JSON response with error message.

## 🔐 Security Features

✅ **Password Hashing** - bcryptjs with salt rounds
✅ **JWT Authentication** - Secure token-based auth
✅ **CORS Protection** - Whitelist allowed origins
✅ **Input Validation** - Server-side validation
✅ **Role-Based Access** - Admin-only endpoints
✅ **Password Encryption** - Never stored in plain text
✅ **SQL Injection Protection** - MongoDB as NoSQL
✅ **XSS Protection** - React auto-escaping

## 📈 Performance Optimization

- Database indexes on frequently queried fields
- JWT caching in localStorage
- Pagination for large result sets
- CORS caching headers
- React component optimization

## 🚀 Deployment

### Deployment Checklist
- [ ] Change JWT_SECRET
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas
- [ ] Enable HTTPS
- [ ] Configure CORS for frontend domain
- [ ] Set environment variables on hosting
- [ ] Test all endpoints
- [ ] Monitor error logs

### Deploy Backend to Heroku
```bash
heroku create your-app
heroku config:set MONGODB_URI=your_atlas_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Deploy Frontend
1. Build: `npm run build`
2. Deploy `dist/` folder to Netlify/Vercel
3. Update API_URL in frontend for production

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [JWT Introduction](https://jwt.io/introduction/)
- [CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/)

## ❓ Troubleshooting

**Frontend can't connect to backend?**
- Check backend is running on port 5000
- Check API_URL in axios.js
- Check CORS settings in backend

**Database connection failed?**
- Verify MongoDB is running
- Check MONGODB_URI in .env
- Check MongoDB Atlas IP whitelist

**Authentication not working?**
- Check token is stored in localStorage
- Verify JWT_SECRET matches
- Check token is sent in Authorization header

**Ports already in use?**
- Change PORT in .env or vite.config.js
- Kill existing processes: `lsof -i :5000`

## 📞 Support

For detailed database setup see [DATABASE_SETUP.md](./DATABASE_SETUP.md)

For API documentation see [backend/README.md](./backend/README.md)

---

**Happy Booking! 🏨✈️**
