import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { images, COLORS } from '../constants'
import { useTheme } from '../theme/ThemeProvider'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/features/Auth/AuthSlice'

const Profile = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { dark, colors } = useTheme()
    const { user } = useSelector((state) => state.auth)

    const textColor = dark ? COLORS.white : COLORS.greyscale900
    const cardBg = dark ? COLORS.dark2 : COLORS.white

    const handleLogout = () => dispatch(logout())

    const ProfileCardItem = ({ icon, label, onPress, value }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: cardBg }]}
            onPress={onPress}
        >
            <View style={styles.cardLeft}>
                <View
                    style={[
                        styles.iconCircle,
                        {
                            backgroundColor: dark
                                ? COLORS.dark3
                                : COLORS.tansparentPrimary,
                        },
                    ]}
                >
                    <MaterialCommunityIcons
                        name={icon}
                        size={22}
                        color={COLORS.primary}
                    />
                </View>
                <Text style={[styles.cardLabel, { color: textColor }]}>
                    {label}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {value && <Text style={styles.cardValue}>{value}</Text>}
                <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color={COLORS.greyscale400}
                />
            </View>
        </TouchableOpacity>
    )

    return (
        <SafeAreaView
            style={[
                styles.container,
                {
                    backgroundColor: dark
                        ? colors.background
                        : COLORS.tertiaryWhite,
                },
            ]}
        >
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.roundBtn}
                >
                    <MaterialCommunityIcons
                        name="arrow-left"
                        size={24}
                        color={textColor}
                    />
                </TouchableOpacity>
                {/* <TouchableOpacity
                    onPress={() => navigation.navigate('MyBookings')}
                    style={styles.roundBtn}
                >
                    <MaterialCommunityIcons
                        name="arrow-left"
                        size={24}
                        color={textColor}
                    />
                </TouchableOpacity> */}
                <Text style={[styles.headerTitle, { color: textColor }]}>
                    My Profile
                </Text>
                <TouchableOpacity style={styles.roundBtn}>
                    <MaterialCommunityIcons
                        name="cog-outline"
                        size={24}
                        color={textColor}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Profile Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={images.user5}
                            style={styles.mainAvatar}
                        />
                        <TouchableOpacity style={styles.editFab}>
                            <MaterialCommunityIcons
                                name="pencil"
                                size={14}
                                color={COLORS.white}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.userName, { color: textColor }]}>
                        {user?.name || 'Customer Name'}
                    </Text>
                    <Text style={styles.userEmail}>
                        {user?.email || 'customer@example.com'}
                    </Text>
                </View>

                {/* Account Actions Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>
                        Account Information
                    </Text>
                    <ProfileCardItem
                        icon="account-circle-outline"
                        label="Personal Info"
                        onPress={() => {}}
                    />
                    <ProfileCardItem
                        icon="wallet-outline"
                        label="My Wallet"
                        value="₹5,240"
                        onPress={() => {}}
                    />
                    <ProfileCardItem
                        icon="shopping-outline"
                        label="Order History"
                        onPress={() => {}}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Preferences</Text>
                    <ProfileCardItem
                        icon="map-marker-radius-outline"
                        label="Shipping Address"
                        onPress={() => {}}
                    />
                    <ProfileCardItem
                        icon="heart-outline"
                        label="My Wishlist"
                        onPress={() => {}}
                    />
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutButtonText}>
                        Log Out fr Account
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    headerTitle: { fontSize: 20, fontFamily: 'bold' },
    roundBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroSection: { alignItems: 'center', paddingVertical: 20 },
    imageContainer: { position: 'relative', marginBottom: 15 },
    mainAvatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 4,
        borderColor: COLORS.white,
    },
    editFab: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: COLORS.primary,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    userName: { fontSize: 24, fontFamily: 'bold' },
    userEmail: { fontSize: 14, color: COLORS.greyscale600, marginTop: 4 },
    section: { marginTop: 25, paddingHorizontal: 20 },
    sectionHeader: {
        fontSize: 13,
        fontFamily: 'bold',
        color: COLORS.greyscale500,
        marginBottom: 12,
        marginLeft: 5,
        textTransform: 'uppercase',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderRadius: 20,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardLeft: { flexDirection: 'row', alignItems: 'center' },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    cardLabel: { fontSize: 16, fontFamily: 'semiBold' },
    cardValue: {
        fontSize: 14,
        color: COLORS.primary,
        fontFamily: 'bold',
        marginRight: 8,
    },
    logoutButton: {
        marginHorizontal: 20,
        marginTop: 30,
        backgroundColor: 'rgba(255, 71, 71, 0.1)',
        paddingVertical: 18,
        borderRadius: 20,
        alignItems: 'center',
    },
    logoutButtonText: { color: COLORS.red, fontFamily: 'bold', fontSize: 16 },
})

export default Profile
