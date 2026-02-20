// App.js
import * as SplashScreen from 'expo-splash-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useEffect } from 'react'
import { LogBox, View, ActivityIndicator, Text } from 'react-native'
import { ThemeProvider } from './theme/ThemeProvider'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store'
import FlashMessage from 'react-native-flash-message'
import { COLORS } from './constants'
import AppNavigation from './navigations/AppNavigation'
import { PersistGate } from 'redux-persist/integration/react'
import { requestNotificationPermission } from './utils/requestNotificationPermission'

// Prevent auto-hide splash screen
SplashScreen.preventAutoHideAsync()

// Ignore specific warnings
LogBox.ignoreLogs([
    'Failed prop type: The prop `message.message`',
    'Non-serializable values were found in the navigation state',
])

export default function App() {
    // ✅ REQUEST NOTIFICATION PERMISSION ON APP START
    useEffect(() => {
        requestNotificationPermission()

        // Hide splash screen as soon as app is ready
        SplashScreen.hideAsync()
    }, [])

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider>
                    <SafeAreaProvider>
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
