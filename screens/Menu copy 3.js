import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Switch,
} from 'react-native'
import React, { useRef } from 'react'
import { COLORS, icons, images } from '../constants'
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
        } catch (error) {
            console.error('Logout failed', error)
        }
    }

    const dynamicStyles = getStyles(colors, dark)

    return (
        <SafeAreaView style={[dynamicStyles.area]}>
            <View style={dynamicStyles.container}>
                {/* HEADER */}
                <View style={dynamicStyles.headerContainer}>
                    <Image
                        source={images.logo}
                        resizeMode="contain"
                        style={dynamicStyles.logo}
                    />
                    <Text style={dynamicStyles.headerTitle}>Settings</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* PROFILE */}
                    <TouchableOpacity
                        style={dynamicStyles.miniProfile}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Image
                            source={images.user1}
                            style={dynamicStyles.miniAvatar}
                        />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={dynamicStyles.nameText}>
                                Nathalie Erneson
                            </Text>
                            <Text style={dynamicStyles.viewProfileText}>
                                Account Details & Activity
                            </Text>
                        </View>
                        <MaterialIcons
                            name="chevron-right"
                            size={24}
                            color={colors.border}
                        />
                    </TouchableOpacity>

                    <View style={dynamicStyles.sectionDivider} />

                    {/* PREFERENCES */}
                    <Text style={dynamicStyles.sectionLabel}>Preferences</Text>

                    <SettingsItem
                        icon={icons.bell2}
                        name="Notification"
                        onPress={() =>
                            navigation.navigate('SettingsNotifications')
                        }
                    />

                    {/* DARK MODE */}
                    <View style={dynamicStyles.customRow}>
                        <View style={dynamicStyles.leftRow}>
                            <Image
                                source={icons.show}
                                style={dynamicStyles.rowIcon}
                            />
                            <Text style={dynamicStyles.rowLabel}>
                                Dark Mode
                            </Text>
                        </View>
                        <Switch
                            value={dark}
                            onValueChange={() =>
                                setScheme(dark ? 'light' : 'dark')
                            }
                            trackColor={{
                                false: '#E0E0E0',
                                true: colors.primary,
                            }}
                            thumbColor={dark ? colors.primary : '#FFF'}
                        />
                    </View>

                    {/* SECURITY */}
                    <Text style={dynamicStyles.sectionLabel}>
                        Security & Legal
                    </Text>

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

                    {/* LOGOUT */}
                    <TouchableOpacity
                        onPress={() => refRBSheet.current.open()}
                        style={dynamicStyles.simpleLogout}
                    >
                        <MaterialIcons
                            name="logout"
                            size={22}
                            color={colors.error}
                        />
                        <Text style={dynamicStyles.simpleLogoutText}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* LOGOUT SHEET */}
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown
                height={260}
                customStyles={{
                    container: {
                        borderTopRightRadius: 32,
                        borderTopLeftRadius: 32,
                        backgroundColor: colors.card,
                    },
                }}
            >
                <Text style={dynamicStyles.bottomTitle}>Logout</Text>
                <View style={dynamicStyles.separateLine} />
                <Text style={dynamicStyles.bottomSubtitle}>
                    Are you sure you want to log out?
                </Text>

                <View style={dynamicStyles.bottomContainer}>
                    <Button
                        title="Cancel"
                        style={dynamicStyles.cancelBtn}
                        textColor={colors.text}
                        onPress={() => refRBSheet.current.close()}
                    />
                    <Button
                        title="Yes, Logout"
                        filled
                        style={dynamicStyles.logoutBtnAction}
                        onPress={handleLogout}
                    />
                </View>
            </RBSheet>
        </SafeAreaView>
    )
}

export default Menu

/* ======================================================
   THEME AWARE STYLES
====================================================== */

const getStyles = (colors, dark) =>
    StyleSheet.create({
        area: {
            flex: 1,
            backgroundColor: colors.background,
        },
        container: {
            flex: 1,
            paddingHorizontal: 16,
        },
        headerContainer: {
            paddingVertical: 15,
            flexDirection: 'row',
            alignItems: 'center',
        },
        logo: {
            height: 28,
            width: 28,
            tintColor: colors.primary,
        },
        headerTitle: {
            fontSize: 22,
            fontFamily: 'bold',
            marginLeft: 12,
            color: colors.text,
        },
        miniProfile: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 20,
        },
        miniAvatar: {
            width: 50,
            height: 50,
            borderRadius: 25,
        },
        nameText: {
            fontSize: 18,
            fontFamily: 'bold',
            color: colors.text,
        },
        viewProfileText: {
            fontSize: 13,
            color: colors.textSecondary,
            marginTop: 2,
        },
        sectionDivider: {
            height: 1,
            backgroundColor: colors.border,
            marginVertical: 10,
        },
        sectionLabel: {
            fontSize: 12,
            fontFamily: 'bold',
            color: colors.textSecondary,
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
        leftRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        rowIcon: {
            width: 24,
            height: 24,
            tintColor: colors.text,
        },
        rowLabel: {
            fontSize: 18,
            fontFamily: 'semiBold',
            marginLeft: 12,
            color: colors.text,
        },
        simpleLogout: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 30,
            paddingVertical: 10,
        },
        simpleLogoutText: {
            fontSize: 18,
            fontFamily: 'semiBold',
            marginLeft: 12,
            color: colors.error,
        },
        bottomTitle: {
            fontSize: 22,
            fontFamily: 'bold',
            color: colors.error,
            textAlign: 'center',
            marginTop: 12,
        },
        bottomSubtitle: {
            fontSize: 16,
            textAlign: 'center',
            marginVertical: 20,
            color: colors.text,
        },
        bottomContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingHorizontal: 16,
        },
        cancelBtn: {
            width: '45%',
            borderRadius: 32,
            backgroundColor: colors.border,
        },
        logoutBtnAction: {
            width: '45%',
            borderRadius: 32,
            backgroundColor: colors.primary,
        },
        separateLine: {
            height: 1,
            backgroundColor: colors.border,
            marginTop: 15,
        },
    })
