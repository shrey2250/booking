# Hotel Booking Full-Stack Application

A full-stack hotel booking application built with React, Vite, Express, MongoDB, and JWT authentication.

## Project Structure

- `backend/` — Express API server, MongoDB data models, authentication, hotel and booking endpoints.
- `frontend/` — React app with hotel browsing, booking, authentication, admin pages, and analytics.

## Features

- User registration and login
- Hotel search, filter, and detail pages
- Booking creation and user booking history
- Admin dashboard for bookings, hotels, users, and analytics
- JWT-based authentication and protected API routes
- Full-stack CRUD support for hotels and bookings

## Local Setup

### 1. Clone repository

```bash
git clone <your-repo-url>
cd hotel-booking
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Update `.env` with your MongoDB connection and JWT secret.

Example:

```env
MONGODB_URI=mongodb://localhost:27017/hotel-booking
JWT_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

The API will run at `http://localhost:5000`.

### 3. Frontend setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

The frontend uses `VITE_API_URL` to point to the backend API.

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the app in your browser at `http://localhost:5173` (or the URL shown in the terminal).

## Production Build

### Frontend build

```bash
cd frontend
npm run build
```

### Backend production start

```bash
cd backend
npm start
```

## Deployment Recommendations

- Backend: use platforms such as Render, Railway, Heroku, or Fly.io.
- Frontend: use Vercel, Netlify, or static hosting for the built `dist` folder.
- Database: use MongoDB Atlas for production database hosting.

### Deployment checklist

- Set `MONGODB_URI` to your Atlas cluster or production database.
- Set a secure `JWT_SECRET` in production.
- Configure CORS if frontend and backend are deployed on different domains.
- Update `frontend/.env` or environment variables in the deployment platform with the backend API URL.

## Source Code Packaging

To create the ZIP archive of this project for submission:

```bash
cd ..
zip -r hotel-booking.zip hotel-booking
```

Or on Windows PowerShell:

```powershell
Compress-Archive -Path hotel-booking -DestinationPath hotel-booking.zip
```

## Submission Notes

- Fully functional full-stack application
- Source code archive: `hotel-booking.zip`
- GitHub repository: include this root README and the full project
- Deployed application link: add your deploy URL here after deployment

## Deployed Application

Add your deployed app link here once live:

- `https://your-app-url.example`

## Contact

If you need help with deployment or repository setup, update this README or ask for assistance.
