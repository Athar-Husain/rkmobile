import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Switch,
} from 'react-native'
import React, { useState, useRef } from 'react'
import { COLORS, SIZES, icons, images } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import { MaterialIcons } from '@expo/vector-icons'
import SettingsItem from '../components/SettingsItem'
import { useTheme } from '../theme/ThemeProvider'
import RBSheet from 'react-native-raw-bottom-sheet'
import Button from '../components/Button'
import { useDispatch } from 'react-redux'
import { logout } from '../redux/features/Auth/AuthSlice'

const Menu = ({ navigation }) => {
    const dispatch = useDispatch()
    const refRBSheet = useRef()
    const { dark, colors, setScheme } = useTheme()

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap()
            refRBSheet.current.close()
        } catch (error) {
            console.error('Logout failed', error)
        }
    }

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.headerLeft}>
                <Image
                    source={images.logo}
                    resizeMode="contain"
                    style={styles.logo}
                />
                <Text
                    style={[
                        styles.headerTitle,
                        { color: dark ? COLORS.white : COLORS.greyscale900 },
                    ]}
                >
                    Settings
                </Text>
            </View>
        </View>
    )

    return (
        <SafeAreaView
            style={[styles.area, { backgroundColor: colors.background }]}
        >
            <View style={styles.container}>
                {renderHeader()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Compact Profile Summary */}
                    <TouchableOpacity
                        style={styles.miniProfile}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Image
                            source={images.user1}
                            style={styles.miniAvatar}
                        />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text
                                style={[
                                    styles.nameText,
                                    {
                                        color: dark
                                            ? COLORS.white
                                            : COLORS.greyscale900,
                                    },
                                ]}
                            >
                                Nathalie Erneson
                            </Text>
                            <Text style={styles.viewProfileText}>
                                Account Details & Activity
                            </Text>
                        </View>
                        <MaterialIcons
                            name="chevron-right"
                            size={24}
                            color={COLORS.greyscale500}
                        />
                    </TouchableOpacity>

                    <View style={styles.sectionDivider} />

                    <Text style={styles.sectionLabel}>Preferences</Text>
                    <SettingsItem
                        icon={icons.bell2}
                        name="Notification"
                        onPress={() =>
                            navigation.navigate('SettingsNotifications')
                        }
                    />

                    {/* Dark Mode Toggle Row */}
                    <View style={styles.customRow}>
                        <View style={styles.leftRow}>
                            <Image
                                source={icons.show}
                                style={[
                                    styles.rowIcon,
                                    {
                                        tintColor: dark
                                            ? COLORS.white
                                            : COLORS.greyscale900,
                                    },
                                ]}
                            />
                            <Text
                                style={[
                                    styles.rowLabel,
                                    {
                                        color: dark
                                            ? COLORS.white
                                            : COLORS.greyscale900,
                                    },
                                ]}
                            >
                                Dark Mode
                            </Text>
                        </View>
                        <Switch
                            value={dark}
                            onValueChange={() =>
                                setScheme(dark ? 'light' : 'dark')
                            }
                            trackColor={{
                                false: '#EEEEEE',
                                true: COLORS.primary,
                            }}
                        />
                    </View>

                    <Text style={styles.sectionLabel}>Security & Legal</Text>
                    <SettingsItem
                        icon={icons.shieldOutline}
                        name="Security"
                        onPress={() => navigation.navigate('SettingsSecurity')}
                    />
                    <SettingsItem
                        icon={icons.lockedComputerOutline}
                        name="Privacy Policy"
                        onPress={() =>
                            navigation.navigate('SettingsPrivacyPolicy')
                        }
                    />

                    <TouchableOpacity
                        onPress={() => refRBSheet.current.open()}
                        style={styles.simpleLogout}
                    >
                        <MaterialIcons
                            name="logout"
                            size={22}
                            color={COLORS.red}
                        />
                        <Text style={styles.simpleLogoutText}>Logout</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                height={260}
                customStyles={{
                    container: {
                        borderTopRightRadius: 32,
                        borderTopLeftRadius: 32,
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                    },
                }}
            >
                <Text style={styles.bottomTitle}>Logout</Text>
                <View style={styles.separateLine} />
                <Text
                    style={[
                        styles.bottomSubtitle,
                        { color: dark ? COLORS.white : COLORS.black },
                    ]}
                >
                    Are you sure you want to log out?
                </Text>
                <View style={styles.bottomContainer}>
                    <Button
                        title="Cancel"
                        style={styles.cancelBtn}
                        textColor={dark ? COLORS.white : COLORS.primary}
                        onPress={() => refRBSheet.current.close()}
                    />
                    <Button
                        title="Yes, Logout"
                        filled
                        style={styles.logoutBtnAction}
                        onPress={handleLogout}
                    />
                </View>
            </RBSheet>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: { flex: 1 },
    container: { flex: 1, paddingHorizontal: 16 },
    headerContainer: {
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: { height: 28, width: 28, tintColor: COLORS.primary },
    headerTitle: { fontSize: 22, fontFamily: 'bold', marginLeft: 12 },
    miniProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
    },
    miniAvatar: { width: 50, height: 50, borderRadius: 25 },
    nameText: { fontSize: 18, fontFamily: 'bold' },
    viewProfileText: { fontSize: 13, color: COLORS.greyscale600, marginTop: 2 },
    sectionDivider: {
        height: 1,
        backgroundColor: COLORS.grayscale200,
        marginVertical: 10,
    },
    sectionLabel: {
        fontSize: 12,
        fontFamily: 'bold',
        color: COLORS.greyscale500,
        textTransform: 'uppercase',
        marginVertical: 15,
        letterSpacing: 1,
    },
    customRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    leftRow: { flexDirection: 'row', alignItems: 'center' },
    rowIcon: { width: 24, height: 24 },
    rowLabel: { fontSize: 18, fontFamily: 'semiBold', marginLeft: 12 },
    simpleLogout: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        paddingVertical: 10,
    },
    simpleLogoutText: {
        color: COLORS.red,
        fontSize: 18,
        fontFamily: 'semiBold',
        marginLeft: 12,
    },
    bottomTitle: {
        fontSize: 22,
        fontFamily: 'bold',
        color: COLORS.red,
        textAlign: 'center',
        marginTop: 12,
    },
    bottomSubtitle: { fontSize: 16, textAlign: 'center', marginVertical: 20 },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
    },
    cancelBtn: {
        width: '45%',
        borderRadius: 32,
        backgroundColor: COLORS.grayscale200,
    },
    logoutBtnAction: {
        width: '45%',
        borderRadius: 32,
        backgroundColor: COLORS.primary,
    },
    separateLine: {
        height: 1,
        backgroundColor: COLORS.grayscale200,
        marginTop: 15,
    },
})

export default Menu
