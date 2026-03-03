import React from 'react'
import {
    View,
    Text,
    Modal,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import moment from 'moment'

const { height } = Dimensions.get('window')

const StaffOrderDetailsModal = ({ visible, order, onClose }) => {
    if (!order) return null

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    {/* Handlebar for visual "Sheet" look */}
                    <View style={styles.handle} />

                    <View style={styles.header}>
                        <Text style={styles.title}>Transaction Details</Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.closeBtn}
                        >
                            <Feather name="x" size={20} color="#64748B" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollBody}
                    >
                        {/* Status & Amount Hero Section */}
                        <View style={styles.heroSection}>
                            <View style={styles.iconCircle}>
                                <Feather
                                    name="check"
                                    size={30}
                                    color="#10B981"
                                />
                            </View>
                            <Text style={styles.heroAmount}>
                                ₹
                                {order.finalAmount?.toLocaleString('en-IN', {
                                    minimumFractionDigits: 2,
                                })}
                            </Text>
                            <Text style={styles.heroStatus}>
                                Payment Successful
                            </Text>
                        </View>

                        {/* Metadata Section */}
                        <View style={styles.infoGrid}>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>
                                    INVOICE NO.
                                </Text>
                                <Text style={styles.infoValue}>
                                    {order.invoiceNumber}
                                </Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>
                                    DATE & TIME
                                </Text>
                                <Text style={styles.infoValue}>
                                    {moment(order.createdAt).format(
                                        'DD MMM YYYY, hh:mm A'
                                    )}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        {/* Items Section */}
                        <Text style={styles.sectionTitle}>Order Summary</Text>
                        {order.items.map((item, index) => (
                            <View key={index} style={styles.itemRow}>
                                <View style={styles.itemMain}>
                                    <Text style={styles.itemName}>
                                        {item.name}
                                    </Text>
                                    <Text style={styles.itemQty}>
                                        Qty: {item.quantity}
                                    </Text>
                                </View>
                                <Text style={styles.itemPrice}>
                                    ₹{item.totalPrice?.toLocaleString('en-IN')}
                                </Text>
                            </View>
                        ))}

                        <View style={styles.dashedDivider} />

                        {/* Payment Summary */}
                        <View style={styles.paymentBox}>
                            <View style={styles.row}>
                                <Text style={styles.rowLabel}>Subtotal</Text>
                                <Text style={styles.rowValue}>
                                    ₹{order.subtotal?.toLocaleString('en-IN')}
                                </Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.rowLabel}>
                                    Tax & Service
                                </Text>
                                <Text style={styles.rowValue}>
                                    ₹{order.tax?.toLocaleString('en-IN')}
                                </Text>
                            </View>
                            <View style={[styles.row, { marginTop: 12 }]}>
                                <Text style={styles.totalLabel}>
                                    Total Amount
                                </Text>
                                <Text style={styles.totalValue}>
                                    ₹
                                    {order.finalAmount?.toLocaleString('en-IN')}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Action Footer */}
                    <SafeAreaView style={styles.footer}>
                        <TouchableOpacity style={styles.secondaryBtn}>
                            <Feather
                                name="download"
                                size={18}
                                color="#0F172A"
                            />
                            <Text style={styles.secondaryBtnText}>
                                Download PDF
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.primaryBtn}>
                            <Feather name="share-2" size={18} color="#FFF" />
                            <Text style={styles.primaryBtnText}>
                                Share Receipt
                            </Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>
            </View>
        </Modal>
    )
}

export default StaffOrderDetailsModal

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.6)', // Sleek dark overlay
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: '#FFF',
        height: height * 0.88,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#E2E8F0',
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
    },
    title: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
    closeBtn: {
        padding: 8,
        backgroundColor: '#F8FAFC',
        borderRadius: 20,
    },
    scrollBody: { paddingBottom: 40 },

    // Hero Section
    heroSection: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#ECFDF5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    heroAmount: {
        fontSize: 32,
        fontWeight: '800',
        color: '#0F172A',
        letterSpacing: -1,
    },
    heroStatus: {
        fontSize: 14,
        color: '#10B981',
        fontWeight: '600',
        marginTop: 4,
    },

    // Info Grid
    infoGrid: {
        flexDirection: 'row',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#F1F5F9',
        marginVertical: 10,
    },
    infoItem: { flex: 1 },
    infoLabel: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 13,
        color: '#334155',
        fontWeight: '600',
        marginTop: 4,
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 16,
        marginTop: 10,
    },

    // Item List
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    itemName: { fontSize: 15, fontWeight: '500', color: '#334155' },
    itemQty: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
    itemPrice: { fontSize: 15, fontWeight: '600', color: '#0F172A' },

    divider: { height: 1, backgroundColor: '#F1F5F9' },
    dashedDivider: {
        height: 1,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        marginVertical: 20,
    },

    // Payment Box
    paymentBox: {
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    rowLabel: { fontSize: 14, color: '#64748B' },
    rowValue: { fontSize: 14, color: '#0F172A', fontWeight: '600' },
    totalLabel: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
    totalValue: { fontSize: 18, fontWeight: '800', color: '#004AAD' },

    // Footer Buttons
    footer: {
        flexDirection: 'row',
        paddingVertical: 20,
        gap: 12,
        borderTopWidth: 1,
        borderColor: '#F1F5F9',
    },
    primaryBtn: {
        flex: 1.5,
        backgroundColor: '#0F172A',
        flexDirection: 'row',
        height: 52,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    primaryBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
    secondaryBtn: {
        flex: 1,
        backgroundColor: '#F1F5F9',
        flexDirection: 'row',
        height: 52,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    secondaryBtnText: { color: '#0F172A', fontWeight: '700', fontSize: 15 },
})
