// navigations/AppNavigation.js
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native'
import AuthStack from './AuthStack'
import MainStack from './MainStack' // Customer Stack
import StaffStack from './StaffStack' // <--- Create this file next
import OnboardingStack from './OnboardingStack'
import { COLORS } from '../constants'
import {
    initializeApplication,
    setAppReady,
} from '../redux/features/Auth/AuthSlice'

const AppNavigation = () => {
    const dispatch = useDispatch()
    const {
        isLoggedIn,
        isAppReady,
        isInitializing,
        hasCompletedOnboarding,
        user,
    } = useSelector((state) => state.auth)

    useEffect(() => {
        const initApp = async () => {
            try {
                await dispatch(initializeApplication()).unwrap()
            } catch (error) {
                dispatch(setAppReady())
            }
        }
        initApp()
    }, [dispatch])

    if (!isAppReady || isInitializing) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        )
    }

    if (!hasCompletedOnboarding) {
        return (
            <NavigationContainer>
                <OnboardingStack />
            </NavigationContainer>
        )
    }

    return (
        <NavigationContainer>
            {isLoggedIn ? (
                // ✅ FORK BASED ON USER SCHEMA TYPE
                user?.userType === 'staff' ? (
                    <StaffStack />
                ) : (
                    <MainStack />
                )
            ) : (
                <AuthStack />
            )}
        </NavigationContainer>
    )
}
// ... styles remain the same
