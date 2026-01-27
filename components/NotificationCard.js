import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '../constants'
import { getTimeAgo } from '../utils/date'
import { useTheme } from '../theme/ThemeProvider'

const NotificationCard = ({
    icon,
    title,
    description,
    date,
    onPress,
    isRead,
}) => {
    const { colors, dark } = useTheme()

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor: isRead
                        ? colors.background
                        : dark
                          ? COLORS.dark2
                          : COLORS.grayscale100,
                },
            ]}
            onPress={onPress}
        >
            <View style={styles.leftContainer}>
                <View
                    style={[
                        styles.iconContainer,
                        {
                            backgroundColor: dark
                                ? COLORS.dark3
                                : COLORS.grayscale200,
                        },
                    ]}
                >
                    <Image
                        source={icon}
                        resizeMode="cover"
                        style={[
                            styles.icon,
                            {
                                tintColor: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    />
                </View>
                <View style={styles.textWrapper}>
                    <Text
                        style={[
                            styles.title,
                            {
                                color: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    >
                        {title}
                    </Text>
                    <Text
                        style={[
                            styles.description,
                            { color: colors.textSecondary },
                        ]}
                    >
                        {description}
                    </Text>
                </View>
            </View>
            <View style={styles.rightContainer}>
                <Text style={[styles.date, { color: colors.textSecondary }]}>
                    {getTimeAgo(date)}
                </Text>
                {/* Unread dot indicator */}
                {!isRead && <View style={styles.unreadDot} />}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        marginVertical: 6, // Adjusted for spacing
        borderRadius: 12, // Added to match modern UI
        width: SIZES.width - 32,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        height: 48, // Increased size
        width: 48, // Increased size
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
        marginRight: 12,
    },
    icon: {
        width: 24, // Increased size
        height: 24, // Increased size
    },
    textWrapper: {
        flex: 1,
        marginRight: 10, // Added to prevent text from overflowing into the right side
    },
    title: {
        fontSize: 16, // Increased font size
        fontFamily: 'medium',
        color: COLORS.black,
        marginBottom: 4, // Adjusted spacing
    },
    description: {
        fontSize: 14,
        fontFamily: 'regular',
        color: 'gray', // Using COLORS from theme for consistency
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    date: {
        fontSize: 12,
        fontFamily: 'regular',
        color: 'gray', // Using COLORS from theme
        marginRight: 8,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
    },
})

export default NotificationCard
