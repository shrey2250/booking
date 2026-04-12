import express from 'express';
import {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  addReview,
} from '../controllers/hotelController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getHotels);
router.get('/:id', getHotelById);
router.post('/', protect, createHotel);
router.put('/:id', protect, updateHotel);
router.delete('/:id', protect, deleteHotel);
router.post('/:id/reviews', protect, addReview);

export default router;
