// components/UserConnectionSection.js

import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from '../../theme/ThemeProvider'
import { COLORS } from '../../constants'
import { useDispatch, useSelector } from 'react-redux'
import { getActiveConnection } from '../../redux/features/Connection/ConnectionSlice'

const UserConnectionSection = ({ onPress }) => {
    const { dark } = useTheme()
    const dispatch = useDispatch()

    const customer = useSelector((state) => state.customer.customer)
    const connection = useSelector((state) => state.connection.connection)
    const networkStatus = useSelector((state) => state.connection.networkStatus)

    const [showAlert, setShowAlert] = useState(true)

    useEffect(() => {
        dispatch(getActiveConnection())
    }, [dispatch])

    useEffect(() => {
        // Show alert again if network status changes to a problem
        if (networkStatus !== 'Good') {
            setShowAlert(true)
        }
    }, [networkStatus])

    const getStatusMessage = () => {
        switch (networkStatus) {
            case 'Low':
                return 'Network is currently low. We are working on fixing it.'
            case 'Moderate':
                return 'Network performance is moderate in your area.'
            case 'Down':
                return 'There is a service outage in your area. We apologize for the inconvenience.'
            default:
                return ''
        }
    }

    const getBannerColor = (status) => {
        switch (status) {
            case 'Down':
                return COLORS.red
            case 'Low':
                return COLORS.yellow
            case 'Moderate':
                return COLORS.orange
            default:
                return COLORS.blue
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.welcomeContainer}>
                <Text
                    style={[
                        styles.welcomeText,
                        { color: dark ? COLORS.white : COLORS.greyscale900 },
                    ]}
                >
                    Welcome back,
                    <Text style={styles.boldUsername}>
                        {' '}
                        {customer?.firstName ?? ''}
                    </Text>
                </Text>

                <TouchableOpacity
                    onPress={onPress}
                    style={[
                        styles.connectionDropdown,
                        {
                            borderColor: dark
                                ? COLORS.dark3
                                : COLORS.greyscale300,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.connectionText,
                            {
                                color: dark
                                    ? COLORS.white
                                    : COLORS.greyscale700,
                            },
                        ]}
                    >
                        {connection?.aliasName ?? 'Select Connection'} ⌄
                    </Text>
                </TouchableOpacity>
            </View>

            {networkStatus !== 'Good' && showAlert && (
                <View
                    style={[
                        styles.alertBanner,
                        { backgroundColor: getBannerColor(networkStatus) },
                    ]}
                >
                    <Text style={styles.alertText}>{getStatusMessage()}</Text>
                    <TouchableOpacity onPress={() => setShowAlert(false)}>
                        <Text style={styles.dismissText}>✕</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        marginBottom: 16,
    },
    welcomeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    welcomeText: {
        fontFamily: 'semiBold',
        fontSize: 15,
    },
    boldUsername: {
        fontWeight: 'bold',
    },
    connectionDropdown: {
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    connectionText: {
        fontFamily: 'medium',
        fontSize: 13,
    },
    alertBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 8,
        marginTop: 12,
    },
    alertText: {
        color: COLORS.white,
        fontSize: 13,
        flex: 1,
        fontFamily: 'medium',
    },
    dismissText: {
        color: COLORS.white,
        fontSize: 16,
        marginLeft: 12,
        fontWeight: 'bold',
    },
})

export default UserConnectionSection
