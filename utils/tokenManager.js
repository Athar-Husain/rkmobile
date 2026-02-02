import AsyncStorage from '@react-native-async-storage/async-storage'

const TOKEN_KEY = 'auth_token'
const EXPIRY_KEY = 'token_expiry'

export const TokenManager = {
    // Save token with expiry
    save: async (token, expiresIn) => {
        try {
            const expiryTime = Date.now() + expiresIn * 1000

            await AsyncStorage.multiSet([
                [TOKEN_KEY, token],
                [EXPIRY_KEY, expiryTime.toString()],
            ])

            return true
        } catch (error) {
            console.error('Error saving token:', error)
            return false
        }
    },

    // Get token
    getToken: async () => {
        try {
            return await AsyncStorage.getItem(TOKEN_KEY)
        } catch (error) {
            console.error('Error getting token:', error)
            return null
        }
    },

    // Check if token is valid
    isValid: async () => {
        try {
            const token = await AsyncStorage.getItem(TOKEN_KEY)
            const expiry = await AsyncStorage.getItem(EXPIRY_KEY)

            if (!token || !expiry) {
                return false
            }

            const expiryTime = parseInt(expiry, 10)
            const currentTime = Date.now()

            // Add 5 minute buffer
            return currentTime < expiryTime - 300000
        } catch (error) {
            console.error('Error checking token validity:', error)
            return false
        }
    },

    // Get token expiry time
    getExpiry: async () => {
        try {
            const expiry = await AsyncStorage.getItem(EXPIRY_KEY)
            return expiry ? parseInt(expiry, 10) : null
        } catch (error) {
            console.error('Error getting token expiry:', error)
            return null
        }
    },

    // Get time until expiry (in seconds)
    getTimeUntilExpiry: async () => {
        try {
            const expiry = await TokenManager.getExpiry()
            if (!expiry) return 0

            const currentTime = Date.now()
            const timeLeft = Math.floor((expiry - currentTime) / 1000)

            return Math.max(0, timeLeft)
        } catch (error) {
            console.error('Error getting time until expiry:', error)
            return 0
        }
    },

    // Clear token
    clear: async () => {
        try {
            await AsyncStorage.multiRemove([TOKEN_KEY, EXPIRY_KEY])
            return true
        } catch (error) {
            console.error('Error clearing token:', error)
            return false
        }
    },

    // Check if token needs refresh (within 5 minutes of expiry)
    needsRefresh: async () => {
        try {
            const timeLeft = await TokenManager.getTimeUntilExpiry()
            return timeLeft > 0 && timeLeft < 300 // 5 minutes
        } catch (error) {
            console.error('Error checking if token needs refresh:', error)
            return false
        }
    },
}

// export { TokenManager }
