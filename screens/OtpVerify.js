import React, { useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, Alert, TouchableOpacity } from 'react-native'
import { useTheme } from '../theme/ThemeProvider'
import { COLORS } from '../constants'
import Input from '../components/Input'
import Button from '../components/Button'
// import { completeSignup, verifyLogin } from '../api/auth'
// import { useAuth } from '../context/AuthContext' // Assuming you have a context

const OtpVerify = ({ navigation, route }) => {
    const { colors } = useTheme()
    const { type, identifier, payload } = route.params
    const [otp, setOtp] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    // const { login } = useAuth() 

    const handleVerify = async () => {
        if (otp.length < 4) {
            Alert.alert('Error', 'Please enter a valid OTP')
            return
        }

        setIsLoading(true)
        try {
            let response
            if (type === 'SIGNUP') {
                response = await completeSignup({ ...payload, otp })
            } else {
                response = await verifyLogin({ identifier, otp })
            }

            if (response.success) {
                // await login(response.token, response.user) // Save JWT & User
                Alert.alert('Success', `Welcome, ${response.user.name}!`)
                navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
            } else {
                Alert.alert('Error', response.message || 'Verification failed')
            }
        } catch (error) {
            Alert.alert('Error', 'Verification failed. Try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>Verification</Text>
                <Text style={[styles.subtitle, { color: colors.text }]}>
                    Enter the 6-digit code sent to {identifier}
                </Text>

                <Input
                    placeholder="0 0 0 0 0 0"
                    keyboardType="number-pad"
                    maxLength={6}
                    onInputChanged={(_, val) => setOtp(val)}
                    style={styles.otpInput}
                />

                <Button 
                    title={type === 'SIGNUP' ? "Register" : "Login"} 
                    filled 
                    isLoading={isLoading} 
                    onPress={handleVerify} 
                    style={styles.button} 
                />

                <TouchableOpacity style={styles.resendBtn}>
                    <Text style={{ color: COLORS.primary, fontWeight: '600' }}>Resend OTP</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center' },
    content: { alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 40, opacity: 0.7 },
    otpInput: { textAlign: 'center', fontSize: 24, letterSpacing: 12, marginBottom: 30 },
    button: { width: '100%', borderRadius: 28 },
    resendBtn: { marginTop: 20 }
})

export default OtpVerify