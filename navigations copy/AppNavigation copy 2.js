// navigation/AppNavigation.js
import React, { useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import {
    initializeApplication,
    selectIsAppReady,
    selectIsLoggedIn,
    selectUserType,
    selectHasOnboardingCompleted,
} from '../redux/features/Auth/AuthSlice'

// -------------------- SCREENS --------------------
// Onboarding
import OnboardingScreen from '../screens/OnboardingScreen'

// Customer screens
import CustomerLoginScreen from '../screens/customer/LoginScreen'
import CustomerDashboardScreen from '../screens/customer/DashboardScreen'
import CustomerProfileScreen from '../screens/customer/ProfileScreen'

// Staff screens
import StaffLoginScreen from '../screens/staff/LoginScreen'
import StaffDashboardScreen from '../screens/staff/DashboardScreen'
import StaffProfileScreen from '../screens/staff/ProfileScreen'

// -------------------- STACKS --------------------
const Stack = createNativeStackNavigator()

// -------------------- LOADER --------------------
const Loader = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
    </View>
)

// -------------------- CUSTOMER STACK --------------------
const CustomerStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CustomerDashboard" component={CustomerDashboardScreen} />
        <Stack.Screen name="CustomerProfile" component={CustomerProfileScreen} />
    </Stack.Navigator>
)

// -------------------- STAFF STACK --------------------
const StaffStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="StaffDashboard" component={StaffDashboardScreen} />
        <Stack.Screen name="StaffProfile" component={StaffProfileScreen} />
    </Stack.Navigator>
)

// -------------------- AUTH STACK --------------------
const AuthStack = ({ userType }) => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userType === 'staff' ? (
            <Stack.Screen name="StaffLogin" component={StaffLoginScreen} />
        ) : (
            <Stack.Screen name="CustomerLogin" component={CustomerLoginScreen} />
        )}
    </Stack.Navigator>
)

// -------------------- ONBOARDING STACK --------------------
const OnboardingStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    </Stack.Navigator>
)

// -------------------- APP NAVIGATION --------------------
const AppNavigation = () => {
    const dispatch = useDispatch()
    const isAppReady = useSelector(selectIsAppReady)
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const userType = useSelector(selectUserType)
    const hasCompletedOnboarding = useSelector(selectHasOnboardingCompleted)

    useEffect(() => {
        dispatch(initializeApplication())
    }, [dispatch])

    if (!isAppReady) {
        return <Loader />
    }

    return (
        <NavigationContainer>
            {hasCompletedOnboarding === false ? (
                <OnboardingStack />
            ) : !isLoggedIn ? (
                <AuthStack userType={userType} />
            ) : userType === 'staff' ? (
                <StaffStack />
            ) : (
                <CustomerStack />
            )}
        </NavigationContainer>
    )
}

export default AppNavigation
