// hooks/useNotifications.js
import { useEffect, useRef } from 'react'
import { getApp } from '@react-native-firebase/app'
import {
    getMessaging,
    onMessage,
    onNotificationOpenedApp,
    getInitialNotification,
    onTokenRefresh,
} from '@react-native-firebase/messaging'
import notifee, {
    AndroidImportance,
    AndroidCategory,
    AndroidVisibility,
    AndroidStyle,
} from '@notifee/react-native'
import { useDispatch, useSelector } from 'react-redux'
import { addNotification } from '../redux/features/Notifications/NotificationSlice'

// Import images at the top level
const notificationIcon = require('../assets/icons/apple.png')
const avatarIcon = require('../assets/icons/apple.png')

// Function to display a local notification
export const displayLocalNotification = async (remoteMessage) => {
    // console.log('remoteMessage in console ', remoteMessage)

    const data = remoteMessage?.data || {}
    const notification = remoteMessage?.notification || {}

    const title = notification?.title || data?.title || '📢 MW FiberNet'
    const body =
        notification?.body || data?.message || 'You have a new notification'
    const image = data?.image || undefined

    try {
        // Create/ensure channel exists with HIGH importance
        const channelId = await notifee.createChannel({
            id: 'high_priority',
            name: 'High Priority Alerts',
            importance: AndroidImportance.HIGH,
            sound: 'default',
            vibration: true,
        })

        // Build config
        const notificationConfig = {
            title,
            body,
            data,
            android: {
                channelId,
                importance: AndroidImportance.HIGH,
                priority: AndroidImportance.HIGH,
                sound: 'default',
                vibration: true,
                pressAction: {
                    id: 'default',
                    launchActivity: 'default',
                },
                // 👇 this forces heads-up even in foreground
                asForegroundService: false,
                localOnly: false,
                category: AndroidCategory.MESSAGE,
                visibility: AndroidVisibility.PUBLIC,
            },
            ios: {
                sound: 'default',
                badge: 1,
                // 👇 ensures foreground heads-up on iOS
                foregroundPresentationOptions: {
                    alert: true,
                    badge: true,
                    sound: true,
                },
            },
        }

        if (image && image.startsWith('http')) {
            notificationConfig.android.style = {
                type: AndroidStyle.BIGPICTURE,
                picture: image,
            }
        }

        await notifee.displayNotification(notificationConfig)
    } catch (err) {
        console.error('❌ Failed to display notification:', err?.message || err)
    }
}

export const useNotifications = () => {
    const dispatch = useDispatch()
    const { customer, isLoggedIn } = useSelector((state) => state.customer)
    const initialHandled = useRef(false)

    useEffect(() => {
        if (!isLoggedIn || !customer?._id) return

        // console.log('🔔 Setting up notification listeners (modular API)...')

        const app = getApp()
        const messaging = getMessaging(app)

        // Foreground messages
        const unsubscribeForeground = onMessage(
            messaging,
            async (remoteMessage) => {
                // console.log('📱 Foreground FCM Message:', remoteMessage)
                await displayLocalNotification(remoteMessage)
                if (remoteMessage?.data) {
                    dispatch(addNotification(remoteMessage.data))
                }
            }
        )

        // Background notification tap
        const unsubscribeNotificationTap = onNotificationOpenedApp(
            messaging,
            (remoteMessage) => {
                // console.log(
                //     '📱 Notification opened from background:',
                //     remoteMessage
                // )
                if (remoteMessage?.data) {
                    dispatch(addNotification(remoteMessage.data))
                }
            }
        )

        // App opened from quit
        getInitialNotification(messaging).then((remoteMessage) => {
            if (remoteMessage && !initialHandled.current) {
                console.log(
                    '📲 App opened from quit via notification:',
                    remoteMessage
                )
                initialHandled.current = true
                if (remoteMessage?.data) {
                    dispatch(addNotification(remoteMessage.data))
                }
            }
        })

        // Token refresh
        const unsubscribeTokenRefresh = onTokenRefresh(
            messaging,
            (newToken) => {
                console.log('🔄 FCM token refreshed:', newToken)
            }
        )

        return () => {
            unsubscribeForeground()
            unsubscribeNotificationTap()
            unsubscribeTokenRefresh()
        }
    }, [dispatch, customer, isLoggedIn])
}

export default useNotifications
