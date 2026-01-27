import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { COLORS, icons } from '../../constants'

const HelpCenterHeader = ({ onBackPress, dark }) => {
    const iconColor = dark ? COLORS.white : COLORS.greyscale900
    const titleColor = dark ? COLORS.white : COLORS.greyscale900

    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerLeft}>
                <TouchableOpacity onPress={onBackPress}>
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={[styles.backIcon, { tintColor: iconColor }]}
                    />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: titleColor }]}>
                    Help Center
                </Text>
            </View>
            <TouchableOpacity>
                <Image
                    source={icons.moreCircle}
                    resizeMode="contain"
                    style={[styles.moreIcon, { tintColor: iconColor }]}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        height: 24,
        width: 24,
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'bold',
    },
    moreIcon: {
        width: 24,
        height: 24,
    },
})

export default HelpCenterHeader
