import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SplashScreen from 'expo-splash-screen'

import { store } from './src/store'
import AppNavigator from './src/navigation/AppNavigator'
import { setToken } from './src/store/slices/authSlice'

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

const App = () => {
    const [appIsReady, setAppIsReady] = useState(false)

    useEffect(() => {
        async function prepare() {
            try {
                // Check for stored token
                const token = await AsyncStorage.getItem('userToken')
                if (token) {
                    store.dispatch(setToken(token))
                }

                // Add any other initialization here
            } catch (e) {
                console.warn(e)
            } finally {
                setAppIsReady(true)
                await SplashScreen.hideAsync()
            }
        }

        prepare()
    }, [])

    if (!appIsReady) {
        return null
    }

    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <StatusBar style="auto" />
                <AppNavigator />
            </SafeAreaProvider>
        </Provider>
    )
}

export default App
