import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from '../../theme/ThemeProvider'
import { COLORS } from '../../constants'
import { useSelector } from 'react-redux'

const UserConnectionSection = ({ onPress }) => {
    const { dark } = useTheme()
    const customer = useSelector((state) => state.customer.customer)
    const { connection } = useSelector((state) => state.connection)

    const [showAlert, setShowAlert] = useState(false)

    const networkStatus = connection?.serviceArea?.networkStatus
    const networkDescription = connection?.serviceArea?.description

    useEffect(() => {
        console.log('networkStatus updated:', networkStatus)
        if (networkStatus && networkStatus !== 'Good') {
            setShowAlert(true)
        } else {
            setShowAlert(false)
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
                return COLORS.secondary
            case 'Moderate':
                return COLORS.warning
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
                        {customer?.firstName ?? null}
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

            {/* Render alert only if showAlert is true and status is not Good */}
            {showAlert && networkStatus !== 'Good' && (
                <View
                    style={[
                        styles.alertBanner,
                        { backgroundColor: getBannerColor(networkStatus) },
                    ]}
                >
                    <View style={styles.alertContent}>
                        <Text style={styles.alertText}>
                            {networkDescription}
                        </Text>
                        <Text style={styles.alertText}>
                            {getStatusMessage()}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => setShowAlert(false)}>
                        {/* <Text style={styles.dismissText}>✕</Text> */}
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
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
        elevation: 2, // Adds a slight shadow effect for better visibility
    },
    alertContent: {
        flex: 1,
        marginRight: 10, // Space between alert text and dismiss button
    },
    alertText: {
        color: COLORS.white,
        fontSize: 13,
        fontFamily: 'medium',
        marginBottom: 4, // Add spacing between messages
    },
    dismissText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 2, // Improved tap area for dismiss button
    },
})

export default UserConnectionSection
