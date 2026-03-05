import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import OnboardingScreen from '../screens/OnboardingScreen'
import { COLORS } from '../constants' // Adjust based on your constants path
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'

const Stack = createNativeStackNavigator()

/**
 * PRODUCTION TIP: Add dynamic data for colors to create smooth
 * transitions. Using your constants list.
 */
export const ONBOARDING_DATA = [
    {
        id: 1,
        title: 'Welcome to',
        subTitle: 'RK Electronics',
        description:
            'Your trusted partner for genuine electronics and reliable home services, right at your doorstep.',
        image: 'logo',
        bgGradient: ['#FFF', '#F0F5FF'], // Starts here
    },
    {
        id: 2,
        title: 'Enjoy the convenience of',
        subTitle: 'HOME SERVICES',
        description:
            'From routine maintenance to emergency repairs, discover trusted professionals ready to tackle any task.',
        image: 'logo',
        bgGradient: ['#F0F5FF', '#F9F0FF'], // Transitions to this
    },
    {
        id: 3,
        title: 'Discover exclusive',
        subTitle: 'OFFERS & DEALS',
        description:
            'Unlock premium discounts on appliances and services. Let us handle the chores, so you can focus on life.',
        image: 'logo',
        bgGradient: ['#F9F0FF', '#FFF'], // Transitions back
    },
]

const OnboardingStack = () => {
    return (
        <View style={{ flex: 1 }}>
            <StatusBar style="dark" />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="OnboardingMain">
                    {(props) => (
                        <OnboardingScreen {...props} data={ONBOARDING_DATA} />
                    )}
                </Stack.Screen>
            </Stack.Navigator>
        </View>
    )
}

export default OnboardingStack
