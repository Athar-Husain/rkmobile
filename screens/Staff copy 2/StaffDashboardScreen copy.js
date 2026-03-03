import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Appearance,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { COLORS } from '../../constants'

const { width } = Dimensions.get('window')
const scale = (size) => (width / 375) * size

// Dummy stats data
const dummyStats = {
    todaySales: 15230,
    totalOrders: 18,
    activeCoupons: 3,
    customersServed: 12,
}

const StaffDashboardScreen = () => {
    const navigation = useNavigation()
    const colorScheme = Appearance.getColorScheme()
    const isDark = colorScheme === 'dark'

    const [stats, setStats] = useState(dummyStats)

    // Optionally, simulate fetching stats from API
    useEffect(() => {
        const fetchStats = async () => {
            // Simulate API call
            // const response = await fetch('/api/staff/stats')
            // const data = await response.json()
            // setStats(data)
        }
        fetchStats()
    }, [])

    return (
        <ScrollView
            style={[
                styles.container,
                { backgroundColor: isDark ? '#000' : '#F8F9FB' },
            ]}
            contentContainerStyle={{ paddingBottom: scale(40) }}
        >
            <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
                Welcome Back!
            </Text>

            {/* Quick Actions */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={[
                        styles.actionCard,
                        { backgroundColor: COLORS.primary },
                    ]}
                    onPress={() => navigation.navigate('StaffPOS')}
                >
                    <Text style={styles.actionText}>Start POS Billing</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionCard, { backgroundColor: '#FF7F50' }]}
                    onPress={() => navigation.navigate('StaffScanner')}
                >
                    <Text style={styles.actionText}>Scan Coupon</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionCard, { backgroundColor: '#4CAF50' }]}
                    onPress={() => navigation.navigate('StaffProfile')}
                >
                    <Text style={styles.actionText}>Profile</Text>
                </TouchableOpacity>
            </View>

            {/* Stats Overview */}
            <Text
                style={[
                    styles.sectionTitle,
                    { color: isDark ? '#fff' : '#000' },
                ]}
            >
                Today's Stats
            </Text>

            <View style={styles.statsContainer}>
                <View
                    style={[
                        styles.statCard,
                        { backgroundColor: isDark ? '#222' : '#fff' },
                    ]}
                >
                    <Text style={styles.statLabel}>Sales</Text>
                    <Text style={styles.statValue}>₹{stats.todaySales}</Text>
                </View>

                <View
                    style={[
                        styles.statCard,
                        { backgroundColor: isDark ? '#222' : '#fff' },
                    ]}
                >
                    <Text style={styles.statLabel}>Orders</Text>
                    <Text style={styles.statValue}>{stats.totalOrders}</Text>
                </View>

                <View
                    style={[
                        styles.statCard,
                        { backgroundColor: isDark ? '#222' : '#fff' },
                    ]}
                >
                    <Text style={styles.statLabel}>Active Coupons</Text>
                    <Text style={styles.statValue}>{stats.activeCoupons}</Text>
                </View>

                <View
                    style={[
                        styles.statCard,
                        { backgroundColor: isDark ? '#222' : '#fff' },
                    ]}
                >
                    <Text style={styles.statLabel}>Customers</Text>
                    <Text style={styles.statValue}>
                        {stats.customersServed}
                    </Text>
                </View>
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
        fontWeight: 'bold',
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
        borderRadius: scale(12),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: scale(12),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    actionText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: scale(16),
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: scale(20),
        fontWeight: 'bold',
        marginBottom: scale(12),
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        width: '48%',
        padding: scale(16),
        borderRadius: scale(12),
        marginBottom: scale(12),
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statLabel: {
        fontSize: scale(14),
        color: '#888',
        marginBottom: scale(8),
    },
    statValue: {
        fontSize: scale(20),
        fontWeight: 'bold',
    },
})
