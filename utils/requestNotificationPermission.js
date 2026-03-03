import { Platform } from 'react-native'
import messaging from '@react-native-firebase/messaging'
import notifee, { AuthorizationStatus } from '@notifee/react-native'

export const requestNotificationPermission = async () => {
    try {
        if (Platform.OS === 'android') {
            // Android 13+ requires explicit POST_NOTIFICATIONS permission
            const settings = await notifee.requestPermission()
            if (settings.authorizationStatus < AuthorizationStatus.AUTHORIZED) {
                console.warn('❌ Android Notifications Denied')
                return false
            }
        }

        if (Platform.OS === 'ios') {
            const authStatus = await messaging().requestPermission({
                alert: true,
                badge: true,
                sound: true,
            })
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL

            if (!enabled) {
                console.warn('❌ iOS Notifications Denied')
                return false
            }
        }

        console.log('✅ All Notification Permissions Granted')
        return true
    } catch (error) {
        console.error('🔥 Permission Request Error:', error)
        return false
    }
}
