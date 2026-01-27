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
    // Setup Notifications Hook (only when logged in)
    // ==========================================
    useEffect(() => {
        if (isLoggedIn) {
            // This will safely call useNotifications only when the user is logged in
            useNotifications() // Make sure this is invoked correctly in useEffect
        }
    }, [isLoggedIn]) // Dependency on isLoggedIn, so it runs after login

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
                <MainStack />
            ) : hasCompletedOnboarding ? (
                <AuthStack />
            ) : (
                <OnboardingStack />
            )}
        </NavigationContainer>
    )
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
