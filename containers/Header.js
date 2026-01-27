// Header.js
import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { images, COLORS, icons } from '../constants'
import { useTheme } from '../theme/ThemeProvider'
import { useSelector } from 'react-redux'

const Header = ({ navigation }) => {
    const { dark, colors } = useTheme()

    const {
        customer,
        allCustomers,
        isCustomerLoading,
        isCustomerError,
        message,
    } = useSelector((state) => state.customer)

    // console.log('customer log', customer.firstName)
    // console.log('customer phone', customer.phone)
    // console.log('customer phone', customer.phone)
    // console.log('customer ', customer.customer.firstName)

    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerLeft}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Image
                        source={images.user5}
                        resizeMode="cover"
                        style={styles.avatar}
                    />
                </TouchableOpacity>
                <Text
                    style={[
                        styles.username,
                        { color: dark ? COLORS.white : COLORS.greyscale900 },
                    ]}
                >
                    Hi, {customer?.firstName} ..!
                </Text>
            </View>
            <TouchableOpacity
                onPress={() => navigation.navigate('Notifications')}
            >
                <Image
                    source={icons.bell}
                    resizeMode="contain"
                    style={[
                        styles.bellIcon,
                        {
                            tintColor: dark
                                ? COLORS.white
                                : COLORS.greyscale900,
                        },
                    ]}
                />
                <View style={styles.noti} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    // Add all relevant header styles from Home.js here
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 8,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 20,
    },
    username: {
        fontFamily: 'semiBold',
        fontSize: 16,
        marginLeft: 12,
    },
    bellIcon: {
        width: 24,
        height: 24,
    },
    noti: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 8,
        backgroundColor: COLORS.red,
        right: 0,
        top: 0,
    },
})

export default Header
