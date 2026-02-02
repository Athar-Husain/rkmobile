import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Alert,
    ScrollView,
} from 'react-native'
import { useTheme } from '../theme/ThemeProvider'
import Input from '../components/Input'
import Button from '../components/Button'
import { COLORS } from '../constants'
// import { completeSignup } from '../api/auth' // your API function

const FinalSignupScreen = ({ navigation, route }) => {
    const { colors } = useTheme()
    // const { signupData, otp_token } = route.params

    const [loading, setLoading] = useState(false)

    // Optional: You can ask user to fill additional details here
    // For now, we'll just complete the signup

    const handleFinalSignup = async () => {
        try {
            setLoading(true)

            const payload = {
                ...signupData,
                otp_token,
            }

            const response = await completeSignup(payload)

            if (response.success) {
                Alert.alert('Success', 'Account created successfully!')
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }], // or 'Login' if you want
                })
            } else {
                Alert.alert('Error', response.message || 'Signup failed')
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        Complete Signup
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.text }]}>
                        Almost done! Click below to create your account.
                    </Text>

                    <Button
                        title={
                            loading ? 'Creating Account...' : 'Create Account'
                        }
                        filled
                        onPress={handleFinalSignup}
                        disabled={loading}
                        style={styles.button}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 16 },
    content: { alignItems: 'center' },
    title: { fontSize: 20, fontFamily: 'semiBold', marginBottom: 8 },
    subtitle: {
        fontSize: 14,
        fontFamily: 'regular',
        textAlign: 'center',
        marginBottom: 24,
    },
    button: { width: '100%', borderRadius: 28 },
})

export default FinalSignupScreen
