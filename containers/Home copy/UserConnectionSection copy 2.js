import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from '../../theme/ThemeProvider'
import { COLORS } from '../../constants'
import { useDispatch, useSelector } from 'react-redux'
import { getActiveConnection } from '../../redux/features/Connection/ConnectionSlice'

const UserConnectionSection = ({ selectedConnection, onPress }) => {
    const { dark } = useTheme()
    const dispatch = useDispatch() // Corrected line here

    const { user, allCustomers, isCustomerLoading, isCustomerError, message } =
        useSelector((state) => state.auth)

    const { connection, connections } = useSelector((state) => state.connection)

    useEffect(() => {
        dispatch(getActiveConnection())
    }, [dispatch])

    return (
        <View style={styles.welcomeContainer}>
            <Text
                style={[
                    styles.welcomeText,
                    { color: dark ? COLORS.white : COLORS.greyscale900 },
                ]}
            >
                Welcome back,
                <Text style={styles.boldUsername}> {user?.name || 'name'}</Text>
            </Text>
            <TouchableOpacity
                onPress={onPress}
                style={[
                    styles.connectionDropdown,
                    { borderColor: dark ? COLORS.dark3 : COLORS.greyscale300 },
                ]}
            >
                <Text
                    style={[
                        styles.connectionText,
                        { color: dark ? COLORS.white : COLORS.greyscale700 },
                    ]}
                >
                    {selectedConnection} ⌄
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    welcomeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 16,
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
})

export default UserConnectionSection
