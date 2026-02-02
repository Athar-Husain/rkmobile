import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import {
    Welcome,
    Login,
    Signup,
    ForgotPasswordMethods,
    ForgotPasswordEmail,
    ForgotPasswordPhoneNumber,
    OTPVerification,
    CreateNewPassword,
    FillYourProfile,
    CreateNewPIN,
    Fingerprint,
} from '../screens'
import OtpVerify from '../screens/OtpVerify'
import FinalSignupScreen from '../screens/FinalSignupScreen'
import VerifyOTPScreen from '../screens/VerifyOTPScreen'

const Stack = createNativeStackNavigator()

const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        {/* <Stack.Screen name="OTPVerification" component={OTPVerification} /> */}
        <Stack.Screen name="VerifyOTP" component={OtpVerify} />
        <Stack.Screen name="VerifyOTPScreen" component={VerifyOTPScreen} />
        <Stack.Screen name="FinalSignup" component={FinalSignupScreen} />
        <Stack.Screen
            name="ForgotPasswordMethods"
            component={ForgotPasswordMethods}
        />
        <Stack.Screen
            name="ForgotPasswordEmail"
            component={ForgotPasswordEmail}
        />
        <Stack.Screen
            name="ForgotPasswordPhoneNumber"
            component={ForgotPasswordPhoneNumber}
        />
        <Stack.Screen name="OTPVerification" component={OTPVerification} />
        <Stack.Screen name="CreateNewPassword" component={CreateNewPassword} />
        <Stack.Screen name="FillYourProfile" component={FillYourProfile} />
        <Stack.Screen name="CreateNewPIN" component={CreateNewPIN} />
        <Stack.Screen name="Fingerprint" component={Fingerprint} />
    </Stack.Navigator>
)

export default AuthStack
