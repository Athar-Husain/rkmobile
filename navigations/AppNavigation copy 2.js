import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import AuthStack from './AuthStack'
import MainStack from './MainStack'
import OnboardingStack from './OnboardingStack'
import { COLORS } from '../constants'
import { initializeApplication } from '../redux/features/Customers/CustomerSlice'
import { useNotifications } from '../hooks/useNotifications'
import { requestUserPermission } from '../hooks/NotificationPermission.js'

const AppNavigation = () => {
    const dispatch = useDispatch()
    const { isLoggedIn, isLoading, hasCompletedOnboarding } = useSelector(
        (state) => state.customer
    )

    console.log('isLoggedIn', isLoggedIn)

    // ==========================================
    // Initialize App on Mount
    // ==========================================
    useEffect(() => {
        dispatch(initializeApplication())
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
