import { Platform, Alert, Linking } from 'react-native'
// import * as Location from 'expo-location'
import notifee, { AuthorizationStatus } from '@notifee/react-native'
import messaging from '@react-native-firebase/messaging'

/**
 * Open app settings
 */
const openAppSettings = () => {
    if (Platform.OS === 'ios') {
        Linking.openURL('app-settings:')
    } else {
        Linking.openSettings()
    }
}

/**
 * Request notification permission
 */
const requestNotificationPermission = async () => {
    try {
        // -------- Android 13+ --------
        if (Platform.OS === 'android' && Platform.Version >= 33) {
            const settings = await notifee.requestPermission()
            if (settings.authorizationStatus < AuthorizationStatus.AUTHORIZED) {
                return false
            }
        }

        // -------- iOS --------
        if (Platform.OS === 'ios') {
            const authStatus = await messaging().requestPermission({
                alert: true,
                badge: true,
                sound: true,
            })
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL
            if (!enabled) return false
        }

        return true
    } catch (error) {
        console.error('🔥 Notification permission request failed:', error)
        return false
    }
}

/**
 * Request location permission
 */
// const requestLocationPermission = async () => {
//     try {
//         const { status } = await Location.requestForegroundPermissionsAsync()
//         return status === 'granted'
//     } catch (error) {
//         console.error('🔥 Location permission request failed:', error)
//         return false
//     }
// }

/**
 * Check current permissions
 */
const checkPermissions = async () => {
    let notifGranted = true
    let locationGranted = true

    // Notifications
    if (Platform.OS === 'android' && Platform.Version >= 33) {
        const settings = await notifee.getNotificationSettings()
        if (settings.authorizationStatus < AuthorizationStatus.AUTHORIZED) {
            notifGranted = false
        }
    }
    if (Platform.OS === 'ios') {
        const settings = await messaging().hasPermission()
        if (
            settings !== messaging.AuthorizationStatus.AUTHORIZED &&
            settings !== messaging.AuthorizationStatus.PROVISIONAL
        ) {
            notifGranted = false
        }
    }

    // Location
    const { status } = await Location.getForegroundPermissionsAsync()
    if (status !== 'granted') locationGranted = false

    return { notifGranted, locationGranted }
}

/**
 * Main function to request/check permissions
 * - Call on app launch
 */
export const requestPermissions = async () => {
    // 1️⃣ Try requesting first
    const notifGranted = await requestNotificationPermission()
    const locationGranted = await requestLocationPermission()

    // 2️⃣ Check if still denied
    const { notifGranted: notifCheck, locationGranted: locationCheck } =
        await checkPermissions()

    if (!notifCheck) {
        Alert.alert(
            'Enable Notifications',
            'To receive order updates and alerts, please enable notifications in your device settings.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Go to Settings', onPress: openAppSettings },
            ]
        )
    }

    if (!locationCheck) {
        Alert.alert(
            'Enable Location',
            'To take orders, the app needs access to your location. Please enable it in your device settings.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Go to Settings', onPress: openAppSettings },
            ]
        )
    }

    return {
        notifications: notifCheck,
        location: locationCheck,
    }
}
