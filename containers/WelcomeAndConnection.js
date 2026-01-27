// WelcomeAndConnection.js
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from '../theme/ThemeProvider'
import { COLORS } from '../constants'

const WelcomeAndConnection = ({ selectedConnection, setModalVisible }) => {
    const { dark } = useTheme()

    return (
        <View style={styles.welcomeContainer}>
            <Text
                style={[
                    styles.welcomeText,
                    { color: dark ? COLORS.white : COLORS.greyscale900 },
                ]}
            >
                Welcome back,
                <Text style={styles.boldUsername}> Joanna</Text>
            </Text>
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={[
                    styles.connectionDropdown,
                    {
                        borderColor: dark ? COLORS.dark3 : COLORS.greyscale300,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.connectionText,
                        {
                            color: dark ? COLORS.white : COLORS.greyscale700,
                        },
                    ]}
                >
                    {selectedConnection} ⌄
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    // Add all relevant welcome and connection styles from Home.js here
    welcomeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 16,
    },
    welcomeText: {
        fontFamily: 'semiBold',
        fontSize: 18,
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
})

export default WelcomeAndConnection
