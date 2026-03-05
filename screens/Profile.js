import React, { useRef } from 'react' // Added useRef
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Pressable,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import { images, COLORS } from '../constants'
import { useTheme } from '../theme/ThemeProvider'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/features/Auth/AuthSlice'
import RBSheet from 'react-native-raw-bottom-sheet' // Import RBSheet

const Profile = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const refRBSheet = useRef() // Create ref for bottom sheet
    const { dark } = useTheme()
    const { user } = useSelector((state) => state.auth)

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap()
            refRBSheet.current.close()
        } catch (error) {
            console.error('Logout failed', error)
        }
    }

    const ProfileActionRow = ({ icon, label, onPress, value, isLast }) => (
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
                        styles.iconWrapper,
                        { backgroundColor: dark ? '#2C2C2E' : '#F2F2F7' },
                    ]}
                >
                    <Feather
                        name={icon}
                        size={18}
                        color={dark ? COLORS.white : '#1C1C1E'}
                    />
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
                {value && <Text style={styles.rowValue}>{value}</Text>}
                <Feather
                    name="chevron-right"
                    size={16}
                    color={COLORS.greyscale500}
                />
            </View>
        </Pressable>
    )

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: dark ? COLORS.black : '#F2F2F7' },
            ]}
        >
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

            {/* Top Navigation Bar */}
            <View style={styles.navBar}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.navBtn}
                >
                    <Feather
                        name="arrow-left"
                        size={24}
                        color={dark ? COLORS.white : COLORS.black}
                    />
                </TouchableOpacity>
                <Text
                    style={[
                        styles.navTitle,
                        { color: dark ? COLORS.white : COLORS.black },
                    ]}
                >
                    My Profile
                </Text>
                <TouchableOpacity style={styles.navBtn}>
                    <Feather
                        name="settings"
                        size={22}
                        color={dark ? COLORS.white : COLORS.black}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollPadding}
            >
                {/* Modern Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.avatarWrapper}>
                        <Image source={images.user5} style={styles.avatar} />
                        <TouchableOpacity style={styles.editBadge}>
                            <Feather
                                name="camera"
                                size={12}
                                color={COLORS.white}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text
                        style={[
                            styles.userName,
                            { color: dark ? COLORS.white : '#1C1C1E' },
                        ]}
                    >
                        {user?.name || 'Julian Casablancas'}
                    </Text>
                    <View style={styles.membershipBadge}>
                        <Feather name="zap" size={10} color="#FFD700" />
                        <Text style={styles.membershipText}>
                            PLATINUM MEMBER
                        </Text>
                    </View>
                </View>

                {/* Section: Finance */}
                <Text style={styles.sectionLabel}>Finance & Orders</Text>
                <View
                    style={[
                        styles.groupCard,
                        { backgroundColor: dark ? '#1C1C1E' : COLORS.white },
                    ]}
                >
                    {/* <ProfileActionRow
                        icon="pocket"
                        label="My Wallet"
                        value="₹5,240.00"
                        onPress={() => {}}
                    /> */}
                    <ProfileActionRow
                        icon="shopping-bag"
                        label="Order History"
                        onPress={() => {}}
                        isLast
                    />
                </View>

                {/* Section: Personal */}
                <Text style={styles.sectionLabel}>Personal</Text>
                <View
                    style={[
                        styles.groupCard,
                        { backgroundColor: dark ? '#1C1C1E' : COLORS.white },
                    ]}
                >
                    <ProfileActionRow
                        icon="user"
                        label="Personal Information"
                        onPress={() => {}}
                    />
                    <ProfileActionRow
                        icon="map-pin"
                        label="Shipping Addresses"
                        onPress={() => {}}
                    />
                    <ProfileActionRow
                        icon="heart"
                        label="Wishlist"
                        onPress={() => {}}
                        isLast
                    />
                </View>

                {/* Log Out Button triggers RBSheet */}
                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={() => refRBSheet.current.open()}
                >
                    <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>

                <Text style={styles.footerText}>User ID: 882910293</Text>
            </ScrollView>

            {/* Sign Out Confirmation Sheet */}
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
                    draggableIcon: {
                        backgroundColor: dark ? '#3A3A3C' : '#D1D1D6',
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
                    <Text style={styles.sheetSubtitle}>
                        Are you sure you want to log out of your account?
                    </Text>
                    <View style={styles.sheetOptions}>
                        <Pressable
                            style={[
                                styles.modalBtn,
                                {
                                    backgroundColor: dark
                                        ? '#2C2C2E'
                                        : '#F2F2F7',
                                },
                            ]}
                            onPress={() => refRBSheet.current.close()}
                        >
                            <Text
                                style={[
                                    styles.modalBtnText,
                                    { color: dark ? COLORS.white : '#000' },
                                ]}
                            >
                                Cancel
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.modalBtn,
                                { backgroundColor: '#FF3B30' },
                            ]}
                            onPress={handleLogout}
                        >
                            <Text
                                style={[
                                    styles.modalBtnText,
                                    { color: 'white' },
                                ]}
                            >
                                Sign Out
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </RBSheet>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 60,
    },
    navTitle: { fontSize: 17, fontFamily: 'bold' },
    navBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },

    scrollPadding: { paddingHorizontal: 16, paddingBottom: 40 },

    heroSection: { alignItems: 'center', marginVertical: 30 },
    avatarWrapper: { position: 'relative', marginBottom: 16 },
    avatar: { width: 100, height: 100, borderRadius: 50 },
    editBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        backgroundColor: '#007AFF',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#F2F2F7',
    },
    userName: { fontSize: 24, fontFamily: 'bold', letterSpacing: -0.5 },
    membershipBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
        gap: 5,
    },
    membershipText: {
        color: '#FFD700',
        fontSize: 10,
        fontFamily: 'bold',
        letterSpacing: 0.5,
    },

    sectionLabel: {
        fontSize: 12,
        color: '#8E8E93',
        textTransform: 'uppercase',
        marginLeft: 12,
        marginBottom: 8,
        letterSpacing: 1,
    },
    groupCard: { borderRadius: 16, overflow: 'hidden', marginBottom: 25 },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#38383A40',
    },
    rowPressed: { backgroundColor: '#38383A10' },
    rowLeft: { flexDirection: 'row', alignItems: 'center' },
    iconWrapper: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowLabel: { fontSize: 16, marginLeft: 14, fontFamily: 'medium' },
    rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    rowValue: { fontSize: 15, color: '#8E8E93' },

    logoutBtn: {
        marginTop: 10,
        backgroundColor: '#FF3B3010',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    logoutText: { color: '#FF3B30', fontSize: 16, fontFamily: 'bold' },
    footerText: {
        textAlign: 'center',
        color: '#8E8E93',
        fontSize: 11,
        marginTop: 24,
    },

    // Sheet Styles
    sheetContent: {
        paddingHorizontal: 24,
        paddingBottom: 24,
        alignItems: 'center',
    },
    sheetTitle: { fontSize: 20, fontFamily: 'bold', marginBottom: 8 },
    sheetSubtitle: {
        fontSize: 14,
        color: '#8E8E93',
        textAlign: 'center',
        marginBottom: 24,
    },
    sheetOptions: { flexDirection: 'row', gap: 12, width: '100%' },
    modalBtn: {
        flex: 1,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBtnText: { fontSize: 16, fontFamily: 'bold' },
})

export default Profile
