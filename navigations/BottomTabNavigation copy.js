// BottomTabNavigation.js
import React from 'react'
import { View, Platform, Image, Text, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { COLORS, FONTS, icons } from '../constants'
import {
    Bookings,
    Favourite,
    HelpCenter,
    Home,
    Inbox,
    Profile,
} from '../screens'
import { useTheme } from '../theme/ThemeProvider'
import BillingScreen from '../screens/Billing'
import ReferralsScreen from '../screens/Referral'
import Menu from '../screens/Menu'
// import Menu from '../screens/Profile'

const Tab = createBottomTabNavigator()

// Helper function to define common tab bar icon/label styling
const getTabBarIcon = (focused, iconSource, label, darkTheme) => (
    <View style={styles.tabIconContainer}>
        <Image
            source={iconSource}
            resizeMode="contain"
            style={[
                styles.tabIcon,
                {
                    tintColor: focused
                        ? COLORS.primary
                        : darkTheme
                          ? COLORS.gray3
                          : COLORS.gray3,
                },
            ]}
        />
        <Text
            style={[
                styles.tabLabel,
                {
                    color: focused
                        ? COLORS.primary
                        : darkTheme
                          ? COLORS.gray3
                          : COLORS.gray3,
                },
            ]}
        >
            {label}
        </Text>
    </View>
)

// Define the central Home/Dashboard tab separately for consistent styling
const CentralHomeTab = ({ focused }) => (
    <View style={styles.centralButtonContainer}>
        <View style={styles.centralButton}>
            <Image
                source={focused ? icons.dashboard : icons.dashboard2}
                resizeMode="contain"
                style={styles.centralButtonIcon}
            />
        </View>
    </View>
)

const BottomTabNavigation = () => {
    const { dark } = useTheme()

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: [
                    styles.tabBar,
                    { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
                ],
            }}
        >
            <Tab.Screen
                name="Help"
                component={HelpCenter}
                options={{
                    tabBarIcon: ({ focused }) =>
                        getTabBarIcon(focused, icons.headset, 'Help', dark),
                }}
            />
            <Tab.Screen
                name="Billing"
                component={BillingScreen}
                options={{
                    tabBarIcon: ({ focused }) =>
                        getTabBarIcon(
                            focused,
                            icons.walletOutline,
                            'Billing',
                            dark
                        ),
                }}
            />
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => CentralHomeTab({ focused }),
                }}
            />
            <Tab.Screen
                name="Referrals"
                component={ReferralsScreen}
                options={{
                    tabBarIcon: ({ focused }) =>
                        getTabBarIcon(
                            focused,
                            focused ? icons.people : icons.people2,
                            'Referrals',
                            dark
                        ),
                }}
            />
            <Tab.Screen
                name="Menu"
                component={Menu}
                options={{
                    tabBarIcon: ({ focused }) =>
                        getTabBarIcon(
                            focused,
                            focused ? icons.menu : icons.moreVertical,
                            'Menu',
                            dark
                        ),
                }}
            />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    tabIconContainer: {
        alignItems: 'center',
    },
    tabIcon: {
        height: 24,
        width: 24,
    },
    tabLabel: {
        ...FONTS.body4,
    },
    centralButtonContainer: {
        alignItems: 'center',
        marginTop: -20,
    },
    centralButton: {
        height: 60,
        width: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    centralButtonIcon: {
        height: 30,
        width: 30,
        tintColor: COLORS.white,
    },
    tabBar: {
        position: 'absolute',
        justifyContent: 'center',
        bottom: 0,
        right: 0,
        left: 0,
        elevation: 0,
        height: Platform.OS === 'ios' ? 90 : 60,
        borderTopColor: 'transparent',
    },
})

export default BottomTabNavigation
