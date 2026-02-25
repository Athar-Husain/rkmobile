import { useEffect, useRef } from 'react'
import messaging from '@react-native-firebase/messaging'
import notifee, {
    AndroidImportance,
    AndroidStyle,
    AndroidCategory,
    AndroidVisibility,
} from '@notifee/react-native'
import { useDispatch, useSelector } from 'react-redux'
import {
    addNotification,
    syncNotificationsFromBackend,
} from '../redux/features/Notifications/NotificationSlice'

// Import images at the top level
const notificationIcon = require('../assets/icons/apple.png')
const avatarIcon = require('../assets/icons/apple.png')

export const displayLocalNotification = async (remoteMessage) => {
    console.log('remoteMessage in console ', remoteMessage)

    const data = remoteMessage?.data || {}
    const notification = remoteMessage?.notification || {}

    const title = notification?.title || data?.title || '📢 MW FiberNet'
    const body =
        notification?.body || data?.message || 'You have a new notification'
    const image = data?.image || undefined

    try {
        // Build notification config
        const notificationConfig = {
            title,
            body,
            data,
            android: {
                channelId: 'default',
                // smallIcon: 'ic_notification', // Use Android resource name instead of require()
                importance: AndroidImportance.HIGH,
                sound: 'default',
                pressAction: {
                    id: 'default',
                    launchActivity: 'default',
                },
                category: AndroidCategory.MESSAGE,
                visibility: AndroidVisibility.PUBLIC,
                timestamp: Date.now(),
                showTimestamp: true,
            },
            ios: {
                sound: 'default',
                badge: 1,
                foregroundPresentationOptions: {
                    alert: true,
                    badge: true,
                    sound: true,
                },
            },
        }

        // Only add largeIcon if we have a valid remote image URL
        if (image && typeof image === 'string' && image.startsWith('http')) {
            notificationConfig.android.largeIcon = image
        } else {
            // Use Android resource name for local assets
            notificationConfig.android.largeIcon = 'avatar'
        }

        // Only add style if we have a valid remote image
        if (image && typeof image === 'string' && image.startsWith('http')) {
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
    const { user, isLoggedIn } = useSelector((state) => state.auth)
    const initialHandled = useRef(false)

    useEffect(() => {
        if (!isLoggedIn || !user?._id) return

        console.log('🔔 Setting up notification listeners...')

        // Only sync if the backend route exists
        // dispatch(syncNotificationsFromBackend(customer._id)).catch((error) => {
        //     console.error('❌ Failed to sync notifications:', error)
        // })

        const unsubscribeForeground = messaging().onMessage(
            async (remoteMessage) => {
                console.log('📱 Foreground FCM Message:', remoteMessage)
                if (remoteMessage?.data) {
                    dispatch(addNotification(remoteMessage.data))
                }
                await displayLocalNotification(remoteMessage)
            }
        )

        const unsubscribeNotificationTap = messaging().onNotificationOpenedApp(
            (remoteMessage) => {
                console.log(
                    '📱 Notification opened from background:',
                    remoteMessage
                )
                if (remoteMessage?.data) {
                    dispatch(addNotification(remoteMessage.data))
                }
            }
        )

        messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
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

        const unsubscribeTokenRefresh = messaging().onTokenRefresh(
            (newToken) => {
                console.log('🔄 FCM token refreshed:', newToken)
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
