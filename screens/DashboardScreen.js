import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    RefreshControl,
    ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/MaterialIcons'

// Components
import Header from '../../components/Header'
import BannerCarousel from '../../components/BannerCarousel'

// Constants
import { COLORS, SIZES, icons, images } from '../../constants'
import { useTheme } from '../../theme/ThemeProvider'

// API
import api from '../../services/api'

const DashboardScreen = () => {
    const navigation = useNavigation()
    const { colors, dark } = useTheme()

    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [user, setUser] = useState(null)
    const [dashboardData, setDashboardData] = useState(null)
    const [quickActions] = useState([
        {
            id: 1,
            title: 'Place Order',
            icon: 'shopping-cart',
            route: 'Categories',
        },
        { id: 2, title: 'Track Order', icon: 'map', route: 'Orders' },
        { id: 3, title: 'My Wallet', icon: 'wallet', route: 'Wallet' },
        { id: 4, title: 'Refer & Earn', icon: 'gift', route: 'Referral' },
        { id: 5, title: 'Support', icon: 'headphones', route: 'Support' },
        { id: 6, title: 'Settings', icon: 'settings', route: 'Settings' },
    ])

    // Load dashboard data
    useFocusEffect(
        React.useCallback(() => {
            loadDashboardData()
            return () => {}
        }, [])
    )

    const loadDashboardData = async () => {
        try {
            setLoading(true)

            // Load user data
            const userString = await AsyncStorage.getItem('user')
            if (userString) {
                setUser(JSON.parse(userString))
            }

            // Load dashboard data from API
            const response = await api.get('/auth/dashboard')
            if (response.data.success) {
                setDashboardData(response.data.dashboard)
            }
        } catch (error) {
            console.error('Failed to load dashboard:', error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const onRefresh = () => {
        setRefreshing(true)
        loadDashboardData()
    }

    const handleQuickAction = (route) => {
        navigation.navigate(route)
    }

    if (loading) {
        return (
            <SafeAreaView
                style={[styles.area, { backgroundColor: colors.background }]}
            >
                <Header title="Dashboard" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView
            style={[styles.area, { backgroundColor: colors.background }]}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
            >
                <Header
                    title="Dashboard"
                    rightComponent={
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Notifications')}
                        >
                            <Icon
                                name="notifications"
                                size={24}
                                color={colors.text}
                            />
                            <View
                                style={[
                                    styles.notificationBadge,
                                    { backgroundColor: COLORS.error },
                                ]}
                            />
                        </TouchableOpacity>
                    }
                />

                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <View>
                        <Text
                            style={[styles.welcomeText, { color: colors.text }]}
                        >
                            Hello, {user?.name?.split(' ')[0] || 'User'}! 👋
                        </Text>
                        <Text
                            style={[
                                styles.subWelcomeText,
                                { color: colors.gray },
                            ]}
                        >
                            What would you like to do today?
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Image
                            source={
                                user?.profileImage
                                    ? { uri: user.profileImage }
                                    : images.avatar
                            }
                            style={styles.avatar}
                        />
                    </TouchableOpacity>
                </View>

                {/* Wallet Balance */}
                <View
                    style={[
                        styles.walletCard,
                        { backgroundColor: colors.card },
                    ]}
                >
                    <View style={styles.walletHeader}>
                        <Text
                            style={[styles.walletTitle, { color: colors.text }]}
                        >
                            Wallet Balance
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Wallet')}
                        >
                            <Text
                                style={[
                                    styles.walletAction,
                                    { color: COLORS.primary },
                                ]}
                            >
                                View Details
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text
                        style={[styles.walletAmount, { color: COLORS.primary }]}
                    >
                        ₹
                        {dashboardData?.stats?.walletBalance?.toFixed(2) ||
                            user?.walletBalance?.toFixed(2) ||
                            '0.00'}
                    </Text>
                    <View style={styles.walletActions}>
                        <TouchableOpacity
                            style={[
                                styles.walletButton,
                                { backgroundColor: COLORS.primary },
                            ]}
                            onPress={() => navigation.navigate('AddMoney')}
                        >
                            <Text style={styles.walletButtonText}>
                                Add Money
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.walletButton,
                                {
                                    backgroundColor: colors.background,
                                    borderColor: COLORS.primary,
                                },
                            ]}
                            onPress={() => navigation.navigate('Transactions')}
                        >
                            <Text
                                style={[
                                    styles.walletButtonText,
                                    { color: COLORS.primary },
                                ]}
                            >
                                Transactions
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Banners */}
                <BannerCarousel />

                {/* Quick Actions */}
                <View style={styles.quickActionsSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Quick Actions
                    </Text>
                    <View style={styles.quickActionsGrid}>
                        {quickActions.map((action) => (
                            <TouchableOpacity
                                key={action.id}
                                style={[
                                    styles.quickActionCard,
                                    { backgroundColor: colors.card },
                                ]}
                                onPress={() => handleQuickAction(action.route)}
                            >
                                <View
                                    style={[
                                        styles.quickActionIcon,
                                        {
                                            backgroundColor:
                                                COLORS.primary + '20',
                                        },
                                    ]}
                                >
                                    <Icon
                                        name={action.icon}
                                        size={24}
                                        color={COLORS.primary}
                                    />
                                </View>
                                <Text
                                    style={[
                                        styles.quickActionText,
                                        { color: colors.text },
                                    ]}
                                >
                                    {action.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Stats Overview */}
                <View style={styles.statsSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Overview
                    </Text>
                    <View style={styles.statsGrid}>
                        <View
                            style={[
                                styles.statCard,
                                { backgroundColor: colors.card },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.statNumber,
                                    { color: COLORS.primary },
                                ]}
                            >
                                {dashboardData?.stats?.totalOrders || 0}
                            </Text>
                            <Text
                                style={[
                                    styles.statLabel,
                                    { color: colors.gray },
                                ]}
                            >
                                Total Orders
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.statCard,
                                { backgroundColor: colors.card },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.statNumber,
                                    { color: COLORS.success },
                                ]}
                            >
                                {dashboardData?.stats?.completedOrders || 0}
                            </Text>
                            <Text
                                style={[
                                    styles.statLabel,
                                    { color: colors.gray },
                                ]}
                            >
                                Completed
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.statCard,
                                { backgroundColor: colors.card },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.statNumber,
                                    { color: COLORS.warning },
                                ]}
                            >
                                {dashboardData?.stats?.pendingOrders || 0}
                            </Text>
                            <Text
                                style={[
                                    styles.statLabel,
                                    { color: colors.gray },
                                ]}
                            >
                                Pending
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.statCard,
                                { backgroundColor: colors.card },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.statNumber,
                                    { color: COLORS.secondary },
                                ]}
                            >
                                {dashboardData?.stats?.referralCount || 0}
                            </Text>
                            <Text
                                style={[
                                    styles.statLabel,
                                    { color: colors.gray },
                                ]}
                            >
                                Referrals
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Recent Orders */}
                <View style={styles.ordersSection}>
                    <View style={styles.ordersHeader}>
                        <Text
                            style={[
                                styles.sectionTitle,
                                { color: colors.text },
                            ]}
                        >
                            Recent Orders
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Orders')}
                        >
                            <Text
                                style={[
                                    styles.viewAll,
                                    { color: COLORS.primary },
                                ]}
                            >
                                View All
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {dashboardData?.recentOrders?.length > 0 ? (
                        <FlatList
                            data={dashboardData.recentOrders.slice(0, 3)}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.orderCard,
                                        { backgroundColor: colors.card },
                                    ]}
                                    onPress={() =>
                                        navigation.navigate('OrderDetails', {
                                            id: item._id,
                                        })
                                    }
                                >
                                    <View style={styles.orderHeader}>
                                        <Text
                                            style={[
                                                styles.orderId,
                                                { color: colors.text },
                                            ]}
                                        >
                                            #{item.orderId}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.orderStatus,
                                                {
                                                    color:
                                                        item.status ===
                                                        'Delivered'
                                                            ? COLORS.success
                                                            : COLORS.warning,
                                                },
                                            ]}
                                        >
                                            {item.status}
                                        </Text>
                                    </View>
                                    <Text
                                        style={[
                                            styles.orderItems,
                                            { color: colors.gray },
                                        ]}
                                    >
                                        {item.items} items
                                    </Text>
                                    <Text
                                        style={[
                                            styles.orderAmount,
                                            { color: colors.text },
                                        ]}
                                    >
                                        ₹{item.amount}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.orderDate,
                                            { color: colors.gray },
                                        ]}
                                    >
                                        {item.date}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item._id}
                        />
                    ) : (
                        <View
                            style={[
                                styles.emptyOrders,
                                { backgroundColor: colors.card },
                            ]}
                        >
                            <Icon
                                name="shopping-bag"
                                size={48}
                                color={colors.gray}
                            />
                            <Text
                                style={[
                                    styles.emptyText,
                                    { color: colors.gray },
                                ]}
                            >
                                No orders yet
                            </Text>
                            <TouchableOpacity
                                style={[
                                    styles.browseButton,
                                    { backgroundColor: COLORS.primary },
                                ]}
                                onPress={() =>
                                    navigation.navigate('Categories')
                                }
                            >
                                <Text style={styles.browseButtonText}>
                                    Browse Products
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Promotions */}
                <View style={styles.promotionSection}>
                    <Image
                        source={images.promotion}
                        style={styles.promotionImage}
                        resizeMode="cover"
                    />
                    <View style={styles.promotionContent}>
                        <Text style={styles.promotionTitle}>Get 20% Off</Text>
                        <Text style={styles.promotionText}>
                            On your first order. Use code: WELCOME20
                        </Text>
                        <TouchableOpacity
                            style={styles.promotionButton}
                            onPress={() => navigation.navigate('Categories')}
                        >
                            <Text style={styles.promotionButtonText}>
                                Shop Now
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    welcomeSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 5,
    },
    subWelcomeText: {
        fontSize: 14,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    walletCard: {
        marginHorizontal: 20,
        marginVertical: 15,
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    walletHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    walletTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    walletAction: {
        fontSize: 14,
        fontWeight: '600',
    },
    walletAmount: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 20,
    },
    walletActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    walletButton: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    walletButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    quickActionsSection: {
        paddingHorizontal: 20,
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 15,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    quickActionCard: {
        width: '30%',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    quickActionIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    quickActionText: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
    },
    statsSection: {
        paddingHorizontal: 20,
        marginVertical: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        width: '48%',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
    },
    ordersSection: {
        paddingHorizontal: 20,
        marginVertical: 20,
    },
    ordersHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    viewAll: {
        fontSize: 14,
        fontWeight: '600',
    },
    orderCard: {
        width: 200,
        padding: 15,
        borderRadius: 10,
        marginRight: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    orderId: {
        fontSize: 14,
        fontWeight: '600',
    },
    orderStatus: {
        fontSize: 12,
        fontWeight: '600',
    },
    orderItems: {
        fontSize: 12,
        marginBottom: 5,
    },
    orderAmount: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 5,
    },
    orderDate: {
        fontSize: 12,
    },
    emptyOrders: {
        padding: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 16,
        marginTop: 10,
        marginBottom: 20,
    },
    browseButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    browseButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    promotionSection: {
        margin: 20,
        borderRadius: 15,
        overflow: 'hidden',
        position: 'relative',
    },
    promotionImage: {
        width: '100%',
        height: 150,
    },
    promotionContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 20,
        justifyContent: 'center',
    },
    promotionTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 5,
    },
    promotionText: {
        color: 'white',
        fontSize: 14,
        opacity: 0.9,
        marginBottom: 15,
    },
    promotionButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    promotionButtonText: {
        color: 'white',
        fontWeight: '600',
    },
})

export default DashboardScreen
