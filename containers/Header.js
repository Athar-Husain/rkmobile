import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Platform,
} from 'react-native'
import { images, COLORS, icons } from '../constants'
import { useTheme } from '../theme/ThemeProvider'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

const Header = () => {
    const navigation = useNavigation()
    const { dark, colors } = useTheme()
    const { user } = useSelector((state) => state.auth)

    // Dynamic styles based on theme
    const iconColor = dark ? COLORS.white : COLORS.greyscale900
    const textColor = dark ? COLORS.white : COLORS.greyscale900

    // Distinguishing styles
    const backgroundColor = dark ? colors.background : COLORS.white
    // const borderBottomColor = dark ? COLORS.greyscale800 : COLORS.greyscale200

    return (
        <View
            style={[
                styles.headerContainer,
                {
                    backgroundColor: backgroundColor,
                    // borderBottomColor: borderBottomColor,
                },
            ]}
        >
            {/* LEFT: User Profile & Greeting */}
            <View style={styles.headerLeft}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Profile')}
                    activeOpacity={0.7}
                >
                    <Image
                        source={images.user5}
                        resizeMode="cover"
                        style={styles.avatar}
                    />
                </TouchableOpacity>
                <View style={styles.textContainer}>
                    <Text
                        style={[
                            styles.greeting,
                            { color: COLORS.grayscale600 },
                        ]}
                    >
                        Hello,
                    </Text>
                    <Text
                        style={[styles.username, { color: textColor }]}
                        numberOfLines={1}
                    >
                        {user?.name || 'Guest'}
                    </Text>
                </View>
            </View>

            {/* CENTER: Company Logo */}
            <View style={styles.logoContainer}>
                <Image
                    source={images.logo}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* RIGHT: Navigation Icons */}
            <View style={styles.headerRight}>
                {/* <TouchableOpacity
                    onPress={() => navigation.navigate('Notifications')}
                    style={styles.iconBtn}
                >
                    <Image
                        source={icons.bell}
                        style={[styles.bellIcon, { tintColor: iconColor }]}
                        resizeMode="contain"
                    />
                    <View
                        style={[
                            styles.notiBadge,
                            { borderColor: backgroundColor },
                        ]}
                    />
                </TouchableOpacity> */}

                <TouchableOpacity
                    onPress={() => navigation.navigate('Menu')}
                    style={styles.iconBtn}
                >
                    <Image
                        source={icons.more}
                        style={[styles.menuIcon, { tintColor: iconColor }]}
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
        paddingTop: Platform.OS === 'ios' ? 10 : 12, // Handle safe area padding
        paddingBottom: 12,
        // borderColor: '#0000006a',
        // borderBottomWidth: 1,
        // Shadow for iOS
        shadowColor: '#ffffff6a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        // Shadow for Android
        elevation: 5,
    },
    headerLeft: {
        flex: 1.2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.greyscale200,
    },
    textContainer: {
        marginLeft: 10,
    },
    greeting: {
        fontSize: 11,
        fontFamily: 'regular',
    },
    username: {
        fontFamily: 'bold',
        fontSize: 14,
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 110,
        height: 45,
    },
    headerRight: {
        flex: 1.2,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    iconBtn: {
        marginLeft: 12,
        padding: 6,
        backgroundColor: 'transparent',
    },
    menuIcon: {
        width: 24,
        height: 24,
    },
    bellIcon: {
        width: 24,
        height: 24,
    },
    notiBadge: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.red,
        right: 8,
        top: 8,
        borderWidth: 1.5,
    },
})

export default Header
