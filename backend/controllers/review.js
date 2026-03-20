import Review from '../models/review.js';
import Order from '../models/order.js';

// ── GET reviews for a product ─────────────────────────────────────
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'firstName lastName avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET current user's reviews ────────────────────────────────────
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('product', 'name images category price')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── CHECK if user can review a product ───────────────────────────
// Returns the eligible order ID if the user has a DELIVERED order containing
// this product and has NOT yet reviewed it.
export const canReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    // Find a DELIVERED order that contains this product
    const eligibleOrder = await Order.findOne({
      user: userId,
      status: 'DELIVERED',
      'items.product': productId,
    });

    if (!eligibleOrder) {
      return res.status(200).json({
        success: true,
        canReview: false,
        reason: 'No delivered order found for this product',
      });
    }

    // Check if review already exists
    const existing = await Review.findOne({
      product: productId,
      user: userId,
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        canReview: false,
        reason: 'Already reviewed',
        existingReview: existing,
      });
    }

    res.status(200).json({
      success: true,
      canReview: true,
      orderId: eligibleOrder._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── CREATE review ─────────────────────────────────────────────────
export const createReview = async (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;
    const userId = req.user._id;

    if (!productId || !orderId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Verify the order belongs to this user, is DELIVERED, and contains the product
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      status: 'DELIVERED',
      'items.product': productId,
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: 'You can only review products from your delivered orders',
      });
    }

    // Guard against duplicate (DB index will also catch this, but give a clean message)
    const existing = await Review.findOne({ product: productId, user: userId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You have already reviewed this product',
      });
    }

    const review = await Review.create({
      product: productId,
      user: userId,
      order: orderId,
      rating: Number(rating),
      comment: comment.trim(),
    });

    // Populate user info before returning
    await review.populate('user', 'firstName lastName avatar');

    res.status(201).json({ success: true, review });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already reviewed this product',
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── UPDATE review (owner only) ────────────────────────────────────
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Only the review owner can edit
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (rating !== undefined) review.rating = Number(rating);
    if (comment !== undefined) review.comment = comment.trim();

    await review.save(); // triggers calcAverageRating via post('save')
    await review.populate('user', 'firstName lastName avatar');

    res.status(200).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE review (owner only) ────────────────────────────────────
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await review.deleteOne(); // triggers calcAverageRating via post('deleteOne')
    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};