// navigation/MainStack.js
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaView, Text, Button, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { useTheme } from '../theme/ThemeProvider'
import { useDispatch } from 'react-redux'
import { logout } from '../redux/features/Auth/AuthSlice'
import { useNavigation } from '@react-navigation/native'
import { Home } from '../screens'

const Stack = createNativeStackNavigator()

/* ===============================
   Hello Screen
================================ */
const HelloScreen = ({ navigation }) => {
    const { dark } = useTheme()

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: dark ? '#000' : '#FFF' },
            ]}
        >
            <StatusBar style={dark ? 'light' : 'dark'} />

            <Text style={[styles.text, { color: dark ? '#FFF' : '#000' }]}>
                Hello, welcome!
            </Text>

            <Button
                title="Go to Next Screen"
                onPress={() => navigation.navigate('NextScreen')}
                color={dark ? '#FFD700' : '#0000FF'}
            />
            <Button
                title="Home Screen"
                onPress={() => navigation.navigate('Home')}
                color={dark ? '#FFD700' : '#0000FF'}
            />
        </SafeAreaView>
    )
}

/* ===============================
   Next Screen
================================ */
const NextScreen = () => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const { dark } = useTheme()

    const handleLogout = () => {
        // Clear redux + persisted auth
        dispatch(logout())

        // Redirect to Auth/Login stack
        // navigation.reset({
        //     index: 0,
        //     routes: [{ name: 'AuthStack' }], // 👈 change if your auth stack name differs
        // })
    }

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: dark ? '#111' : '#EEE' },
            ]}
        >
            <Text style={[styles.text, { color: dark ? '#FFF' : '#000' }]}>
                This is the next screen!
            </Text>

            <Button
                title="Logout"
                onPress={handleLogout}
                color={dark ? '#FFD700' : '#03030a'}
            />
        </SafeAreaView>
    )
}

/* ===============================
   Stack Navigator
================================ */
const MainStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Hello" component={HelloScreen} />
            <Stack.Screen name="NextScreen" component={NextScreen} />
            <Stack.Screen name="Home" component={Home} />

            {/* <Stack.Screen name="OTPVerification1" component={OTPVerification} />

            <Stack.Screen name="OtpVerify" component={OtpVerify} />
            <Stack.Screen name="VerifyOTPScreen" component={VerifyOTPScreen} /> */}
        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    text: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    },
})

export default MainStack
