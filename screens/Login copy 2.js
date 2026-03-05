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
import { OtpInput } from 'react-native-otp-entry'
import { useForm, Controller } from 'react-hook-form'
import { COLORS } from '../constants'

// ... Keep your other imports (Redux, Theme, etc.)

const Login = () => {
    // ... Keep your states (isLoading, step, etc.)

    const renderStep1 = () => (
        <View style={styles.fadeContainer}>
            <View style={styles.logoContainer}>
                <Image source={images.logo} style={styles.logo} />
                <Text style={[styles.title, { color: colors.text }]}>
                    Welcome Back
                </Text>
                <Text style={[styles.subtitle, { color: colors.grayscale700 }]}>
                    Enter your details to receive an OTP
                </Text>
            </View>

            <Controller
                control={control}
                name="emailOrMobile"
                rules={{ required: 'Email or Mobile is required' }}
                render={({ field: { onChange, value } }) => (
                    <Input
                        placeholder="Email or Mobile Number"
                        icon={icons.user}
                        value={value}
                        onInputChanged={(_, v) => onChange(v)}
                        errorText={errors.emailOrMobile?.message}
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
            </View>

            <Button
                title={loading ? 'Sending...' : 'Get OTP'}
                onPress={handleSubmit(handleSendOTP)}
                filled
                style={styles.mainBtn}
            />
        </View>
    )

    const renderStep2 = () => (
        <View style={styles.fadeContainer}>
            <View style={styles.logoContainer}>
                <Text style={[styles.title, { color: colors.text }]}>
                    Verify Identity
                </Text>
                <Text style={[styles.subtitle, { color: colors.grayscale700 }]}>
                    We sent a code to{' '}
                    <Text style={{ fontWeight: '700', color: colors.text }}>
                        {userIdentifier}
                    </Text>
                </Text>
                {/* BIG APP FEATURE: Allow user to go back and fix their email/phone */}
                <TouchableOpacity onPress={() => setStep(1)}>
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
                            width: SIZES.width / 8, // Responsive width
                            height: 56,
                            borderRadius: 12,
                        },
                        pinCodeTextStyle: { color: colors.text, fontSize: 20 },
                    }}
                />
            </View>

            <View style={styles.resendWrapper}>
                {countdown > 0 ? (
                    <Text style={{ color: colors.text }}>
                        Resend in{' '}
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
                title={loading ? 'Verifying...' : 'Finish Login'}
                onPress={handleVerifyOTP}
                filled
                disabled={otpCode.length < 6}
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
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {step === 1 ? renderStep1() : renderStep2()}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    // ... keep your existing styles ...
    editLink: {
        color: COLORS.primary,
        fontFamily: 'medium',
        marginTop: 8,
        textDecorationLine: 'underline',
    },
    timerText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    fadeContainer: {
        width: '100%',
        animation: 'fadeIn 0.5s', // Logical animation
    },
})

