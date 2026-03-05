import React, { useState, useCallback, useEffect } from 'react'
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
    Platform,
    StatusBar,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import QRCode from 'react-native-qrcode-svg'
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect, useRoute } from '@react-navigation/native'
import {
    fetchDiscoverCoupons,
    fetchActiveCoupons,
    fetchHistoryCoupons,
    fetchUserSavings,
    claimCouponUser,
} from '../redux/features/Coupons/CouponSlice'
import { useTheme } from '../theme/ThemeProvider' // Added theme hook
import { COLORS } from '../constants'

const { width } = Dimensions.get('window')

const CouponsScreen = () => {
    const dispatch = useDispatch()
    const route = useRoute()
    const { colors, dark } = useTheme() // Consume theme

    const [activeTab, setActiveTab] = useState('get_new')
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedCoupon, setSelectedCoupon] = useState(null)

    const {
        discoverCoupons,
        activeCoupons,
        historyCoupons,
        userSavings,
        isCouponLoading,
    } = useSelector((state) => state.coupon)

    useEffect(() => {
        if (route.params?.initialTab) {
            const tabMap = {
                discover: 'get_new',
                active: 'my_rewards',
                history: 'used',
            }
            setActiveTab(tabMap[route.params.initialTab] || 'get_new')
        }
    }, [route.params?.initialTab])

    const fetchCoupons = useCallback(async () => {
        dispatch(fetchUserSavings())
        if (activeTab === 'get_new') {
            await dispatch(fetchDiscoverCoupons())
        } else if (activeTab === 'my_rewards') {
            await dispatch(fetchActiveCoupons())
        } else if (activeTab === 'used') {
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
                setActiveTab('my_rewards')
            }
        })
    }

    const renderHeader = () => (
        <View
            style={[
                styles.savingsCard,
                {
                    backgroundColor: dark ? '#1C1C1E' : COLORS.primary,
                    borderWidth: dark ? 1 : 0,
                    borderColor: '#2C2C2E',
                },
            ]}
        >
            <View>
                <Text style={styles.savingsLabel}>Total Savings</Text>
                <Text style={styles.savingsValue}>
                    ₹{userSavings?.totalAmount || 0}
                </Text>
            </View>
            <View style={styles.savingsStat}>
                <Text style={styles.savingsLabel}>Used</Text>
                <Text style={styles.savingsValue}>
                    {userSavings?.count || 0}
                </Text>
            </View>
            <MaterialCommunityIcons
                name="wallet-giftcard"
                size={40}
                color={dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)'}
            />
        </View>
    )

    const renderCoupon = useCallback(
        ({ item }) => {
            const isGetNew = activeTab === 'get_new'
            const isUsed = activeTab === 'used'
            const isMyRewards = activeTab === 'my_rewards'

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

            const themeColor =
                daysLeft <= 2 && expiryDate > now
                    ? '#E74C3C'
                    : couponData.color || COLORS.primary

            return (
                <TouchableOpacity
                    activeOpacity={isGetNew ? 1 : 0.8}
                    onPress={() => {
                        if (isMyRewards) {
                            setSelectedCoupon(item)
                            setModalVisible(true)
                        }
                    }}
                    style={[
                        styles.couponCard,
                        { backgroundColor: dark ? '#1C1C1E' : '#FFF' },
                        isUsed && { opacity: 0.5 },
                    ]}
                >
                    <View
                        style={[
                            styles.leftTab,
                            {
                                backgroundColor: isUsed
                                    ? dark
                                        ? '#2C2C2E'
                                        : '#BDC3C7'
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
                        <View
                            style={[
                                styles.cutoutTop,
                                { backgroundColor: colors.background },
                            ]}
                        />
                        <View
                            style={[
                                styles.cutoutBottom,
                                { backgroundColor: colors.background },
                            ]}
                        />
                    </View>

                    <View style={styles.rightContent}>
                        <Text
                            style={[styles.couponTitle, { color: colors.text }]}
                            numberOfLines={1}
                        >
                            {couponData.title}
                        </Text>
                        <Text
                            style={[
                                styles.couponSub,
                                { color: dark ? '#8E8E93' : '#7F8C8D' },
                            ]}
                            numberOfLines={2}
                        >
                            {couponData.description}
                        </Text>

                        {!isUsed ? (
                            <Text
                                style={[
                                    styles.couponExpiry,
                                    daysLeft <= 2 && { color: '#E74C3C' },
                                ]}
                            >
                                {expiryDate > now
                                    ? `Ends in ${daysLeft} days`
                                    : 'Expired'}
                            </Text>
                        ) : (
                            <Text
                                style={[
                                    styles.statusText,
                                    {
                                        color:
                                            item.status === 'USED'
                                                ? '#27AE60'
                                                : '#E74C3C',
                                    },
                                ]}
                            >
                                {item.status === 'USED' ? 'Used' : 'Expired'}
                            </Text>
                        )}

                        {isGetNew ? (
                            <TouchableOpacity
                                style={[
                                    styles.claimBtn,
                                    { backgroundColor: themeColor },
                                ]}
                                onPress={() => handleClaim(couponData._id)}
                            >
                                <Text style={styles.claimBtnText}>
                                    GET THIS
                                </Text>
                            </TouchableOpacity>
                        ) : isMyRewards ? (
                            <View style={styles.statusRow}>
                                <MaterialCommunityIcons
                                    name="qrcode-scan"
                                    size={16}
                                    color={themeColor}
                                />
                                <Text
                                    style={[
                                        styles.statusText,
                                        { color: themeColor },
                                    ]}
                                >
                                    Tap to Show QR
                                </Text>
                            </View>
                        ) : null}
                    </View>
                </TouchableOpacity>
            )
        },
        [activeTab, dark, colors.text, colors.background]
    )

    const tabs = [
        { id: 'get_new', label: 'GET NEW' },
        { id: 'my_rewards', label: 'MY REWARDS' },
        { id: 'used', label: 'USED' },
    ]

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
            <View
                style={[
                    styles.header,
                    { backgroundColor: dark ? '#121212' : '#FFF' },
                ]}
            >
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    RK Rewards
                </Text>
                {renderHeader()}
                <View
                    style={[
                        styles.tabBar,
                        { backgroundColor: dark ? '#1C1C1E' : '#F1F3F5' },
                    ]}
                >
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab.id}
                            onPress={() => setActiveTab(tab.id)}
                            style={[
                                styles.tabItem,
                                activeTab === tab.id && [
                                    styles.activeTabItem,
                                    {
                                        backgroundColor: dark
                                            ? '#2C2C2E'
                                            : '#FFF',
                                    },
                                ],
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tabLabel,
                                    activeTab === tab.id && {
                                        color: dark ? '#FFF' : COLORS.primary,
                                    },
                                ]}
                            >
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {isCouponLoading &&
            !discoverCoupons.length &&
            !activeCoupons.length ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={
                        activeTab === 'get_new'
                            ? discoverCoupons
                            : activeTab === 'my_rewards'
                              ? activeCoupons
                              : historyCoupons
                    }
                    renderItem={renderCoupon}
                    keyExtractor={(item, index) => item._id || index.toString()}
                    contentContainerStyle={[
                        styles.listContainer,
                        { paddingBottom: 140 },
                    ]}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons
                                name="ticket-percent-outline"
                                size={80}
                                color={dark ? '#3A3A3C' : '#ccc'}
                            />
                            <Text style={styles.emptyText}>Nothing here</Text>
                        </View>
                    }
                    refreshing={isCouponLoading}
                    onRefresh={fetchCoupons}
                />
            )}

            <Modal visible={modalVisible} transparent animationType="fade">
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setModalVisible(false)}
                >
                    <View
                        style={[
                            styles.modalContent,
                            { backgroundColor: dark ? '#1C1C1E' : '#FFF' },
                        ]}
                    >
                        <Text
                            style={[styles.modalTitle, { color: colors.text }]}
                        >
                            Redeem Offer
                        </Text>
                        <Text
                            style={[
                                styles.modalSubtitle,
                                { color: dark ? '#8E8E93' : '#7F8C8D' },
                            ]}
                        >
                            Show this QR at the counter
                        </Text>
                        <View
                            style={[
                                styles.qrWrapper,
                                { backgroundColor: '#FFF' },
                            ]}
                        >
                            {selectedCoupon?.uniqueCode && (
                                <QRCode
                                    value={selectedCoupon.uniqueCode}
                                    size={width * 0.55}
                                    backgroundColor="white"
                                    color="black"
                                />
                            )}
                        </View>
                        <Text
                            style={[
                                styles.uniqueCodeText,
                                { color: dark ? '#FFF' : COLORS.primary },
                            ]}
                        >
                            {selectedCoupon?.uniqueCode}
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.closeButton,
                                { backgroundColor: COLORS.primary },
                            ]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>GO BACK</Text>
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
        paddingTop: Platform.OS === 'android' ? 45 : 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 8,
        shadowOpacity: 0.1,
        shadowRadius: 10,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 15,
    },
    tabBar: {
        flexDirection: 'row',
        borderRadius: 15,
        padding: 5,
    },
    tabItem: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
    },
    activeTabItem: { elevation: 3, shadowOpacity: 0.1 },
    tabLabel: { fontSize: 10, fontWeight: '800', color: '#95A5A6' },
    listContainer: { padding: 20 },
    savingsCard: {
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    savingsLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
        fontWeight: '600',
    },
    savingsValue: { color: '#FFF', fontSize: 22, fontWeight: '900' },
    couponCard: {
        borderRadius: 16,
        flexDirection: 'row',
        marginBottom: 16,
        height: 130,
        elevation: 3,
        shadowOpacity: 0.1,
        overflow: 'hidden',
    },
    leftTab: { width: '30%', justifyContent: 'center', alignItems: 'center' },
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
    },
    cutoutBottom: {
        position: 'absolute',
        bottom: -10,
        right: -10,
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    rightContent: { flex: 1, padding: 15, justifyContent: 'center' },
    couponTitle: { fontSize: 16, fontWeight: '800' },
    couponSub: { fontSize: 12, marginVertical: 3 },
    couponExpiry: { fontSize: 11, fontWeight: '700', color: '#E67E22' },
    claimBtn: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    claimBtnText: { color: '#FFF', fontSize: 11, fontWeight: '900' },
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
        borderRadius: 25,
        padding: 25,
        alignItems: 'center',
    },
    modalTitle: { fontSize: 20, fontWeight: '900' },
    modalSubtitle: { fontSize: 13, marginBottom: 25 },
    qrWrapper: {
        padding: 15,
        borderRadius: 20,
        elevation: 10,
    },
    uniqueCodeText: {
        marginTop: 20,
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 5,
    },
    closeButton: {
        marginTop: 30,
        width: '100%',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    closeButtonText: { color: '#FFF', fontWeight: '900' },
    emptyState: { alignItems: 'center', marginTop: 80 },
    emptyText: { color: '#BDC3C7', marginTop: 10, fontWeight: '700' },
})

export default CouponsScreen
