// index.js
import { registerRootComponent } from 'expo'
import messaging from '@react-native-firebase/messaging'
// import notifee, { EventType } from '@notifee/react-native'
import notifee, {
    AndroidImportance,
    AndroidStyle, // you’re using this too
    AndroidCategory,
    EventType,
    AndroidVisibility, // you’re using this too
} from '@notifee/react-native'
import App from './App'
import { displayLocalNotification } from './hooks/useNotifications'
// import { displayLocalNotification } from './hooks/useNotifications'

// ==========================================
// 1. CREATE NOTIFICATION CHANNELS FIRST
// ==========================================
const createNotificationChannels = async () => {
    try {
        await notifee.createChannel({
            id: 'high_priority',
            name: 'High Priority Alerts',
            importance: notifee.AndroidImportance.HIGH,
            sound: 'default',
            vibration: true,
        })

        await notifee.createChannel({
            id: 'default',
            name: 'Default Notifications',
            importance: notifee.AndroidImportance.DEFAULT,
            sound: 'default',
        })

        // console.log('✅ Notification channels created')
    } catch (error) {
        console.error('❌ Failed to create channels:', error)
    }
}

// Create channels immediately
createNotificationChannels()

// ==========================================
// 2. FIREBASE BACKGROUND MESSAGE HANDLER
// ==========================================
// This handles incoming messages when app is backgrounded (NOT killed)
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('📩 Background Message received:', remoteMessage)

    // Only display if it's a data-only message
    // Firebase automatically shows notification messages in background
    if (remoteMessage.data && !remoteMessage.notification) {
        await displayLocalNotification(remoteMessage)
    }
})

// ==========================================
// 3. NOTIFEE BACKGROUND EVENT HANDLER
// ==========================================
// This handles user interactions with notifications in background/killed state
notifee.onBackgroundEvent(async ({ type, detail }) => {
    console.log('📱 Notifee Background Event:', type, detail)

    const { notification, pressAction } = detail

    switch (type) {
        case EventType.PRESS:
            console.log(
                '🔔 Notification pressed in background/killed:',
                notification
            )

            // Store the notification data for when app opens
            // You can use AsyncStorage or any storage solution
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
                console.error('Failed to store notification data:', error)
            }
            break

        case EventType.DISMISSED:
            console.log('🔔 Notification dismissed in background')
            break

        case EventType.ACTION_PRESS:
            console.log('🔔 Action pressed in background:', pressAction)
            // Handle specific action presses
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
