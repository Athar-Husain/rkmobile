// index.js
import { registerRootComponent } from 'expo'
import { getApp } from '@react-native-firebase/app'
import {
    getMessaging,
    setBackgroundMessageHandler,
} from '@react-native-firebase/messaging'
import notifee, { AndroidImportance, EventType } from '@notifee/react-native'
import App from './App'
import { displayLocalNotification } from './hooks/useNotifications'

// ==========================================
// 1. CREATE NOTIFICATION CHANNELS FIRST
// ==========================================
const createNotificationChannels = async () => {
    try {
        await notifee.createChannel({
            id: 'high_priority',
            name: 'High Priority Alerts',
            importance: AndroidImportance.HIGH,
            sound: 'default',
            vibration: true,
        })

        await notifee.createChannel({
            id: 'default',
            name: 'Default Notifications',
            importance: AndroidImportance.HIGH, // Set default to high priority
            sound: 'default',
            vibration: true,
        })

        console.log('✅ Notification channels created')
    } catch (error) {
        console.error('❌ Failed to create channels:', error)
    }
}

// Create channels immediately
createNotificationChannels()

// ==========================================
// 2. FIREBASE BACKGROUND MESSAGE HANDLER
// ==========================================
const app = getApp()
const messaging = getMessaging(app)

// console.log(
//   '🔥 Firebase App Options:',
//   getApp().options
// )

setBackgroundMessageHandler(messaging, async (remoteMessage) => {
    console.log('📩 Background Message received:', remoteMessage)

    // Display notification for data-only or combined messages
    await displayLocalNotification(remoteMessage)
})

// ==========================================
// 3. NOTIFEE BACKGROUND EVENT HANDLER
// ==========================================
notifee.onBackgroundEvent(async ({ type, detail }) => {
    console.log('📱 Notifee Background Event:', type, detail)

    const { notification, pressAction } = detail

    switch (type) {
        case EventType.PRESS:
            console.log(
                '🔔 Notification pressed in background/killed:',
                notification
            )

            try {
                const AsyncStorage =
                    require('@react-native-async-storage/async-storage').default
                await AsyncStorage.setItem(
                    'lastNotificationPress',
                    JSON.stringify({
                        notification,
                        pressAction,
                        timestamp: Date.now(),
                    })
                )
            } catch (error) {
                console.error('❌ Failed to store notification data:', error)
            }
            break

        case EventType.DISMISSED:
            console.log('🔔 Notification dismissed in background')
            break

        case EventType.ACTION_PRESS:
            console.log('🔔 Action pressed in background:', pressAction)
            break

        case EventType.DELIVERED:
            console.log('🔔 Notification delivered in background')
            break

        default:
            console.log('🔔 Unknown background event:', type)
    }
})

// ==========================================
// 4. REGISTER APP
// ==========================================
registerRootComponent(App)
