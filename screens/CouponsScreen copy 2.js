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
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as Clipboard from 'expo-clipboard'

const CouponsScreen = () => {
    const [loading, setLoading] = useState(true)
    const [coupons, setCoupons] = useState([])
    const [copiedId, setCopiedId] = useState(null)

    // Modal State
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedCoupon, setSelectedCoupon] = useState(null)

    useEffect(() => {
        setTimeout(() => {
            setCoupons([
                {
                    id: '1',
                    code: 'RKESTAR20',
                    discount: '20% OFF',
                    desc: 'On all AC installations',
                    expiry: 'Ends 15 Feb',
                    color: '#004AAD',
                },
                {
                    id: '2',
                    code: 'SAVE500',
                    discount: '₹500 OFF',
                    desc: 'Min. purchase of ₹10,000',
                    expiry: 'Valid for 3 days',
                    color: '#E91E63',
                },
                {
                    id: '3',
                    code: 'FREEFIX',
                    discount: 'FREE SVC',
                    desc: 'First service for new users',
                    expiry: 'Limited Period',
                    color: '#4CAF50',
                },
            ])
            setLoading(false)
        }, 800)
    }, [])

    const openQR = (coupon) => {
        setSelectedCoupon(coupon)
        setModalVisible(true)
    }

    const copyToClipboard = async (code, id) => {
        await Clipboard.setStringAsync(code)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const renderCoupon = ({ item }) => (
        <View style={styles.couponWrapper}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => openQR(item)}
                style={styles.couponCard}
            >
                <View style={[styles.leftTab, { backgroundColor: item.color }]}>
                    <Text style={styles.discountText}>{item.discount}</Text>
                    <View style={styles.dashLine} />
                    <MaterialCommunityIcons
                        name="qrcode-scan"
                        size={24}
                        color="rgba(255,255,255,0.7)"
                    />
                </View>

                <View style={styles.rightContent}>
                    <View>
                        <Text style={styles.couponDesc}>{item.desc}</Text>
                        <Text style={styles.expiryText}>{item.expiry}</Text>
                    </View>

                    <TouchableOpacity
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
                                copiedId === item.id && { color: '#2E7D32' },
                            ]}
                        >
                            {copiedId === item.id ? 'COPIED!' : item.code}
                        </Text>
                        <MaterialCommunityIcons
                            name="content-copy"
                            size={14}
                            color="#666"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.cutoutTop} />
                <View style={styles.cutoutBottom} />
            </TouchableOpacity>
        </View>
    )

    return (
        <View style={styles.container}>
            <View style={styles.headerSection}>
                <Text style={styles.headerTitle}>Vouchers</Text>
                <Text style={styles.subTitle}>
                    Tap a coupon to show at counter
                </Text>
            </View>

            <FlatList
                data={coupons}
                renderItem={renderCoupon}
                keyExtractor={(item) => item.id}
            />

            {/* QR CODE MODAL */}
            <Modal
                animationType="fade"
                transparent={true}
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
                                Redeem Offer
                            </Text>
                        </View>

                        <View style={styles.modalBody}>
                            <Text style={styles.modalDesc}>
                                {selectedCoupon?.desc}
                            </Text>

                            {/* QR Placeholder */}
                            <View style={styles.qrContainer}>
                                <MaterialCommunityIcons
                                    name="qrcode"
                                    size={180}
                                    color="#1A1A1A"
                                />
                                <View style={styles.qrFrame} />
                            </View>

                            <Text style={styles.modalCodeText}>
                                {selectedCoupon?.code}
                            </Text>
                            <Text style={styles.instructions}>
                                Please show this QR code to the cashier at RK
                                Electronics.
                            </Text>

                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>Done</Text>
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
    headerSection: { marginTop: 50, marginBottom: 25 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A' },
    subTitle: { fontSize: 14, color: '#7C7C7C', marginTop: 4 },

    // Coupon Styles
    couponWrapper: { marginBottom: 18, elevation: 4 },
    couponCard: {
        backgroundColor: '#fff',
        height: 110,
        borderRadius: 16,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    leftTab: { width: '32%', justifyContent: 'center', alignItems: 'center' },
    discountText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 18,
        textAlign: 'center',
    },
    dashLine: {
        height: 1,
        width: '60%',
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginVertical: 8,
    },
    rightContent: { flex: 1, padding: 15, justifyContent: 'space-between' },
    couponDesc: { fontSize: 15, fontWeight: '700', color: '#333' },
    expiryText: { fontSize: 12, color: '#9E9E9E' },
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
    codeText: { fontWeight: 'bold', marginRight: 8, fontSize: 13 },
    cutoutTop: {
        position: 'absolute',
        top: -10,
        left: '32%',
        marginLeft: -10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F8F9FB',
    },
    cutoutBottom: {
        position: 'absolute',
        bottom: -10,
        left: '32%',
        marginLeft: -10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F8F9FB',
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 24,
        overflow: 'hidden',
        alignItems: 'center',
    },
    modalHeader: { width: '100%', padding: 20, alignItems: 'center' },
    modalHeaderText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    modalBody: { padding: 25, alignItems: 'center', width: '100%' },
    modalDesc: {
        fontSize: 16,
        fontWeight: '600',
        color: '#444',
        textAlign: 'center',
        marginBottom: 20,
    },
    qrContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#eee',
    },
    modalCodeText: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1A1A1A',
        letterSpacing: 2,
        marginBottom: 10,
    },
    instructions: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
        marginBottom: 25,
    },
    closeButton: {
        backgroundColor: '#004AAD',
        width: '100%',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    closeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
})

export default CouponsScreen
