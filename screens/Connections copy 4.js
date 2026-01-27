import React, { useState, useEffect } from 'react'
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
import { icons, COLORS } from '../constants'
import Icon from 'react-native-vector-icons/Ionicons'
import { switchConnection } from '../redux/features/Customers/CustomerSlice'
import { getConnectionsForUser } from '../redux/features/Connection/ConnectionSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'

const ConnectionsScreen = ({ navigation, route }) => {
    const dispatch = useDispatch()
    const { dark } = useTheme()

    // Get connections from Redux store
    const { connections, isConnectionLoading, isConnectionError, message } =
        useSelector((state) => state.connection)

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getConnectionsForUser())
        }, [dispatch])
    )

    const handleSelectConnection = (selectedId) => {
        // Find the selected connection using its _id
        const selectedConnection = connections.find(
            (conn) => conn._id === selectedId
        )
        if (!selectedConnection) return

        const data = {
            connectionId: selectedId,
        }

        dispatch(switchConnection(data))

        route.params.onConnectionSelected(
            selectedConnection.userName || selectedConnection.aliasName
        )
    }

    const renderConnectionItem = ({ item }) => {
        const location =
            item.serviceArea?.description ||
            item.serviceArea?.region ||
            'Location not specified'

        const connectionName = item.userName || item.aliasName || 'No Name'

        return (
            <TouchableOpacity
                style={[
                    styles.connectionItem,
                    {
                        backgroundColor: dark ? '#1C1C1E' : '#FFFFFF',
                        borderColor: dark ? '#333' : '#E0E0E0',
                    },
                ]}
                onPress={() => handleSelectConnection(item._id)}
            >
                <View style={styles.connectionInfo}>
                    <Icon
                        name={'wifi-outline'}
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

                {/* Conditional Rendering based on connections array length */}
                {connections.length > 1 && (
                    <View style={styles.statusContainer}>
                        <TouchableOpacity
                            style={styles.selectButton}
                            onPress={() => handleSelectConnection(item._id)}
                        >
                            <Text style={styles.selectButtonText}>Select</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>
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
                    onPress={() => navigation.goBack()}
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

            {/* Display a message when there's only one connection */}
            {!isConnectionLoading && connections.length <= 1 && (
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

            {isConnectionLoading && (
                <ActivityIndicator size="large" color={COLORS.primary} />
            )}
            {isConnectionError && <Text>Error: {message}</Text>}
            {!isConnectionLoading && connections && connections.length > 0 && (
                <FlatList
                    data={connections}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderConnectionItem}
                    contentContainerStyle={styles.listContainer}
                />
            )}
            {!isConnectionLoading &&
                connections &&
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
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 16,
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
        fontWeight: 'bold',
    },
    connectionLocation: {
        fontSize: 12,
    },
    statusContainer: {
        alignItems: 'flex-end',
    },
    primaryText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    selectButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    selectButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    oneConnectionMessageContainer: {
        padding: 16,
        backgroundColor: '#E0F7FA', // Light blue background
        borderRadius: 8,
        margin: 16,
    },
    oneConnectionMessage: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    emptyListText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
})

export default ConnectionsScreen
