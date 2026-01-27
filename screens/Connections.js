import React, { useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from 'react-native'
import { useTheme } from '../theme/ThemeProvider'
import { COLORS } from '../constants'
import Icon from 'react-native-vector-icons/Ionicons'
import { switchConnection } from '../redux/features/Customers/CustomerSlice'
import { getConnectionsForUser } from '../redux/features/Connection/ConnectionSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'

const ConnectionsScreen = ({ navigation, route }) => {
    const dispatch = useDispatch()
    const { dark } = useTheme()

    const {
        connections,
        connection,
        isConnectionLoading,
        isConnectionError,
        message,
    } = useSelector((state) => state.connection)

    // console.log('connection ', connection)

    // Fetch connections every time screen comes into focus
    useFocusEffect(
        useCallback(() => {
            dispatch(getConnectionsForUser())
        }, [dispatch])
    )

    const handleSelectConnection = (connectionId) => {
        const selectedConnection = connections.find(
            (c) => c._id === connectionId
        )
        if (!selectedConnection) return

        dispatch(switchConnection({ connectionId }))
            .unwrap()
            .then(() => {
                if (route?.params?.onConnectionSelected) {
                    route.params.onConnectionSelected(
                        selectedConnection.userName ||
                            selectedConnection.aliasName ||
                            'Connection'
                    )
                }
            })
            .catch((err) => {
                console.error('Error switching connection:', err)
            })
    }

    const renderConnectionItem = ({ item }) => {
        const location =
            item.serviceArea?.description ||
            item.serviceArea?.region ||
            'Location not specified'
        const connectionName =
            item.userName || item.aliasName || 'Unnamed Connection'

        // Check if this connection is the active one
        const isActive = connection && connection._id === item._id

        return (
            <View
                style={[
                    styles.connectionItem,
                    {
                        backgroundColor: dark ? '#1C1C1E' : '#FFFFFF',
                        borderColor: dark ? '#333' : '#E0E0E0',
                    },
                ]}
            >
                <View style={styles.connectionInfo}>
                    <Icon
                        name="wifi-outline"
                        size={24}
                        color={dark ? COLORS.white : COLORS.greyscale700}
                        style={styles.icon}
                    />
                    <View>
                        <Text
                            style={[
                                styles.connectionName,
                                {
                                    color: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                },
                            ]}
                        >
                            {connectionName}
                        </Text>
                        <Text
                            style={[
                                styles.connectionLocation,
                                {
                                    color: dark
                                        ? COLORS.greyscale700
                                        : COLORS.greyscale700,
                                },
                            ]}
                        >
                            {location}
                        </Text>
                    </View>
                </View>

                {isActive ? (
                    <View style={styles.activeLabel}>
                        <Text style={styles.activeLabelText}>Active</Text>
                    </View>
                ) : connections.length > 1 ? (
                    <TouchableOpacity
                        style={styles.selectButton}
                        onPress={() => handleSelectConnection(item._id)}
                    >
                        <Text style={styles.selectButtonText}>Select</Text>
                    </TouchableOpacity>
                ) : null}
            </View>
        )
    }

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: dark ? COLORS.dark1 : COLORS.greyscale100 },
            ]}
        >
            <View
                style={[
                    styles.header,
                    { borderBottomColor: dark ? '#333' : '#E0E0E0' },
                ]}
            >
                <TouchableOpacity
                    onPress={navigation.goBack}
                    style={styles.backButton}
                >
                    <Icon
                        name="arrow-back"
                        size={24}
                        color={dark ? COLORS.white : COLORS.black}
                    />
                </TouchableOpacity>
                <Text
                    style={[
                        styles.headerTitle,
                        { color: dark ? COLORS.white : COLORS.black },
                    ]}
                >
                    Manage Connections
                </Text>
            </View>

            {isConnectionLoading && (
                <ActivityIndicator
                    size="large"
                    color={COLORS.primary}
                    style={styles.centered}
                />
            )}

            {!isConnectionLoading && isConnectionError && (
                <Text style={[styles.errorText, { color: COLORS.red }]}>
                    Error: {message || 'Something went wrong'}
                </Text>
            )}

            {!isConnectionLoading &&
                !isConnectionError &&
                connections.length === 0 && (
                    <Text
                        style={[
                            styles.emptyListText,
                            {
                                color: dark
                                    ? COLORS.greyscale700
                                    : COLORS.greyscale900,
                            },
                        ]}
                    >
                        No connections found.
                    </Text>
                )}

            {!isConnectionLoading && connections.length === 1 && (
                <View style={styles.oneConnectionMessageContainer}>
                    <Text
                        style={[
                            styles.oneConnectionMessage,
                            {
                                color: dark
                                    ? COLORS.greyscale700
                                    : COLORS.greyscale900,
                            },
                        ]}
                    >
                        You only have one connection. No need to switch!
                    </Text>
                </View>
            )}

            {!isConnectionLoading && connections.length > 0 && (
                <FlatList
                    data={connections}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderConnectionItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    connectionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    connectionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        marginRight: 15,
    },
    connectionName: {
        fontSize: 16,
        fontWeight: '700',
    },
    connectionLocation: {
        fontSize: 12,
        marginTop: 2,
    },
    selectButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    selectButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 14,
    },
    oneConnectionMessageContainer: {
        padding: 16,
        backgroundColor: '#E0F7FA',
        borderRadius: 8,
        margin: 16,
    },
    oneConnectionMessage: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '700',
    },
    emptyListText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    errorText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        fontWeight: '700',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeLabel: {
        backgroundColor: COLORS.success || '#4CAF50', // Green color for active
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    activeLabelText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 14,
    },
})

export default ConnectionsScreen
