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
import { useTheme } from '../../theme/ThemeProvider' // Added theme hook
import { COLORS } from '../../constants'

const { height } = Dimensions.get('window')

const StaffOrderDetailsModal = ({ visible, order, onClose }) => {
    const { colors, dark } = useTheme()

    if (!order) return null

    // Dynamic styles for the specific sheet components
    const sheetBg = dark ? '#1C1C1E' : '#FFFFFF'
    const secondarySurface = dark ? '#2C2C2E' : '#F8FAFC'
    const borderColor = dark ? '#38383A' : '#F1F5F9'
    const mutedText = dark ? '#8E8E93' : '#64748B'

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={[styles.content, { backgroundColor: sheetBg }]}>
                    {/* Handlebar */}
                    <View
                        style={[
                            styles.handle,
                            { backgroundColor: dark ? '#3A3A3C' : '#E2E8F0' },
                        ]}
                    />

                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>
                            Transaction Details
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[
                                styles.closeBtn,
                                { backgroundColor: secondarySurface },
                            ]}
                        >
                            <Feather name="x" size={20} color={mutedText} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollBody}
                    >
                        {/* Status & Amount Hero Section */}
                        <View style={styles.heroSection}>
                            <View
                                style={[
                                    styles.iconCircle,
                                    {
                                        backgroundColor: dark
                                            ? 'rgba(16, 185, 129, 0.1)'
                                            : '#ECFDF5',
                                    },
                                ]}
                            >
                                <Feather
                                    name="check"
                                    size={30}
                                    color="#10B981"
                                />
                            </View>
                            <Text
                                style={[
                                    styles.heroAmount,
                                    { color: colors.text },
                                ]}
                            >
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
                        <View
                            style={[
                                styles.infoGrid,
                                { borderColor: borderColor },
                            ]}
                        >
                            <View style={styles.infoItem}>
                                <Text
                                    style={[
                                        styles.infoLabel,
                                        { color: mutedText },
                                    ]}
                                >
                                    INVOICE NO.
                                </Text>
                                <Text
                                    style={[
                                        styles.infoValue,
                                        { color: colors.text },
                                    ]}
                                >
                                    {order.invoiceNumber}
                                </Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text
                                    style={[
                                        styles.infoLabel,
                                        { color: mutedText },
                                    ]}
                                >
                                    DATE & TIME
                                </Text>
                                <Text
                                    style={[
                                        styles.infoValue,
                                        { color: colors.text },
                                    ]}
                                >
                                    {moment(order.createdAt).format(
                                        'DD MMM YYYY, hh:mm A'
                                    )}
                                </Text>
                            </View>
                        </View>

                        {/* Items Section */}
                        <Text
                            style={[
                                styles.sectionTitle,
                                { color: colors.text },
                            ]}
                        >
                            Order Summary
                        </Text>
                        {order.items.map((item, index) => (
                            <View key={index} style={styles.itemRow}>
                                <View style={styles.itemMain}>
                                    <Text
                                        style={[
                                            styles.itemName,
                                            { color: colors.text },
                                        ]}
                                    >
                                        {item.name}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.itemQty,
                                            { color: mutedText },
                                        ]}
                                    >
                                        Qty: {item.quantity}
                                    </Text>
                                </View>
                                <Text
                                    style={[
                                        styles.itemPrice,
                                        { color: colors.text },
                                    ]}
                                >
                                    ₹{item.totalPrice?.toLocaleString('en-IN')}
                                </Text>
                            </View>
                        ))}

                        <View
                            style={[
                                styles.dashedDivider,
                                { borderColor: dark ? '#48484A' : '#E2E8F0' },
                            ]}
                        />

                        {/* Payment Summary */}
                        <View
                            style={[
                                styles.paymentBox,
                                { backgroundColor: secondarySurface },
                            ]}
                        >
                            <View style={styles.row}>
                                <Text
                                    style={[
                                        styles.rowLabel,
                                        { color: mutedText },
                                    ]}
                                >
                                    Subtotal
                                </Text>
                                <Text
                                    style={[
                                        styles.rowValue,
                                        { color: colors.text },
                                    ]}
                                >
                                    ₹{order.subtotal?.toLocaleString('en-IN')}
                                </Text>
                            </View>
                            <View style={styles.row}>
                                <Text
                                    style={[
                                        styles.rowLabel,
                                        { color: mutedText },
                                    ]}
                                >
                                    Tax & Service
                                </Text>
                                <Text
                                    style={[
                                        styles.rowValue,
                                        { color: colors.text },
                                    ]}
                                >
                                    ₹{order.tax?.toLocaleString('en-IN')}
                                </Text>
                            </View>
                            <View style={[styles.row, { marginTop: 12 }]}>
                                <Text
                                    style={[
                                        styles.totalLabel,
                                        { color: colors.text },
                                    ]}
                                >
                                    Total Amount
                                </Text>
                                <Text
                                    style={[
                                        styles.totalValue,
                                        { color: dark ? '#58A6FF' : '#004AAD' },
                                    ]}
                                >
                                    ₹
                                    {order.finalAmount?.toLocaleString('en-IN')}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Action Footer */}
                    <SafeAreaView
                        style={[styles.footer, { borderColor: borderColor }]}
                    >
                        <TouchableOpacity
                            style={[
                                styles.secondaryBtn,
                                {
                                    backgroundColor: dark
                                        ? '#2C2C2E'
                                        : '#F1F5F9',
                                },
                            ]}
                        >
                            <Feather
                                name="download"
                                size={18}
                                color={colors.text}
                            />
                            <Text
                                style={[
                                    styles.secondaryBtnText,
                                    { color: colors.text },
                                ]}
                            >
                                PDF
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.primaryBtn,
                                {
                                    backgroundColor: dark
                                        ? COLORS.primary
                                        : '#0F172A',
                                },
                            ]}
                        >
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    content: {
        height: height * 0.88,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
    },
    handle: {
        width: 40,
        height: 5,
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
    title: { fontSize: 18, fontWeight: '700' },
    closeBtn: {
        padding: 8,
        borderRadius: 20,
    },
    scrollBody: { paddingBottom: 40 },
    heroSection: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    heroAmount: {
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: -1,
    },
    heroStatus: {
        fontSize: 14,
        color: '#10B981',
        fontWeight: '600',
        marginTop: 4,
    },
    infoGrid: {
        flexDirection: 'row',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginVertical: 10,
    },
    infoItem: { flex: 1 },
    infoLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 13,
        fontWeight: '600',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 16,
        marginTop: 10,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    itemName: { fontSize: 15, fontWeight: '500' },
    itemQty: { fontSize: 12, marginTop: 2 },
    itemPrice: { fontSize: 15, fontWeight: '600' },
    dashedDivider: {
        height: 1,
        borderWidth: 1,
        borderStyle: 'dashed',
        marginVertical: 20,
    },
    paymentBox: {
        padding: 16,
        borderRadius: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    rowLabel: { fontSize: 14 },
    rowValue: { fontSize: 14, fontWeight: '600' },
    totalLabel: { fontSize: 16, fontWeight: '700' },
    totalValue: { fontSize: 18, fontWeight: '800' },
    footer: {
        flexDirection: 'row',
        paddingVertical: 20,
        gap: 12,
        borderTopWidth: 1,
    },
    primaryBtn: {
        flex: 1.5,
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
        flexDirection: 'row',
        height: 52,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    secondaryBtnText: { fontWeight: '700', fontSize: 15 },
})
