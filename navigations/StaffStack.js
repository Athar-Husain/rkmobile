// navigation/StaffStack.js
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useTheme } from '../theme/ThemeProvider'

// Navigation
import StaffBottomTabNavigation from './StaffBottomTabNavigation'

// Screens
import StaffScannerScreen from '../screens/Staff/StaffScannerScreen'
import StaffProfileScreen from '../screens/Staff/StaffProfileScreen'
import Menu from '../screens/Menu'
// import Header from '../components/Header'
import Header from '../containers/Header'

const Stack = createNativeStackNavigator()

const StaffStack = () => {
    const { dark } = useTheme()
    const backgroundColor = dark ? '#000' : '#FFF'
    const barStyle = dark ? 'light-content' : 'dark-content'

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
            <StatusBar
                style={barStyle}
                backgroundColor={backgroundColor}
                translucent={false}
            />
            <Header />

            <Stack.Navigator
                screenOptions={{
                    headerShown: false, // match MainStack
                }}
            >
                <Stack.Screen
                    name="StaffTabs"
                    component={StaffBottomTabNavigation}
                />

                <Stack.Screen
                    name="StaffScanner"
                    component={StaffScannerScreen}
                />
                <Stack.Screen name="Menu" component={Menu} />

                <Stack.Screen
                    name="StaffProfile"
                    component={StaffProfileScreen}
                />
            </Stack.Navigator>
        </SafeAreaView>
    )
}

export default StaffStack
