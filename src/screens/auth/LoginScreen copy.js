import React, { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Image,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { login } from '../../store/slices/authSlice'

const LoginScreen = ({ navigation }) => {
    const dispatch = useDispatch()
    const { loading, error } = useSelector((state) => state.auth)
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        try {
            await dispatch(login(data)).unwrap()
            // Navigation handled by AppNavigator based on auth state
        } catch (err) {
            Alert.alert(
                'Login Failed',
                err.message || 'Please check your credentials'
            )
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Logo/Header */}
            <View style={styles.header}>
                <Text style={styles.title}>RK Electronics</Text>
                <Text style={styles.subtitle}>Mobile Application</Text>
            </View>

            {/* Login Form */}
            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Login</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mobile Number</Text>
                    <Controller
                        control={control}
                        name="mobile"
                        rules={{
                            required: 'Mobile number is required',
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: 'Enter a valid 10-digit mobile number',
                            },
                        }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[
                                    styles.input,
                                    errors.mobile && styles.inputError,
                                ]}
                                placeholder="Enter mobile number"
                                keyboardType="phone-pad"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {errors.mobile && (
                        <Text style={styles.errorText}>
                            {errors.mobile.message}
                        </Text>
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <Controller
                        control={control}
                        name="password"
                        rules={{
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message:
                                    'Password must be at least 6 characters',
                            },
                        }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={[
                                    styles.input,
                                    errors.password && styles.inputError,
                                ]}
                                placeholder="Enter password"
                                secureTextEntry
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {errors.password && (
                        <Text style={styles.errorText}>
                            {errors.password.message}
                        </Text>
                    )}
                </View>

                {/* Location Fields (from your image) */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Location</Text>
                    <Controller
                        control={control}
                        name="location"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your location"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>City</Text>
                    <Controller
                        control={control}
                        name="city"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your city"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                </View>

                {/* Forgot Password */}
                <TouchableOpacity
                    style={styles.forgotPassword}
                    onPress={() => navigation.navigate('ForgotPassword')}
                >
                    <Text style={styles.forgotPasswordText}>
                        Forgot Password?
                    </Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                    style={[
                        styles.loginButton,
                        loading && styles.buttonDisabled,
                    ]}
                    onPress={handleSubmit(onSubmit)}
                    disabled={loading}
                >
                    <Text style={styles.loginButtonText}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Text>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>
                        Don't have an account?{' '}
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Signup')}
                    >
                        <Text style={styles.signupLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginVertical: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    subtitle: {
        fontSize: 16,
        color: '#7f8c8d',
        marginTop: 5,
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    formTitle: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 20,
        color: '#2c3e50',
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 5,
        color: '#34495e',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f8f9fa',
    },
    inputError: {
        borderColor: '#e74c3c',
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 12,
        marginTop: 5,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: '#3498db',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#3498db',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonDisabled: {
        backgroundColor: '#bdc3c7',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    signupText: {
        color: '#7f8c8d',
        fontSize: 14,
    },
    signupLink: {
        color: '#3498db',
        fontSize: 14,
        fontWeight: '600',
    },
})

export default LoginScreen
