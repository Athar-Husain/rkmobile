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
    ActivityIndicator,
    Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Device from 'expo-device'

// Components
import Header from '../../components/Header'
import Input from '../../components/Input'
import Button from '../../components/Button'

// Constants
import { COLORS, SIZES, icons, images } from '../../constants'
import { useTheme } from '../../theme/ThemeProvider'

// Form handling
import { useForm, Controller } from 'react-hook-form'
import Checkbox from 'expo-checkbox'

// API
import api from '../../services/api'

const SigninScreen = () => {
    const navigation = useNavigation()
    const { colors, dark } = useTheme()
    const [loading, setLoading] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [deviceToken, setDeviceToken] = useState(null)

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            emailOrMobile: '',
            password: '',
        },
    })

    // Load remembered credentials
    useEffect(() => {
        loadRememberedCredentials()
    }, [])

    const loadRememberedCredentials = async () => {
        try {
            const remembered = await AsyncStorage.getItem('rememberedUser')
            if (remembered) {
                const { emailOrMobile, password } = JSON.parse(remembered)
                setValue('emailOrMobile', emailOrMobile)
                setValue('password', password)
                setRememberMe(true)
            }
        } catch (error) {
            console.error('Failed to load remembered credentials:', error)
        }
    }

    const handleSignin = async (data) => {
        setLoading(true)
        try {
            // Get device info
            const deviceId = Device.osBuildId || 'unknown'

            const payload = {
                emailOrMobile: data.emailOrMobile.trim(),
                password: data.password,
                deviceToken,
                platform: Platform.OS,
                deviceId,
            }

            const response = await api.post('/auth/signin', payload)

            if (response.data.success) {
                // Store tokens and user data
                await AsyncStorage.setItem('token', response.data.token)
                await AsyncStorage.setItem(
                    'refreshToken',
                    response.data.refreshToken
                )
                await AsyncStorage.setItem(
                    'user',
                    JSON.stringify(response.data.user)
                )

                // Remember credentials if checked
                if (rememberMe) {
                    await AsyncStorage.setItem(
                        'rememberedUser',
                        JSON.stringify({
                            emailOrMobile: data.emailOrMobile,
                            password: data.password,
                        })
                    )
                } else {
                    await AsyncStorage.removeItem('rememberedUser')
                }

                // Navigate to main app
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainTabs' }],
                })
            } else {
                Alert.alert('Error', response.data.message || 'Sign in failed')
            }
        } catch (error) {
            console.error('Signin error:', error)

            let errorMessage = 'Network error. Please try again.'

            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        errorMessage = 'Invalid email/mobile or password'
                        break
                    case 403:
                        errorMessage = 'Account is deactivated or blocked'
                        break
                    case 423:
                        errorMessage = 'Account locked. Please try again later.'
                        break
                    default:
                        errorMessage =
                            error.response.data?.message || 'Sign in failed'
                }
            }

            Alert.alert('Error', errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleForgotPassword = () => {
        navigation.navigate('ForgotPassword')
    }

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
                        title="Welcome Back"
                        onPress={() => navigation.goBack()}
                    />

                    <View style={styles.logoContainer}>
                        <Image source={images.logo} style={styles.logo} />
                        <Text
                            style={[styles.welcomeText, { color: colors.text }]}
                        >
                            Sign in to continue
                        </Text>
                    </View>

                    {/* Email/Mobile */}
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

                    {/* Password */}
                    <Controller
                        control={control}
                        name="password"
                        rules={{ required: 'Password is required' }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder="Password"
                                icon={icons.padlock}
                                secureTextEntry={!showPassword}
                                value={value}
                                onInputChanged={(_, val) => onChange(val)}
                                errorText={errors.password?.message}
                                containerStyle={styles.inputContainer}
                                rightIcon={
                                    showPassword ? icons.eye : icons.eyeClosed
                                }
                                onRightIconPress={() =>
                                    setShowPassword(!showPassword)
                                }
                            />
                        )}
                    />

                    {/* Remember Me & Forgot Password */}
                    <View style={styles.optionsContainer}>
                        <TouchableOpacity
                            style={styles.rememberContainer}
                            onPress={() => setRememberMe(!rememberMe)}
                        >
                            <Checkbox
                                value={rememberMe}
                                color={
                                    rememberMe ? COLORS.primary : colors.border
                                }
                                style={styles.checkbox}
                            />
                            <Text
                                style={[
                                    styles.rememberText,
                                    { color: colors.text },
                                ]}
                            >
                                Remember me
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleForgotPassword}>
                            <Text style={styles.forgotText}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Signin Button */}
                    <Button
                        title={loading ? 'Signing In...' : 'Sign In'}
                        filled
                        onPress={handleSubmit(handleSignin)}
                        style={styles.button}
                        disabled={loading}
                    />

                    {/* Social Login (Optional) */}
                    <View style={styles.socialContainer}>
                        <Text
                            style={[styles.socialText, { color: colors.text }]}
                        >
                            Or sign in with
                        </Text>
                        <View style={styles.socialButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.socialButton,
                                    { backgroundColor: colors.card },
                                ]}
                            >
                                <Image
                                    source={icons.google}
                                    style={styles.socialIcon}
                                />
                                <Text
                                    style={[
                                        styles.socialButtonText,
                                        { color: colors.text },
                                    ]}
                                >
                                    Google
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.socialButton,
                                    { backgroundColor: colors.card },
                                ]}
                            >
                                <Image
                                    source={icons.facebook}
                                    style={styles.socialIcon}
                                />
                                <Text
                                    style={[
                                        styles.socialButtonText,
                                        { color: colors.text },
                                    ]}
                                >
                                    Facebook
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Signup Link */}
                    <View style={styles.signupContainer}>
                        <Text
                            style={[styles.signupText, { color: colors.text }]}
                        >
                            Don't have an account?{' '}
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Signup')}
                        >
                            <Text style={styles.signupLink}>Sign Up</Text>
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
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    logoContainer: {
        alignItems: 'center',
        marginVertical: 30,
    },
    logo: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        marginBottom: 15,
    },
    welcomeText: {
        fontSize: 18,
        opacity: 0.8,
    },
    inputContainer: {
        marginBottom: 20,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    rememberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        marginRight: 10,
        width: 20,
        height: 20,
        borderRadius: 4,
    },
    rememberText: {
        fontSize: 14,
    },
    forgotText: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
    },
    button: {
        borderRadius: 25,
        height: 50,
        marginBottom: 25,
    },
    socialContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    socialText: {
        fontSize: 14,
        marginBottom: 15,
        opacity: 0.7,
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    socialIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
        resizeMode: 'contain',
    },
    socialButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signupText: {
        fontSize: 14,
    },
    signupLink: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
    },
})

export default SigninScreen
