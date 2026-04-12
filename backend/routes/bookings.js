import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  getBookingStats,
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/admin/all', protect, admin, getAllBookings);
router.get('/admin/stats', protect, admin, getBookingStats);
router.get('/', protect, getBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);

export default router;
