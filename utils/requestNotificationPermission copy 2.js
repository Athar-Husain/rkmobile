import { Platform } from 'react-native'
import messaging from '@react-native-firebase/messaging'
import notifee, { AuthorizationStatus } from '@notifee/react-native'

export const requestNotificationPermission = async () => {
    try {
        console.log('🔔 Requesting notification permission...')

        /* =========================
       ANDROID 13+ (API 33+)
    ========================= */
        if (Platform.OS === 'android' && Platform.Version >= 33) {
            const settings = await notifee.requestPermission()

            console.log(
                '📱 Android permission status:',
                settings.authorizationStatus
            )

            if (settings.authorizationStatus < AuthorizationStatus.AUTHORIZED) {
                console.warn('❌ Android notifications denied')
                return false
            }

            if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
                console.warn('❌ User explicitly denied notifications')
            }
        }

        /* =========================
       iOS PERMISSION
    ========================= */
        if (Platform.OS === 'ios') {
            const authStatus = await messaging().requestPermission({
                alert: true,
                badge: true,
                sound: true,
            })

            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL

            console.log('🍎 iOS permission enabled:', enabled)

            if (!enabled) {
                console.warn('❌ iOS notifications denied')
                return false
            }
        }

        console.log('✅ Notification permission granted')
        return true
    } catch (error) {
        console.error('🔥 Permission request failed:', error)
        return false
    }
}
