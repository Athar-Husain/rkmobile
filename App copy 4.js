// App.js
import * as SplashScreen from 'expo-splash-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
import { useCallback, useEffect } from 'react'
import { FONTS } from './constants/fonts'
import { LogBox, View, ActivityIndicator, Text } from 'react-native'
import { ThemeProvider } from './theme/ThemeProvider'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store'
import FlashMessage from 'react-native-flash-message'
import { COLORS } from './constants'
import AppNavigation from './navigations/AppNavigation'
import { PersistGate } from 'redux-persist/integration/react'
import { requestNotificationPermission } from './utils/requestNotificationPermission'
// import { requestNotificationPermission } from './utils/requestNotificationPermission'

useEffect(() => {
    requestNotificationPermission()
}, [])

// Prevent auto-hide splash screen
SplashScreen.preventAutoHideAsync()

// Ignore specific warnings
LogBox.ignoreLogs([
    'Failed prop type: The prop `message.message`',
    'Non-serializable values were found in the navigation state',
])

export default function App() {
    const [fontsLoaded, fontError] = useFonts(FONTS)

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync()
        }
    }, [fontsLoaded, fontError])

    useEffect(() => {
        // Initialize FlashMessage with default options
        // This prevents the undefined message error
    }, [])

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
                            floating={true}
                            hideStatusBar={false}
                            animated={true}
                        />
                    </SafeAreaProvider>
                </ThemeProvider>
            </PersistGate>
        </Provider>
    )
}
