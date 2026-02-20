import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import Checkbox from 'expo-checkbox'
import { OtpInput } from 'react-native-otp-entry'

// Components
import Header from '../components/Header'
import Input from '../components/Input'
import Button from '../components/Button'

// Constants & Theme
import { COLORS, icons, images } from '../constants'
import { useTheme } from '../theme/ThemeProvider'

// Redux
// import {
//     staffSigninSendOTP,
//     staffSigninVerifyOTP,
//     clearError,
// } from '../redux/features/Auth/authSlice'
// import { FCMService } from '../redux/features/Staff/AuthService'
import {
    clearError,
    signinStaffSendOTP,
    signinStaffVerifyOTP,
} from '../redux/features/Auth/AuthSlice'
import { FCMService } from '../redux/features/Auth/AuthService'

const LoginStaff = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { colors, dark } = useTheme()

    const { isLoading: authLoading, isLoggedIn } = useSelector(
        (state) => state.auth
    )

    const [loading, setLoading] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [step, setStep] = useState(1)
    const [tempToken, setTempToken] = useState(null)
    const [userIdentifier, setUserIdentifier] = useState('')
    const [countdown, setCountdown] = useState(0)
    const [otpCode, setOtpCode] = useState('')
    const [deviceToken, setDeviceToken] = useState(null)

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: { emailOrMobile: '' },
    })

    useEffect(() => {
        const prepare = async () => {
            await loadRememberedCredentials()
            try {
                const token = await FCMService.getToken()
                setDeviceToken(token)
            } catch (err) {
                console.log('FCM token error:', err)
            }
        }
        prepare()
    }, [])

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    useEffect(() => {
        if (isLoggedIn) {
            // navigation.reset({ index: 0, routes: [{ name: 'StaffMainTabs' }] })
            console.log('logged in Succesfully')
        }
        return () => {
            dispatch(clearError())
        }
    }, [isLoggedIn])

    const loadRememberedCredentials = async () => {
        try {
            const remembered = await AsyncStorage.getItem('rememberedStaff')
            if (remembered) {
                const { emailOrMobile } = JSON.parse(remembered)
                setValue('emailOrMobile', emailOrMobile)
                setRememberMe(true)
            }
        } catch (e) {
            console.log('RememberMe load error', e)
        }
    }

    const handleSendOTP = async (data) => {
        setLoading(true)
        try {
            const id = data.emailOrMobile.trim()
            const result = await dispatch(
                signinStaffSendOTP({ emailOrMobile: id })
            ).unwrap()

            if (result.success) {
                setTempToken(result.tempToken)
                setUserIdentifier(id)
                setCountdown(120)
                setStep(2)

                if (rememberMe) {
                    await AsyncStorage.setItem(
                        'rememberedStaff',
                        JSON.stringify({ emailOrMobile: id })
                    )
                } else {
                    await AsyncStorage.removeItem('rememberedStaff')
                }
            }
        } catch (error) {
            Alert.alert('Login Failed', error || 'Staff not found')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOTP = async () => {
        if (otpCode.length !== 6) {
            Alert.alert('Required', 'Please enter the 6-digit OTP')
            return
        }

        setLoading(true)
        try {
            await dispatch(
                signinStaffVerifyOTP({
                    otp: otpCode,
                    tempToken,
                    deviceToken,
                    platform: Platform.OS,
                })
            ).unwrap()
        } catch (error) {
            setOtpCode('')
        } finally {
            setLoading(false)
        }
    }

    /* ---------------- RENDERING ---------------- */

    const renderStep1 = () => (
        <>
            <Header title="Staff Sign In" onPress={() => navigation.goBack()} />

            <View style={styles.logoContainer}>
                <Image source={images.logo} style={styles.logo} />
                <Text style={[styles.title, { color: colors.text }]}>
                    Welcome Back
                </Text>
                <Text style={[styles.subtitle, { color: colors.grayscale700 }]}>
                    Sign in to your Staff account
                </Text>
            </View>

            <View style={styles.formContainer}>
                <Controller
                    control={control}
                    name="emailOrMobile"
                    rules={{
                        required: 'Email or Mobile is required',
                        pattern: {
                            value: /^([^\s@]+@[^\s@]+\.[^\s@]+|[6-9]\d{9})$/,
                            message: 'Enter a valid email or 10-digit mobile',
                        },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <Input
                            placeholder="Email or Mobile Number"
                            icon={icons.user}
                            value={value}
                            onInputChanged={(_, v) => onChange(v)}
                            errorText={errors.emailOrMobile?.message}
                            autoCapitalize="none"
                        />
                    )}
                />

                <View style={styles.optionsContainer}>
                    <TouchableOpacity
                        style={styles.checkboxRow}
                        onPress={() => setRememberMe(!rememberMe)}
                        activeOpacity={0.7}
                    >
                        <Checkbox
                            value={rememberMe}
                            onValueChange={setRememberMe}
                            color={rememberMe ? COLORS.primary : undefined}
                            style={styles.checkbox}
                        />
                        <Text
                            style={[styles.optionLabel, { color: colors.text }]}
                        >
                            Remember Me
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    // onPress={() =>
                    //     navigation.navigate('StaffForgotPassword')
                    // }
                    >
                        <Text style={styles.linkText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                <Button
                    title={
                        loading || authLoading ? 'Sending OTP...' : 'Continue'
                    }
                    onPress={handleSubmit(handleSendOTP)}
                    filled
                    disabled={loading || authLoading}
                    style={styles.mainBtn}
                />
            </View>

            <View style={styles.footer}>
                <Text style={{ color: colors.text, fontSize: 15 }}>
                    Don't have a staff account?{' '}
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Signup')}
                >
                    <Text style={[styles.linkText, { fontSize: 15 }]}>
                        Customer Sign Up
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    )

    const renderStep2 = () => (
        <>
            <Header title="Verify Identity" onPress={() => setStep(1)} />

            <View style={styles.logoContainer}>
                <Image source={images.logo} style={styles.logo} />
                <Text style={[styles.title, { color: colors.text }]}>
                    Verification Code
                </Text>
                <Text style={[styles.subtitle, { color: colors.grayscale700 }]}>
                    Sent to{' '}
                    <Text style={{ fontWeight: 'bold', color: colors.text }}>
                        {userIdentifier}
                    </Text>
                </Text>
            </View>

            <View style={styles.otpSection}>
                <OtpInput
                    numberOfDigits={6}
                    focusColor={COLORS.primary}
                    focusStickBlinkingDuration={500}
                    onTextChange={(text) => setOtpCode(text)}
                    theme={{
                        pinCodeContainerStyle: {
                            backgroundColor: dark
                                ? COLORS.dark2
                                : COLORS.secondaryWhite,
                            borderColor: dark
                                ? COLORS.gray
                                : COLORS.grayscale200,
                            borderRadius: 12,
                            width: 48,
                            height: 55,
                        },
                        pinCodeTextStyle: {
                            color: colors.text,
                            fontSize: 22,
                            fontWeight: '700',
                        },
                    }}
                />
            </View>

            <View style={styles.resendWrapper}>
                {countdown > 0 ? (
                    <Text
                        style={{
                            color: colors.text,
                            opacity: 0.7,
                            fontSize: 15,
                        }}
                    >
                        Resend code in{' '}
                        <Text
                            style={{ color: COLORS.primary, fontWeight: '700' }}
                        >
                            {countdown}s
                        </Text>
                    </Text>
                ) : (
                    <TouchableOpacity
                        onPress={() =>
                            handleSendOTP({ emailOrMobile: userIdentifier })
                        }
                    >
                        <Text style={styles.linkText}>Resend OTP</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Button
                title={loading ? 'Verifying...' : 'Verify & Login'}
                onPress={handleVerifyOTP}
                filled
                disabled={loading || otpCode.length < 6}
                style={styles.mainBtn}
            />
        </>
    )

    return (
        <SafeAreaView
            style={[styles.area, { backgroundColor: colors.background }]}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    {step === 1 ? renderStep1() : renderStep2()}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: { flex: 1 },
    scrollContainer: { paddingHorizontal: 24, paddingBottom: 40 },
    logoContainer: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
    logo: { width: 120, height: 120, resizeMode: 'contain', marginBottom: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
    subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
    formContainer: { width: '100%' },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 20,
    },
    checkboxRow: { flexDirection: 'row', alignItems: 'center' },
    checkbox: { width: 20, height: 20, borderRadius: 6 },
    optionLabel: { marginLeft: 10, fontSize: 14, fontWeight: '500' },
    linkText: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
    mainBtn: { marginTop: 10, borderRadius: 32, height: 56 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
    otpSection: { marginVertical: 30, width: '100%' },
    resendWrapper: { alignItems: 'center', marginBottom: 30 },
})

export default LoginStaff
