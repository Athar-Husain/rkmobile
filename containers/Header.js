import React, { useMemo } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Platform,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { images, COLORS, icons } from '../constants'
import { useTheme } from '../theme/ThemeProvider'

const Header = () => {
    const navigation = useNavigation()
    const insets = useSafeAreaInsets()
    const { dark, colors } = useTheme()
    const { user } = useSelector((state) => state.auth)

    // 1. Dynamic Greeting Logic
    const greeting = useMemo(() => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good Morning'
        if (hour < 17) return 'Good Afternoon'
        return 'Good Evening'
    }, [])

    // 2. Theme-Based Calculations
    const iconColor = colors.text
    const backgroundColor = colors.background

    return (
        <View
            style={[
                styles.headerContainer,
                {
                    backgroundColor: backgroundColor,
                    paddingTop: insets.top > 0 ? insets.top : 12, // Native Safe Area Handling
                    borderBottomColor: dark
                        ? COLORS.dark3
                        : COLORS.grayscale200,
                },
            ]}
        >
            {/* LEFT: User Identity */}
            <View style={styles.headerLeft}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Profile')}
                    activeOpacity={0.8}
                    style={styles.avatarWrapper}
                >
                    <Image
                        source={
                            user?.profileImage
                                ? { uri: user.profileImage }
                                : images.user5
                        }
                        resizeMode="cover"
                        style={[
                            styles.avatar,
                            {
                                borderColor: dark
                                    ? COLORS.dark3
                                    : COLORS.grayscale200,
                            },
                        ]}
                    />
                    <View style={styles.onlineStatus} />
                </TouchableOpacity>
                <View style={styles.textContainer}>
                    <Text
                        style={[
                            styles.greeting,
                            { color: colors.grayscale700 },
                        ]}
                    >
                        {greeting},
                    </Text>
                    <Text
                        style={[styles.username, { color: colors.text }]}
                        numberOfLines={1}
                    >
                        {user?.name?.split(' ')[0] || 'Guest'}
                    </Text>
                </View>
            </View>

            {/* CENTER: Branding */}
            <View style={styles.logoContainer}>
                <Image
                    source={images.logo}
                    style={[
                        styles.logo,
                        { tintColor: dark ? COLORS.white : undefined },
                    ]}
                    resizeMode="contain"
                />
            </View>

            {/* RIGHT: Actions */}
            <View style={styles.headerRight}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Notifications')}
                    activeOpacity={0.7}
                    style={[
                        styles.iconBtn,
                        {
                            backgroundColor: dark
                                ? COLORS.dark2
                                : COLORS.secondaryWhite,
                        },
                    ]}
                >
                    <Image
                        source={icons.bell}
                        style={[styles.icon, { tintColor: iconColor }]}
                        resizeMode="contain"
                    />
                    <View
                        style={[
                            styles.notiBadge,
                            { borderColor: backgroundColor },
                        ]}
                    />
                </TouchableOpacity>
                {/* <Text>
                    checking
                </Text> */}

                <TouchableOpacity
                    onPress={() => navigation.navigate('Menu')}
                    activeOpacity={0.7}
                    style={[
                        styles.iconBtn,
                        {
                            backgroundColor: dark
                                ? COLORS.dark2
                                : COLORS.secondaryWhite,
                        },
                    ]}
                >
                    <Image
                        source={icons.more}
                        style={[styles.icon, { tintColor: iconColor }]}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 12,
        // Elevation/Shadow for a "Floating" feel
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderBottomWidth: 0.5,
    },
    headerLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 14,
        borderWidth: 1,
    },
    onlineStatus: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4ADE80',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    textContainer: {
        marginLeft: 10,
    },
    greeting: {
        fontSize: 10,
        fontFamily: 'medium',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    username: {
        fontFamily: 'bold',
        fontSize: 15,
        marginTop: -2,
    },
    logoContainer: {
        flex: 0.8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 90,
        height: 35,
    },
    headerRight: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    icon: {
        width: 20,
        height: 20,
    },
    notiBadge: {
        position: 'absolute',
        width: 9,
        height: 9,
        borderRadius: 4.5,
        backgroundColor: COLORS.red,
        right: 10,
        top: 10,
        borderWidth: 1.5,
    },
})

export default Header
