import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    Modal,
    ScrollView,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment'
// import {
//     addRating,
//     getMyPurchases,
// } from '../redux/features/Purchases/PurchaseSlice.js'
import OrderDetailsModal from '../containers/Purchases/OrderDetailsModal'
import { getMyPurchases } from '../redux/features/Purchases/PurchaseSlice'

const { height, width } = Dimensions.get('window')

/* =============================================================================
   MAIN COMPONENT: OrderHistoryScreen
   ============================================================================= */
const OrderHistoryScreen = () => {
    const dispatch = useDispatch()
    const { mypurchases, isPurchaseLoading } = useSelector(
        (state) => state.purchase
    )

    // console.log("mypurchases", mypurchases)

    const [selectedOrder, setSelectedOrder] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        dispatch(getMyPurchases())
    }, [dispatch])

    const handleViewDetails = (order) => {
        setSelectedOrder(order)
        setModalVisible(true)
    }

    const getDeliveryInfo = (status) => {
        const map = {
            PENDING: { color: '#7C7C7C', label: 'Processing' },
            SCHEDULED: { color: '#004AAD', label: 'Scheduled' },
            DELIVERED: { color: '#2E7D32', label: 'Delivered' },
            INSTALLED: { color: '#6200EE', label: 'Installed' },
        }
        return map[status] || map['PENDING']
    }

    const renderOrderItem = ({ item }) => {
        const delivery = getDeliveryInfo(item.delivery?.status)
        const isCancelled = item.status === 'CANCELLED'

        return (
            <View style={[styles.card, isCancelled && { opacity: 0.7 }]}>
                <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons
                            name={
                                item.delivery?.type === 'HOME_DELIVERY'
                                    ? 'truck-fast'
                                    : 'store-check'
                            }
                            size={22}
                            color="#004AAD"
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.orderId}>{item.invoiceNumber}</Text>
                        <Text style={styles.date}>
                            {moment(item.createdAt).format(
                                'DD MMM YYYY, hh:mm A'
                            )}
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.statusBadge,
                            { backgroundColor: delivery.color + '15' },
                        ]}
                    >
                        <Text
                            style={[
                                styles.statusText,
                                { color: delivery.color },
                            ]}
                        >
                            {isCancelled ? 'CANCELLED' : delivery.label}
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardBody}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.itemName} numberOfLines={1}>
                            {item.items[0]?.name}
                            {item.items.length > 1 && (
                                <Text style={styles.moreCount}>
                                    {' '}
                                    +{item.items.length - 1} more
                                </Text>
                            )}
                        </Text>
                        <Text style={styles.storeName}>
                            📍 {item.storeId?.name || 'Authorized Store'}
                        </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.price}>
                            ₹{item.finalAmount?.toLocaleString('en-IN')}
                        </Text>
                        {item.discount > 0 && (
                            <Text style={styles.savings}>
                                Saved ₹{item.discount.toLocaleString('en-IN')}
                            </Text>
                        )}
                    </View>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.secondaryBtn}
                        onPress={() => handleViewDetails(item)}
                    >
                        <Text style={styles.secondaryBtnText}>
                            View Details
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.primaryBtn}>
                        <MaterialCommunityIcons
                            name="file-download-outline"
                            size={16}
                            color="#FFF"
                        />
                        <Text style={styles.primaryBtnText}>Invoice</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerSection}>
                <Text style={styles.headerTitle}>Order History</Text>
                <Text style={styles.subTitle}>
                    Manage invoices & service requests
                </Text>
            </View>

            <FlatList
                data={mypurchases}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item._id}
                refreshControl={
                    <RefreshControl
                        refreshing={isPurchaseLoading}
                        onRefresh={() => dispatch(getMyPurchases())}
                    />
                }
                contentContainerStyle={{ paddingBottom: 30 }}
                ListEmptyComponent={
                    !isPurchaseLoading && (
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons
                                name="receipt"
                                size={80}
                                color="#E0E0E0"
                            />
                            <Text style={styles.emptyStateText}>
                                No purchases found
                            </Text>
                        </View>
                    )
                }
            />

            <OrderDetailsModal
                visible={modalVisible}
                order={selectedOrder}
                onClose={() => setModalVisible(false)}
            />
        </View>
    )
}

/* =============================================================================
   STYLES (Merged)
   ============================================================================= */
const styles = StyleSheet.create({
    // Screen Styles
    container: { flex: 1, backgroundColor: '#F8FAFC', paddingHorizontal: 16 },
    headerSection: { marginTop: 60, marginBottom: 20 },
    headerTitle: { fontSize: 28, fontWeight: '800', color: '#1A1C1E' },
    subTitle: { fontSize: 14, color: '#64748B', marginTop: 4 },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center' },
    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: '#F0F7FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    orderId: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
    date: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 10, fontWeight: '800' },
    divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 14 },
    cardBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    itemName: { fontSize: 16, fontWeight: '600', color: '#334155' },
    moreCount: { color: '#004AAD', fontSize: 13 },
    storeName: { fontSize: 12, color: '#64748B', marginTop: 4 },
    price: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
    savings: {
        fontSize: 11,
        color: '#16A34A',
        fontWeight: '600',
        marginTop: 2,
    },
    footer: { flexDirection: 'row', gap: 10 },
    primaryBtn: {
        flex: 1.5,
        backgroundColor: '#004AAD',
        flexDirection: 'row',
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    primaryBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
    secondaryBtn: {
        flex: 1,
        backgroundColor: '#FFF',
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    secondaryBtnText: { color: '#475569', fontSize: 14, fontWeight: '600' },
    emptyState: { alignItems: 'center', marginTop: 100 },
    emptyStateText: { marginTop: 16, color: '#94A3B8', fontSize: 16 },
})

export default OrderHistoryScreen
