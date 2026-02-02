import AsyncStorage from '@react-native-async-storage/async-storage'
import messaging from '@react-native-firebase/messaging'
import { Platform } from 'react-native'
import axios from 'axios'
import { BASE_API_URL } from '../../../utils/baseurl.js'
import { TokenManager } from '../../../utils/tokenManager'

const FCM_URL = `${BASE_API_URL}/api/notifications`

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

export const sendFCMTokenToServer = async () => {
    try {
        const token = await TokenManager.getToken()
        if (!token) {
            return
        }

        const fcmToken = await getFCMToken()
        if (!fcmToken) {
            return
        }

        await axios.post(
            `${FCM_URL}/register-token`,
            { fcmToken },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
    } catch (error) {
        console.error('Error sending FCM token to server:', error)
    }
}

// services/FCMService.js
export const verifyFCMToken = async (token) => {
    try {
        const response = await axios.post(
            'https://fcm.googleapis.com/fcm/send',
            { to: token },
            {
                headers: {
                    Authorization: `key=${FIREBASE_SERVER_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        )
        return response.data.success === 1
    } catch (error) {
        return false
    }
}

// Track notification engagement
const trackNotificationEvent = (eventName, notificationData) => {
    // Integrate with Firebase Analytics, Mixpanel, etc.
    analytics().logEvent(eventName, {
        notification_id: notificationData.id,
        notification_type: notificationData.type,
        timestamp: Date.now(),
    })
}
