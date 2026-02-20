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
import { addRating } from '../../redux/features/Purchases/PurchaseSlice.js'

// Import your Redux actions
// import { getMyPurchases, addRating } from '../../../redux/features/Purchase/PurchaseSlice';

const { height, width } = Dimensions.get('window')

/* =============================================================================
   SUB-COMPONENT: OrderDetailsModal
   ============================================================================= */
const OrderDetailsModal = ({ visible, order, onClose }) => {
    const dispatch = useDispatch()
    const [userRating, setUserRating] = useState(0)
    const [feedback, setFeedback] = useState('')
    const { isPurchaseLoading } = useSelector((state) => state.purchase)

    // Reset local state when order changes
    useEffect(() => {
        if (order) {
            setUserRating(order.rating || 0)
            setFeedback(order.feedback || '')
        }
    }, [order])

    if (!order) return null

    const handleSubmitReview = () => {
        dispatch(
            addRating({
                id: order._id,
                data: { rating: userRating, feedback: feedback },
            })
        )
    }

    const Section = ({ title, children, icon }) => (
        <View style={styles.modalSection}>
            <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name={icon} size={18} color="#004AAD" />
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            {children}
        </View>
    )

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}
            >
                <View style={styles.modalContent}>
                    {/* Handle bar for visual cue */}
                    <View style={styles.modalHandle} />

                    <View style={styles.modalHeader}>
                        <Text style={styles.modalHeaderTitle}>
                            Invoice Details
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.closeBtn}
                        >
                            <MaterialCommunityIcons
                                name="close"
                                size={22}
                                color="#333"
                            />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.modalScroll}
                    >
                        {/* 1. Summary Header */}
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryInvoice}>
                                {order.invoiceNumber}
                            </Text>
                            <Text style={styles.summaryDate}>
                                {moment(order.createdAt).format('LLLL')}
                            </Text>
                            <View style={styles.statusRow}>
                                <Text style={styles.statusLabel}>
                                    Order Status:{' '}
                                </Text>
                                <Text
                                    style={[
                                        styles.statusValue,
                                        {
                                            color:
                                                order.status === 'COMPLETED'
                                                    ? '#2E7D32'
                                                    : '#C62828',
                                        },
                                    ]}
                                >
                                    {order.status}
                                </Text>
                            </View>
                        </View>

                        {/* 2. Items List */}
                        <Section title="Items Purchased" icon="basket-outline">
                            {order.items.map((item, index) => (
                                <View key={index} style={styles.itemRow}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.itemNameText}>
                                            {item.name}
                                        </Text>
                                        <Text style={styles.itemSubText}>
                                            {item.brand} • {item.model}
                                        </Text>
                                    </View>
                                    <Text style={styles.itemQty}>
                                        x{item.quantity}
                                    </Text>
                                    <Text style={styles.itemPrice}>
                                        ₹
                                        {item.totalPrice?.toLocaleString(
                                            'en-IN'
                                        )}
                                    </Text>
                                </View>
                            ))}
                        </Section>

                        {/* 3. Warranty Info */}
                        {order.warranty?.endDate && (
                            <Section
                                title="Warranty Details"
                                icon="shield-check-outline"
                            >
                                <View style={styles.infoBox}>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.infoLabel}>
                                            Coverage Until:
                                        </Text>
                                        <Text style={styles.infoValue}>
                                            {moment(
                                                order.warranty.endDate
                                            ).format('DD MMM YYYY')}
                                        </Text>
                                    </View>
                                    {order.warranty.cardNumber && (
                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoLabel}>
                                                Warranty Card:
                                            </Text>
                                            <Text style={styles.infoValue}>
                                                {order.warranty.cardNumber}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </Section>
                        )}

                        {/* 4. Payment Details */}
                        <Section title="Payment Summary" icon="cash-register">
                            <View style={styles.billRow}>
                                <Text style={styles.billLabel}>Subtotal</Text>
                                <Text style={styles.billValue}>
                                    ₹{order.subtotal?.toLocaleString('en-IN')}
                                </Text>
                            </View>
                            <View style={styles.billRow}>
                                <Text style={styles.billLabel}>
                                    Tax & Charges
                                </Text>
                                <Text style={styles.billValue}>
                                    +₹{order.tax?.toLocaleString('en-IN')}
                                </Text>
                            </View>
                            <View style={styles.billRow}>
                                <Text
                                    style={[
                                        styles.billLabel,
                                        { color: '#2E7D32' },
                                    ]}
                                >
                                    Discount Applied
                                </Text>
                                <Text
                                    style={[
                                        styles.billValue,
                                        { color: '#2E7D32' },
                                    ]}
                                >
                                    -₹{order.discount?.toLocaleString('en-IN')}
                                </Text>
                            </View>
                            <View style={[styles.billRow, styles.totalRow]}>
                                <Text style={styles.totalLabel}>
                                    Grand Total
                                </Text>
                                <Text style={styles.totalValue}>
                                    ₹
                                    {order.finalAmount?.toLocaleString('en-IN')}
                                </Text>
                            </View>
                            <Text style={styles.paymentMethodText}>
                                Paid via {order.payment?.method} (
                                {order.payment?.status})
                            </Text>
                        </Section>

                        {/* 5. Rating & Feedback System */}
                        <Section title="Rate your Purchase" icon="star-outline">
                            <View style={styles.ratingContainer}>
                                <View style={styles.starsRow}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <TouchableOpacity
                                            key={star}
                                            onPress={() => setUserRating(star)}
                                        >
                                            <MaterialCommunityIcons
                                                name={
                                                    star <= userRating
                                                        ? 'star'
                                                        : 'star-outline'
                                                }
                                                size={32}
                                                color={
                                                    star <= userRating
                                                        ? '#FFB400'
                                                        : '#CCC'
                                                }
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <TextInput
                                    style={styles.feedbackInput}
                                    placeholder="Tell us about your experience..."
                                    value={feedback}
                                    onChangeText={setFeedback}
                                    multiline
                                />
                                <TouchableOpacity
                                    style={[
                                        styles.submitRatingBtn,
                                        (userRating === 0 ||
                                            isPurchaseLoading) && {
                                            opacity: 0.6,
                                        },
                                    ]}
                                    onPress={handleSubmitReview}
                                    disabled={
                                        userRating === 0 || isPurchaseLoading
                                    }
                                >
                                    {isPurchaseLoading ? (
                                        <ActivityIndicator color="#FFF" />
                                    ) : (
                                        <Text style={styles.submitRatingText}>
                                            Update Review
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </Section>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

const styles = StyleSheet.create({
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
export default OrderDetailsModal
