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
    AndroidVisibility,
    AndroidStyle,
} from '@notifee/react-native'
import { useDispatch, useSelector } from 'react-redux'
import { addNotification } from '../redux/features/Notifications/NotificationSlice'
import AuthService from '../redux/features/Auth/AuthService'

/**
 * Manually displays a notification using Notifee.
 * This is the ONLY place a notification is visually rendered.
 */
export const displayLocalNotification = async (remoteMessage) => {
    const { data } = remoteMessage
    if (!data) return

    const title = data.title || '📢 RK Electronics'
    const body = data.body || 'You have a new update'
    const image = data.image && data.image !== 'undefined' ? data.image : null

    try {
        const channelId = await notifee.createChannel({
            id: 'high_priority',
            name: 'High Priority Alerts',
            importance: AndroidImportance.HIGH,
            visibility: AndroidVisibility.PUBLIC,
            sound: 'default',
        })

        const notificationConfig = {
            title,
            body,
            data: data, // Attach data so it's available when the user taps
            android: {
                channelId,
                importance: AndroidImportance.HIGH,
                priority: 'high',
                pressAction: { id: 'default', launchActivity: 'default' },
            },
            ios: {
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
        console.error('❌ Notifee Display Error:', err)
    }
}

export const useNotifications = (isLoggedIn = false) => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const initialHandled = useRef(false)

    useEffect(() => {
        if (!isLoggedIn || !user?._id) return

        const messaging = getMessaging(getApp())

        // FOREGROUND: Always trigger Notifee manual display
        const unsubscribeForeground = onMessage(
            messaging,
            async (remoteMessage) => {
                await displayLocalNotification(remoteMessage)
                if (remoteMessage?.data)
                    dispatch(addNotification(remoteMessage.data))
            }
        )

        // BACKGROUND TAP: Handle user clicking notification when app is in background
        const unsubscribeNotificationTap = onNotificationOpenedApp(
            messaging,
            (remoteMessage) => {
                if (remoteMessage?.data)
                    dispatch(addNotification(remoteMessage.data))
            }
        )

        // KILLED STATE TAP: Handle user clicking notification when app was closed
        getInitialNotification(messaging).then((remoteMessage) => {
            if (remoteMessage && !initialHandled.current) {
                initialHandled.current = true
                if (remoteMessage?.data)
                    dispatch(addNotification(remoteMessage.data))
            }
        })

        const unsubscribeTokenRefresh = onTokenRefresh(
            messaging,
            async (newToken) => {
                try {
                    await AuthService.updateFCMToken(newToken)
                } catch (error) {
                    console.error('Failed to update FCM token:', error)
                }
            }
        )

        return () => {
            unsubscribeForeground()
            unsubscribeNotificationTap()
            unsubscribeTokenRefresh()
        }
    }, [dispatch, user, isLoggedIn])
}

export default useNotifications
