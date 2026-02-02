import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { OtpInput } from 'react-native-otp-entry'

import Header from '../components/Header'
import Button from '../components/Button'
import { COLORS, images } from '../constants'
import { useTheme } from '../theme/ThemeProvider'
import {
    signupVerifyOTP,
    signupSendOTP,
    clearError,
} from '../redux/features/Auth/AuthSlice'
import { useNavigation } from '@react-navigation/native'

const VerifyOTPScreen = ({ route }) => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { colors, dark } = useTheme()
    const { email, mobile } = route.params
    const { isLoading, tempToken, isLoggedIn } = useSelector(
        (state) => state.auth
    )

    const [otp, setOTP] = useState('')
    const [timer, setTimer] = useState(30)

    useEffect(() => {
        const interval = setInterval(() => {
            if (timer > 0) setTimer(timer - 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [timer])

    // useEffect(() => {
    //     if (isLoggedIn) {
    //         navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })
    //     }
    //     return () => {
    //         dispatch(clearError())
    //     }
    // }, [isLoggedIn])

    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            // Updated to 6 for your requirement
            Alert.alert('Invalid OTP', 'Please enter the 6-digit code.')
            return
        }
        if (!tempToken) {
            Alert.alert('Session Expired', 'Please signup again.')
            return
        }
        try {
            await dispatch(signupVerifyOTP({ otp, tempToken })).unwrap()
        } catch (err) {
            console.log('Verify OTP error', err)
        }
    }

    const handleResendOTP = async () => {
        setTimer(30)
        try {
            await dispatch(signupSendOTP(route.params)).unwrap()
            Alert.alert('Success', 'A new OTP has been sent.')
        } catch (err) {
            Alert.alert('Error', 'Failed to resend OTP.')
        }
    }

    return (
        <SafeAreaView
            style={[styles.area, { backgroundColor: colors.background }]}
        >
            <Header
                title="OTP Verification"
                // onPress={() => navigation.goBack()}
            />

            <ScrollView
                contentContainerStyle={styles.centerContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.imgContainer}>
                    <Image source={images.logo} style={styles.illustration} />
                </View>

                <Text
                    style={[
                        styles.title,
                        { color: dark ? COLORS.white : COLORS.black },
                    ]}
                >
                    Verify Your Identity
                </Text>

                <Text
                    style={[
                        styles.subtitle,
                        {
                            color: dark
                                ? COLORS.grayscale400
                                : COLORS.grayscale700,
                        },
                    ]}
                >
                    Enter the 6-digit code sent to {'\n'}
                    <Text
                        style={{
                            fontWeight: 'bold',
                            color: dark ? COLORS.white : COLORS.black,
                        }}
                    >
                        {email || mobile}
                    </Text>
                </Text>

                <View style={styles.otpWrapper}>
                    <OtpInput
                        numberOfDigits={6}
                        focusColor={COLORS.primary}
                        focusStickBlinkingDuration={500}
                        onTextChange={(text) => setOTP(text)}
                        theme={{
                            pinCodeContainerStyle: {
                                backgroundColor: dark
                                    ? COLORS.dark2
                                    : COLORS.secondaryWhite,
                                borderColor: dark
                                    ? COLORS.gray
                                    : COLORS.grayscale200,
                                borderWidth: 1,
                                borderRadius: 12,
                                height: 50,
                                width: 45, // Adjusted for 6 digits to fit screen width
                            },
                            pinCodeTextStyle: {
                                color: dark ? COLORS.white : COLORS.black,
                                fontSize: 20,
                                fontWeight: '600',
                            },
                            focusedPinCodeContainerStyle: {
                                borderColor: COLORS.primary,
                                borderWidth: 2,
                            },
                        }}
                    />
                </View>

                <View style={styles.resendContainer}>
                    <Text
                        style={{
                            color: dark
                                ? COLORS.grayscale400
                                : COLORS.grayscale700,
                            fontSize: 16,
                        }}
                    >
                        Didn't receive code?{' '}
                    </Text>
                    {timer > 0 ? (
                        <Text style={styles.timerText}>Resend in {timer}s</Text>
                    ) : (
                        <TouchableOpacity onPress={handleResendOTP}>
                            <Text style={styles.resendText}>Resend Now</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title={isLoading ? 'Verifying...' : 'Verify & Proceed'}
                    onPress={handleVerifyOTP}
                    filled
                    style={styles.btn}
                    disabled={isLoading}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: { flex: 1 },
    centerContainer: {
        paddingHorizontal: 24,
        alignItems: 'center',
        paddingBottom: 40,
    },
    imgContainer: {
        marginTop: 40,
        marginBottom: 30,
    },
    illustration: {
        width: 140,
        height: 140,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    otpWrapper: {
        width: '100%',
        paddingHorizontal: 5,
        marginBottom: 20,
    },
    resendContainer: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center',
    },
    timerText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 16,
    },
    resendText: {
        color: COLORS.primary,
        fontWeight: '700',
        fontSize: 16,
    },
    footer: {
        padding: 24,
        backgroundColor: 'transparent',
    },
    btn: {
        width: '100%',
        borderRadius: 32, // Elegant rounded look
        height: 56,
    },
})

export default VerifyOTPScreen
