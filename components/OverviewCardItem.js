import React from 'react'
import { View, Text, Image, StyleSheet, Platform } from 'react-native'
import PropTypes from 'prop-types'

import { COLORS, FONTS } from '../constants'

const OverviewCardItem = ({ icon, title, value, bgColor }) => {
    return (
        <View style={[styles.card, { backgroundColor: bgColor }]}>
            <Image
                source={icon}
                style={styles.icon}
                accessibilityLabel={`${title} icon`}
                accessible
            />
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.title}>{title}</Text>
        </View>
    )
}

OverviewCardItem.propTypes = {
    icon: PropTypes.any.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    bgColor: PropTypes.string.isRequired,
}

const styles = StyleSheet.create({
    card: {
        flexBasis: '31%',
        flexGrow: 1,
        aspectRatio: 1,
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    icon: {
        width: 20,
        height: 20,
        marginBottom: 6,
        tintColor: COLORS.white,
    },
    value: {
        fontSize: 18,
        fontFamily: FONTS.bold,
        color: COLORS.white,
    },
    title: {
        fontSize: 11,
        fontFamily: FONTS.semiBold,
        color: COLORS.white,
        textAlign: 'center',
        marginTop: 3,
        lineHeight: 14,
    },
})

export default React.memo(OverviewCardItem)
// export default OverviewCardItem
