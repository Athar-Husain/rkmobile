import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { useTheme } from '../../theme/ThemeProvider'
import { images, COLORS, icons, SIZES } from '../../constants'

const Header = () => {
    const navigation = useNavigation()
    const { dark, colors } = useTheme()

    // Get user data from Redux if available, otherwise fallback to "Joanna"
    const user = useSelector((state) => state.auth?.user)
    const firstName = user?.firstName || 'Joanna'

    /**
     * Professional Touch: Dynamic Greeting
     */
    const greeting = useMemo(() => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good Morning'
        if (hour < 18) return 'Good Afternoon'
        return 'Good Evening'
    }, [])

    return (
        <View
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <View style={styles.headerLeft}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('Profile')}
                    style={styles.avatarWrapper}
                >
                    <Image
                        source={
                            user?.profileImage
                                ? { uri: user.profileImage }
                                : images.user5
                        }
                        resizeMode="cover"
                        style={styles.avatar}
                    />
                    {/* Online Status Indicator */}
                    <View style={styles.onlineDot} />
                </TouchableOpacity>

                <View style={styles.textColumn}>
                    <Text
                        style={[
                            styles.greeting,
                            { color: colors.grayscale700 },
                        ]}
                    >
                        {greeting},
                    </Text>
                    <Text style={[styles.username, { color: colors.text }]}>
                        {firstName}! 👋
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                activeOpacity={0.7}
                style={[
                    styles.iconBtn,
                    {
                        backgroundColor: dark
                            ? COLORS.dark3
                            : COLORS.secondaryWhite,
                        borderColor: dark ? COLORS.dark3 : '#F1F1F1',
                    },
                ]}
                onPress={() => navigation.navigate('Notifications')}
            >
                <Image
                    source={icons.bell}
                    resizeMode="contain"
                    style={[styles.bellIcon, { tintColor: colors.text }]}
                />
                {/* Notification Badge */}
                <View style={styles.notiBadge} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 15,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 18, // Slightly squared-round for a modern premium look
        borderWidth: 1.5,
        borderColor: COLORS.primary,
    },
    onlineDot: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4ADE80', // Modern emerald green
        borderWidth: 2,
        borderColor: '#FFF',
    },
    textColumn: {
        marginLeft: 15,
    },
    greeting: {
        fontSize: 13,
        fontFamily: 'regular',
        marginBottom: -2,
    },
    username: {
        fontFamily: 'bold',
        fontSize: 18,
    },
    iconBtn: {
        width: 48,
        height: 48,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    bellIcon: {
        width: 22,
        height: 22,
    },
    notiBadge: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.red,
        right: 12,
        top: 12,
        borderWidth: 2,
        borderColor: '#FFF',
    },
})

export default Header
