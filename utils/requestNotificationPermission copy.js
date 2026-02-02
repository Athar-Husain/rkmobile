import { Platform } from 'react-native'
import messaging from '@react-native-firebase/messaging'
import notifee from '@notifee/react-native'

export const requestNotificationPermission = async () => {
  try {
    console.log('🔔 Requesting notification permission...')

    // ✅ ANDROID 13+
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const settings = await notifee.requestPermission()
      console.log('📱 Notifee permission result:', settings)

      if (settings.authorizationStatus < 1) {
        console.warn('❌ Notification permission denied')
        return false
      }
    }

    // ✅ Firebase permission (required for iOS, safe on Android)
    const authStatus = await messaging().requestPermission()
    console.log('🔐 Firebase permission status:', authStatus)

    return true
  } catch (error) {
    console.error('❌ Failed to request permission:', error)
    return false
  }
}
