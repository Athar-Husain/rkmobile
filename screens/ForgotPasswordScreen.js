import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'

// Components
import Header from '../../components/Header'
import Input from '../../components/Input'
import Button from '../../components/Button'

// Constants
import { COLORS, SIZES, icons } from '../../constants'
import { useTheme } from '../../theme/ThemeProvider'

// Form handling
import { useForm, Controller } from 'react-hook-form'

// API
import api from '../../services/api'

const ForgotPasswordScreen = () => {
    const navigation = useNavigation()
    const { colors, dark } = useTheme()
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1) // 1: Enter email/mobile, 2: Enter OTP, 3: Reset password
    const [resetToken, setResetToken] = useState(null)

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            emailOrMobile: '',
            otp: '',
            newPassword: '',
            confirmPassword: '',
        },
    })

    const handleSendResetCode = async (data) => {
        setLoading(true)
        try {
            const response = await api.post('/auth/forgot-password', {
                emailOrMobile: data.emailOrMobile.trim(),
            })

            if (response.data.success) {
                setResetToken(response.data.resetToken)
                setStep(2)
                Alert.alert('Success', 'Reset code sent to your email/mobile')
            } else {
                Alert.alert(
                    'Error',
                    response.data.message || 'Failed to send reset code'
                )
            }
        } catch (error) {
            console.error('Forgot password error:', error)
            Alert.alert(
                'Error',
                error.response?.data?.message ||
                    'Network error. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOTP = async (data) => {
        setLoading(true)
        try {
            // In this flow, OTP verification is done during reset password
            setStep(3)
        } catch (error) {
            Alert.alert('Error', 'Please check the OTP and try again')
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async (data) => {
        if (data.newPassword !== data.confirmPassword) {
            Alert.alert('Error', 'Passwords do not match')
            return
        }

        if (data.newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters')
            return
        }

        setLoading(true)
        try {
            const response = await api.post('/auth/reset-password', {
                resetToken,
                otp: data.otp,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            })

            if (response.data.success) {
                Alert.alert('Success', 'Password reset successfully!', [
                    {
                        text: 'Sign In',
                        onPress: () => navigation.navigate('Signin'),
                    },
                ])
            } else {
                Alert.alert(
                    'Error',
                    response.data.message || 'Failed to reset password'
                )
            }
        } catch (error) {
            console.error('Reset password error:', error)
            Alert.alert(
                'Error',
                error.response?.data?.message ||
                    'Network error. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    const renderStep1 = () => (
        <>
            <Text style={[styles.title, { color: colors.text }]}>
                Forgot Password?
            </Text>
            <Text style={[styles.subtitle, { color: colors.text }]}>
                Enter your email or mobile number to receive a reset code
            </Text>

            <Controller
                control={control}
                name="emailOrMobile"
                rules={{
                    required: 'Email or mobile number is required',
                    validate: (value) => {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        const mobileRegex = /^[6-9]\d{9}$/
                        return (
                            emailRegex.test(value) ||
                            mobileRegex.test(value) ||
                            'Invalid email or mobile number'
                        )
                    },
                }}
                render={({ field: { onChange, value } }) => (
                    <Input
                        placeholder="Email or Mobile Number"
                        icon={icons.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={value}
                        onInputChanged={(_, val) => onChange(val)}
                        errorText={errors.emailOrMobile?.message}
                        containerStyle={styles.inputContainer}
                    />
                )}
            />

            <Button
                title={loading ? 'Sending...' : 'Send Reset Code'}
                filled
                onPress={handleSubmit(handleSendResetCode)}
                style={styles.button}
                disabled={loading}
            />
        </>
    )

    const renderStep2 = () => (
        <>
            <Text style={[styles.title, { color: colors.text }]}>
                Enter Reset Code
            </Text>
            <Text style={[styles.subtitle, { color: colors.text }]}>
                Enter the 6-digit code sent to your email/mobile
            </Text>

            <Controller
                control={control}
                name="otp"
                rules={{
                    required: 'Reset code is required',
                    pattern: {
                        value: /^\d{6}$/,
                        message: 'Enter 6-digit code',
                    },
                }}
                render={({ field: { onChange, value } }) => (
                    <Input
                        placeholder="6-digit Code"
                        icon={icons.lock}
                        keyboardType="number-pad"
                        maxLength={6}
                        value={value}
                        onInputChanged={(_, val) => onChange(val)}
                        errorText={errors.otp?.message}
                        containerStyle={styles.inputContainer}
                    />
                )}
            />

            <Button
                title={loading ? 'Verifying...' : 'Verify Code'}
                filled
                onPress={handleSubmit(handleVerifyOTP)}
                style={styles.button}
                disabled={loading}
            />
        </>
    )

    const renderStep3 = () => (
        <>
            <Text style={[styles.title, { color: colors.text }]}>
                Reset Password
            </Text>
            <Text style={[styles.subtitle, { color: colors.text }]}>
                Enter your new password
            </Text>

            <Controller
                control={control}
                name="newPassword"
                rules={{
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                }}
                render={({ field: { onChange, value } }) => (
                    <Input
                        placeholder="New Password"
                        icon={icons.padlock}
                        secureTextEntry
                        value={value}
                        onInputChanged={(_, val) => onChange(val)}
                        errorText={errors.newPassword?.message}
                        containerStyle={styles.inputContainer}
                    />
                )}
            />

            <Controller
                control={control}
                name="confirmPassword"
                rules={{
                    required: 'Please confirm your password',
                    validate: (value) =>
                        value === watch('newPassword') ||
                        'Passwords do not match',
                }}
                render={({ field: { onChange, value } }) => (
                    <Input
                        placeholder="Confirm Password"
                        icon={icons.padlock}
                        secureTextEntry
                        value={value}
                        onInputChanged={(_, val) => onChange(val)}
                        errorText={errors.confirmPassword?.message}
                        containerStyle={styles.inputContainer}
                    />
                )}
            />

            <Button
                title={loading ? 'Resetting...' : 'Reset Password'}
                filled
                onPress={handleSubmit(handleResetPassword)}
                style={styles.button}
                disabled={loading}
            />
        </>
    )

    return (
        <SafeAreaView
            style={[styles.area, { backgroundColor: colors.background }]}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <Header
                        title="Reset Password"
                        onPress={() => {
                            if (step === 1) {
                                navigation.goBack()
                            } else {
                                setStep(step - 1)
                            }
                        }}
                    />

                    <View style={styles.content}>
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}

                        {step > 1 && (
                            <TouchableOpacity
                                onPress={() => setStep(1)}
                                style={styles.backLink}
                            >
                                <Text
                                    style={[
                                        styles.backLinkText,
                                        { color: colors.text },
                                    ]}
                                >
                                    ← Back to start
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            onPress={() => navigation.navigate('Signin')}
                            style={styles.signinLink}
                        >
                            <Text
                                style={[
                                    styles.signinLinkText,
                                    { color: colors.primary },
                                ]}
                            >
                                Remember password? Sign in
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: 25,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
        opacity: 0.7,
        lineHeight: 22,
    },
    inputContainer: {
        marginBottom: 20,
    },
    button: {
        borderRadius: 25,
        height: 50,
        marginTop: 10,
    },
    backLink: {
        marginTop: 25,
        alignItems: 'center',
    },
    backLinkText: {
        fontSize: 14,
        opacity: 0.7,
    },
    signinLink: {
        marginTop: 30,
        alignItems: 'center',
    },
    signinLinkText: {
        fontSize: 14,
        fontWeight: '600',
    },
})

export default ForgotPasswordScreen
