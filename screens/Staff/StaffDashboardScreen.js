import React, { useState, useMemo, useEffect } from 'react'
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    SafeAreaView,
    Platform,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import Feather from 'react-native-vector-icons/Feather'
import moment from 'moment'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { COLORS } from '../../constants'
import { useTheme } from '../../theme/ThemeProvider'
import { getMyRecordedPurchases } from '../../redux/features/Purchases/PurchaseSlice'

const { width } = Dimensions.get('window')

const StaffDashboardScreen = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { dark, colors } = useTheme()
    const { user } = useSelector((state) => state.auth)
    const { myrecordedpurchases } = useSelector((state) => state.purchase)

    const [timeframe, setTimeframe] = useState('Today')

    useEffect(() => {
        dispatch(getMyRecordedPurchases())
    }, [dispatch])

    const analytics = useMemo(() => {
        if (!myrecordedpurchases) return { revenue: 0, orders: 0, items: 0 }
        const now = moment()
        const filtered = myrecordedpurchases.filter((order) => {
            const orderDate = moment(order.createdAt)
            if (timeframe === 'Today') return orderDate.isSame(now, 'day')
            if (timeframe === 'Week') return orderDate.isSame(now, 'week')
            if (timeframe === 'Month') return orderDate.isSame(now, 'month')
            return true
        })

        const totalRevenue = filtered.reduce(
            (acc, curr) => acc + (curr.finalAmount || 0),
            0
        )
        const totalItems = filtered.reduce(
            (acc, curr) => acc + (curr.items?.length || 0),
            0
        )

        return {
            revenue: totalRevenue.toLocaleString('en-IN'),
            orders: filtered.length,
            items: totalItems,
        }
    }, [myrecordedpurchases, timeframe])

    const tabBarHeight = useBottomTabBarHeight()
    const cardBg = dark ? COLORS.dark2 : COLORS.white
    const secondaryBg = dark ? COLORS.dark3 : '#F1F5F9'
    const mutedText = dark ? COLORS.greyscale400 : '#94A3B8'
    const borderColor = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: tabBarHeight + 20 },
                ]}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greeting, { color: mutedText }]}>
                            {moment().format('dddd, DD MMM')}
                        </Text>
                        <Text style={[styles.userName, { color: colors.text }]}>
                            Hi, {user?.name?.split(' ')[0] || 'Staff'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.notifBadge,
                            { backgroundColor: cardBg, borderColor },
                        ]}
                    >
                        <Feather name="bell" size={20} color={colors.text} />
                        <View style={styles.dot} />
                    </TouchableOpacity>
                </View>

                {/* Overview Header & Filter */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Overview
                    </Text>
                    <View
                        style={[
                            styles.filterContainer,
                            { backgroundColor: secondaryBg },
                        ]}
                    >
                        {['Today', 'Week', 'Month'].map((item) => (
                            <TouchableOpacity
                                key={item}
                                onPress={() => setTimeframe(item)}
                                style={[
                                    styles.filterTab,
                                    timeframe === item &&
                                        styles.filterTabActive,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.filterTabText,
                                        {
                                            color:
                                                timeframe === item
                                                    ? '#FFF'
                                                    : mutedText,
                                        },
                                    ]}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Analytics Card */}
                <View
                    style={[
                        styles.statsWrapper,
                        { backgroundColor: cardBg, borderColor },
                    ]}
                >
                    <StatRow
                        label={`${timeframe} Revenue`}
                        value={`₹${analytics.revenue}`}
                        icon="trending-up"
                        trend="+8.4%"
                        dark={dark}
                        textColor={colors.text}
                    />
                    <View
                        style={[
                            styles.statDivider,
                            { backgroundColor: borderColor },
                        ]}
                    />
                    <View style={styles.statGrid}>
                        <MiniStat
                            label="Orders"
                            value={analytics.orders}
                            colors={colors}
                        />
                        <MiniStat
                            label="Items Sold"
                            value={analytics.items}
                            colors={colors}
                        />
                        <MiniStat label="Refunds" value="0" colors={colors} />
                    </View>
                </View>

                {/* Management Grid */}
                <Text
                    style={[
                        styles.sectionTitle,
                        { color: colors.text, marginTop: 32, marginBottom: 16 },
                    ]}
                >
                    Management
                </Text>

                <View style={styles.grid}>
                    <QuickLink
                        title="Scan Coupon"
                        subtitle="Scan to redeem"
                        icon="maximize"
                        color="#6366F1"
                        onPress={() => navigation.navigate('StaffScanner')}
                        dark={dark}
                        cardBg={cardBg}
                        borderColor={borderColor}
                    />
                    <QuickLink
                        title="View Orders"
                        subtitle="Track sales"
                        icon="file-text"
                        color="#F59E0B"
                        onPress={() => navigation.navigate('Orders')}
                        dark={dark}
                        cardBg={cardBg}
                        borderColor={borderColor}
                    />
                    <QuickLink
                        title="Shops"
                        subtitle="Manage outlets"
                        icon="home"
                        color="#10B981"
                        onPress={() => navigation.navigate('Shops')}
                        dark={dark}
                        cardBg={cardBg}
                        borderColor={borderColor}
                    />
                    <QuickLink
                        title="Profile"
                        subtitle="Account info"
                        icon="user"
                        color="#64748B"
                        onPress={() => navigation.navigate('StaffProfile')}
                        dark={dark}
                        cardBg={cardBg}
                        borderColor={borderColor}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

// Sub-components
const QuickLink = ({
    title,
    subtitle,
    icon,
    color,
    onPress,
    dark,
    cardBg,
    borderColor,
}) => (
    <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.linkCard, { backgroundColor: cardBg, borderColor }]}
        onPress={onPress}
    >
        <View
            style={[
                styles.linkIconBg,
                { backgroundColor: `${color}${dark ? '20' : '10'}` },
            ]}
        >
            <Feather name={icon} size={22} color={color} />
        </View>
        <Text
            style={[styles.linkText, { color: dark ? '#F1F5F9' : '#1E293B' }]}
            numberOfLines={1}
        >
            {title}
        </Text>
        <Text style={styles.linkSubText}>{subtitle}</Text>
    </TouchableOpacity>
)

const MiniStat = ({ label, value, colors }) => (
    <View style={styles.miniStat}>
        <Text style={[styles.miniStatValue, { color: colors.text }]}>
            {value}
        </Text>
        <Text style={styles.miniStatLabel}>{label}</Text>
    </View>
)

const StatRow = ({ label, value, icon, trend, dark, textColor }) => (
    <View style={styles.statRow}>
        <View>
            <Text style={styles.statRowLabel}>{label}</Text>
            <Text style={[styles.statRowValue, { color: textColor }]}>
                {value}
            </Text>
        </View>
        <View
            style={[
                styles.trendBadge,
                {
                    backgroundColor: dark
                        ? 'rgba(16, 185, 129, 0.15)'
                        : '#ECFDF5',
                },
            ]}
        >
            <Feather name={icon} size={12} color="#10B981" />
            <Text style={styles.trendText}>{trend}</Text>
        </View>
    </View>
)

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 20 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    greeting: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    userName: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
    notifBadge: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    dot: {
        position: 'absolute',
        top: 14,
        right: 14,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: { fontSize: 18, fontWeight: '700' },
    filterContainer: { flexDirection: 'row', borderRadius: 12, padding: 3 },
    filterTab: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
    filterTabActive: {
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
    },
    filterTabText: { fontSize: 12, fontWeight: '700' },
    statsWrapper: {
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
            },
            android: { elevation: 2 },
        }),
    },
    statRow: { flexDirection: 'row', justifyContent: 'space-between' },
    statRowLabel: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statRowValue: {
        fontSize: 32,
        fontWeight: '800',
        marginTop: 4,
        letterSpacing: -1,
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        height: 26,
    },
    trendText: {
        color: '#10B981',
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 4,
    },
    statDivider: { height: 1, marginVertical: 20 },
    statGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    miniStatValue: { fontSize: 18, fontWeight: '700' },
    miniStatLabel: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    linkCard: {
        width: (width - 55) / 2,
        padding: 20,
        borderRadius: 24,
        marginBottom: 15,
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.03,
                shadowRadius: 8,
            },
            android: { elevation: 1 },
        }),
    },
    linkIconBg: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    linkText: { fontSize: 15, fontWeight: '700', letterSpacing: -0.2 },
    linkSubText: {
        fontSize: 11,
        color: '#94A3B8',
        marginTop: 4,
        fontWeight: '500',
    },
})

export default StaffDashboardScreen
