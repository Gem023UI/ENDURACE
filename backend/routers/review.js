import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
  getProductReviews,
  getMyReviews,
  canReview,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/review.js';

const router = express.Router();

// Public
router.get('/product/:productId', getProductReviews);

// Protected
router.get('/mine', protect, getMyReviews);
router.get('/can-review/:productId', protect, canReview);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;