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
import { ScrollView } from 'react-native-virtualized-view' // Assuming this provides ScrollView
import SettingsItem from '../components/SettingsItem' // Assuming this component exists
import { useTheme } from '../theme/ThemeProvider'
import RBSheet from 'react-native-raw-bottom-sheet'
import Button from '../components/Button' // Assuming this component exists

const Profile = ({ navigation }) => {
    const refRBSheet = useRef()
    const { dark, colors, setScheme } = useTheme()

    const [isDarkMode, setIsDarkMode] = useState(dark) // Initialize with current theme

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev)
        dark ? setScheme('light') : setScheme('dark')
    }

    /**
     * Render Header
     */
    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[
                        styles.backButton,
                        {
                            borderColor: dark
                                ? COLORS.dark3
                                : COLORS.grayscale200,
                        },
                    ]}
                >
                    <Image
                        source={icons.back} // Ensure this icon is available
                        resizeMode="contain"
                        style={[
                            styles.backIcon,
                            {
                                tintColor: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    />
                </TouchableOpacity>
                <Text
                    style={[
                        styles.headerTitle,
                        { color: dark ? COLORS.white : COLORS.greyscale900 },
                    ]}
                >
                    Menu
                </Text>
                {/* Changed title to Menu */}
                <View style={{ width: 46 }} />
            </View>
        )
    }

    /**
     * Render Profile Access & Settings Items
     */
    const renderMenuItems = () => {
        return (
            <View style={styles.settingsContainer}>
                {/* Profile Access Item */}
                <SettingsItem
                    icon={icons.userOutline} // Ensure this icon is available
                    name="Edit Profile"
                    onPress={() => navigation.navigate('EditProfile')} // Navigate to new screen
                />
                <SettingsItem
                    icon={icons.bell2} // Ensure this icon is available
                    name="Notification"
                    onPress={() => navigation.navigate('SettingsNotifications')}
                />
                <SettingsItem
                    icon={icons.wallet2Outline} // Ensure this icon is available
                    name="Payment"
                    onPress={() => navigation.navigate('SettingsPayment')}
                />
                <SettingsItem
                    icon={icons.shieldOutline} // Ensure this icon is available
                    name="Security"
                    onPress={() => navigation.navigate('SettingsSecurity')}
                />

                {/* Dark Mode Switch */}
                <TouchableOpacity
                    style={styles.settingsItemContainer}
                    activeOpacity={0.8}
                >
                    <View style={styles.leftContainer}>
                        <Image
                            source={icons.show} // Assuming this is for visibility/theme
                            resizeMode="contain"
                            style={[
                                styles.settingsIcon,
                                {
                                    tintColor: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                },
                            ]}
                        />
                        <Text
                            style={[
                                styles.settingsName,
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
                    <View style={styles.rightContainer}>
                        <Switch
                            value={isDarkMode}
                            onValueChange={toggleDarkMode}
                            thumbColor={
                                isDarkMode ? COLORS.white : COLORS.white
                            }
                            trackColor={{
                                false: COLORS.grayscale200,
                                true: COLORS.primary,
                            }}
                            ios_backgroundColor={COLORS.grayscale200}
                            style={styles.switch}
                        />
                    </View>
                </TouchableOpacity>

                <SettingsItem
                    icon={icons.lockedComputerOutline} // Ensure this icon is available
                    name="Privacy Policy"
                    onPress={() => navigation.navigate('SettingsPrivacyPolicy')}
                />
                <SettingsItem
                    icon={icons.infoCircle} // Ensure this icon is available
                    name="Help Center"
                    onPress={() => navigation.navigate('HelpCenter')}
                />
                <SettingsItem
                    icon={icons.people4} // Ensure this icon is available
                    name="Invite Friends"
                    onPress={() => navigation.navigate('InviteFriends')}
                />

                {/* Logout Button */}
                <TouchableOpacity
                    onPress={() => refRBSheet.current.open()}
                    style={styles.logoutContainer}
                >
                    <View style={styles.logoutLeftContainer}>
                        <Image
                            source={icons.logout} // Ensure this icon is available
                            resizeMode="contain"
                            style={[
                                styles.logoutIcon,
                                { tintColor: COLORS.red },
                            ]}
                        />
                        <Text
                            style={[styles.logoutName, { color: COLORS.red }]}
                        >
                            Logout
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <SafeAreaView
            style={[styles.area, { backgroundColor: colors.background }]}
        >
            <View
                style={[
                    styles.container,
                    { backgroundColor: colors.background },
                ]}
            >
                {renderHeader()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {renderMenuItems()}
                </ScrollView>
            </View>
            {/* Logout Confirmation Bottom Sheet */}
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={false}
                height={260} // Fixed height for better control
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    },
                    draggableIcon: {
                        backgroundColor: dark
                            ? COLORS.gray2
                            : COLORS.grayscale200,
                        height: 4,
                    },
                    container: {
                        borderTopRightRadius: 32,
                        borderTopLeftRadius: 32,
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                    },
                }}
            >
                <Text style={[styles.bottomTitle, { color: COLORS.red }]}>
                    Logout
                </Text>
                <View
                    style={[
                        styles.separateLine,
                        {
                            backgroundColor: dark
                                ? COLORS.greyScale800
                                : COLORS.grayscale200,
                        },
                    ]}
                />
                <Text
                    style={[
                        styles.bottomSubtitle,
                        {
                            color: dark ? COLORS.white : COLORS.black,
                        },
                    ]}
                >
                    Are you sure you want to log out?
                </Text>
                <View style={styles.bottomButtonContainer}>
                    <Button
                        title="Cancel"
                        style={{
                            width: (SIZES.width - 32) / 2 - 8,
                            backgroundColor: dark
                                ? COLORS.dark3
                                : COLORS.tansparentPrimary,
                            borderRadius: 32,
                            borderColor: dark
                                ? COLORS.dark3
                                : COLORS.tansparentPrimary,
                        }}
                        textColor={dark ? COLORS.white : COLORS.primary}
                        onPress={() => refRBSheet.current.close()}
                    />
                    <Button
                        title="Yes, Logout"
                        filled
                        style={styles.logoutConfirmButton}
                        onPress={() => {
                            // Implement your logout logic here
                            refRBSheet.current.close()
                            // Example: navigation.navigate('AuthStack');
                        }}
                    />
                </View>
            </RBSheet>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16, // Added margin for spacing
    },
    backButton: {
        height: 46,
        width: 46,
        borderWidth: 1,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        width: 24,
        height: 24,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        marginLeft: 12, // Adjusted for cleaner alignment
    },
    // Removed specific profile styles as they are now in EditProfileScreen
    settingsContainer: {
        marginVertical: 12,
    },
    settingsItemContainer: {
        width: SIZES.width - 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingsIcon: {
        height: 24,
        width: 24,
    },
    settingsName: {
        fontSize: 18,
        fontFamily: 'semiBold',
        marginLeft: 12,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    switch: {
        marginLeft: 8,
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    },
    logoutContainer: {
        width: SIZES.width - 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
    },
    logoutLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutIcon: {
        height: 24,
        width: 24,
    },
    logoutName: {
        fontSize: 18,
        fontFamily: 'semiBold',
        marginLeft: 12,
    },
    // Bottom Sheet Styles
    bottomButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
        paddingHorizontal: 16,
    },
    logoutConfirmButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.primary,
        borderRadius: 32,
    },
    bottomTitle: {
        fontSize: 24,
        fontFamily: 'semiBold',
        textAlign: 'center',
        marginTop: 12,
    },
    bottomSubtitle: {
        fontSize: 18, // Slightly reduced font size for better readability
        fontFamily: 'semiBold',
        textAlign: 'center',
        marginVertical: 20, // Adjusted margin
        paddingHorizontal: 16, // Added padding for better text wrapping
    },
    separateLine: {
        width: SIZES.width,
        height: 1,
        backgroundColor: COLORS.grayscale200,
        marginTop: 12,
    },
})

export default Profile
