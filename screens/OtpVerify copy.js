import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Alert,
    TouchableOpacity,
} from 'react-native'
import { useTheme } from '../theme/ThemeProvider'
import Input from '../components/Input'
import Button from '../components/Button'
import { COLORS } from '../constants'
// import { verifyOtp } from '../api/auth' // your API function

const OtpVerify = ({ navigation, route }) => {
    const { colors } = useTheme()
    // const { phone, email, otp_token, signupData } = route.params

    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)

    const handleVerifyOtp = async () => {
        if (!otp || otp.length < 4) {
            Alert.alert('Error', 'Please enter a valid OTP')
            return
        }

        try {
            setLoading(true)
            // const response = await verifyOtp({ phone, email, otp, otp_token })

            if (response.success) {
                // OTP verified, navigate to Final Signup screen
                // navigation.navigate('FinalSignup', { signupData, otp_token })
                console.log('next')
            } else {
                Alert.alert(
                    'Error',
                    response.message || 'OTP verification failed'
                )
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const handleResendOtp = async () => {
        try {
            // Call resend OTP API (optional)
            Alert.alert('Info', 'OTP resend functionality not implemented yet')
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to resend OTP')
        }
    }

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>
                    Verify OTP
                </Text>
                <Text style={[styles.subtitle, { color: colors.text }]}>
                    Enter the OTP sent to
                    {/* {phone || email} */}
                </Text>

                <Input
                    placeholder="Enter OTP"
                    keyboardType="number-pad"
                    // value={otp}
                    onInputChanged={(_, val) => setOtp(val)}
                    maxLength={6}
                    style={styles.otpInput}
                />

                <Button
                    title={loading ? 'Verifying...' : 'Verify OTP'}
                    filled
                    onPress={handleVerifyOtp}
                    disabled={loading}
                    style={styles.button}
                />

                <TouchableOpacity
                    onPress={handleResendOtp}
                    style={styles.resendRow}
                >
                    <Text
                        style={[styles.resendText, { color: COLORS.primary }]}
                    >
                        Resend OTP
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 16 },
    content: { alignItems: 'center' },
    title: { fontSize: 20, fontFamily: 'semiBold', marginBottom: 8 },
    subtitle: {
        fontSize: 14,
        fontFamily: 'regular',
        textAlign: 'center',
        marginBottom: 24,
    },
    otpInput: {
        textAlign: 'center',
        fontSize: 18,
        letterSpacing: 8,
        marginBottom: 20,
    },
    button: { width: '100%', borderRadius: 28 },
    resendRow: { marginTop: 16 },
    resendText: { fontSize: 14, fontFamily: 'medium' },
})

export default OtpVerify
