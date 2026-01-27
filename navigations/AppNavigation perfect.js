// navigations/AppNavigation.js
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import { ActivityIndicator, View, StyleSheet, Platform } from 'react-native' // ⬅️ Added Platform
import AuthStack from './AuthStack'
import MainStack from './MainStack'
import OnboardingStack from './OnboardingStack'
import { COLORS } from '../constants'
import { initializeApplication } from '../redux/features/Customers/CustomerSlice'
import { useNotifications } from '../hooks/useNotifications'
import { requestUserPermission } from '../hooks/NotificationPermission.js'

// ⚠️ NEW IMPORTS FOR NOTIFEE CHANNEL SETUP
import notifee, { AndroidImportance } from '@notifee/react-native'

// Function to create the Android Notification Channel
async function setupNotificationChannel() {
    try {
        await notifee.createChannel({
            id: 'high_priority',
            name: 'High Priority Alerts',
            // CRITICAL: Importance MUST be HIGH for heads-up and sound on Android
            importance: AndroidImportance.HIGH,
        })
        console.log('✅ Notifee Channel created successfully (Android only)')
    } catch (error) {
        console.error('❌ Failed to create Notifee Channel:', error)
    }
}

const AppNavigation = () => {
    const dispatch = useDispatch()
    const { isLoggedIn, isLoading, hasCompletedOnboarding } = useSelector(
        (state) => state.customer
    )

    console.log('isLoggedIn', isLoggedIn)

    // ==========================================
    // Initialize App and Setup Notifee Channel
    // ==========================================
    useEffect(() => {
        // 1. Initialize application state (user check, etc.)
        dispatch(initializeApplication())

        // 2. Setup Notifee Channel for Android Heads-up/Sound
        if (Platform.OS === 'android') {
            setupNotificationChannel()
        }
    }, [dispatch])

    // ==========================================
    // Request Permission AFTER Login
    // ==========================================
    useEffect(() => {
        if (isLoggedIn) {
            // Request permission after user is logged in
            requestUserPermission()
        }
    }, [isLoggedIn])

    // ==========================================
    // Loading State
    // ==========================================
    if (isLoading || hasCompletedOnboarding === null) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        )
    }

    // ==========================================
    // Navigation Tree
    // ==========================================
    return (
        <NavigationContainer>
            {isLoggedIn ? (
                <>
                    <MainStack />
                    {/* Hook useNotifications after navigation context is ready */}
                    <NotificationsWrapper />
                </>
            ) : hasCompletedOnboarding ? (
                <AuthStack />
            ) : (
                <OnboardingStack />
            )}
        </NavigationContainer>
    )
}

// NotificationsWrapper is a separate component where the hook is invoked.
const NotificationsWrapper = () => {
    useNotifications() // Call useNotifications here inside the component, after navigation is ready
    return null // Doesn't render anything
}

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
})

export default AppNavigation
