import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Appearance,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../redux/features/Auth/AuthSlice'
import { COLORS } from '../../constants'

const StaffProfileScreen = () => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)

    const colorScheme = Appearance.getColorScheme()
    const isDark = colorScheme === 'dark'

    const handleLogout = () => {
        dispatch(logout())
    }

    return (
        <ScrollView
            style={[
                styles.container,
                { backgroundColor: isDark ? '#121212' : '#F8F9FB' },
            ]}
            contentContainerStyle={{ paddingBottom: 40 }}
        >
            {/* Header Section */}
            <View style={styles.header}>
                <View
                    style={[styles.avatar, { backgroundColor: COLORS.primary }]}
                >
                    <Text style={styles.avatarText}>
                        {user?.name?.charAt(0) || 'U'}
                    </Text>
                </View>
                <Text
                    style={[styles.name, { color: isDark ? '#fff' : '#000' }]}
                >
                    {user?.name || 'Unknown'}
                </Text>
                <Text
                    style={[styles.role, { color: isDark ? '#aaa' : '#666' }]}
                >
                    {user?.role?.toUpperCase() || 'STAFF'}
                </Text>
            </View>

            {/* Info Cards */}
            <View
                style={[
                    styles.infoCard,
                    { backgroundColor: isDark ? '#1E1E1E' : '#FFF' },
                ]}
            >
                <Text
                    style={[styles.label, { color: isDark ? '#999' : '#999' }]}
                >
                    Store
                </Text>
                <Text
                    style={[styles.value, { color: isDark ? '#fff' : '#000' }]}
                >
                    {user?.storeId || 'Main Branch'}
                </Text>
            </View>

            <View
                style={[
                    styles.infoCard,
                    { backgroundColor: isDark ? '#1E1E1E' : '#FFF' },
                ]}
            >
                <Text
                    style={[styles.label, { color: isDark ? '#999' : '#999' }]}
                >
                    Permissions
                </Text>
                {user?.permissions ? (
                    <>
                        {user.permissions.canCreatePurchase && (
                            <Text
                                style={[
                                    styles.permission,
                                    { color: COLORS.success },
                                ]}
                            >
                                ✓ Can Create Purchase
                            </Text>
                        )}
                        {user.permissions.canRedeemCoupon && (
                            <Text
                                style={[
                                    styles.permission,
                                    { color: COLORS.success },
                                ]}
                            >
                                ✓ Can Redeem Coupons
                            </Text>
                        )}
                        {user.permissions.canVerifyCoupon && (
                            <Text
                                style={[
                                    styles.permission,
                                    { color: COLORS.success },
                                ]}
                            >
                                ✓ Can Verify Coupons
                            </Text>
                        )}
                        {!user.permissions.canViewBranchReports && (
                            <Text
                                style={[
                                    styles.permission,
                                    { color: COLORS.warning },
                                ]}
                            >
                                ✗ Cannot View Branch Reports
                            </Text>
                        )}
                    </>
                ) : (
                    <Text
                        style={[styles.permission, { color: COLORS.warning }]}
                    >
                        No permissions assigned
                    </Text>
                )}
            </View>

            {/* Logout Button */}
            <TouchableOpacity
                style={[
                    styles.logoutBtn,
                    { backgroundColor: isDark ? '#2C2C2C' : '#FFEDED' },
                ]}
                onPress={handleLogout}
            >
                <Text
                    style={[
                        styles.logoutText,
                        { color: isDark ? '#FF3B30' : '#FF3B30' },
                    ]}
                >
                    Logout
                </Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default StaffProfileScreen

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { alignItems: 'center', marginVertical: 30 },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    avatarText: { color: '#FFF', fontSize: 40, fontWeight: 'bold' },
    name: { fontSize: 26, fontWeight: 'bold', marginTop: 12 },
    role: { fontSize: 14, letterSpacing: 1, marginTop: 4 },
    infoCard: {
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    label: { fontSize: 12, marginBottom: 6 },
    value: { fontSize: 18, fontWeight: '600' },
    permission: { fontSize: 14, marginBottom: 4 },
    logoutBtn: {
        marginTop: 10,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
    },
    logoutText: { fontWeight: 'bold', fontSize: 16 },
})
