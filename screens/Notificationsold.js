// src/screens/NotificationsScreen.js
import React from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import {
    markAsRead,
    clearNotifications,
} from '../redux/features/Notifications/NotificationSlice'

export default function NotificationsScreen() {
    const { list } = useSelector((state) => state.notifications)
    const dispatch = useDispatch()

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.item, item.read ? styles.read : styles.unread]}
            onPress={() => dispatch(markAsRead(item.id))}
        >
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.message}</Text>
            <Text style={styles.meta}>{item.type?.toUpperCase()}</Text>
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => dispatch(clearNotifications())}
            >
                <Text style={{ color: 'white' }}>Clear All</Text>
            </TouchableOpacity>

            <FlatList
                data={list}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text>No notifications yet</Text>}
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
    },
    item: {
        padding: 12,
        marginBottom: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    unread: { backgroundColor: '#f1f5f9' },
    read: { backgroundColor: '#fff' },
    title: { fontSize: 16, fontWeight: '600' },
    meta: { fontSize: 12, color: '#666', marginTop: 4 },
})
