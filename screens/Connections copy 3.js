import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Dimensions,
} from 'react-native'
import { useTheme } from '../theme/ThemeProvider'
import { icons, COLORS } from '../constants'
import Icon from 'react-native-vector-icons/Ionicons'
import {
    getCustomerProfile,
    switchConnection,
} from '../redux/features/Customers/CustomerSlice'
import {
    getActiveConnection,
    getConnectionsForUser,
} from '../redux/features/Connection/ConnectionSlice'
import { useDispatch, useSelector } from 'react-redux'
import { showMessage } from 'react-native-flash-message'

const { width, height } = Dimensions.get('window')

const ConnectionsScreen = ({ navigation, route }) => {
    const dispatch = useDispatch()
    const { dark } = useTheme()

    const {
        connections,
        connection,
        isConnectionLoading,
        isConnectionError,
        message,
        // Assuming `customer` state is available to get the active connection
    } = useSelector((state) => state.connection)
    const {
        customer, // Assuming `customer` state is available to get the active connection
    } = useSelector((state) => state.customer)

    useEffect(() => {
        dispatch(getConnectionsForUser())
        dispatch(getActiveConnection())
    }, [dispatch])

    const handleSelectConnectionold = (selectedId) => {
        const isActive = customer?.activeConnection === selectedId

        if (isActive) {
            showMessage({
                message: 'This is already your active connection.',
                type: 'info',
            })
            return
        }
        if (connections.length <= 1) {
            showMessage({
                message: 'You must have more than 1 connection to switch',
                type: 'info',
                position: 'top',
                statusBarHeight: 5,
                safeArea: true,
                // style: {
                // borderRadius: 10,
                // height: 20, // Set a specific height
                // width: '90%', // Set a specific width
                // alignSelf: 'center', // Center it on the screen
                // },
            })
            return
        }

        const selectedConnection = connections.find(
            (conn) => conn._id === selectedId
        )
        if (!selectedConnection) {
            return
        }

        const data = {
            connectionId: selectedId,
        }

        dispatch(switchConnection(data))
        dispatch(getCustomerProfile())
        // dispatch(getConnectionsForUser())
        dispatch(getConnectionsForUser())
        // dispatch(getActiveConnection())

        if (route.params && route.params.onConnectionSelected) {
            route.params.onConnectionSelected(
                selectedConnection.userName || selectedConnection.aliasName
            )
        }
    }

    // const handleSelectConnectionnew = async (selectedId) => {
    //     const isActive = customer?.activeConnection === selectedId

    //     if (isActive) {
    //         showMessage({
    //             message: 'This is already your active connection.',
    //             type: 'info',
    //         })
    //         return
    //     }

    //     if (connections.length <= 1) {
    //         showMessage({
    //             message: 'You must have more than 1 connection to switch',
    //             type: 'info',
    //         })
    //         return
    //     }

    //     const selectedConnection = connections.find(
    //         (conn) => conn._id === selectedId
    //     )
    //     if (!selectedConnection) return

    //     try {
    //         const resultAction = await dispatch(
    //             switchConnection({ connectionId: selectedId })
    //         )

    //         if (switchConnection.fulfilled.match(resultAction)) {
    //             // ✅ Only fetch profile if switch succeeded
    //             await dispatch(getCustomerProfile())
    //             await dispatch(getConnectionsForUser())

    //             showMessage({
    //                 message: 'Switched connection successfully!',
    //                 type: 'success',
    //             })

    //             if (route.params?.onConnectionSelected) {
    //                 route.params.onConnectionSelected(
    //                     selectedConnection.userName ||
    //                         selectedConnection.aliasName
    //                 )
    //             }
    //         } else {
    //             showMessage({
    //                 message: 'Failed to switch connection',
    //                 type: 'danger',
    //             })
    //         }
    //     } catch (error) {
    //         showMessage({
    //             message: 'Something went wrong while switching',
    //             type: 'danger',
    //         })
    //     }
    // }
    const handleSelectConnectionnot = async (selectedId) => {
        const isActive = customer?.activeConnection === selectedId

        if (isActive) {
            showMessage({
                message: 'This is already your active connection.',
                type: 'info',
            })
            return
        }

        if (connections.length <= 1) {
            showMessage({
                message: 'You must have more than 1 connection to switch',
                type: 'info',
            })
            return
        }

        const selectedConnection = connections.find(
            (conn) => conn._id === selectedId
        )
        if (!selectedConnection) return

        try {
            const resultAction = await dispatch(
                switchConnection({ connectionId: selectedId })
            )

            if (switchConnection.fulfilled.match(resultAction)) {
                // After a successful switch, re-fetch all necessary data
                await dispatch(getCustomerProfile())
                await dispatch(getConnectionsForUser())

                showMessage({
                    message: 'Switched connection successfully!',
                    type: 'success',
                })

                if (route.params?.onConnectionSelected) {
                    route.params.onConnectionSelected(
                        selectedConnection.userName ||
                            selectedConnection.aliasName
                    )
                }
            } else {
                showMessage({
                    message: 'Failed to switch connection',
                    type: 'danger',
                })
            }
        } catch (error) {
            showMessage({
                message: 'Something went wrong while switching',
                type: 'danger',
            })
        }
    }

    const handleSelectConnection = async (selectedId) => {
        const isActive = customer?.activeConnection === selectedId

        if (isActive) {
            showMessage({
                message: 'This is already your active connection.',
                type: 'info',
            })
            return
        }

        if (connections.length <= 1) {
            showMessage({
                message: 'You must have more than 1 connection to switch',
                type: 'info',
            })
            return
        }

        const selectedConnection = connections.find(
            (conn) => conn._id === selectedId
        )
        if (!selectedConnection) return

        try {
            // We do not need to await here, because the `isConnectionLoading` state
            // from the `connection` slice will already be handled by the dispatch
            // of `switchConnection`. The state will be set to loading, the spinner will show.
            const resultAction = await dispatch(
                switchConnection({ connectionId: selectedId })
            )

            if (switchConnection.fulfilled.match(resultAction)) {
                // After a successful switch, we also need to re-fetch the
                // customer profile to update the `activeConnection` property.
                // This is the source of the spinner after the toast.
                await Promise.all([
                    dispatch(getCustomerProfile()),
                    dispatch(getConnectionsForUser()),
                ])

                showMessage({
                    message: 'Switched connection successfully!',
                    type: 'success',
                })

                if (route.params?.onConnectionSelected) {
                    route.params.onConnectionSelected(
                        selectedConnection.userName ||
                            selectedConnection.aliasName
                    )
                }
            } else {
                showMessage({
                    message: 'Failed to switch connection',
                    type: 'danger',
                })
            }
        } catch (error) {
            showMessage({
                message: 'Something went wrong while switching',
                type: 'danger',
            })
        }
    }

    const renderConnectionItem = ({ item }) => {
        const location =
            item.serviceArea?.description ||
            item.serviceArea?.region ||
            'Location not specified'

        const connectionName = item.userName || item.aliasName || 'No Name'

        // Check if this connection is the active one
        const isActive = customer?.activeConnection === item._id

        console.log('isActive in connection render', isActive)

        return (
            <TouchableOpacity
                style={[
                    styles.connectionItem,
                    {
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                        borderColor: dark
                            ? isActive
                                ? COLORS.primary
                                : COLORS.dark3
                            : isActive
                              ? COLORS.primary
                              : COLORS.greyscale300,
                        borderWidth: isActive ? 2 : 1,
                    },
                ]}
                onPress={() => handleSelectConnection(item._id)}
            >
                <View style={styles.connectionInfo}>
                    <Icon
                        name={isActive ? 'wifi' : 'wifi-outline'}
                        size={width * 0.07}
                        color={
                            isActive
                                ? COLORS.primary
                                : dark
                                  ? COLORS.white
                                  : COLORS.greyscale700
                        }
                        style={styles.icon}
                    />
                    <View style={styles.textContainer}>
                        <Text
                            style={[
                                styles.connectionName,
                                {
                                    color: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                },
                            ]}
                            numberOfLines={1}
                        >
                            {connectionName}
                        </Text>
                        <Text
                            style={[
                                styles.connectionLocation,
                                {
                                    color: dark
                                        ? COLORS.greyscale500
                                        : COLORS.greyscale700,
                                },
                            ]}
                            numberOfLines={1}
                        >
                            {location}
                        </Text>
                    </View>
                </View>

                {connections.length > 1 ? (
                    <View style={styles.statusContainer}>
                        {isActive ? (
                            <Text
                                style={[
                                    styles.activeText,
                                    {
                                        color: dark
                                            ? COLORS.primary
                                            : COLORS.primary,
                                    },
                                ]}
                            >
                                Active
                            </Text>
                        ) : (
                            <TouchableOpacity
                                style={[
                                    styles.selectButton,
                                    {
                                        backgroundColor: COLORS.primary,
                                    },
                                ]}
                                onPress={() => handleSelectConnection(item._id)}
                            >
                                <Text style={styles.selectButtonText}>
                                    Select
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    <Text
                        style={[
                            styles.infoText,
                            {
                                color: dark
                                    ? COLORS.greyscale500
                                    : COLORS.greyscale700,
                            },
                        ]}
                    >
                        Main
                    </Text>
                )}
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView
            style={[
                styles.safeArea,
                { backgroundColor: dark ? COLORS.dark1 : COLORS.greyscale100 },
            ]}
        >
            <View
                style={[
                    styles.header,
                    {
                        borderBottomColor: dark
                            ? COLORS.dark3
                            : COLORS.greyscale300,
                    },
                ]}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Icon
                        name="arrow-back"
                        size={width * 0.07}
                        color={dark ? COLORS.white : COLORS.greyscale900}
                    />
                </TouchableOpacity>
                <Text
                    style={[
                        styles.headerTitle,
                        { color: dark ? COLORS.white : COLORS.greyscale900 },
                    ]}
                >
                    Manage Connections
                </Text>
            </View>

            {isConnectionLoading && (
                <View style={styles.centeredView}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    {/* <Text>this is</Text> */}
                </View>
            )}

            {!isConnectionLoading && connections && (
                <FlatList
                    data={connections}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderConnectionItem}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <View style={styles.centeredView}>
                            <Text
                                style={[
                                    styles.emptyListText,
                                    {
                                        color: dark
                                            ? COLORS.greyscale500
                                            : COLORS.greyscale700,
                                    },
                                ]}
                            >
                                No connections found.
                            </Text>
                        </View>
                    }
                    ListHeaderComponent={
                        connections.length <= 1 && (
                            <View style={styles.infoMessage}>
                                <Text
                                    style={[
                                        styles.infoMessageText,
                                        {
                                            color: dark
                                                ? COLORS.greyscale500
                                                : COLORS.greyscale700,
                                        },
                                    ]}
                                >
                                    This is your only connection.
                                </Text>
                            </View>
                        )
                    }
                />
            )}
            {isConnectionError && (
                <View style={styles.centeredView}>
                    <Text
                        style={[
                            styles.errorText,
                            { color: dark ? COLORS.error : COLORS.red500 },
                        ]}
                    >
                        Error: {message}
                    </Text>
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
        paddingVertical: width * 0.04,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    backButton: {
        marginRight: width * 0.04,
    },
    headerTitle: {
        fontSize: width * 0.05,
        fontWeight: '700',
    },
    listContainer: {
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.05,
    },
    connectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: width * 0.04,
        borderRadius: 12,
        marginBottom: width * 0.03,
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
        marginRight: width * 0.04,
    },
    textContainer: {
        flex: 1,
    },
    connectionName: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
    },
    connectionLocation: {
        fontSize: width * 0.035,
        marginTop: 2,
    },
    statusContainer: {
        alignItems: 'flex-end',
    },
    selectButton: {
        paddingHorizontal: width * 0.05,
        paddingVertical: width * 0.02,
        borderRadius: 20,
    },
    selectButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: width * 0.035,
    },
    activeText: {
        fontSize: width * 0.04,
        fontWeight: 'bold',
    },
    infoText: {
        fontSize: width * 0.04,
    },
    infoMessage: {
        padding: width * 0.04,
        borderRadius: 8,
        marginBottom: width * 0.04,
        backgroundColor: COLORS.info,
    },
    infoMessageText: {
        fontSize: width * 0.04,
        textAlign: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: width * 0.05,
    },
    emptyListText: {
        fontSize: width * 0.045,
        textAlign: 'center',
    },
    errorText: {
        fontSize: width * 0.04,
        textAlign: 'center',
        fontWeight: 'bold',
    },
})

export default ConnectionsScreen
