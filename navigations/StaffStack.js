import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import StaffScannerScreen from '../screens/Staff/StaffScannerScreen.js'
import StaffProfileScreen from '../screens/Staff/StaffProfileScreen.js'
import { COLORS } from '../constants'

const Stack = createNativeStackNavigator()

const StaffStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: COLORS.white },
                headerTintColor: COLORS.primary,
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <Stack.Screen
                name="StaffScanner"
                component={StaffScannerScreen}
                options={{ title: 'Scan Customer QR' }}
            />
            <Stack.Screen
                name="StaffProfile"
                component={StaffProfileScreen}
                options={{ title: 'Staff Account' }}
            />
        </Stack.Navigator>
    )
}

export default StaffStack
