// App.js
import React, { useCallback, useEffect } from 'react'
import { View, ActivityIndicator, Text, LogBox } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import FlashMessage from 'react-native-flash-message'
import { store, persistor } from './redux/store'
import { ThemeProvider } from './theme/ThemeProvider'
import AppNavigation from './navigations/AppNavigation'
import { FONTS } from './constants/fonts'
import { COLORS } from './constants'
import { requestNotificationPermission } from './utils/requestNotificationPermission'

// Prevent auto-hide splash screen
SplashScreen.preventAutoHideAsync()

// Ignore specific warnings
LogBox.ignoreLogs([
    'Failed prop type: The prop `message.message`',
    'Non-serializable values were found in the navigation state',
])

export default function App() {
    const [fontsLoaded, fontError] = useFonts(FONTS)

    // REQUEST NOTIFICATION PERMISSION
    useEffect(() => {
        requestNotificationPermission().catch(console.error)
    }, [])

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync()
        }
    }, [fontsLoaded, fontError])

    if (!fontsLoaded && !fontError) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ marginTop: 10, color: COLORS.primary }}>
                    Loading Fonts...
                </Text>
            </View>
        )
    }

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider>
                    <SafeAreaProvider onLayout={onLayoutRootView}>
                        <AppNavigation />
                        <FlashMessage
                            position="top"
                            duration={3000}
                            titleStyle={{ fontSize: 16, fontWeight: '600' }}
                            textStyle={{ fontSize: 14 }}
                            floating
                            animated
                        />
                    </SafeAreaProvider>
                </ThemeProvider>
            </PersistGate>
        </Provider>
    )
}
