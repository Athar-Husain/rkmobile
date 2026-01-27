import AsyncStorage from '@react-native-async-storage/async-storage'
import messaging from '@react-native-firebase/messaging'
import notifee, { AuthorizationStatus } from '@notifee/react-native'
import { PermissionsAndroid, Platform, Linking } from 'react-native'

// ==========================================
// REQUEST USER PERMISSIONS
// ==========================================
export async function requestUserPermission() {
    try {
        let granted = false

        if (Platform.OS === 'android') {
            // Android 13+ requires POST_NOTIFICATIONS permission
            if (Platform.Version >= 33) {
                const permission = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                )
                granted = permission === PermissionsAndroid.RESULTS.GRANTED
            } else {
                granted = true
            }

            // Notifee permission (heads-up notifications)
            const notifeeSettings = await notifee.requestPermission({
                alert: true,
                badge: true,
                sound: true,
                announcement: true,
            })

            const notifeeStatus =
                notifeeSettings?.authorizationStatus ??
                AuthorizationStatus.NOT_DETERMINED

            if (notifeeStatus >= AuthorizationStatus.AUTHORIZED) {
                granted = granted && true
                await getFCMToken()
                return true
            }

            return false
        } else if (Platform.OS === 'ios') {
            // iOS permission
            const authStatus = await messaging().requestPermission({
                alert: true,
                badge: true,
                sound: true,
                announcement: true,
                criticalAlert: true,
            })

            const notifeeSettings = await notifee.requestPermission({
                alert: true,
                badge: true,
                sound: true,
                criticalAlert: true,
            })

            const notifeeStatus =
                notifeeSettings?.authorizationStatus ??
                AuthorizationStatus.NOT_DETERMINED

            granted =
                authStatus >= AuthorizationStatus.AUTHORIZED &&
                notifeeStatus >= AuthorizationStatus.AUTHORIZED

            if (granted) {
                await getFCMToken()
            }

            return granted
        }

        return false
    } catch (error) {
        console.error('❌ Error requesting permissions:', error)
        return false
    }
}

// ==========================================
// GET OR GENERATE FCM TOKEN
// ==========================================
export const getFCMToken = async () => {
    try {
        if (Platform.OS === 'ios') {
            await messaging().registerDeviceForRemoteMessages()
        }

        let fcmToken = await AsyncStorage.getItem('fcm_token')
        if (fcmToken) {
            console.log('🔑 Using existing FCM token:', fcmToken)
            return fcmToken
        }

        const newToken = await messaging().getToken()
        if (newToken) {
            await AsyncStorage.setItem('fcm_token', newToken)
            console.log('🆕 New FCM token generated:', newToken)
            return newToken
        }

        console.error('❌ Failed to generate FCM token')
        return null
    } catch (error) {
        console.error('❌ Error generating FCM token:', error)
        return null
    }
}

// ==========================================
// OPEN NOTIFICATION SETTINGS
// ==========================================
export const openNotificationSettings = async () => {
    try {
        if (Platform.OS === 'ios') {
            await Linking.openURL('app-settings:')
        } else {
            await notifee.openNotificationSettings()
        }
    } catch (error) {
        console.error('❌ Failed to open settings:', error)
    }
}

// ==========================================
// HELPER: SHOULD PROMPT
// ==========================================
export const shouldPromptForNotification = async () => {
    const status = await getPermissionStatus()
    return status !== 'granted'
}

// ==========================================
// GET PERMISSION STATUS
// ==========================================
export const getPermissionStatus = async () => {
    try {
        const notifeeSettings = await notifee.getNotificationSettings()
        const status =
            notifeeSettings?.authorizationStatus ??
            AuthorizationStatus.NOT_DETERMINED

        if (status >= AuthorizationStatus.AUTHORIZED) return 'granted'
        if (status === AuthorizationStatus.DENIED) return 'denied'
        return 'not_determined'
    } catch (error) {
        return 'not_determined'
    }
}
