import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import LoginScreen from '../screens/auth/LoginScreen'
import SignupScreen from '../screens/auth/SignupScreen'
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen'
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen'

const Stack = createNativeStackNavigator()

const AuthNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Signup"
                component={SignupScreen}
                options={{ title: 'Sign Up' }}
            />
            <Stack.Screen
                name="OTPVerification"
                component={OTPVerificationScreen}
                options={{ title: 'Verify OTP' }}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{ title: 'Forgot Password' }}
            />
        </Stack.Navigator>
    )
}

export default AuthNavigator
