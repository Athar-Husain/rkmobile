import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import Feather from 'react-native-vector-icons/Feather'
import { logout } from '../../redux/features/Auth/AuthSlice'
import { COLORS } from '../../constants'
import { useTheme } from '../../theme/ThemeProvider'

const StaffProfileScreen = () => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { dark, colors } = useTheme()

    const handleLogout = () => dispatch(logout())

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Profile Identity Card */}
                <View style={styles.identitySection}>
                    <View
                        style={[
                            styles.avatarContainer,
                            { borderColor: dark ? COLORS.dark3 : '#F1F5F9' },
                        ]}
                    >
                        <View
                            style={[
                                styles.avatar,
                                { backgroundColor: COLORS.primary },
                            ]}
                        >
                            <Text style={styles.avatarText}>
                                {user?.name?.charAt(0) || 'U'}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.editBadge}>
                            <Feather name="camera" size={14} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <Text
                        style={[
                            styles.name,
                            {
                                color: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    >
                        {user?.name || 'Staff Member'}
                    </Text>
                    <View
                        style={[
                            styles.roleBadge,
                            {
                                backgroundColor: dark
                                    ? COLORS.dark3
                                    : '#F1F5F9',
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.roleText,
                                {
                                    color: dark
                                        ? COLORS.greyscale300
                                        : COLORS.greyscale600,
                                },
                            ]}
                        >
                            {user?.role?.toUpperCase() || 'STAFF'} • ID:{' '}
                            {user?._id?.slice(-6).toUpperCase() || 'N/A'}
                        </Text>
                    </View>
                </View>

                {/* Account Settings Group */}
                <Text style={styles.sectionHeader}>Workplace</Text>
                <View
                    style={[
                        styles.groupCard,
                        { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
                    ]}
                >
                    <ProfileRow
                        icon="map-pin"
                        label="Assigned Store"
                        value={user?.storeId || 'Main Branch'}
                        dark={dark}
                    />
                    <View style={styles.separator} />
                    <ProfileRow
                        icon="mail"
                        label="Email Address"
                        value={user?.email || 'not-provided@store.com'}
                        dark={dark}
                    />
                </View>

                {/* Permissions Group */}
                <Text style={styles.sectionHeader}>Access Permissions</Text>
                <View
                    style={[
                        styles.groupCard,
                        { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
                    ]}
                >
                    <PermissionRow
                        active={user?.permissions?.canCreatePurchase}
                        label="Billing & Checkout"
                        dark={dark}
                    />
                    <View style={styles.separator} />
                    <PermissionRow
                        active={user?.permissions?.canRedeemCoupon}
                        label="Coupon Redemption"
                        dark={dark}
                    />
                    <View style={styles.separator} />
                    <PermissionRow
                        active={user?.permissions?.canViewBranchReports}
                        label="Branch Analytics"
                        dark={dark}
                    />
                </View>

                {/* Danger Zone */}
                <TouchableOpacity
                    style={[
                        styles.logoutBtn,
                        { backgroundColor: dark ? COLORS.dark2 : '#FFF' },
                    ]}
                    onPress={handleLogout}
                >
                    <Feather name="log-out" size={20} color="#FF3B30" />
                    <Text style={styles.logoutText}>
                        Sign Out from Terminal
                    </Text>
                </TouchableOpacity>

                {/* App Version Info */}
                <View style={styles.footerInfo}>
                    <Text style={styles.footerText}>
                        Version 2.4.0 (Build 102)
                    </Text>
                    <Text style={styles.footerText}>
                        © 2026 YourBrand POS Systems
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

// Sub-component: Standard Info Row
const ProfileRow = ({ icon, label, value, dark }) => (
    <View style={styles.row}>
        <View
            style={[
                styles.rowIconBg,
                { backgroundColor: dark ? COLORS.dark3 : '#F8FAFC' },
            ]}
        >
            <Feather
                name={icon}
                size={18}
                color={dark ? COLORS.white : COLORS.greyscale700}
            />
        </View>
        <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text
                style={[
                    styles.rowValue,
                    { color: dark ? COLORS.white : COLORS.greyscale900 },
                ]}
            >
                {value}
            </Text>
        </View>
    </View>
)

// Sub-component: Permission Toggle Style
const PermissionRow = ({ active, label, dark }) => (
    <View style={styles.row}>
        <View
            style={[
                styles.rowIconBg,
                { backgroundColor: active ? '#ECFDF5' : '#FEF2F2' },
            ]}
        >
            <Feather
                name={active ? 'shield' : 'shield-off'}
                size={18}
                color={active ? '#10B981' : '#EF4444'}
            />
        </View>
        <Text
            style={[
                styles.permissionLabel,
                { color: dark ? COLORS.white : COLORS.greyscale800 },
            ]}
        >
            {label}
        </Text>
        <Feather
            name={active ? 'check-circle' : 'slash'}
            size={16}
            color={active ? '#10B981' : '#CBD5E1'}
        />
    </View>
)

export default StaffProfileScreen

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 20 },

    // Identity Section
    identitySection: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
    avatarContainer: {
        padding: 5,
        borderWidth: 1,
        borderRadius: 60,
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: { color: '#FFF', fontSize: 36, fontWeight: '800' },
    editBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: COLORS.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
    roleBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 8,
    },
    roleText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },

    // Group Cards
    sectionHeader: {
        fontSize: 13,
        fontWeight: '700',
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
        marginLeft: 4,
    },
    groupCard: {
        borderRadius: 20,
        paddingHorizontal: 16,
        marginBottom: 25,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    rowIconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    rowContent: { flex: 1 },
    rowLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },
    rowValue: { fontSize: 15, fontWeight: '600', marginTop: 2 },
    separator: { height: 1, backgroundColor: '#F1F5F9' },

    permissionLabel: { flex: 1, fontSize: 15, fontWeight: '600' },

    // Logout
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 20,
        gap: 10,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    logoutText: { color: '#FF3B30', fontSize: 16, fontWeight: '700' },

    // Footer
    footerInfo: { marginTop: 30, alignItems: 'center' },
    footerText: { fontSize: 12, color: '#94A3B8', marginBottom: 4 },
})
