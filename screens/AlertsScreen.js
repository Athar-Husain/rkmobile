import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Animated,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const AlertsScreen = () => {
    const [alerts, setAlerts] = useState([])
    const [filter, setFilter] = useState('All')

    useEffect(() => {
        setAlerts([
            {
                id: '1',
                title: 'Order Delivered',
                msg: 'Your Samsung AC has been installed successfully.',
                time: '2h ago',
                type: 'success',
                unread: true,
            },
            {
                id: '2',
                title: 'Flash Sale!',
                msg: 'Up to 50% off on Soundbars for the next 4 hours.',
                time: '5h ago',
                type: 'promo',
                unread: true,
            },
            {
                id: '3',
                title: 'Payment Confirmed',
                msg: 'Payment of ₹45,000 received for Invoice #RK-99.',
                time: 'Yesterday',
                type: 'billing',
                unread: false,
            },
            {
                id: '4',
                title: 'Service Reminder',
                msg: 'Your Water Purifier service is due next week. Book now!',
                time: '2 days ago',
                type: 'service',
                unread: false,
            },
            {
                id: '5',
                title: 'Flash Sale!',
                msg: 'Up to 50% off on Soundbars for the next 4 hours.',
                time: '5h ago',
                type: 'promo',
                unread: true,
            },
            {
                id: '6',
                title: 'Payment Confirmed',
                msg: 'Payment of ₹45,000 received for Invoice #RK-99.',
                time: 'Yesterday',
                type: 'billing',
                unread: false,
            },
            {
                id: '7',
                title: 'Service Reminder',
                msg: 'Your Water Purifier service is due next week. Book now!',
                time: '2 days ago',
                type: 'service',
                unread: false,
            },
        ])
    }, [])

    const markAllRead = () => {
        setAlerts(alerts.map((a) => ({ ...a, unread: false })))
    }

    //  return {
    //     name: 'package-check',
    //     color: '#4CAF50',
    // }
    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return {
                    // name: 'package-variant-closed-check',
                    name: 'cube-send',
                    color: '#4CAF50',
                }
            case 'promo':
                return { name: 'sale', color: '#E91E63' }
            case 'billing':
                return { name: 'receipt', color: '#004AAD' }
            case 'service':
                return { name: 'wrench-clock', color: '#FF9800' }
            default:
                return { name: 'bell', color: '#666' }
        }
    }

    const renderAlert = ({ item }) => {
        const icon = getIcon(item.type)
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.alertRow, item.unread && styles.unreadRow]}
            >
                <View
                    style={[
                        styles.iconBg,
                        { backgroundColor: icon.color + '15' },
                    ]}
                >
                    <MaterialCommunityIcons
                        name={icon.name}
                        size={24}
                        color={icon.color}
                    />
                </View>

                <View style={styles.alertContent}>
                    <View style={styles.alertHeader}>
                        <Text
                            style={[
                                styles.alertTitle,
                                item.unread && styles.boldText,
                            ]}
                        >
                            {item.title}
                        </Text>
                        <Text style={styles.time}>{item.time}</Text>
                    </View>
                    <Text style={styles.alertMsg} numberOfLines={2}>
                        {item.msg}
                    </Text>

                    {item.unread && <View style={styles.unreadDot} />}
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header Section */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    <Text style={styles.headerSub}>
                        You have {alerts.filter((a) => a.unread).length} unread
                        messages
                    </Text>
                </View>
                <TouchableOpacity onPress={markAllRead}>
                    <Text style={styles.markReadBtn}>Mark all as read</Text>
                </TouchableOpacity>
            </View>

            {/* Filter Chips */}
            <View style={styles.filterBar}>
                {['All', 'Orders', 'Offers', 'Service'].map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={[
                            styles.chip,
                            filter === cat && styles.activeChip,
                        ]}
                        onPress={() => setFilter(cat)}
                    >
                        <Text
                            style={[
                                styles.chipText,
                                filter === cat && styles.activeChipText,
                            ]}
                        >
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={alerts}
                renderItem={renderAlert}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons
                            name="bell-off-outline"
                            size={60}
                            color="#DDD"
                        />
                        <Text style={styles.emptyText}>All caught up!</Text>
                    </View>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FB' },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
    headerSub: { fontSize: 12, color: '#7C7C7C', marginTop: 4 },
    markReadBtn: { color: '#004AAD', fontSize: 13, fontWeight: '600' },

    filterBar: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFF',
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    activeChip: { backgroundColor: '#004AAD', borderColor: '#004AAD' },
    chipText: { fontSize: 13, color: '#666', fontWeight: '500' },
    activeChipText: { color: '#FFF' },

    alertRow: {
        flexDirection: 'row',
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 12,
        backgroundColor: '#FFF',
        borderRadius: 16,
        alignItems: 'center',
        position: 'relative',
        // Minimal shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
        elevation: 2,
    },
    unreadRow: {
        backgroundColor: '#F0F5FF', // Light blue tint for unread
        borderLeftWidth: 4,
        borderLeftColor: '#004AAD',
    },
    iconBg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    alertContent: { flex: 1 },
    alertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    alertTitle: { fontSize: 15, color: '#333' },
    boldText: { fontWeight: 'bold', color: '#000' },
    time: { fontSize: 11, color: '#999' },
    alertMsg: { fontSize: 13, color: '#666', lineHeight: 18 },

    unreadDot: {
        position: 'absolute',
        right: -5,
        top: '50%',
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#004AAD',
    },

    emptyState: { alignItems: 'center', marginTop: 100 },
    emptyText: { color: '#AAA', marginTop: 10, fontSize: 16 },
})

export default AlertsScreen
