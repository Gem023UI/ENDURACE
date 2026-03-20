import Order from '../models/order.js';
import User from '../models/user.js';
import { sendPushNotification } from '../utils/pushNotification.js';

// Status display labels for push notification messages
const STATUS_LABELS = {
  PENDING:   'Pending',
  TO_SHIP:   'To Ship',
  DELIVERED: 'Delivered',
  CANCELED:  'Canceled',
};

const STATUS_MESSAGES = {
  TO_SHIP:   'Great news! Your order is on its way. 🚚',
  DELIVERED: 'Your order has been delivered. Enjoy! 🎉',
  CANCELED:  'Your order has been canceled.',
};

// ── CREATE order (user places order from checkout) ────────────────
export const createOrder = async (req, res) => {
  try {
    const { items, total, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must have at least one item' });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      total: Number(total),
      shippingAddress: shippingAddress || {},
      paymentMethod: paymentMethod || 'Cash on Delivery',
      status: 'PENDING',
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET current user's orders ─────────────────────────────────────
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET single order by ID ────────────────────────────────────────
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    // Users can only see their own orders; admins can see all
    if (
      req.user.role !== 'admin' &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorised' });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET all orders (admin) ────────────────────────────────────────
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── UPDATE order status (admin only) + push notification ─────────
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!STATUS_LABELS[status]) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    order.notificationSentAt = new Date();
    await order.save();

    // ── Send push notification to the order owner ─────────────────
    const owner = await User.findById(order.user).select('pushToken');
    if (owner?.pushToken) {
      const notifBody = STATUS_MESSAGES[status] || `Your order status is now: ${STATUS_LABELS[status]}`;
      await sendPushNotification(
        owner.pushToken,
        `Order ${order._id.toString().slice(-6).toUpperCase()} — ${STATUS_LABELS[status]}`,
        notifBody,
        // Data payload — mobile app navigates to OrderInfo on tap
        {
          screen: 'OrderInfo',
          orderId: order._id.toString(),
        }
      );
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};