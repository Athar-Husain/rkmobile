import React from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const OrderHistoryScreen = () => {
    const orders = [
        {
            id: 'INV-9901',
            item: 'Samsung Galaxy S24 Ultra',
            date: '24 Jan 2026',
            price: '₹74,999',
            status: 'Delivered',
            icon: 'cellphone-check',
        },
        {
            id: 'INV-8852',
            item: 'LG OLED TV 55"',
            date: '12 Dec 2025',
            price: '₹1,20,000',
            status: 'Servicing',
            icon: 'television-shimmer',
        },
    ]

    const renderOrderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                        name={item.icon}
                        size={24}
                        color="#004AAD"
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.orderId}>{item.id}</Text>
                    <Text style={styles.date}>{item.date}</Text>
                </View>
                <View
                    style={[
                        styles.badge,
                        {
                            backgroundColor:
                                item.status === 'Delivered'
                                    ? '#E8F5E9'
                                    : '#FFF3E0',
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.badgeText,
                            {
                                color:
                                    item.status === 'Delivered'
                                        ? '#2E7D32'
                                        : '#EF6C00',
                            },
                        ]}
                    >
                        {item.status}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardBody}>
                <Text style={styles.itemName}>{item.item}</Text>
                <Text style={styles.price}>{item.price}</Text>
            </View>

            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                <MaterialCommunityIcons
                    name="file-download-outline"
                    size={18}
                    color="#004AAD"
                />
                <Text style={styles.actionText}>Download Invoice</Text>
            </TouchableOpacity>
        </View>
    )

    return (
        <View style={styles.container}>
            <View style={styles.headerSection}>
                <Text style={styles.headerTitle}>Order History</Text>
                <Text style={styles.subTitle}>
                    View and manage your purchases
                </Text>
            </View>

            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
        paddingHorizontal: 20,
    },
    headerSection: {
        marginTop: 40,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    subTitle: {
        fontSize: 14,
        color: '#7C7C7C',
        marginTop: 4,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        // Elevation for Android
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: '#F0F5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    orderId: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    date: {
        fontSize: 12,
        color: '#9E9E9E',
        marginTop: 2,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 15,
    },
    cardBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#444',
        flex: 1,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#004AAD',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#F0F5FF',
        borderWidth: 1,
        borderColor: '#D0E0FF',
    },
    actionText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#004AAD',
        marginLeft: 8,
    },
})

export default OrderHistoryScreen
