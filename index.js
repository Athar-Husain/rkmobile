import { registerRootComponent } from 'expo'
import { getApps, getApp, initializeApp } from '@react-native-firebase/app'
import {
    getMessaging,
    setBackgroundMessageHandler,
} from '@react-native-firebase/messaging'
import notifee, { EventType } from '@notifee/react-native'
import App from './App'
import { displayLocalNotification } from './hooks/useNotifications'
import AsyncStorage from '@react-native-async-storage/async-storage'

// 1. Initialize Firebase
const firebaseApp = getApps().length ? getApp() : initializeApp()

// 2. Background FCM Handler
// This is triggered when the app is in the background or quit.
const messaging = getMessaging(firebaseApp)
setBackgroundMessageHandler(messaging, async (remoteMessage) => {
    // console.log('📩 Background Data Received:', remoteMessage.data)
    // Since we use data-only payloads, we MUST manually display the notification
    await displayLocalNotification(remoteMessage)
})

// 3. Notifee Background Event Handler (for button presses, etc.)
notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail
    if (type === EventType.PRESS) {
        await AsyncStorage.setItem(
            'lastNotificationPress',
            JSON.stringify({
                notification,
                pressAction,
                timestamp: Date.now(),
            })
        )
    }
})

registerRootComponent(App)
