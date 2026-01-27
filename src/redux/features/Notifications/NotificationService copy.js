// src/redux/features/Notifications/NotificationService.js
import api from '../../../api/api';

export const registerFCMToken = ({ userId, fcmToken, userType }) => async () => {
  try {
    await api.post('/notifications/register-token', {
      userId,
      fcmToken,
      userType,
    });
  } catch (error) {
    console.error('Error registering FCM token:', error);
  }
};
