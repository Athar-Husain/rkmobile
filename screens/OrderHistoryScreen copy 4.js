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

// Import your Redux actions
// import { getMyPurchases, addRating } from '../../../redux/features/Purchase/PurchaseSlice';

const { height, width } = Dimensions.get('window')

/* =============================================================================
   SUB-COMPONENT: OrderDetailsModal
   ============================================================================= */
// const OrderDetailsModal = ({ visible, order, onClose }) => {
//     const dispatch = useDispatch()
//     const [userRating, setUserRating] = useState(0)
//     const [feedback, setFeedback] = useState('')
//     const { isPurchaseLoading } = useSelector((state) => state.purchase)

//     // Reset local state when order changes
//     useEffect(() => {
//         if (order) {
//             setUserRating(order.rating || 0)
//             setFeedback(order.feedback || '')
//         }
//     }, [order])

//     if (!order) return null

//     const handleSubmitReview = () => {
//         dispatch(
//             addRating({
//                 id: order._id,
//                 data: { rating: userRating, feedback: feedback },
//             })
//         )
//     }

//     const Section = ({ title, children, icon }) => (
//         <View style={styles.modalSection}>
//             <View style={styles.sectionHeader}>
//                 <MaterialCommunityIcons name={icon} size={18} color="#004AAD" />
//                 <Text style={styles.sectionTitle}>{title}</Text>
//             </View>
//             {children}
//         </View>
//     )

//     return (
//         <Modal
//             visible={visible}
//             animationType="slide"
//             transparent={true}
//             onRequestClose={onClose}
//         >
//             <KeyboardAvoidingView
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                 style={styles.modalOverlay}
//             >
//                 <View style={styles.modalContent}>
//                     {/* Handle bar for visual cue */}
//                     <View style={styles.modalHandle} />

//                     <View style={styles.modalHeader}>
//                         <Text style={styles.modalHeaderTitle}>
//                             Invoice Details
//                         </Text>
//                         <TouchableOpacity
//                             onPress={onClose}
//                             style={styles.closeBtn}
//                         >
//                             <MaterialCommunityIcons
//                                 name="close"
//                                 size={22}
//                                 color="#333"
//                             />
//                         </TouchableOpacity>
//                     </View>

//                     <ScrollView
//                         showsVerticalScrollIndicator={false}
//                         contentContainerStyle={styles.modalScroll}
//                     >
//                         {/* 1. Summary Header */}
//                         <View style={styles.summaryCard}>
//                             <Text style={styles.summaryInvoice}>
//                                 {order.invoiceNumber}
//                             </Text>
//                             <Text style={styles.summaryDate}>
//                                 {moment(order.createdAt).format('LLLL')}
//                             </Text>
//                             <View style={styles.statusRow}>
//                                 <Text style={styles.statusLabel}>
//                                     Order Status:{' '}
//                                 </Text>
//                                 <Text
//                                     style={[
//                                         styles.statusValue,
//                                         {
//                                             color:
//                                                 order.status === 'COMPLETED'
//                                                     ? '#2E7D32'
//                                                     : '#C62828',
//                                         },
//                                     ]}
//                                 >
//                                     {order.status}
//                                 </Text>
//                             </View>
//                         </View>

//                         {/* 2. Items List */}
//                         <Section title="Items Purchased" icon="basket-outline">
//                             {order.items.map((item, index) => (
//                                 <View key={index} style={styles.itemRow}>
//                                     <View style={{ flex: 1 }}>
//                                         <Text style={styles.itemNameText}>
//                                             {item.name}
//                                         </Text>
//                                         <Text style={styles.itemSubText}>
//                                             {item.brand} • {item.model}
//                                         </Text>
//                                     </View>
//                                     <Text style={styles.itemQty}>
//                                         x{item.quantity}
//                                     </Text>
//                                     <Text style={styles.itemPrice}>
//                                         ₹
//                                         {item.totalPrice?.toLocaleString(
//                                             'en-IN'
//                                         )}
//                                     </Text>
//                                 </View>
//                             ))}
//                         </Section>

//                         {/* 3. Warranty Info */}
//                         {order.warranty?.endDate && (
//                             <Section
//                                 title="Warranty Details"
//                                 icon="shield-check-outline"
//                             >
//                                 <View style={styles.infoBox}>
//                                     <View style={styles.infoRow}>
//                                         <Text style={styles.infoLabel}>
//                                             Coverage Until:
//                                         </Text>
//                                         <Text style={styles.infoValue}>
//                                             {moment(
//                                                 order.warranty.endDate
//                                             ).format('DD MMM YYYY')}
//                                         </Text>
//                                     </View>
//                                     {order.warranty.cardNumber && (
//                                         <View style={styles.infoRow}>
//                                             <Text style={styles.infoLabel}>
//                                                 Warranty Card:
//                                             </Text>
//                                             <Text style={styles.infoValue}>
//                                                 {order.warranty.cardNumber}
//                                             </Text>
//                                         </View>
//                                     )}
//                                 </View>
//                             </Section>
//                         )}

