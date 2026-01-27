import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import OnboardingScreen from '../screens/OnboardingScreen'
// import OnboardingScreen from '../OnboardingScreen'

const Stack = createNativeStackNavigator()

// Data for all onboarding screens
const onboardingData = [
    {
        key: 'Onboarding1',
        title: 'Welcome to',
        subTitle: 'MW FiberNet',
        description:
            "We're here to make your life easier by connecting you with top-notch service providers for all your home needs.",
        // imageName: 'onboarding1',
        imageName: 'logo',
    },
    {
        key: 'Onboarding2',
        title: 'Enjoy the convenience of',
        subTitle: 'CONVENIENCE',
        description:
            "Access home services whenever and wherever you need them. From routine maintenance to emergency repairs, we've got you covered.",
        // imageName: 'onboarding2',
        imageName: 'logo',
    },
    {
        key: 'Onboarding3',
        title: 'Efficient',
        subTitle: 'A Reliable Service',
        description:
            'Discover a network of trusted professionals ready to tackle any task, ensuring your home is always in tip-top shape.',
        imageName: 'logo',
        // imageName: 'onboarding3',
    },
    {
        key: 'Onboarding4',
        title: 'Premium Wifi',
        subTitle: 'MW FiberNet',
        description:
            'Let us handle the chores, so you can focus on what matters most.',
        imageName: 'logo',
        // imageName: 'onboarding4',
    },
]

const OnboardingStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {onboardingData.map((screenData, index) => (
                <Stack.Screen
                    key={screenData.key}
                    name={screenData.key}
                    options={{ animation: 'slide_from_right' }}
                >
                    {(props) => (
                        <OnboardingScreen
                            {...props}
                            data={screenData}
                            index={index}
                            totalScreens={onboardingData.length}
                        />
                    )}
                </Stack.Screen>
            ))}
        </Stack.Navigator>
    )
}

export default OnboardingStack
