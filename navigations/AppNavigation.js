import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native'
import AuthStack from './AuthStack'
import MainStack from './MainStack'
import OnboardingStack from './OnboardingStack'
import StaffStack from './StaffStack'
import { COLORS } from '../constants'
import { useTheme } from '../theme/ThemeProvider'
import {
    initializeApplication,
    setAppReady,
} from '../redux/features/Auth/AuthSlice'

const AppNavigation = () => {
    const dispatch = useDispatch()
    const { colors } = useTheme()
    const {
        isLoggedIn,
        user,
        isAppReady,
        isInitializing,
        hasCompletedOnboarding,
    } = useSelector((state) => state.auth)

    const userType = user?.userType

    useEffect(() => {
        const initApp = async () => {
            try {
                await dispatch(initializeApplication()).unwrap()
            } catch (err) {
                console.error('App initialization failed:', err)
            } finally {
                dispatch(setAppReady())
            }
        }
        initApp()
    }, [dispatch])

    if (!isAppReady || isInitializing) {
        return (
            <View
                style={[
                    styles.loaderContainer,
                    { backgroundColor: colors.background },
                ]}
            >
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={[styles.loadingText, { color: colors.text }]}>
                    Initializing...
                </Text>
            </View>
        )
    }

    return (
        <NavigationContainer>
            {!hasCompletedOnboarding ? (
                <OnboardingStack />
            ) : !isLoggedIn ? (
                <AuthStack />
            ) : userType === 'staff' ? (
                <StaffStack />
            ) : (
                <MainStack />
            )}
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: { marginTop: 12, fontSize: 16 },
})

export default AppNavigation
