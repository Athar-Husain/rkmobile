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
import {
    signinSendOTP,
    signinVerifyOTP,
    clearError,
} from '../redux/features/Auth/AuthSlice'
import { FCMService } from '../redux/features/Auth/AuthService'

const Login = () => {
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
            navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })
        }
        return () => {
            dispatch(clearError())
        }
    }, [isLoggedIn])

    const loadRememberedCredentials = async () => {
        try {
            const remembered = await AsyncStorage.getItem('rememberedUser')
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
                signinSendOTP({ emailOrMobile: id })
            ).unwrap()

            if (result.success) {
                setTempToken(result.tempToken)
                setUserIdentifier(id)
                setCountdown(120)
                setStep(2)
                if (rememberMe) {
                    await AsyncStorage.setItem(
                        'rememberedUser',
                        JSON.stringify({ emailOrMobile: id })
                    )
                } else {
                    await AsyncStorage.removeItem('rememberedUser')
                }
            }
        } catch (error) {
            Alert.alert('Login Failed', error || 'User not found')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOTP = async () => {
        if (otpCode.length !== 6) return
        setLoading(true)
        try {
            await dispatch(
                signinVerifyOTP({
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

    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <View style={styles.headerSection}>
                <Image
                    source={images.logo}
                    style={[
                        styles.logo,
                        // { tintColor: colors.primary }
                    ]}
                />
                <Text style={[styles.title, { color: colors.text }]}>
                    Welcome Back
                </Text>
                <Text style={[styles.subtitle, { color: colors.grayscale700 }]}>
                    Sign in to your RK Electronics account
                </Text>
            </View>

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
                >
                    <Checkbox
                        value={rememberMe}
                        onValueChange={setRememberMe}
                        color={rememberMe ? COLORS.primary : undefined}
                        style={styles.checkbox}
                    />
                    <Text style={[styles.optionLabel, { color: colors.text }]}>
                        Remember Me
                    </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                    onPress={() => navigation.navigate('ForgotPassword')}
                >
                    <Text style={styles.linkText}>Forgot Password?</Text>
                </TouchableOpacity> */}
            </View>

            <Button
                title={loading || authLoading ? 'Sending OTP...' : 'Continue'}
                onPress={handleSubmit(handleSendOTP)}
                filled
                disabled={loading || authLoading}
                style={styles.mainBtn}
            />

            <View style={styles.footer}>
                <Text style={{ color: colors.text, fontSize: 15 }}>
                    Don't have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.linkText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    )

    const renderStep2 = () => (
        <View style={styles.stepContainer}>
            <View style={styles.headerSection}>
                <Text style={[styles.title, { color: colors.text }]}>
                    Verify Identity
                </Text>
                <Text style={[styles.subtitle, { color: colors.grayscale700 }]}>
                    Sent to{' '}
                    <Text style={{ fontWeight: 'bold', color: colors.text }}>
                        {userIdentifier}
                    </Text>
                </Text>
                <TouchableOpacity
                    onPress={() => setStep(1)}
                    style={{ marginTop: 8 }}
                >
                    <Text style={styles.editLink}>Edit Contact Info</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.otpSection}>
                <OtpInput
                    numberOfDigits={6}
                    focusColor={COLORS.primary}
                    onTextChange={setOtpCode}
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
                            height: 56,
                        },
                        pinCodeTextStyle: {
                            color: colors.text,
                            fontSize: 22,
                            fontFamily: 'bold',
                        },
                    }}
                />
            </View>

            <View style={styles.resendWrapper}>
                {countdown > 0 ? (
                    <Text style={{ color: colors.text, opacity: 0.7 }}>
                        Resend code in{' '}
                        <Text style={styles.timerText}>{countdown}s</Text>
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
        </View>
    )

    return (
        <SafeAreaView
            style={[styles.area, { backgroundColor: colors.background }]}
        >
            <Header
                title={step === 1 ? 'Sign In' : 'Verification'}
                onPress={() => (step === 1 ? navigation.goBack() : setStep(1))}
            />
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
    scrollContainer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        flexGrow: 1,
        justifyContent: 'center',
    },
    stepContainer: { width: '100%' },
    headerSection: { alignItems: 'center', marginBottom: 32 },
    logo: { width: 150, height: 150, resizeMode: 'contain', marginBottom: 16 },

    title: {
        fontSize: 28,
        fontFamily: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        fontFamily: 'regular',
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 24,
    },
    checkboxRow: { flexDirection: 'row', alignItems: 'center' },
    checkbox: { width: 20, height: 20, borderRadius: 6 },
    optionLabel: { marginLeft: 10, fontSize: 14, fontFamily: 'medium' },
    linkText: { color: COLORS.primary, fontFamily: 'bold', fontSize: 15 },
    editLink: {
        color: COLORS.primary,
        textDecorationLine: 'underline',
        fontFamily: 'medium',
    },
    mainBtn: { height: 56, borderRadius: 16, marginTop: 10 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
    otpSection: { marginVertical: 32 },
    resendWrapper: { alignItems: 'center', marginBottom: 32 },
    timerText: { color: COLORS.primary, fontFamily: 'bold' },
})

export default Login
