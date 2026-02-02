import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../redux/features/Auth/AuthSlice'
import { COLORS } from '../../constants'

const StaffProfileScreen = () => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)

    const handleLogout = () => {
        dispatch(logout())
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user?.name?.charAt(0)}
                    </Text>
                </View>
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.role}>{user?.role?.toUpperCase()}</Text>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.label}>Store ID</Text>
                <Text style={styles.value}>
                    {user?.storeId || 'Main Branch'}
                </Text>

                <View style={styles.divider} />

                <Text style={styles.label}>Permissions</Text>
                <Text style={styles.value}>
                    {user?.permissions?.canRedeemCoupon
                        ? '✓ Coupon Redemption'
                        : '✗ No Redemption Access'}
                </Text>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FB', padding: 20 },
    header: { alignItems: 'center', marginVertical: 30 },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
    name: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
    role: { color: '#666', fontSize: 14, letterSpacing: 1 },
    infoSection: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        elevation: 2,
    },
    label: { color: '#999', fontSize: 12, marginBottom: 5 },
    value: { fontSize: 16, fontWeight: '600', marginBottom: 15 },
    divider: { height: 1, backgroundColor: '#EEE', marginBottom: 15 },
    logoutBtn: {
        marginTop: 'auto',
        backgroundColor: '#FFEDED',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    logoutText: { color: '#FF3B30', fontWeight: 'bold', fontSize: 16 },
})

export default StaffProfileScreen
