import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    SafeAreaView,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import Feather from 'react-native-vector-icons/Feather'
import { COLORS } from '../../constants'
import { useTheme } from '../../theme/ThemeProvider'

const { width } = Dimensions.get('window')

const StaffDashboardScreen = () => {
    const navigation = useNavigation()
    const { dark, colors } = useTheme()
    const { user } = useSelector((state) => state.auth)

    // Layout Constants
    const CARD_WIDTH = (width - 52) / 2 // Perfect padding for 2-column grid

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <Text
                            style={[
                                styles.greeting,
                                {
                                    color: dark
                                        ? COLORS.greyscale300
                                        : COLORS.greyscale600,
                                },
                            ]}
                        >
                            Good Morning,
                        </Text>
                        <Text
                            style={[
                                styles.userName,
                                {
                                    color: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                },
                            ]}
                        >
                            {user?.name?.split(' ')[0] || 'Staff Member'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.notifBadge,
                            {
                                backgroundColor: dark
                                    ? COLORS.dark3
                                    : '#F1F5F9',
                            },
                        ]}
                    >
                        <Feather
                            name="bell"
                            size={20}
                            color={dark ? COLORS.white : COLORS.greyscale900}
                        />
                        <View style={styles.dot} />
                    </TouchableOpacity>
                </View>

                {/* Primary Action Card (High Focus) */}
                <TouchableOpacity
                    style={styles.mainActionCard}
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('StaffPOS')}
                >
                    <View style={styles.mainActionContent}>
                        <View>
                            <Text style={styles.mainActionTitle}>
                                Create New Sale
                            </Text>
                            <Text style={styles.mainActionSub}>
                                Tap to start POS billing
                            </Text>
                        </View>
                        <View style={styles.mainActionIcon}>
                            <Feather
                                name="plus"
                                size={24}
                                color={COLORS.primary}
                            />
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Quick Navigation Grid */}
                <Text
                    style={[
                        styles.sectionTitle,
                        { color: dark ? COLORS.white : COLORS.greyscale900 },
                    ]}
                >
                    Quick Actions
                </Text>
                <View style={styles.grid}>
                    <QuickLink
                        title="Scan Coupon"
                        icon="maximize"
                        color="#6366F1"
                        onPress={() => navigation.navigate('StaffScanner')}
                        dark={dark}
                    />
                    <QuickLink
                        title="Orders"
                        icon="file-text"
                        color="#F59E0B"
                        onPress={() => navigation.navigate('StaffOrders')}
                        dark={dark}
                    />
                    <QuickLink
                        title="Customers"
                        icon="users"
                        color="#10B981"
                        onPress={() => {}}
                        dark={dark}
                    />
                    <QuickLink
                        title="My Profile"
                        icon="settings"
                        color="#64748B"
                        onPress={() => navigation.navigate('StaffProfile')}
                        dark={dark}
                    />
                </View>

                {/* Stats Section */}
                <View style={styles.statsHeader}>
                    <Text
                        style={[
                            styles.sectionTitle,
                            {
                                color: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    >
                        Performance
                    </Text>
                    <Text style={styles.dateLabel}>Today</Text>
                </View>

                <View
                    style={[
                        styles.statsWrapper,
                        { backgroundColor: dark ? COLORS.dark2 : '#F8FAFC' },
                    ]}
                >
                    <StatRow
                        label="Today's Revenue"
                        value="₹15,230"
                        icon="trending-up"
                        trend="+12%"
                    />
                    <View style={styles.statDivider} />
                    <View style={styles.statGrid}>
                        <MiniStat label="Orders" value="18" />
                        <MiniStat label="Customers" value="12" />
                        <MiniStat label="Coupons" value="03" />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

// Sub-component for clean links
const QuickLink = ({ title, icon, color, onPress, dark }) => (
    <TouchableOpacity
        style={[
            styles.linkCard,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
        ]}
        onPress={onPress}
    >
        <View style={[styles.linkIconBg, { backgroundColor: `${color}15` }]}>
            <Feather name={icon} size={22} color={color} />
        </View>
        <Text
            style={[
                styles.linkText,
                { color: dark ? COLORS.white : COLORS.greyscale800 },
            ]}
        >
            {title}
        </Text>
    </TouchableOpacity>
)

// Sub-component for mini stats
const MiniStat = ({ label, value }) => (
    <View style={styles.miniStat}>
        <Text style={styles.miniStatValue}>{value}</Text>
        <Text style={styles.miniStatLabel}>{label}</Text>
    </View>
)

// Sub-component for Revenue Row
const StatRow = ({ label, value, icon, trend }) => (
    <View style={styles.statRow}>
        <View style={styles.statRowLeft}>
            <Text style={styles.statRowLabel}>{label}</Text>
            <Text style={styles.statRowValue}>{value}</Text>
        </View>
        <View style={styles.trendBadge}>
            <Feather name={icon} size={12} color="#10B981" />
            <Text style={styles.trendText}>{trend}</Text>
        </View>
    </View>
)

export default StaffDashboardScreen

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 40 },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    greeting: { fontSize: 14, fontWeight: '500' },
    userName: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
    notifBadge: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        borderWidth: 2,
        borderColor: '#FFF',
    },

    // Main Action
    mainActionCard: {
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        elevation: 8,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    mainActionContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mainActionTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },
    mainActionSub: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        marginTop: 2,
    },
    mainActionIcon: {
        width: 44,
        height: 44,
        backgroundColor: '#FFF',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Grid
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15 },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    linkCard: {
        width: '48%',
        padding: 16,
        borderRadius: 16,
        marginBottom: 15,
        alignItems: 'flex-start',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    linkIconBg: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    linkText: { fontSize: 14, fontWeight: '600' },

    // Stats
    statsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dateLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.primary,
        backgroundColor: '#E0E7FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    statsWrapper: { borderRadius: 20, padding: 20 },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statRowLabel: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    statRowValue: {
        fontSize: 26,
        fontWeight: '800',
        color: '#0F172A',
        marginTop: 4,
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    trendText: {
        color: '#10B981',
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 4,
    },
    statDivider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 20 },
    statGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    miniStat: { alignItems: 'flex-start' },
    miniStatValue: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
    miniStatLabel: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
})
