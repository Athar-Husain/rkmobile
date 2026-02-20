import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
// import PurchaseService from '../../../services/PurchaseService'
import moment from 'moment'

const OrderHistoryScreen = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const fetchOrders = async () => {
        try {
            const response = await getMyPurchases()
            if (response.success) {
                setOrders(response.purchases)
            }
        } catch (error) {
            console.error("Fetch Error:", error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => { fetchOrders() }, [])

    // Helper to map your Schema Enums to UI Colors
    const getDeliveryInfo = (status) => {
        const map = {
            'PENDING': { color: '#7C7C7C', label: 'Processing' },
            'SCHEDULED': { color: '#004AAD', label: 'Scheduled' },
            'DELIVERED': { color: '#2E7D32', label: 'Delivered' },
            'INSTALLED': { color: '#6200EE', label: 'Installed' }
        }
        return map[status] || map['PENDING']
    }

    const renderOrderItem = ({ item }) => {
        const delivery = getDeliveryInfo(item.delivery?.status)
        const isCancelled = item.status === 'CANCELLED'

        return (
            <View style={[styles.card, isCancelled && { opacity: 0.7 }]}>
                {/* Header: Invoice & Status */}
                <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons 
                            name={item.delivery?.type === 'HOME_DELIVERY' ? "truck-fast" : "store-check"} 
                            size={22} 
                            color="#004AAD" 
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.orderId}>{item.invoiceNumber}</Text>
                        <Text style={styles.date}>{moment(item.createdAt).format('DD MMM YYYY, hh:mm A')}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: delivery.color + '15' }]}>
                        <Text style={[styles.statusText, { color: delivery.color }]}>
                            {isCancelled ? 'CANCELLED' : delivery.label}
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Body: Product Info */}
                <View style={styles.cardBody}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.itemName} numberOfLines={1}>
                            {item.items[0]?.name}
                            {item.items.length > 1 && <Text style={styles.moreCount}> +{item.items.length - 1} more</Text>}
                        </Text>
                        <Text style={styles.storeName}>📍 {item.storeId?.name || 'RK Electronics'}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.price}>₹{item.finalAmount.toLocaleString('en-IN')}</Text>
                        {item.discount > 0 && (
                            <Text style={styles.savings}>Saved ₹{item.discount.toLocaleString('en-IN')}</Text>
                        )}
                    </View>
                </View>

                {/* Footer: Actions */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.secondaryBtn}>
                        <Text style={styles.secondaryBtnText}>View Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.primaryBtn}>
                        <MaterialCommunityIcons name="file-download-outline" size={16} color="#FFF" />
                        <Text style={styles.primaryBtnText}>Invoice</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerSection}>
                <Text style={styles.headerTitle}>Purchase History</Text>
                <Text style={styles.subTitle}>Manage your invoices and warranties</Text>
            </View>

            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item._id}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchOrders} />}
                contentContainerStyle={{ paddingBottom: 30 }}
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons name="receipt" size={80} color="#E0E0E0" />
                            <Text style={styles.emptyStateText}>No purchases found</Text>
                        </View>
                    )
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F7FA', paddingHorizontal: 16 },
    headerSection: { marginTop: 50, marginBottom: 20, paddingLeft: 4 },
    headerTitle: { fontSize: 26, fontWeight: '800', color: '#1A1C1E' },
    subTitle: { fontSize: 14, color: '#6C757D', marginTop: 4 },
    card: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
    cardHeader: { flexDirection: 'row', alignItems: 'center' },
    iconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F0F4FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    orderId: { fontSize: 15, fontWeight: '700', color: '#1A1C1E' },
    date: { fontSize: 11, color: '#ADB5BD', marginTop: 2 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
    divider: { height: 1, backgroundColor: '#F1F3F5', marginVertical: 14 },
    cardBody: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    itemName: { fontSize: 16, fontWeight: '600', color: '#343A40', marginBottom: 4 },
    moreCount: { color: '#004AAD', fontSize: 13 },
    storeName: { fontSize: 12, color: '#6C757D' },
    price: { fontSize: 18, fontWeight: '800', color: '#1A1C1E' },
    savings: { fontSize: 11, color: '#2E7D32', fontWeight: '600', marginTop: 2 },
    footer: { flexDirection: 'row', gap: 10 },
    primaryBtn: { flex: 1.5, backgroundColor: '#004AAD', flexDirection: 'row', height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', gap: 6 },
    primaryBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
    secondaryBtn: { flex: 1, backgroundColor: '#F8F9FA', height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E9ECEF' },
    secondaryBtnText: { color: '#495057', fontSize: 13, fontWeight: '600' },
    emptyState: { alignItems: 'center', marginTop: 100 },
    emptyStateText: { marginTop: 16, color: '#ADB5BD', fontSize: 16, fontWeight: '500' }
})

export default OrderHistoryScreen