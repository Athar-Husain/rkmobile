import AsyncStorage from '@react-native-async-storage/async-storage'

export const TokenManager = {
    save: async (token, expiresInSeconds) => {
        const expiryTime = Date.now() + expiresInSeconds * 1000
        await AsyncStorage.setItem('access_token', token)
        await AsyncStorage.setItem('token_expiry', expiryTime.toString())
    },

    clear: async () => {
        await AsyncStorage.removeItem('access_token')
        await AsyncStorage.removeItem('token_expiry')
    },

    getToken: async () => {
        return AsyncStorage.getItem('access_token')
    },

    isValid: async () => {
        const expiry = await AsyncStorage.getItem('token_expiry')
        return expiry && Date.now() < parseInt(expiry, 10)
    },
}
