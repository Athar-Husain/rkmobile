// hooks/NotificationPermission.js
import AsyncStorage from '@react-native-async-storage/async-storage'
import messaging from '@react-native-firebase/messaging'
import notifee, { AuthorizationStatus } from '@notifee/react-native'
import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native'

export async function requestUserPermission() {
    try {
        let granted = false

        if (Platform.OS === 'android') {
            // Android 13+ (API 33) requires POST_NOTIFICATIONS permission
            if (Platform.Version >= 33) {
                const permission = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                )
                if (permission === PermissionsAndroid.RESULTS.GRANTED) {
                    granted = true
                } else {
                    granted = false
                }
            } else {
                granted = true
            }

            // Notifee permission (for heads-up notifications)
            const notifeeSettings = await notifee.requestPermission({
                alert: true,
                badge: true,
                sound: true,
                announcement: true,
            })

            if (
                (notifeeSettings.authorizationStatus ?? 0) >=
                AuthorizationStatus.AUTHORIZED
            ) {
                granted = granted && true
                await getFCMToken()
                return true
            }
            return false
        } else if (Platform.OS === 'ios') {
            // iOS permissions
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

            granted =
                authStatus >= AuthorizationStatus.AUTHORIZED &&
                (notifeeSettings.authorizationStatus ?? 0) >=
                    AuthorizationStatus.AUTHORIZED

            if (granted) {
                await getFCMToken()
            }
            return granted
        }

        return false
    } catch (error) {
        console.error('Error requesting permissions:', error)
        return false
    }
}

// ==========================================
// Get or Generate FCM Token
// ==========================================
export const getFCMToken = async () => {
    try {
        // Register device for remote messages (iOS requirement)
        if (Platform.OS === 'ios') {
            await messaging().registerDeviceForRemoteMessages()
        }

        // Check if token already exists
        let fcmToken = await AsyncStorage.getItem('fcm_token')

        if (fcmToken) {
            console.log('🔑 Using existing FCM token:', fcmToken)
            return fcmToken
        }

        // Generate new token
        const newToken = await messaging().getToken()

        if (newToken) {
            await AsyncStorage.setItem('fcm_token', newToken)
            console.log('🆕 New FCM token generated:', newToken)
            return newToken
        } else {
            console.error('❌ Failed to generate FCM token')
            return null
        }
    } catch (error) {
        console.error('❌ Error during FCM token generation:', error)
        return null
    }
}

// export const getFCMToken = async () => {
//     try {
//         // Register device for remote messages (iOS requirement)
//         if (Platform.OS === 'ios') {
//             await messaging().registerDeviceForRemoteMessages()
//         }

//         // Check if token already exists
//         let fcmToken = await AsyncStorage.getItem('fcm_token')

//         if (fcmToken) {
//             console.log('🔑 Using existing FCM token:', fcmToken)
//             return fcmToken
//         }

//         // Generate new token
//         const newToken = await messaging().getToken()

//         if (newToken) {
//             await AsyncStorage.setItem('fcm_token', newToken)
//             console.log('🆕 New FCM token generated:', newToken)
//             return newToken
//         } else {
//             console.error('❌ Failed to generate FCM token')
//             return null
//         }
//     } catch (error) {
//         console.error('❌ Error during FCM token generation:', error)
//         return null
//     }
// }

// Add this function to your NotificationPermission.js file
// export const registerFCMToken = async (token) => {
//     try {
//         // Replace with your API endpoint
//         const response = await fetch('YOUR_API_ENDPOINT/register-token', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 token: token,
//                 platform: Platform.OS,
//             }),
//         })

//         if (response.ok) {
//             console.log('FCM Token registered successfully')
//         } else {
//             console.error('Failed to register FCM token')
//         }
//     } catch (error) {
//         console.error('Error registering FCM token:', error)
//     }
// }
