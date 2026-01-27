import React, { useEffect } from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import {
    getNotifications,
    markAsRead,
    deleteNotification,
    resetNotificationState,
} from '../redux/features/Notifications/NotificationSlice'

export default function NotificationsScreen() {
    const dispatch = useDispatch()

    const {
        notifications,
        isNotificationLoading,
        isNotificationError,
        notificationMessage,
    } = useSelector((state) => state.notifications)

    // console.log('notifications', notifications)

    useEffect(() => {
        dispatch(getNotifications())
        return () => {
            dispatch(resetNotificationState())
        }
    }, [dispatch])

    const handleMarkAsRead = (id) => {
        dispatch(markAsRead(id))
    }

    const handleClearAll = () => {
        notifications.forEach((n) => dispatch(deleteNotification(n._id)))
    }

    const handleRetry = () => {
        dispatch(getNotifications())
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.item, item.isRead ? styles.read : styles.unread]}
            onPress={() => handleMarkAsRead(item._id)}
        >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
            {item.data && item.data.type && (
                <Text style={styles.meta}>{item.data.type.toUpperCase()}</Text>
            )}
        </TouchableOpacity>
    )

    if (isNotificationLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        )
    }

    if (isNotificationError) {
        return (
            <View style={styles.center}>
                <Text style={{ color: 'red', marginBottom: 10 }}>
                    {notificationMessage}
                </Text>
                <TouchableOpacity onPress={handleRetry} style={styles.retryBtn}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {/* <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
                <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity> */}

            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No notifications yet</Text>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    clearBtn: {
        backgroundColor: '#e63946',
        padding: 10,
        marginBottom: 10,
        borderRadius: 6,
        alignItems: 'center',
    },
    clearText: { color: '#fff', fontWeight: '600' },
    item: {
        padding: 12,
        marginBottom: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    unread: { backgroundColor: '#f1f5f9' },
    read: { backgroundColor: '#fff' },
    title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    message: { fontSize: 14, color: '#333' },
    meta: { fontSize: 12, color: '#666', marginTop: 6 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { textAlign: 'center', color: '#777', marginTop: 20 },
    retryBtn: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 6,
    },
    retryText: { color: '#fff', fontWeight: '600' },
})
