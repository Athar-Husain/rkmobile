import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, icons, images } from '../constants'
import { useTheme } from '../theme/ThemeProvider'
import Button from '../components/Button'
import ResetOnboardingButton from '../components/ResetOnboardingButton'

const Welcome = ({ navigation }) => {
    const { colors, dark } = useTheme()

    return (
        <SafeAreaView
            style={[styles.area, { backgroundColor: colors.background }]}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    {/* Logo Section */}
                    <Image
                        source={images.logo}
                        resizeMode="contain"
                        style={[
                            styles.logo,
                            // { tintColor: colors.primary }
                        ]}
                    />
                    <Text style={[styles.title, { color: colors.text }]}>
                        RK Electronics
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
                        Discover premium electronics and expert services from
                        around the world at your fingertips.
                    </Text>

                    {/* Primary Action Buttons */}
                    <View style={styles.buttonGroup}>
                        <Button
                            title="Sign In"
                            onPress={() => navigation.navigate('Login')}
                            filled
                            style={styles.mainBtn}
                        />
                        <TouchableOpacity
                            style={[
                                styles.outlineBtn,
                                { borderColor: colors.primary },
                            ]}
                            onPress={() => navigation.navigate('Signup')}
                        >
                            <Text
                                style={[
                                    styles.outlineBtnText,
                                    { color: colors.primary },
                                ]}
                            >
                                Create Account
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Staff Login Link */}
                    <TouchableOpacity
                        style={styles.staffLinkContainer}
                        onPress={() => navigation.navigate('LoginStaff')}
                    >
                        <Text
                            style={[
                                styles.loginTitle,
                                { color: dark ? COLORS.white : COLORS.black },
                            ]}
                        >
                            Are you a team member?{' '}
                        </Text>
                        <Text style={styles.loginSubtitle}>Staff Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Footer Legal Section */}
            <View style={styles.footer}>
                <View style={styles.legalWrapper}>
                    <Text
                        style={[
                            styles.bottomTitle,
                            {
                                color: dark
                                    ? COLORS.grayscale400
                                    : COLORS.grayscale700,
                            },
                        ]}
                    >
                        By continuing, you accept the{' '}
                    </Text>
                    <TouchableOpacity onPress={() => {}}>
                        <Text
                            style={[styles.legalLink, { color: colors.text }]}
                        >
                            Terms of Use
                        </Text>
                    </TouchableOpacity>
                    <Text
                        style={[
                            styles.bottomTitle,
                            {
                                color: dark
                                    ? COLORS.grayscale400
                                    : COLORS.grayscale700,
                            },
                        ]}
                    >
                        {' '}
                        &{' '}
                    </Text>
                    <TouchableOpacity onPress={() => {}}>
                        <Text
                            style={[styles.legalLink, { color: colors.text }]}
                        >
                            Privacy Policy
                        </Text>
                    </TouchableOpacity>
                </View>
                <ResetOnboardingButton />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: { flex: 1 },
    scrollContainer: { flexGrow: 1, justifyContent: 'center' },
    content: {
        paddingHorizontal: 24,
        alignItems: 'center',
        paddingVertical: 40,
    },
    logo: { width: 200, height: 200, marginBottom: 15 },
    title: {
        fontSize: 32,
        fontFamily: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'regular',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    buttonGroup: { width: '100%', marginVertical: 40, gap: 16 },
    mainBtn: { width: '100%', height: 56, borderRadius: 16 },
    outlineBtn: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    outlineBtnText: { fontSize: 18, fontFamily: 'semiBold' },
    staffLinkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    loginTitle: { fontSize: 15, fontFamily: 'regular' },
    loginSubtitle: {
        fontSize: 15,
        fontFamily: 'semiBold',
        color: COLORS.primary,
    },
    footer: { paddingHorizontal: 24, paddingBottom: 20, alignItems: 'center' },
    legalWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 16,
    },
    bottomTitle: { fontSize: 12, fontFamily: 'regular' },
    legalLink: {
        fontSize: 12,
        fontFamily: 'medium',
        textDecorationLine: 'underline',
    },
})

export default Welcome
