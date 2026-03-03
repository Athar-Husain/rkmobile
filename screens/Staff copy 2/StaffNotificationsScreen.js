import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// Example notification data (Replace this with actual data fetching logic)
const notificationsData = [
    {
        id: '1',
        title: 'New Order Received',
        message: 'You have a new order to process.',
    },
    {
        id: '2',
        title: 'Inventory Low',
        message: 'Stock for item "XYZ" is running low.',
    },
    {
        id: '3',
        title: 'Customer Feedback',
        message: 'A customer has left a feedback on their order.',
    },
]

const StaffNotificationsScreen = () => {
    const [notifications, setNotifications] = useState([])

    // Example useEffect for fetching notifications (Replace with actual fetch call)
    useEffect(() => {
        // Simulate fetching notifications
        setNotifications(notificationsData)
    }, [])

    const renderNotification = ({ item }) => (
        <TouchableOpacity
            style={styles.notificationCard}
            onPress={() => handleNotificationPress(item)}
        >
            <MaterialCommunityIcons
                name="bell"
                size={30}
                color="#004AAD"
                style={styles.icon}
            />
            <View style={styles.notificationTextContainer}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationMessage}>{item.message}</Text>
            </View>
        </TouchableOpacity>
    )

    const handleNotificationPress = (notification) => {
        // Handle click on a notification (e.g., navigate to a details screen)
        console.log('Notification clicked:', notification)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Notifications</Text>

            {notifications.length === 0 ? (
                <Text style={styles.noNotificationsText}>
                    No new notifications
                </Text>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderNotification}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.notificationsList}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#004AAD',
        marginBottom: 20,
    },
    notificationsList: {
        paddingBottom: 30,
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    icon: {
        marginRight: 16,
    },
    notificationTextContainer: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    notificationMessage: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 4,
    },
    noNotificationsText: {
        fontSize: 16,
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: 50,
    },
})

export default StaffNotificationsScreen
