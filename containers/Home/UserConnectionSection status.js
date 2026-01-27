// components/UserConnectionSection.js

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { COLORS } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { getActiveConnection } from '../../redux/features/Connection/ConnectionSlice';

const UserConnectionSection = ({ onPress }) => {
    const { dark } = useTheme();
    const dispatch = useDispatch();

    const customer = useSelector((state) => state.customer.customer); // adjust if your slice is different
    const connection = useSelector((state) => state.connection.connection);
    const networkStatus = useSelector((state) => state.connection.networkStatus);

    useEffect(() => {
        dispatch(getActiveConnection());
    }, [dispatch]);

    const getStatusMessage = () => {
        switch (networkStatus) {
            case 'Low':
                return 'Network is currently low. We are working on fixing it.';
            case 'Moderate':
                return 'Network performance is moderate in your area.';
            case 'Down':
                return 'There is a service outage in your area. We apologize for the inconvenience.';
            default:
                return 'Your network is running smoothly.';
        }
    };

    return (
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

            <Text
                style={[
                    styles.networkStatusText,
                    { color: dark ? COLORS.white : COLORS.greyscale700 },
                ]}
            >
                {getStatusMessage()}
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
                    {connection?.aliasName ?? 'Select Connection'} ⌄
                </Text>
            </TouchableOpacity>
        </View>
    );
};

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
    networkStatusText: {
        fontFamily: 'regular',
        fontSize: 13,
        marginVertical: 8,
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
});

export default UserConnectionSection;
