import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as Clipboard from 'expo-clipboard'

const CouponsScreen = () => {
    const [loading, setLoading] = useState(true)
    const [coupons, setCoupons] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedCoupon, setSelectedCoupon] = useState(null)
    const [copiedId, setCopiedId] = useState(null)

    useEffect(() => {
        // Mock Data with Statuses and Savings Values
        setTimeout(() => {
            setCoupons([
                {
                    id: '1',
                    code: 'RKESTAR20',
                    discount: '20% OFF',
                    desc: 'On all AC installations',
                    status: 'active',
                    savingsValue: 1200,
                    color: '#004AAD',
                },
                {
                    id: '2',
                    code: 'SAVE500',
                    discount: '₹500 OFF',
                    desc: 'Min. purchase of ₹10,000',
                    status: 'active',
                    savingsValue: 500,
                    color: '#E91E63',
                },
                {
                    id: '3',
                    code: 'WELCOME75',
                    discount: '₹75 OFF',
                    desc: 'First purchase special',
                    status: 'redeemed',
                    savingsValue: 75,
                    color: '#4CAF50',
                },
                {
                    id: '4',
                    code: 'WINTER25',
                    discount: '25% OFF',
                    desc: 'Geyser Service Special',
                    status: 'expired',
                    savingsValue: 450,
                    color: '#FF9800',
                },
            ])
            setLoading(false)
        }, 800)
    }, [])

    // Calculate Total Savings
    const totalSaved = coupons
        .filter((c) => c.status === 'redeemed')
        .reduce((sum, item) => sum + item.savingsValue, 0)

    const openQR = (coupon) => {
        setSelectedCoupon(coupon)
        setModalVisible(true)
    }

    const copyToClipboard = async (code, id) => {
        await Clipboard.setStringAsync(code)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const renderCoupon = ({ item }) => {
        const isInactive = item.status !== 'active'

        return (
            <View
                style={[styles.couponWrapper, isInactive && { opacity: 0.7 }]}
            >
                <TouchableOpacity
                    activeOpacity={isInactive ? 1 : 0.8}
                    onPress={() => !isInactive && openQR(item)}
                    style={styles.couponCard}
                >
                    {/* Left Section */}
                    <View
                        style={[
                            styles.leftTab,
                            {
                                backgroundColor: isInactive
                                    ? '#9E9E9E'
                                    : item.color,
                            },
                        ]}
                    >
                        <Text style={styles.discountText}>{item.discount}</Text>
                        <MaterialCommunityIcons
                            name={
                                item.status === 'redeemed'
                                    ? 'check-decagram'
                                    : item.status === 'expired'
                                      ? 'clock-outline'
                                      : 'qrcode-scan'
                            }
                            size={22}
                            color="rgba(255,255,255,0.7)"
                            style={{ marginTop: 5 }}
                        />
                    </View>

                    {/* Right Content */}
                    <View style={styles.rightContent}>
                        <View style={styles.rowJustify}>
                            <Text
                                style={[
                                    styles.couponDesc,
                                    isInactive && { color: '#888' },
                                ]}
                            >
                                {item.desc}
                            </Text>
                            {isInactive && (
                                <View
                                    style={[
                                        styles.statusBadge,
                                        {
                                            backgroundColor:
                                                item.status === 'expired'
                                                    ? '#FFEBEE'
                                                    : '#E8F5E9',
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.statusText,
                                            {
                                                color:
                                                    item.status === 'expired'
                                                        ? '#D32F2F'
                                                        : '#2E7D32',
                                            },
                                        ]}
                                    >
                                        {item.status.toUpperCase()}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            disabled={isInactive}
                            activeOpacity={0.8}
                            style={[
                                styles.codeContainer,
                                copiedId === item.id && styles.copiedContainer,
                            ]}
                            onPress={() => copyToClipboard(item.code, item.id)}
                        >
                            <Text
                                style={[
                                    styles.codeText,
                                    isInactive && { color: '#aaa' },
                                ]}
                            >
                                {copiedId === item.id ? 'COPIED!' : item.code}
                            </Text>
                            {!isInactive && (
                                <MaterialCommunityIcons
                                    name="content-copy"
                                    size={14}
                                    color="#666"
                                />
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Aesthetic Cutouts */}
                    <View style={styles.cutoutTop} />
                    <View style={styles.cutoutBottom} />
                </TouchableOpacity>
            </View>
        )
    }

    if (loading)
        return (
            <ActivityIndicator
                size="large"
                color="#004AAD"
                style={{ flex: 1 }}
            />
        )

    return (
        <View style={styles.container}>
            {/* Header / Savings Dashboard */}
            <View style={styles.headerSection}>
                <Text style={styles.headerTitle}>My Rewards</Text>
                <View style={styles.savingsDashboard}>
                    <View>
                        <Text style={styles.savingsLabel}>
                            Total Value Saved
                        </Text>
                        <Text style={styles.savingsAmount}>₹{totalSaved}</Text>
                    </View>
                    <View style={styles.savingsIconBox}>
                        <MaterialCommunityIcons
                            name="wallet-giftcard"
                            size={30}
                            color="#004AAD"
                        />
                    </View>
                </View>
            </View>

            <FlatList
                data={coupons}
                renderItem={renderCoupon}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                ListHeaderComponent={
                    <Text style={styles.listSectionTitle}>
                        Available Vouchers
                    </Text>
                }
            />

            {/* REDEEM MODAL */}
            <Modal
                animationType="slide"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <View
                            style={[
                                styles.modalHeader,
                                { backgroundColor: selectedCoupon?.color },
                            ]}
                        >
                            <Text style={styles.modalHeaderText}>
                                Show at Checkout
                            </Text>
                        </View>
                        <View style={styles.modalBody}>
                            <Text style={styles.modalDesc}>
                                {selectedCoupon?.desc}
                            </Text>
                            <View style={styles.qrFrame}>
                                <MaterialCommunityIcons
                                    name="qrcode"
                                    size={180}
                                    color="#1A1A1A"
                                />
                            </View>
                            <Text style={styles.modalCodeDisplay}>
                                {selectedCoupon?.code}
                            </Text>
                            <Text style={styles.modalHint}>
                                Scan this code at any RK Electronics outlet in
                                Ballari to apply your discount.
                            </Text>
                            <TouchableOpacity
                                style={styles.doneButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.doneButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FB', paddingHorizontal: 20 },
    headerSection: { marginTop: 50, marginBottom: 20 },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 15,
    },

    // Savings Dashboard
    savingsDashboard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    savingsLabel: { fontSize: 13, color: '#7C7C7C', fontWeight: '600' },
    savingsAmount: { fontSize: 26, fontWeight: 'bold', color: '#004AAD' },
    savingsIconBox: {
        backgroundColor: '#F0F5FF',
        padding: 10,
        borderRadius: 12,
    },

    listSectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#444',
        marginBottom: 15,
        marginTop: 10,
    },

    // Coupon Styling
    couponWrapper: { marginBottom: 16 },
    couponCard: {
        backgroundColor: '#fff',
        height: 110,
        borderRadius: 16,
        flexDirection: 'row',
        overflow: 'hidden',
        elevation: 3,
    },
    leftTab: {
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    discountText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 18,
        textAlign: 'center',
    },
    rightContent: { flex: 1, padding: 15, justifyContent: 'space-between' },
    rowJustify: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    couponDesc: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
        flex: 1,
        marginRight: 5,
    },

    statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    statusText: { fontSize: 9, fontWeight: 'bold' },

    codeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        padding: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#D1D1D1',
    },
    copiedContainer: { borderColor: '#4CAF50', backgroundColor: '#E8F5E9' },
    codeText: {
        fontWeight: 'bold',
        marginRight: 8,
        fontSize: 12,
        letterSpacing: 1,
    },

    cutoutTop: {
        position: 'absolute',
        top: -10,
        left: '30%',
        marginLeft: -10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F8F9FB',
    },
    cutoutBottom: {
        position: 'absolute',
        bottom: -10,
        left: '30%',
        marginLeft: -10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F8F9FB',
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 25,
        overflow: 'hidden',
    },
    modalHeader: { padding: 20, alignItems: 'center' },
    modalHeaderText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    modalBody: { padding: 25, alignItems: 'center' },
    modalDesc: {
        fontSize: 16,
        fontWeight: '600',
        color: '#444',
        textAlign: 'center',
        marginBottom: 20,
    },
    qrFrame: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 15,
        marginBottom: 20,
    },
    modalCodeDisplay: {
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: 3,
        color: '#1A1A1A',
        marginBottom: 10,
    },
    modalHint: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
        marginBottom: 20,
    },
    doneButton: {
        backgroundColor: '#004AAD',
        width: '100%',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    doneButtonText: { color: '#fff', fontWeight: 'bold' },
})

export default CouponsScreen
