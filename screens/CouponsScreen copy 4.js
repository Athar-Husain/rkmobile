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
    Dimensions,
    SafeAreaView,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as Clipboard from 'expo-clipboard'
import { fetchMyCoupons } from '../redux/features/Coupons/CouponSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import CouponList from '../containers/Coupons/CouponList'

const { width } = Dimensions.get('window')

const CouponsScreen = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [coupons, setCoupons] = useState([])
    const [activeTab, setActiveTab] = useState('active') // 'active' or 'history'
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedCoupon, setSelectedCoupon] = useState(null)
    const [copiedId, setCopiedId] = useState(null)

    const { myCoupons, isCouponLoading } = useSelector((state) => state.coupon)

    console.log('myCoupons', myCoupons)

    // useEffect(() => {
    //     dispatch(fetchMyCoupons())
    // }, [dispatch])

    useFocusEffect(
        React.useCallback(() => {
            dispatch(fetchMyCoupons())
        }, [dispatch])
    )

    useEffect(() => {
        // Simulating API Fetch
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

    const filteredCoupons = coupons.filter((c) =>
        activeTab === 'active' ? c.status === 'active' : c.status !== 'active'
    )

    const totalSaved = coupons
        .filter((c) => c.status === 'redeemed')
        .reduce((sum, item) => sum + item.savingsValue, 0)

    const copyToClipboard = async (code, id) => {
        await Clipboard.setStringAsync(code)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const renderCoupon = ({ item }) => {
        const isHistory = item.status !== 'active'

        return (
            <View
                style={[
                    styles.couponWrapper,
                    isHistory && styles.historyOpacity,
                ]}
            >
                <TouchableOpacity
                    activeOpacity={isHistory ? 1 : 0.8}
                    onPress={() =>
                        !isHistory &&
                        (setSelectedCoupon(item), setModalVisible(true))
                    }
                    style={styles.couponCard}
                >
                    <View
                        style={[
                            styles.leftTab,
                            {
                                backgroundColor: isHistory
                                    ? '#BDC3C7'
                                    : item.color,
                            },
                        ]}
                    >
                        <Text style={styles.discountText}>{item.discount}</Text>
                        <MaterialCommunityIcons
                            name={
                                item.status === 'redeemed'
                                    ? 'check-circle'
                                    : item.status === 'expired'
                                      ? 'close-circle'
                                      : 'ticket-percent'
                            }
                            size={20}
                            color="white"
                        />
                    </View>

                    <View style={styles.rightContent}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.couponDesc} numberOfLines={2}>
                                {item.desc}
                            </Text>
                            {isHistory && (
                                <View
                                    style={[
                                        styles.statusBadge,
                                        {
                                            backgroundColor:
                                                item.status === 'expired'
                                                    ? '#FDEDEC'
                                                    : '#EAFAF1',
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.statusText,
                                            {
                                                color:
                                                    item.status === 'expired'
                                                        ? '#E74C3C'
                                                        : '#27AE60',
                                            },
                                        ]}
                                    >
                                        {item.status.toUpperCase()}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            disabled={isHistory}
                            onPress={() => copyToClipboard(item.code, item.id)}
                            style={[
                                styles.codeContainer,
                                copiedId === item.id && styles.copiedContainer,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.codeText,
                                    isHistory && { color: '#999' },
                                ]}
                            >
                                {copiedId === item.id ? 'COPIED!' : item.code}
                            </Text>
                            {!isHistory && (
                                <MaterialCommunityIcons
                                    name="content-copy"
                                    size={14}
                                    color="#004AAD"
                                />
                            )}
                        </TouchableOpacity>
                    </View>

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
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                {/* 1. Enhanced Dashboard Section */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Rewards Center</Text>
                    <View style={styles.dashboardCard}>
                        <View>
                            <Text style={styles.dashLabel}>
                                Lifetime Savings
                            </Text>
                            <Text style={styles.dashAmount}>₹{totalSaved}</Text>
                        </View>
                        <View style={styles.progressContainer}>
                            <Text style={styles.progressText}>
                                ₹300 to next Reward
                            </Text>
                            <View style={styles.progressBarBg}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        { width: '70%' },
                                    ]}
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* 2. Custom Tab Switcher */}
                <View style={styles.tabContainer}>
                    {['active', 'history'].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.tab,
                                activeTab === tab && styles.activeTab,
                            ]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === tab && styles.activeTabText,
                                ]}
                            >
                                {tab === 'active'
                                    ? 'Available'
                                    : 'Past Vouchers'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <FlatList
                    data={filteredCoupons}
                    renderItem={renderCoupon}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        paddingBottom: 30,
                    }}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons
                                name="ticket-outline"
                                size={80}
                                color="#DCDDE1"
                            />
                            <Text style={styles.emptyTitle}>
                                No Vouchers Yet
                            </Text>
                            <Text style={styles.emptySub}>
                                Keep shopping to unlock exclusive deals!
                            </Text>
                        </View>
                    }
                />

                {/* Modal remains largely the same but with style tweaks for "Premium" feel */}
                {/* ... Modal Code ... */}

                <CouponList />

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
                                    Scan this code at any RK Electronics outlet
                                    in Ballari to apply your discount.
                                </Text>
                                <TouchableOpacity
                                    style={styles.doneButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.doneButtonText}>
                                        Close
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Pressable>
                </Modal>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FB' },
    header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 20,
    },

    // Dashboard
    dashboardCard: {
        backgroundColor: '#004AAD',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dashLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
    dashAmount: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
    progressContainer: { alignItems: 'flex-end', width: '40%' },
    progressText: { color: '#FFF', fontSize: 10, marginBottom: 5 },
    progressBarBg: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 3,
    },
    progressBarFill: { height: 6, backgroundColor: '#FFF', borderRadius: 3 },

    // Tabs
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: '#EEE',
        borderRadius: 12,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTab: { backgroundColor: '#FFF', elevation: 2 },
    tabText: { fontSize: 14, color: '#7F8C8D', fontWeight: '600' },
    activeTabText: { color: '#004AAD' },

    // Coupon Card
    couponWrapper: { marginBottom: 15 },
    historyOpacity: { opacity: 0.8 },
    couponCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        height: 110,
        flexDirection: 'row',
        overflow: 'hidden',
        elevation: 3,
    },
    leftTab: { width: '28%', justifyContent: 'center', alignItems: 'center' },
    discountText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    },
    rightContent: { flex: 1, padding: 15, justifyContent: 'space-between' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    couponDesc: { fontSize: 14, fontWeight: '700', color: '#2C3E50', flex: 1 },
    codeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#F0F5FF',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#004AAD',
    },
    copiedContainer: { backgroundColor: '#EAFAF1', borderColor: '#27AE60' },
    codeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#004AAD',
        marginRight: 10,
    },

    // Visuals
    cutoutTop: {
        position: 'absolute',
        top: -10,
        left: '28%',
        marginLeft: -10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F8F9FB',
    },
    cutoutBottom: {
        position: 'absolute',
        bottom: -10,
        left: '28%',
        marginLeft: -10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F8F9FB',
    },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    statusText: { fontSize: 10, fontWeight: 'bold' },

    emptyState: { alignItems: 'center', marginTop: 60 },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#7F8C8D',
        marginTop: 15,
    },
    emptySub: { color: '#95A5A6', marginTop: 5 },

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
