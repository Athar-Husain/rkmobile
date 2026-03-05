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
    StatusBar,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import QRCode from 'react-native-qrcode-svg'
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'

// Theme & Constants (Matching Home.js)
import { useTheme } from '../theme/ThemeProvider'
import { COLORS } from '../constants'

// Actions
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
    const { colors, dark } = useTheme() // Consistent with Home.js logic
    
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
        // Always fetch latest savings
        dispatch(fetchUserSavings())

        if (activeTab === 'discover') {
            await dispatch(fetchDiscoverCoupons())
        } else if (activeTab === 'active') {
            await dispatch(fetchActiveCoupons())
        } else if (activeTab === 'history') {
            await dispatch(fetchHistoryCoupons())
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
        <View style={[styles.savingsCard, { backgroundColor: COLORS.primary }]}>
            <View>
                <Text style={styles.savingsLabel}>Total Savings</Text>
                <Text style={styles.savingsValue}>
                    ₹{userSavings?.totalAmount || 0}
                </Text>
            </View>
            <View>
                <Text style={styles.savingsLabel}>Redeemed</Text>
                <Text style={styles.savingsValue}>
                    {userSavings?.count || 0}
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
            const isActive = activeTab === 'active'

            const couponData =
                item.couponId && typeof item.couponId === 'object'
                    ? item.couponId
                    : item

            const now = new Date()
            const expiryDate = new Date(couponData.validUntil)
            const daysLeft = Math.max(
                Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24)),
                0
            )

            // Dynamic theme color (turns red if expiring soon)
            const themeColor =
                daysLeft <= 2 && expiryDate > now
                    ? '#E74C3C'
                    : couponData.color || COLORS.primary

            return (
                <TouchableOpacity
                    activeOpacity={isDiscover ? 1 : 0.8}
                    onPress={() => {
                        if (isActive) {
                            setSelectedCoupon(item)
                            setModalVisible(true)
                        }
                    }}
                    style={[
                        styles.couponCard, 
                        { backgroundColor: colors.card },
                        isHistory && { opacity: 0.6 }
                    ]}
                >
                    {/* Left Discount Panel */}
                    <View
                        style={[
                            styles.leftTab,
                            {
                                backgroundColor: isHistory
                                    ? colors.grayscale400
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
                        {/* Dynamic cutouts that match background theme */}
                        <View style={[styles.cutoutTop, { backgroundColor: colors.background }]} />
                        <View style={[styles.cutoutBottom, { backgroundColor: colors.background }]} />
                    </View>

                    {/* Right Content Area */}
                    <View style={styles.rightContent}>
                        <Text style={[styles.couponTitle, { color: colors.text }]} numberOfLines={1}>
                            {couponData.title}
                        </Text>

                        <Text style={[styles.couponSub, { color: colors.grayscale700 }]} numberOfLines={2}>
                            {couponData.description}
                        </Text>

                        {!isHistory ? (
                            <Text
                                style={[
                                    styles.couponExpiry,
                                    daysLeft <= 2 && { color: '#E74C3C' },
                                ]}
                            >
                                {expiryDate > now
                                    ? `Expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`
                                    : 'Expired'}
                            </Text>
                        ) : (
                            <Text
                                style={[
                                    styles.statusText,
                                    {
                                        color: item.status === 'USED' ? '#27AE60' : '#E74C3C',
                                    },
                                ]}
                            >
                                {item.status === 'USED' ? 'Redeemed' : 'Expired'}
                            </Text>
                        )}

                        {isDiscover ? (
                            <TouchableOpacity
                                style={[
                                    styles.claimBtn,
                                    { backgroundColor: themeColor },
                                ]}
                                onPress={() => handleClaim(couponData._id)}
                            >
                                <Text style={styles.claimBtnText}>CLAIM OFFER</Text>
                            </TouchableOpacity>
                        ) : isActive ? (
                            <View style={styles.statusRow}>
                                <MaterialCommunityIcons
                                    name="qrcode-scan"
                                    size={16}
                                    color={themeColor}
                                />
                                <Text style={[styles.statusText, { color: themeColor, marginLeft: 6 }]}>
                                    Tap to Redeem
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </TouchableOpacity>
            )
        },
        [activeTab, colors]
    )

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar
                barStyle={dark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />
            
            <View style={[styles.header, { backgroundColor: colors.card }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>RK Rewards</Text>
                {renderHeader()}
                
                <View style={[styles.tabBar, { backgroundColor: dark ? colors.background : '#F1F3F5' }]}>
                    {['discover', 'active', 'history'].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={[
                                styles.tabItem,
                                activeTab === tab && [styles.activeTabItem, { backgroundColor: dark ? colors.card : '#FFF' }],
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tabLabel,
                                    { color: colors.grayscale700 },
                                    activeTab === tab && { color: COLORS.primary },
                                ]}
                            >
                                {tab.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {isCouponLoading && !discoverCoupons.length && !activeCoupons.length ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={
                        activeTab === 'discover'
                            ? discoverCoupons
                            : activeTab === 'active'
                            ? activeCoupons
                            : historyCoupons
                    }
                    renderItem={renderCoupon}
                    keyExtractor={(item, index) => item._id || index.toString()}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons
                                name="ticket-percent-outline"
                                size={80}
                                color={colors.grayscale400}
                            />
                            <Text style={{ color: colors.grayscale700, marginTop: 10 }}>
                                No coupons found here
                            </Text>
                        </View>
                    }
                    refreshing={isCouponLoading}
                    onRefresh={fetchCoupons}
                />
            )}

            <Modal visible={modalVisible} transparent animationType="fade">
                <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Store Redemption</Text>
                        <Text style={{ color: colors.grayscale700, marginVertical: 10 }}>
                            Show this QR to the store staff
                        </Text>

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

                        <Text style={[styles.uniqueCodeText, { color: COLORS.primary }]}>
                            {selectedCoupon?.uniqueCode}
                        </Text>

                        <TouchableOpacity
                            style={[styles.closeButton, { backgroundColor: COLORS.primary }]}
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
    container: { flex: 1 },
    header: {
        padding: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 5,
    },
    headerTitle: { fontSize: 24, fontWeight: '800', marginBottom: 15 },
    tabBar: { flexDirection: 'row', borderRadius: 15, padding: 5 },
    tabItem: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
    activeTabItem: { elevation: 3 },
    tabLabel: { fontSize: 11, fontWeight: '700' },
    listContainer: { padding: 20 },
    savingsCard: {
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    savingsLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600' },
    savingsValue: { color: '#FFF', fontSize: 22, fontWeight: '800' },
    couponCard: {
        borderRadius: 16,
        flexDirection: 'row',
        marginBottom: 16,
        height: 130,
        elevation: 2,
        overflow: 'hidden',
    },
    leftTab: { width: '30%', justifyContent: 'center', alignItems: 'center', position: 'relative' },
    discountText: { color: '#FFF', fontWeight: '900', fontSize: 18, textAlign: 'center' },
    cutoutTop: { position: 'absolute', top: -10, right: -10, width: 20, height: 20, borderRadius: 10 },
    cutoutBottom: { position: 'absolute', bottom: -10, right: -10, width: 20, height: 20, borderRadius: 10 },
    rightContent: { flex: 1, padding: 15, justifyContent: 'center' },
    couponTitle: { fontSize: 16, fontWeight: '700' },
    couponSub: { fontSize: 12, marginVertical: 4 },
    couponExpiry: { fontSize: 11, fontWeight: '600' },
    claimBtn: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8, alignSelf: 'flex-start', marginTop: 5 },
    claimBtnText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
    statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    statusText: { fontSize: 12, fontWeight: '700' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '85%', borderRadius: 25, padding: 25, alignItems: 'center' },
    modalTitle: { fontSize: 20, fontWeight: '800' },
    qrWrapper: { padding: 15, backgroundColor: '#FFF', borderRadius: 20 },
    uniqueCodeText: { marginTop: 20, fontSize: 18, fontWeight: 'bold', letterSpacing: 4 },
    closeButton: { marginTop: 30, width: '100%', padding: 15, borderRadius: 15, alignItems: 'center' },
    closeButtonText: { color: '#FFF', fontWeight: '800' },
    emptyState: { alignItems: 'center', marginTop: 80 },
})

export default CouponsScreen;