import React, { useCallback, useEffect } from 'react'
import { View, ActivityIndicator, Text, LogBox, StyleSheet } from 'react-native'
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
import { StatusBar } from 'expo-status-bar'

SplashScreen.preventAutoHideAsync()

LogBox.ignoreLogs([
    'Failed prop type: The prop `message.message`',
    'Non-serializable values were found in the navigation state',
])

export default function App() {
    const [fontsLoaded, fontError] = useFonts(FONTS)

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
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading Fonts...</Text>
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
                            floating
                            statusBarHeight={StatusBar.currentHeight}
                        />
                    </SafeAreaProvider>
                </ThemeProvider>
            </PersistGate>
        </Provider>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000', // Keeps it dark during splash transition
    },
    loadingText: {
        marginTop: 10,
        color: COLORS.primary,
        fontFamily: 'medium',
    },
})
