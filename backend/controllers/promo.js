import User from '../models/user.js';
import { sendPushNotification } from '../utils/pushNotification.js';

// ── Admin: broadcast a promotion notification to all users ────────
export const broadcastPromotion = async (req, res) => {
  try {
    const { title, body, discountCode } = req.body;

    if (!title || !body) {
      return res.status(400).json({ success: false, message: 'title and body are required' });
    }

    // Fetch all users who have a push token
    const users = await User.find({
      pushToken: { $exists: true, $ne: '' },
      isActive: true,
    }).select('pushToken');

    if (users.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No users with push tokens found.',
        sent: 0,
      });
    }

    // Send in parallel (Expo handles batching on their end)
    const results = await Promise.allSettled(
      users.map((u) =>
        sendPushNotification(u.pushToken, title, body, {
          screen: 'Promotion',
          discountCode: discountCode || null,
        })
      )
    );

    const sent     = results.filter((r) => r.status === 'fulfilled').length;
    const failed   = results.filter((r) => r.status === 'rejected').length;

    res.status(200).json({
      success: true,
      message: `Notification sent to ${sent} user${sent !== 1 ? 's' : ''}.`,
      sent,
      failed,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};