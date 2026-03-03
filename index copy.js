// index.js
import { registerRootComponent } from 'expo'
import { getApps, getApp, initializeApp } from '@react-native-firebase/app'
import {
    getMessaging,
    setBackgroundMessageHandler,
} from '@react-native-firebase/messaging'
import notifee, { AndroidImportance, EventType } from '@notifee/react-native'
import App from './App'
import { displayLocalNotification } from './hooks/useNotifications'
import AsyncStorage from '@react-native-async-storage/async-storage'

// =====================
// 1. SAFE FIREBASE APP INIT
// =====================
const firebaseApp = getApps().length ? getApp() : initializeApp()

// =====================
// 2. CREATE NOTIFICATION CHANNELS
// =====================
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
            importance: AndroidImportance.DEFAULT,
            sound: 'default',
            vibration: true,
        })
        console.log('✅ Notification channels created')
    } catch (err) {
        console.error('❌ Failed to create channels:', err)
    }
}
createNotificationChannels()

// =====================
// 3. FIREBASE BACKGROUND MESSAGES
// =====================
const messaging = getMessaging(firebaseApp)
setBackgroundMessageHandler(messaging, async (remoteMessage) => {
    console.log('📩 Background message received:', remoteMessage)
    await displayLocalNotification(remoteMessage).catch(console.error)
})

// =====================
// 4. NOTIFEE BACKGROUND EVENTS
// =====================
notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail
    switch (type) {
        case EventType.PRESS:
            try {
                await AsyncStorage.setItem(
                    'lastNotificationPress',
                    JSON.stringify({
                        notification,
                        pressAction,
                        timestamp: Date.now(),
                    })
                )
            } catch (err) {
                console.error('❌ Failed to save notification press:', err)
            }
            break
        case EventType.DISMISSED:
        case EventType.ACTION_PRESS:
        case EventType.DELIVERED:
            break
        default:
            console.log('🔔 Unknown background event:', type)
    }
})

// =====================
// 5. REGISTER APP
// =====================
registerRootComponent(App)
