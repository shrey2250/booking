# 🏨 Hotel Booking System (MERN)

A full-stack hotel booking web application with authentication, role-based access, and admin dashboard.

---

## 🚀 Features

### 🔐 Authentication & Security
- JWT-based authentication
- Password hashing using bcrypt
- Role-based access control (Admin/User)
- Protected routes (frontend + backend)

### 👤 User Features
- Register & Login
- Browse hotels
- Book hotels
- View booking summary

### 🛠️ Admin Features
- Admin login panel
- Manage users
- Manage hotels
- View bookings
- Analytics dashboard

---

## 🧰 Tech Stack

### Frontend
- React.js (Vite)
- React Router DOM
- CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB

---

## 📂 Project Structure
hotel-booking/
│
├── backend/ # API & server
├── frontend/ # React app
├── .gitignore
└── README.md

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
git clone https://github.com/YOUR_USERNAME/hotel-booking.git

cd hotel-booking

---

### 2️⃣ Backend Setup
cd backend
npm install
npm start

---

### 3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

---

## 🌐 Environment Variables

Create `.env` file in backend:
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
PORT=5000

---

## 🔐 API Authentication

- Token stored in localStorage
- Used for protected routes
- Admin routes require role = "admin"

---

## 📸 Screenshots

(Add your screenshots here before submission)

---

## 👨‍💻 Author

- Shrey Kariya

---

## 📌 Notes

- Admin panel is hidden from UI for security
- Access via: `/admin/login`