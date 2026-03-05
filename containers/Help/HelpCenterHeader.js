import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { COLORS, icons } from '../../constants'

const HelpCenterHeader = ({ onBackPress, dark }) => {
    // Professional color palette: Avoid pure black/white for text where possible
    const titleColor = dark ? '#FFFFFF' : '#1A1A1E'
    const iconColor = dark ? '#EBEBF5' : '#3C3C43'
    // Subtle background for buttons
    const btnBg = dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'

    return (
        <View
            style={[
                styles.container,
                { borderBottomColor: dark ? '#2C2C2E' : '#F2F2F7' },
            ]}
        >
            <TouchableOpacity
                onPress={onBackPress}
                activeOpacity={0.7}
                style={[styles.btn, { backgroundColor: btnBg }]}
            >
                <Image
                    source={icons.back}
                    style={[styles.icon, { tintColor: iconColor }]}
                />
            </TouchableOpacity>

            <View style={styles.titleWrapper}>
                <Text style={[styles.title, { color: titleColor }]}>
                    Help Center
                </Text>
                {/* Optional: Tiny indicator of "Giant" quality - a subtitle or status */}
                <Text style={styles.subtitle}>How can we help today?</Text>
            </View>

            <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.btn, { backgroundColor: btnBg }]}
            >
                <Image
                    source={icons.moreCircle}
                    style={[styles.icon, { tintColor: iconColor }]}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20, // Increased for a more spacious feel
        paddingVertical: 16,
        borderBottomWidth: 1, // Adds a premium "divider" look
    },
    titleWrapper: {
        alignItems: 'center',
        flex: 1,
    },
    btn: {
        width: 44, // Standard Apple touch target size
        height: 44,
        borderRadius: 14, // Slightly smoother curve
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        height: 22,
        width: 22,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 17, // Classic iOS header size
        fontWeight: '700',
        letterSpacing: -0.4,
    },
    subtitle: {
        fontSize: 11,
        color: '#8E8E93',
        fontWeight: '500',
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
})

export default HelpCenterHeader
