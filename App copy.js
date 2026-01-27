// app.js
import * as SplashScreen from 'expo-splash-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
import { useCallback, useState } from 'react'
import { FONTS } from './constants/fonts'
import { LogBox, View, ActivityIndicator, Text } from 'react-native'
import { ThemeProvider } from './theme/ThemeProvider'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import FlashMessage from 'react-native-flash-message'
import { COLORS } from './constants'
import AppNavigation from './navigations/AppNavigation'
// NOTE: Firebase initialization is handled by Expo Config Plugins and native files,
// so the boilerplate code in App.js is not needed for the default app.

// Ignore all log notifications
LogBox.ignoreAllLogs()

// 1. Prevent auto-hide splash screen in the global scope
SplashScreen.preventAutoHideAsync()

export default function App() {
    // 2. Load fonts and track loading status
    const [fontsLoaded] = useFonts(FONTS)

    // 3. Callback function to hide the splash screen
    const onLayoutRootView = useCallback(async () => {
        // Hide the splash screen ONLY when all resources (fonts) are loaded
        if (fontsLoaded) {
            await SplashScreen.hideAsync()
        }
    }, [fontsLoaded])

    // 4. Show a loading indicator (or null) until fonts are loaded
    if (!fontsLoaded) {
        // Important: You must return a component (or null) while waiting for resources
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

    // 5. Render the app content after fonts are loaded
    return (
        <Provider store={store}>
            <ThemeProvider>
                {/* 6. onLayoutRootView is called when the main view is mounted, which is the perfect time to hide the splash screen */}
                <SafeAreaProvider onLayout={onLayoutRootView}>
                    <AppNavigation />
                    <FlashMessage position="top" />
                </SafeAreaProvider>
            </ThemeProvider>
        </Provider>
    )
}
