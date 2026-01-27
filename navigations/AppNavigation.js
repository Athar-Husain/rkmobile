//navigations/AppNavigation.js
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import { ActivityIndicator, View, StyleSheet, Platform } from 'react-native'
import AuthStack from './AuthStack'
import MainStack from './MainStack'
import OnboardingStack from './OnboardingStack'
import { COLORS } from '../constants'
import { initializeApplication } from '../redux/features/Customers/CustomerSlice'

import { useNotifications } from '../hooks/useNotifications'
import { requestUserPermission } from '../hooks/NotificationPermission'
import NotificationBanner from '../components/NotificationBanner'

const AppNavigation = () => {
    const dispatch = useDispatch()
    const { isLoggedIn, isLoading, hasCompletedOnboarding } = useSelector(
        (state) => state.customer
    )

    useEffect(() => {
        dispatch(initializeApplication())
    }, [dispatch])

    useEffect(() => {
        if (isLoggedIn) requestUserPermission()
    }, [isLoggedIn])

    if (isLoading || hasCompletedOnboarding === null) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        )
    }

    return (
        <NavigationContainer>
            {isLoggedIn ? (
                <>
                    <MainStack />
                    <NotificationsWrapper />
                    <NotificationBanner />
                </>
            ) : hasCompletedOnboarding ? (
                <AuthStack />
            ) : (
                <OnboardingStack />
            )}
        </NavigationContainer>
    )
}

const NotificationsWrapper = () => {
    useNotifications()
    return null
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
