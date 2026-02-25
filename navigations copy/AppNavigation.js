// navigations/AppNavigation.js
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import AuthStack from './AuthStack'
import MainStack from './MainStack'
import OnboardingStack from './OnboardingStack'
import { COLORS } from '../constants'
import {
    initializeApplication,
    selectUserType,
    setAppReady,
} from '../redux/features/Auth/AuthSlice'
import { Text } from 'react-native'
import StaffStack from './StaffStack'

const AppNavigation = () => {
    const dispatch = useDispatch()
    const {
        isLoggedIn,
        user,
        isAppReady,
        isInitializing,
        hasCompletedOnboarding,
    } = useSelector((state) => state.auth)

    const userType = user?.userType
    console.log('user', user)
    console.log('userType', user?.userType)

    useEffect(() => {
        const initApp = async () => {
            try {
                await dispatch(initializeApplication()).unwrap()
            } catch (error) {
                console.log('App initialization error:', error)
                // Even if initialization fails, mark app as ready
                dispatch(setAppReady())
            }
        }

        initApp()
    }, [dispatch])

    // Show loading screen while initializing
    if (!isAppReady || isInitializing) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        )
    }

    // If onboarding not completed, show onboarding
    if (!hasCompletedOnboarding) {
        return (
            <NavigationContainer>
                <OnboardingStack />
            </NavigationContainer>
        )
    }

    // If logged in, show main app, otherwise auth
    return (
        <NavigationContainer>
            {!isLoggedIn ? (
                <AuthStack />
            ) : userType === 'staff' ? (
                <StaffStack />
            ) : (
                <MainStack />
            )}
        </NavigationContainer>
        // <NavigationContainer>
        //     {isLoggedIn ? <MainStack /> : <AuthStack />}
        // </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.primary,
    },
})

export default AppNavigation
