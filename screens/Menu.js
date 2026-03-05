import React, { useRef } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Switch,
    Pressable,
} from 'react-native'
import { COLORS, icons, images } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useTheme } from '../theme/ThemeProvider'
import RBSheet from 'react-native-raw-bottom-sheet'
import Button from '../components/Button'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/features/Auth/AuthSlice'
import HelpCenter from './HelpCenter'

const Menu = ({ navigation }) => {
    const dispatch = useDispatch()
    const refRBSheet = useRef()
    const { dark, setScheme } = useTheme()
    const { user } = useSelector((state) => state.auth)

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap()
            // refRBSheet.current.close()
        } catch (error) {
            console.error('Logout failed', error)
        }
    }

    // Refined Row Component for Giant-style UI
    const ActionRow = ({
        icon,
        label,
        value,
        onPress,
        isLast,
        type = 'nav',
    }) => (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
                isLast && { borderBottomWidth: 0 },
            ]}
        >
            <View style={styles.rowLeft}>
                <View
                    style={[
                        styles.iconContainer,
                        { backgroundColor: dark ? '#1C1C1E' : '#F2F2F7' },
                    ]}
                >
                    {icon}
                </View>
                <Text
                    style={[
                        styles.rowLabel,
                        { color: dark ? COLORS.white : '#1C1C1E' },
                    ]}
                >
                    {label}
                </Text>
            </View>
            <View style={styles.rowRight}>
                {type === 'nav' && (
                    <Feather
                        name="chevron-right"
                        size={18}
                        color={COLORS.greyscale500}
                    />
                )}
                {type === 'switch' && (
                    <Switch
                        value={value}
                        onValueChange={onPress}
                        trackColor={{ false: '#D1D1D6', true: '#34C759' }}
                        thumbColor={COLORS.white}
                    />
                )}
            </View>
        </Pressable>
    )

    return (
        <SafeAreaView
            style={[
                styles.area,
                { backgroundColor: dark ? COLORS.black : '#F2F2F7' },
            ]}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Minimalist Header */}
                <View style={styles.header}>
                    <Text
                        style={[
                            styles.headerTitle,
                            { color: dark ? COLORS.white : '#000' },
                        ]}
                    >
                        Account
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Image
                            source={
                                user?.avatar
                                    ? { uri: user.avatar }
                                    : images.user1
                            }
                            style={styles.headerAvatar}
                        />
                    </TouchableOpacity>
                </View>

                {/* Account Overview Card */}
                <View
                    style={[
                        styles.glassCard,
                        { backgroundColor: dark ? '#1C1C1E' : COLORS.white },
                    ]}
                >
                    <View style={styles.profileSection}>
                        <View>
                            <Text
                                style={[
                                    styles.nameText,
                                    { color: dark ? COLORS.white : '#000' },
                                ]}
                            >
                                {user?.name || 'Guest User'}
                            </Text>
                            <Text style={styles.emailText}>
                                {user?.email || 'Standard Member'}
                            </Text>
                        </View>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>VERIFIED</Text>
                        </View>
                    </View>
                </View>

                {/* Section: Activity */}
                <Text style={styles.groupLabel}>Activity</Text>
                <View
                    style={[
                        styles.groupCard,
                        { backgroundColor: dark ? '#1C1C1E' : COLORS.white },
                    ]}
                >
                    <ActionRow
                        icon={
                            <Feather
                                name="package"
                                size={18}
                                color={dark ? COLORS.white : '#48484A'}
                            />
                        }
                        label="Order History"
                        onPress={() => navigation.navigate('Orders')}
                    />
                    {/* <ActionRow
                        icon={
                            <Feather
                                name="heart"
                                size={18}
                                color={dark ? COLORS.white : '#48484A'}
                            />
                        }
                        label="Wishlist"
                        onPress={() => {}}
                        isLast
                    /> */}
                </View>

                {/* Section: Preferences */}
                <Text style={styles.groupLabel}>Preferences</Text>
                <View
                    style={[
                        styles.groupCard,
                        { backgroundColor: dark ? '#1C1C1E' : COLORS.white },
                    ]}
                >
                    {/* <ActionRow
                        icon={
                            <Feather
                                name="bell"
                                size={18}
                                color={dark ? COLORS.white : '#48484A'}
                            />
                        }
                        label="Notifications"
                        onPress={() =>
                            navigation.navigate('SettingsNotifications')
                        }
                    /> */}
                    <ActionRow
                        type="switch"
                        value={dark}
                        icon={
                            <Feather
                                name={dark ? 'moon' : 'sun'}
                                size={18}
                                color={dark ? COLORS.white : '#48484A'}
                            />
                        }
                        label="Dark Appearance"
                        onPress={() => setScheme(dark ? 'light' : 'dark')}
                        isLast
                    />
                </View>

                {/* Section: Support */}
                <Text style={styles.groupLabel}>Support</Text>
                <View
                    style={[
                        styles.groupCard,
                        { backgroundColor: dark ? '#1C1C1E' : COLORS.white },
                    ]}
                >
                    <ActionRow
                        icon={
                            <Feather
                                name="shield"
                                size={18}
                                color={dark ? COLORS.white : '#48484A'}
                            />
                        }
                        label="Privacy & Security"
                        onPress={() => {}}
                    />
                    <ActionRow
                        icon={
                            <Feather
                                name="help-circle"
                                size={18}
                                color={dark ? COLORS.white : '#48484A'}
                            />
                        }
                        label="Help Center"
                        // onPress={() => {HelpCenter}}
                        onPress={() => navigation.navigate('HelpCenter')}
                        isLast
                    />
                </View>

                <TouchableOpacity
                    onPress={() => refRBSheet.current.open()}
                    style={styles.signOutBtn}
                >
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>
                    Version 2.4.0 (Build 102)
                </Text>
            </ScrollView>

            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                height={220}
                customStyles={{
                    container: {
                        borderTopRightRadius: 28,
                        borderTopLeftRadius: 28,
                        backgroundColor: dark ? '#1C1C1E' : COLORS.white,
                    },
                }}
            >
                <View style={styles.sheetContent}>
                    <Text
                        style={[
                            styles.sheetTitle,
                            { color: dark ? COLORS.white : '#000' },
                        ]}
                    >
                        Sign Out?
                    </Text>
                    <View style={styles.sheetOptions}>
                        <Pressable
                            style={styles.cancelBtn}
                            onPress={() => refRBSheet.current.close()}
                        >
                            <Text style={styles.cancelText}>
                                Stay Logged In
                            </Text>
                        </Pressable>
                        <Pressable
                            style={styles.confirmBtn}
                            onPress={handleLogout}
                        >
                            <Text style={styles.confirmText}>Sign Out</Text>
                        </Pressable>
                    </View>
                </View>
            </RBSheet>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 25,
    },
    headerTitle: { fontSize: 34, fontFamily: 'bold', letterSpacing: -1 },
    headerAvatar: { width: 40, height: 40, borderRadius: 20 },

    // Cards
    glassCard: {
        padding: 20,
        borderRadius: 24,
        marginBottom: 25,
    },
    groupCard: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 25,
    },
    profileSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nameText: { fontSize: 22, fontFamily: 'bold', letterSpacing: -0.5 },
    emailText: { fontSize: 14, color: '#8E8E93', marginTop: 4 },
    statusBadge: {
        backgroundColor: '#34C75915',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        color: '#34C759',
        fontSize: 10,
        fontFamily: 'bold',
        letterSpacing: 1,
    },

    // Grouping
    groupLabel: {
        fontSize: 13,
        color: '#8E8E93',
        textTransform: 'uppercase',
        marginLeft: 16,
        marginBottom: 8,
        letterSpacing: 0.5,
    },

    // Rows
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#38383A20',
    },
    rowPressed: { backgroundColor: '#38383A10' },
    rowLeft: { flexDirection: 'row', alignItems: 'center' },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowLabel: { fontSize: 16, marginLeft: 14, fontFamily: 'medium' },

    // Sign Out
    signOutBtn: {
        marginTop: 10,
        alignItems: 'center',
        paddingVertical: 18,
        borderRadius: 20,
        backgroundColor: '#FF3B3010',
    },
    signOutText: { color: '#FF3B30', fontSize: 16, fontFamily: 'bold' },
    versionText: {
        textAlign: 'center',
        color: '#8E8E93',
        fontSize: 12,
        marginTop: 30,
    },

    // Sheet
    sheetContent: { padding: 24, alignItems: 'center' },
    sheetTitle: { fontSize: 20, fontFamily: 'bold', marginBottom: 30 },
    sheetOptions: { flexDirection: 'row', gap: 12 },
    cancelBtn: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: '#8E8E9320',
    },
    confirmBtn: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: '#FF3B30',
    },
    cancelText: { fontWeight: '600' },
    confirmText: { color: 'white', fontWeight: 'bold' },
})

export default Menu
