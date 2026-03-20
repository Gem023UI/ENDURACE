/**
 * sendPushNotification
 * Sends a push notification via Expo's push API.
 *
 * @param {string}  expoPushToken  - The recipient's Expo push token
 * @param {string}  title          - Notification title
 * @param {string}  body           - Notification body text
 * @param {object}  data           - Extra payload (navigated to on tap)
 */
export const sendPushNotification = async (expoPushToken, title, body, data = {}) => {
    if (!expoPushToken || !expoPushToken.startsWith('ExponentPushToken')) {
      console.warn('sendPushNotification: invalid or missing push token, skipping.');
      return;
    }
  
    const message = {
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data,
      priority: 'high',
      channelId: 'order-updates', // Android channel (registered in mobile app)
    };
  
    try {
      const res = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
  
      const result = await res.json();
  
      // Log any per-notification errors from Expo
      if (result?.data?.status === 'error') {
        console.error('Expo push error:', result.data.message);
      }
  
      return result;
    } catch (err) {
      console.error('Failed to send push notification:', err.message);
    }
  };