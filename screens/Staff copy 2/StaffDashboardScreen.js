// StaffDashboardScreen.js

import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { COLORS } from '../../constants'
import { useTheme } from '../../theme/ThemeProvider'

const { width } = Dimensions.get('window')
const scale = (size) => (width / 375) * size

// Dummy stats (replace later with API/Redux data)
const dummyStats = {
    todaySales: 15230,
    totalOrders: 18,
    activeCoupons: 3,
    customersServed: 12,
}

const StaffDashboardScreen = () => {
    const navigation = useNavigation()
    const { dark, colors } = useTheme()
    const [stats, setStats] = useState(dummyStats)

    const { user } = useSelector((state) => state.auth)

    useEffect(() => {
        // Future API call example:
        // dispatch(fetchStaffStats())
    }, [])

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={{ paddingBottom: scale(40) }}
            showsVerticalScrollIndicator={false}
        >
            {/* Welcome Title */}
            <Text
                style={[
                    styles.title,
                    { color: dark ? COLORS.white : COLORS.greyscale900 },
                ]}
            >
                Welcome Back, {user?.name?.split(' ')[0] || 'Staff'}!
            </Text>

            {/* Quick Actions */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={[
                        styles.actionCard,
                        { backgroundColor: COLORS.primary },
                    ]}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('StaffPOS')}
                >
                    <Text style={styles.actionText}>Start POS Billing</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionCard, { backgroundColor: '#FF7F50' }]}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('StaffScanner')}
                >
                    <Text style={styles.actionText}>Scan Coupon</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionCard, { backgroundColor: '#4CAF50' }]}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('StaffProfile')}
                >
                    <Text style={styles.actionText}>Profile</Text>
                </TouchableOpacity>
            </View>

            {/* Stats Section */}
            <Text
                style={[
                    styles.sectionTitle,
                    { color: dark ? COLORS.white : COLORS.greyscale900 },
                ]}
            >
                Today's Stats
            </Text>

            <View style={styles.statsContainer}>
                {Object.entries(stats).map(([key, value]) => (
                    <View
                        key={key}
                        style={[
                            styles.statCard,
                            {
                                backgroundColor: dark
                                    ? COLORS.dark2
                                    : COLORS.white,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.statLabel,
                                {
                                    color: dark
                                        ? COLORS.greyscale400
                                        : COLORS.greyscale600,
                                },
                            ]}
                        >
                            {key === 'todaySales'
                                ? 'Sales'
                                : key === 'totalOrders'
                                  ? 'Orders'
                                  : key === 'activeCoupons'
                                    ? 'Active Coupons'
                                    : 'Customers'}
                        </Text>

                        <Text
                            style={[
                                styles.statValue,
                                { color: COLORS.primary },
                            ]}
                        >
                            {key === 'todaySales' ? `₹${value}` : value}
                        </Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    )
}

export default StaffDashboardScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: scale(20),
    },
    title: {
        fontSize: scale(24),
        fontFamily: 'bold',
        marginBottom: scale(20),
    },
    actionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: scale(30),
    },
    actionCard: {
        width: '48%',
        padding: scale(20),
        borderRadius: scale(14),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: scale(12),
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    actionText: {
        color: '#fff',
        fontFamily: 'semiBold',
        fontSize: scale(16),
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: scale(20),
        fontFamily: 'bold',
        marginBottom: scale(12),
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        width: '48%',
        padding: scale(18),
        borderRadius: scale(14),
        marginBottom: scale(12),
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
    },
    statLabel: {
        fontSize: scale(14),
        marginBottom: scale(8),
    },
    statValue: {
        fontSize: scale(20),
        fontFamily: 'bold',
    },
})
