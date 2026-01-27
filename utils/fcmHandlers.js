// src/utils/fcmHandlers.js

import messaging from '@react-native-firebase/messaging'
// ⚠️ You MUST import the Redux store directly for headless tasks
import { store } from '../redux/store' // 👈 ADJUST PATH TO YOUR STORE
import { addNotification } from '../redux/features/Notifications/NotificationSlice'

/**
 * ➡️ KILLED/BACKGROUND STATE HANDLER (Headless Task)
 * This must be registered outside the React component lifecycle.
 * It ensures data-only messages are processed even when the app is closed.
 */
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log(
        '[FCM Headless] Message received in background/killed state:',
        remoteMessage.notification?.title
    )

    const notificationData = remoteMessage.data

    if (notificationData) {
        // Dispatch the notification to your Redux store directly.
        store.dispatch(addNotification(notificationData))
        // Add additional logic here, like storing to database if needed.
    }

    return Promise.resolve()
})

/**
 * Helper to initialize the static handler.
 */
export const initializeFCMHandlers = () => {
    console.log('✅ FCM Static Handlers Registered.')
}