//                         {/* 4. Payment Details */}
//                         <Section title="Payment Summary" icon="cash-register">
//                             <View style={styles.billRow}>
//                                 <Text style={styles.billLabel}>Subtotal</Text>
//                                 <Text style={styles.billValue}>
//                                     ₹{order.subtotal?.toLocaleString('en-IN')}
//                                 </Text>
//                             </View>
//                             <View style={styles.billRow}>
//                                 <Text style={styles.billLabel}>
//                                     Tax & Charges
//                                 </Text>
//                                 <Text style={styles.billValue}>
//                                     +₹{order.tax?.toLocaleString('en-IN')}
//                                 </Text>
//                             </View>
//                             <View style={styles.billRow}>
//                                 <Text
//                                     style={[
//                                         styles.billLabel,
//                                         { color: '#2E7D32' },
//                                     ]}
//                                 >
//                                     Discount Applied
//                                 </Text>
//                                 <Text
//                                     style={[
//                                         styles.billValue,
//                                         { color: '#2E7D32' },
//                                     ]}
//                                 >
//                                     -₹{order.discount?.toLocaleString('en-IN')}
//                                 </Text>
//                             </View>
//                             <View style={[styles.billRow, styles.totalRow]}>
//                                 <Text style={styles.totalLabel}>
//                                     Grand Total
//                                 </Text>
//                                 <Text style={styles.totalValue}>
//                                     ₹
//                                     {order.finalAmount?.toLocaleString('en-IN')}
//                                 </Text>
//                             </View>
//                             <Text style={styles.paymentMethodText}>
//                                 Paid via {order.payment?.method} (
//                                 {order.payment?.status})
//                             </Text>
//                         </Section>

//                         {/* 5. Rating & Feedback System */}
//                         <Section title="Rate your Purchase" icon="star-outline">
//                             <View style={styles.ratingContainer}>
//                                 <View style={styles.starsRow}>
//                                     {[1, 2, 3, 4, 5].map((star) => (
//                                         <TouchableOpacity
//                                             key={star}
//                                             onPress={() => setUserRating(star)}
//                                         >
//                                             <MaterialCommunityIcons
//                                                 name={
//                                                     star <= userRating
//                                                         ? 'star'
//                                                         : 'star-outline'
//                                                 }
//                                                 size={32}
//                                                 color={
//                                                     star <= userRating
//                                                         ? '#FFB400'
//                                                         : '#CCC'
//                                                 }
//                                             />
//                                         </TouchableOpacity>
//                                     ))}
//                                 </View>
//                                 <TextInput
//                                     style={styles.feedbackInput}
//                                     placeholder="Tell us about your experience..."
//                                     value={feedback}
//                                     onChangeText={setFeedback}
//                                     multiline
//                                 />
//                                 <TouchableOpacity
//                                     style={[
//                                         styles.submitRatingBtn,
//                                         (userRating === 0 ||
//                                             isPurchaseLoading) && {
//                                             opacity: 0.6,
//                                         },
//                                     ]}
//                                     onPress={handleSubmitReview}
//                                     disabled={
//                                         userRating === 0 || isPurchaseLoading
//                                     }
//                                 >
//                                     {isPurchaseLoading ? (
//                                         <ActivityIndicator color="#FFF" />
//                                     ) : (
//                                         <Text style={styles.submitRatingText}>
//                                             Update Review
//                                         </Text>
//                                     )}
//                                 </TouchableOpacity>
//                             </View>
//                         </Section>
//                     </ScrollView>
//                 </View>
//             </KeyboardAvoidingView>
//         </Modal>
//     )
// }

/* =============================================================================
   MAIN COMPONENT: OrderHistoryScreen
   ============================================================================= */
const OrderHistoryScreen = () => {
    const dispatch = useDispatch()
    const { mypurchases, isPurchaseLoading } = useSelector(
        (state) => state.purchase
    )

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

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: height * 0.88,
        padding: 20,
    },
    modalHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#E2E8F0',
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalHeaderTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
    closeBtn: { padding: 4 },
    modalScroll: { paddingBottom: 40 },
    summaryCard: {
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    summaryInvoice: { fontSize: 20, fontWeight: '800', color: '#004AAD' },
    summaryDate: { fontSize: 13, color: '#64748B', marginTop: 4 },
    statusRow: { flexDirection: 'row', marginTop: 10, alignItems: 'center' },
    statusLabel: { fontSize: 13, color: '#64748B' },
    statusValue: { fontSize: 13, fontWeight: '700' },
    modalSection: { marginBottom: 25 },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#334155' },
    itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    itemNameText: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
    itemSubText: { fontSize: 12, color: '#94A3B8' },
    itemQty: { fontSize: 14, color: '#64748B', marginHorizontal: 15 },
    itemPrice: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
        width: 90,
        textAlign: 'right',
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    billLabel: { color: '#64748B', fontSize: 14 },
    billValue: { color: '#0F172A', fontSize: 14, fontWeight: '600' },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 12,
        marginTop: 8,
    },
    totalLabel: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
    totalValue: { fontSize: 20, fontWeight: '800', color: '#004AAD' },
    paymentMethodText: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 10,
        fontStyle: 'italic',
    },
    infoBox: { padding: 15, backgroundColor: '#F0F7FF', borderRadius: 15 },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    infoLabel: { fontSize: 13, color: '#004AAD', fontWeight: '500' },
    infoValue: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
    ratingContainer: { backgroundColor: '#FFF', padding: 5 },
    starsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 15,
        justifyContent: 'center',
    },
    feedbackInput: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 12,
        height: 80,
        textAlignVertical: 'top',
        borderHorizontal: 1,
        borderColor: '#E2E8F0',
    },
    submitRatingBtn: {
        backgroundColor: '#004AAD',
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    submitRatingText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
})

export default OrderHistoryScreen
