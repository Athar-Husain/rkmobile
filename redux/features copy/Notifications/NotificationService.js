import AsyncStorage from '@react-native-async-storage/async-storage'
import messaging from '@react-native-firebase/messaging'
import { Platform } from 'react-native'
import axios from 'axios'
import { BASE_API_URL } from '../../../utils/baseurl.js'
import { TokenManager } from '../../../utils/tokenManager'

const NOTIFICATION_URL = `${BASE_API_URL}/api/notifications`

export const NotificationService = {
    getFCMToken: async () => {
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
    },

    sendFCMTokenToServer: async () => {
        try {
            const token = await TokenManager.getToken()
            if (!token) {
                return
            }

            const fcmToken = await this.getFCMToken()
            if (!fcmToken) {
                return
            }

            await axios.post(
                `${NOTIFICATION_URL}/register-token`,
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
    },

    // ... other notification related methods ...
}
