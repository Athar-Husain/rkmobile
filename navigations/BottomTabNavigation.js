import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Platform, StyleSheet, View } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as Haptics from 'expo-haptics'
import { useSelector } from 'react-redux'

// Theme & Constants
import { Home } from '../screens'
import CouponsScreen from '../screens/CouponsScreen'
import ShopsScreen from '../screens/ShopsScreen'
import OrderHistoryScreen from '../screens/OrderHistoryScreen'
import NotificationsScreen from '../screens/Notifications'
import { COLORS } from '../constants'
import { useTheme } from '../theme/ThemeProvider'

const Tab = createBottomTabNavigator()

const TAB_ICONS = {
    Home: { active: 'home', inactive: 'home-outline' },
    Coupons: { active: 'ticket-percent', inactive: 'ticket-percent-outline' },
    Shops: { active: 'store', inactive: 'store-outline' },
    Orders: { active: 'clipboard-text', inactive: 'clipboard-text-outline' },
    Notifications: { active: 'bell', inactive: 'bell-outline' },
}

const BottomTabNavigation = () => {
    const { colors, dark } = useTheme()

    const unreadAlertsCount = useSelector(
        (state) => state.notifications?.unreadCount || 0
    )

    const handleTabPress = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
    }

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: colors.grayscale700,
                tabBarShowLabel: true,
                tabBarHideOnKeyboard: true,
                tabBarLabelStyle: styles.tabLabel,

                // --- OVERLAP CONFIGURATION ---
                tabBarTransparent: true,
                tabBarStyle: [
                    styles.tabBar,
                    {
                        borderTopColor: dark
                            ? 'rgba(255,255,255,0.1)'
                            : 'rgba(0,0,0,0.05)',
                    },
                ],
                tabBarBackground: () => (
                    <View
                        style={[
                            StyleSheet.absoluteFill,
                            {
                                backgroundColor: dark
                                    ? 'rgba(28, 28, 30, 0.92)' // Dark Glass
                                    : 'rgba(255, 255, 255, 0.92)', // Light Glass
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                            },
                        ]}
                    />
                ),
                // -----------------------------

                tabBarIcon: ({ focused, color }) => {
                    const iconConfig = TAB_ICONS[route.name]
                    const iconName = focused
                        ? iconConfig.active
                        : iconConfig.inactive

                    return (
                        <MaterialCommunityIcons
                            name={iconName}
                            size={24}
                            color={color}
                        />
                    )
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                listeners={{ tabPress: handleTabPress }}
            />
            <Tab.Screen
                name="Coupons"
                component={CouponsScreen}
                listeners={{ tabPress: handleTabPress }}
            />
            <Tab.Screen
                name="Shops"
                component={ShopsScreen}
                listeners={{ tabPress: handleTabPress }}
            />
            <Tab.Screen
                name="Orders"
                component={OrderHistoryScreen}
                listeners={{ tabPress: handleTabPress }}
            />
            <Tab.Screen
                name="Notifications"
                component={NotificationsScreen}
                listeners={{ tabPress: handleTabPress }}
                options={{
                    tabBarBadge:
                        unreadAlertsCount > 0 ? unreadAlertsCount : null,
                    tabBarBadgeStyle: styles.badge,
                }}
            />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        height: Platform.OS === 'ios' ? 88 : 70,
        paddingBottom: Platform.OS === 'ios' ? 30 : 12,
        paddingTop: 10,
        borderTopWidth: 1,
        elevation: 0, // Removed for transparent look
        backgroundColor: 'transparent',
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '700',
        marginTop: 2,
    },
    badge: {
        backgroundColor: '#FF3B30',
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        lineHeight: 14,
        marginTop: Platform.OS === 'ios' ? 0 : 2,
    },
})

export default BottomTabNavigation
