// navigation/StaffStack.js
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar' // Expo Status Bar
import { useTheme } from '../theme/ThemeProvider'

// Navigation
import StaffBottomTabNavigation from './StaffBottomTabNavigation'

// Screens
import StaffScannerScreen from '../screens/Staff/StaffScannerScreen'
import StaffProfileScreen from '../screens/Staff/StaffProfileScreen'
import Menu from '../screens/Menu'
import Header from '../containers/Header'
import StaffPOSScreen from '../screens/Staff/StaffPOSScreen'
import CategoriesScreen from '../screens/CategoriesScreen'
import { HelpCenter } from '../screens'
import ShopsScreen from '../screens/ShopsScreen'

const Stack = createNativeStackNavigator()

const StaffStack = () => {
    const { dark } = useTheme()

    // Background color for SafeAreaView
    const backgroundColor = dark ? '#000' : '#FFF'

    // Correct Expo Status Bar Styles: 'light', 'dark', or 'auto'
    const statusBarStyle = dark ? 'light' : 'dark'

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
            <StatusBar
                style={statusBarStyle} // Fixed style prop
                backgroundColor={backgroundColor}
                translucent={false}
            />

            <Header />

            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
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

                <Stack.Screen name="Shops" component={ShopsScreen} />
                <Stack.Screen name="HelpCenter" component={HelpCenter} />
                <Stack.Screen name="Menu" component={Menu} />

                <Stack.Screen name="StaffPOS" component={StaffPOSScreen} />

                <Stack.Screen name="Categories" component={CategoriesScreen} />
                <Stack.Screen
                    name="StaffProfile"
                    component={StaffProfileScreen}
                />
            </Stack.Navigator>
        </SafeAreaView>
    )
}

export default StaffStack
