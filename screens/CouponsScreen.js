import React, { useState, useCallback } from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    Pressable,
    SafeAreaView,
    Dimensions,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import QRCode from 'react-native-qrcode-svg'
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import {
    fetchDiscoverCoupons,
    fetchActiveCoupons,
    fetchHistoryCoupons,
    fetchUserSavings,
    claimCouponUser,
} from '../redux/features/Coupons/CouponSlice'

const { width } = Dimensions.get('window')

const CouponsScreen = () => {
    const dispatch = useDispatch()
    const [activeTab, setActiveTab] = useState('discover')
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedCoupon, setSelectedCoupon] = useState(null)

    // Redux state
    const {
        discoverCoupons,
        activeCoupons,
        historyCoupons,
        userSavings,
        isCouponLoading,
    } = useSelector((state) => state.coupon)

    const fetchCoupons = useCallback(async () => {
        dispatch(fetchUserSavings())
        if (activeTab === 'discover') {
            const res = await dispatch(fetchDiscoverCoupons())
            if (res.meta.requestStatus === 'fulfilled') {
                const allCoupons = Object.values(
                    res.payload.categorizedCoupons || {}
                ).flat()
                const sortedCoupons = allCoupons.sort((a, b) => {
                    const createdDiff =
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    if (createdDiff !== 0) return createdDiff
                    return (
                        new Date(a.validUntil).getTime() -
                        new Date(b.validUntil).getTime()
                    )
                })
                dispatch({
                    type: 'coupon/setDiscoverCoupons',
                    payload: sortedCoupons,
                })
            }
        }
        if (activeTab === 'active') await dispatch(fetchActiveCoupons())
        if (activeTab === 'history') {
            await Promise.all([
                dispatch(fetchHistoryCoupons()),
                dispatch(fetchUserSavings()),
            ])
        }
    }, [activeTab, dispatch])

    useFocusEffect(
        useCallback(() => {
            fetchCoupons()
        }, [fetchCoupons])
    )

    const handleClaim = (id) => {
        dispatch(claimCouponUser(id)).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') {
                setActiveTab('active')
            }
        })
    }

    const renderHeader = () => (
        <View style={styles.savingsCard}>
            <View>
                <Text style={styles.savingsLabel}>Total Savings</Text>
                <Text style={styles.savingsValue}>
                    ₹{userSavings.totalAmount || 0}
                </Text>
            </View>
            <View style={styles.savingsStat}>
                <Text style={styles.savingsLabel}>Redeemed</Text>
                <Text style={styles.savingsValue}>
                    {userSavings.count || 0}
                </Text>
            </View>
            <MaterialCommunityIcons
                name="wallet-giftcard"
                size={40}
                color="rgba(255,255,255,0.3)"
            />
        </View>
    )

    const renderCoupon = useCallback(
        ({ item }) => {
            const isDiscover = activeTab === 'discover'
            const isHistory = activeTab === 'history'
            const couponData = item.couponId || item

            const now = new Date()
            const expiryDate = new Date(couponData.validUntil)
            const daysLeft = Math.max(
                Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24)),
                0
            )

            const themeColor =
                daysLeft <= 2 && expiryDate > now
                    ? '#E74C3C'
                    : couponData.color || '#004AAD'

            return (
                <TouchableOpacity
                    activeOpacity={isDiscover ? 1 : 0.8}
                    onPress={() => {
                        if (activeTab === 'active') {
                            setSelectedCoupon(item)
                            setModalVisible(true)
                        }
                    }}
                    style={[styles.couponCard, isHistory && { opacity: 0.7 }]}
                >
                    {/* Left Discount Panel */}
                    <View
                        style={[
                            styles.leftTab,
                            {
                                backgroundColor: isHistory
                                    ? '#BDC3C7'
                                    : themeColor,
                            },
                        ]}
                    >
                        <Text style={styles.discountText}>
                            {couponData.type === 'PERCENTAGE'
                                ? `${couponData.value}%`
                                : `₹${couponData.value}`}
                            {'\n'}OFF
                        </Text>
                        <View style={styles.cutoutTop} />
                        <View style={styles.cutoutBottom} />
                    </View>

                    {/* Right Content */}
                    <View style={styles.rightContent}>
                        <Text style={styles.couponTitle} numberOfLines={1}>
                            {couponData.title}
                        </Text>

                        <Text style={styles.couponSub} numberOfLines={2}>
                            {couponData.description}
                        </Text>

                        <Text style={styles.couponExpiry}>
                            {expiryDate > now
                                ? `Expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`
                                : 'Expired'}
                        </Text>

                        {isDiscover ? (
                            <TouchableOpacity
                                style={[
                                    styles.claimBtn,
                                    { backgroundColor: themeColor },
                                ]}
                                onPress={() => handleClaim(couponData._id)}
                                disabled={couponData.status !== 'ACTIVE'}
                            >
                                <Text style={styles.claimBtnText}>
                                    {couponData.status === 'ACTIVE'
                                        ? 'CLAIM OFFER'
                                        : 'CLAIMED'}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.statusRow}>
                                <MaterialCommunityIcons
                                    name={
                                        isHistory
                                            ? 'check-circle-outline'
                                            : 'qrcode-scan'
                                    }
                                    size={16}
                                    color={isHistory ? '#7f8c8d' : themeColor}
                                />
                                <Text
                                    style={[
                                        styles.statusText,
                                        {
                                            color: isHistory
                                                ? '#7f8c8d'
                                                : themeColor,
                                        },
                                    ]}
                                >
                                    {isHistory
                                        ? item.status === 'USED'
                                            ? 'Redeemed'
                                            : 'Expired'
                                        : 'Tap to Redeem'}
                                </Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            )
        },
        [activeTab]
    )

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>RK Rewards</Text>
                {renderHeader()}
                <View style={styles.tabBar}>
                    {['discover', 'active', 'history'].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={[
                                styles.tabItem,
                                activeTab === tab && styles.activeTabItem,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tabLabel,
                                    activeTab === tab && styles.activeTabLabel,
                                ]}
                            >
                                {tab.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {isCouponLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#004AAD" />
                </View>
            ) : (
                <FlatList
                    data={
                        activeTab === 'discover'
                            ? Array.isArray(discoverCoupons)
                                ? discoverCoupons
                                : []
                            : activeTab === 'active'
                              ? Array.isArray(activeCoupons)
                                  ? activeCoupons
                                  : []
                              : Array.isArray(historyCoupons)
                                ? historyCoupons
                                : []
                    }
                    renderItem={renderCoupon}
                    keyExtractor={(item, index) =>
                        item._id || item.couponId?._id || index.toString()
                    }
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons
                                name="ticket-percent-outline"
                                size={80}
                                color="#ccc"
                            />
                            <Text style={styles.emptyText}>
                                No coupons found here
                            </Text>
                        </View>
                    }
                    refreshing={isCouponLoading}
                    onRefresh={fetchCoupons}
                />
            )}

            {/* QR Modal */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Store Redemption</Text>
                        <Text style={styles.modalSubtitle}>
                            Let the staff scan this QR code
                        </Text>

                        {/* <View style={styles.qrWrapper}>
                            {selectedCoupon?.qrCodeData && (
                                <QRCode
                                    value={selectedCoupon.qrCodeData}
                                    size={width * 0.55}
                                    color="black"
                                    backgroundColor="white"
                                />
                            )}
                        </View> */}

                        {/* <View style={styles.qrWrapper}>
                            {selectedCoupon?.qrCodeImage ? (
                                <QRCode
                                    value={selectedCoupon.qrCodeImage}
                                    size={width * 0.55}
                                />
                            ) : selectedCoupon?.uniqueCode ? (
                                <QRCode
                                    value={selectedCoupon.uniqueCode}
                                    size={width * 0.55}
                                />
                            ) : null}
                        </View>
                        <Text style={styles.uniqueCodeText}>
                            {selectedCoupon?.uniqueCode}
                        </Text> */}

                        <View style={styles.qrWrapper}>
                            {selectedCoupon?.uniqueCode && (
                                <QRCode
                                    value={selectedCoupon.uniqueCode}
                                    size={width * 0.55}
                                    color="black"
                                    backgroundColor="white"
                                />
                            )}
                        </View>

                        {/* <View style={styles.qrWrapper}>
                            {selectedCoupon?.uniqueCode && (
                                <QRCode
                                    value={selectedCoupon.uniqueCode}
                                    size={width * 0.55}
                                    color="black"
                                    backgroundColor="white"
                                />
                            )}
                        </View> */}

                        {/* <View style={styles.qrWrapper}>
                            {selectedCoupon?.qrCodeData && (
                                <QRCode
                                    value={selectedCoupon.qrCodeData}
                                    size={width * 0.75} // Restore the size to 75% of the screen width (larger QR)
                                    color="black"
                                    backgroundColor="white"
                                />
                            )}
                        </View> */}

                        <Text style={styles.uniqueCodeText}>
                            {selectedCoupon?.uniqueCode}
                        </Text>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>CLOSE</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FB' },
    header: {
        backgroundColor: '#FFF',
        padding: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#004AAD',
        marginBottom: 15,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#F1F3F5',
        borderRadius: 15,
        padding: 5,
    },
    tabItem: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 12,
    },
    activeTabItem: { backgroundColor: '#FFF', elevation: 3 },
    tabLabel: { fontSize: 11, fontWeight: '700', color: '#95A5A6' },
    activeTabLabel: { color: '#004AAD' },
    listContainer: { padding: 20 },
    savingsCard: {
        backgroundColor: '#004AAD',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 4,
    },
    savingsLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: '600',
    },
    savingsValue: { color: '#FFF', fontSize: 22, fontWeight: '800' },
    couponCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        flexDirection: 'row',
        marginBottom: 16,
        height: 130,
        elevation: 2,
        overflow: 'hidden',
    },
    leftTab: {
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    discountText: {
        color: '#FFF',
        fontWeight: '900',
        fontSize: 18,
        textAlign: 'center',
    },
    cutoutTop: {
        position: 'absolute',
        top: -10,
        right: -10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F8F9FB',
    },
    cutoutBottom: {
        position: 'absolute',
        bottom: -10,
        right: -10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F8F9FB',
    },
    rightContent: { flex: 1, padding: 15, justifyContent: 'center' },
    couponTitle: { fontSize: 16, fontWeight: '700', color: '#2C3E50' },
    couponSub: { fontSize: 12, color: '#7F8C8D', marginVertical: 4 },
    couponExpiry: { fontSize: 11, fontWeight: '600', color: '#E67E22' },
    claimBtn: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginTop: 5,
    },
    claimBtnText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
    statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    statusText: { fontSize: 12, fontWeight: '700', marginLeft: 6 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#FFF',
        borderRadius: 25,
        padding: 25,
        alignItems: 'center',
    },
    modalTitle: { fontSize: 20, fontWeight: '800', color: '#2C3E50' },
    modalSubtitle: { fontSize: 13, color: '#7F8C8D', marginBottom: 25 },
    qrWrapper: {
        padding: 15,
        backgroundColor: '#FFF',
        borderRadius: 20,
        elevation: 10,
    },
    uniqueCodeText: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 4,
        color: '#004AAD',
    },
    closeButton: {
        marginTop: 30,
        backgroundColor: '#004AAD',
        width: '100%',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    closeButtonText: { color: '#FFF', fontWeight: '800' },
    emptyState: { alignItems: 'center', marginTop: 80 },
    emptyText: { color: '#BDC3C7', marginTop: 10 },
})

export default CouponsScreen
