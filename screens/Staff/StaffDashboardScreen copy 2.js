import React from 'react'
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
import { useSelector } from 'react-redux'
import Feather from 'react-native-vector-icons/Feather'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { COLORS } from '../../constants'
import { useTheme } from '../../theme/ThemeProvider'

const { width } = Dimensions.get('window')

const StaffDashboardScreen = () => {
    const navigation = useNavigation()
    const { dark, colors } = useTheme()
    const { user } = useSelector((state) => state.auth)

    // Get Tab Bar Height safely
    let tabBarHeight = 0
    try {
        tabBarHeight = useBottomTabBarHeight()
    } catch (e) {
        tabBarHeight = 80 // Standard fallback
    }

    // Dynamic Theme Colors
    const cardBg = dark ? COLORS.dark2 : COLORS.white
    const secondaryBg = dark ? COLORS.dark3 : '#F8FAFC'
    const mutedText = dark ? COLORS.greyscale400 : '#64748B'
    const borderColor = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'

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
                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greeting, { color: mutedText }]}>
                            Welcome back,
                        </Text>
                        <Text style={[styles.userName, { color: colors.text }]}>
                            {user?.name?.split(' ')[0] || 'Staff'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.notifBadge,
                            { backgroundColor: secondaryBg },
                        ]}
                        activeOpacity={0.7}
                    >
                        <Feather name="bell" size={22} color={colors.text} />
                        <View style={styles.dot} />
                    </TouchableOpacity>
                </View>

                {/* KPI / Performance Section */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Performance
                    </Text>
                    <View
                        style={[
                            styles.dateBadge,
                            { backgroundColor: dark ? '#1E293B' : '#E0E7FF' },
                        ]}
                    >
                        <Text style={styles.dateLabel}>Today</Text>
                    </View>
                </View>

                <View
                    style={[
                        styles.statsWrapper,
                        { backgroundColor: cardBg, borderColor },
                    ]}
                >
                    <StatRow
                        label="Shift Revenue"
                        value="₹15,230"
                        icon="trending-up"
                        trend="+12%"
                        dark={dark}
                        textColor={colors.text}
                    />
                    <View
                        style={[
                            styles.statDivider,
                            { backgroundColor: dark ? '#38383A' : '#F1F5F9' },
                        ]}
                    />
                    <View style={styles.statGrid}>
                        <MiniStat label="Orders" value="18" colors={colors} />
                        <MiniStat
                            label="Items Sold"
                            value="42"
                            colors={colors}
                        />
                        <MiniStat label="Refunds" value="00" colors={colors} />
                    </View>
                </View>

                {/* Management Grid */}
                <Text
                    style={[
                        styles.sectionTitle,
                        { color: colors.text, marginTop: 30, marginBottom: 15 },
                    ]}
                >
                    Management
                </Text>

                <View style={styles.grid}>
                    <QuickLink
                        title="Scan Coupon"
                        icon="maximize"
                        color="#6366F1"
                        onPress={() => navigation.navigate('StaffScanner')}
                        dark={dark}
                        cardBg={cardBg}
                    />
                    <QuickLink
                        title="View Orders"
                        icon="file-text"
                        color="#F59E0B"
                        onPress={() => navigation.navigate('Orders')}
                        dark={dark}
                        cardBg={cardBg}
                    />
                    <QuickLink
                        title="Shops"
                        icon="home"
                        color="#10B981"
                        onPress={() => navigation.navigate('Shops')}
                        dark={dark}
                        cardBg={cardBg}
                    />
                    <QuickLink
                        title="Profile"
                        icon="user"
                        color="#64748B"
                        onPress={() => navigation.navigate('StaffProfile')}
                        dark={dark}
                        cardBg={cardBg}
                    />
                </View>

                {/* Recent Activity Placeholder */}
                <View
                    style={[styles.infoBox, { backgroundColor: secondaryBg }]}
                >
                    <Feather name="info" size={18} color={COLORS.primary} />
                    <Text style={[styles.infoText, { color: mutedText }]}>
                        You have 2 pending orders to fulfill. Check the orders
                        tab.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

// --- Helper Sub-components ---

const QuickLink = ({ title, icon, color, onPress, dark, cardBg }) => (
    <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.linkCard, { backgroundColor: cardBg }]}
        onPress={onPress}
    >
        <View
            style={[
                styles.linkIconBg,
                { backgroundColor: `${color}${dark ? '25' : '12'}` },
            ]}
        >
            <Feather name={icon} size={22} color={color} />
        </View>
        <Text
            style={[
                styles.linkText,
                { color: dark ? '#FFF' : COLORS.greyscale800 },
            ]}
            numberOfLines={1}
        >
            {title}
        </Text>
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

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: Platform.OS === 'android' ? 10 : 0,
    },
    greeting: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
    userName: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
    notifBadge: {
        width: 50,
        height: 50,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        position: 'absolute',
        top: 15,
        right: 15,
        width: 9,
        height: 9,
        borderRadius: 4.5,
        backgroundColor: '#EF4444',
        borderWidth: 2,
        borderColor: '#FFF',
    },

    // Performance Section
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: { fontSize: 18, fontWeight: '700' },
    dateBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    dateLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.primary,
    },
    statsWrapper: {
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 12,
            },
            android: { elevation: 3 },
        }),
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    statRowLabel: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statRowValue: {
        fontSize: 34,
        fontWeight: '800',
        marginTop: 6,
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    trendText: {
        color: '#10B981',
        fontSize: 13,
        fontWeight: '700',
        marginLeft: 4,
    },
    statDivider: { height: 1, marginVertical: 20 },
    statGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    miniStat: { alignItems: 'flex-start' },
    miniStatValue: { fontSize: 20, fontWeight: '700' },
    miniStatLabel: { fontSize: 12, color: '#94A3B8', marginTop: 4 },

    // Grid System
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    linkCard: {
        width: (width - 55) / 2,
        padding: 20,
        borderRadius: 22,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(148, 163, 184, 0.08)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.03,
                shadowRadius: 8,
            },
            android: { elevation: 2 },
        }),
    },
    linkIconBg: {
        width: 46,
        height: 46,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    linkText: { fontSize: 15, fontWeight: '600' },

    // Info Box
    infoBox: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        marginTop: 20,
        alignItems: 'center',
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
    },
})

export default StaffDashboardScreen
