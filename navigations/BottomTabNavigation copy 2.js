import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Platform, StyleSheet, View } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as Haptics from 'expo-haptics' // Optional: if using Expo
import { useSelector } from 'react-redux'

// Theme & Constants
import { Home } from '../screens'
import CouponsScreen from '../screens/CouponsScreen'
import ShopsScreen from '../screens/ShopsScreen'
import AlertsScreen from '../screens/AlertsScreen'
import OrderHistoryScreen from '../screens/OrderHistoryScreen'
import { COLORS } from '../constants'
import { useTheme } from '../theme/ThemeProvider'
import NotificationsScreen from '../screens/Notifications'

const Tab = createBottomTabNavigator()

// Optimization: Use a map for icons to keep the component clean
const TAB_ICONS = {
    Home: { active: 'home', inactive: 'home-outline' },
    Coupons: { active: 'ticket-percent', inactive: 'ticket-percent-outline' },
    Shops: { active: 'store', inactive: 'store-outline' },
    Orders: { active: 'clipboard-text', inactive: 'clipboard-text-outline' },
    Notifications: { active: 'bell', inactive: 'bell-outline' },
}

const BottomTabNavigation = () => {
    const { colors, dark } = useTheme()

    // Production Logic: Get actual unread count from Redux
    const unreadAlertsCount = useSelector(
        (state) => state.alerts?.unreadCount || 0
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
                tabBarHideOnKeyboard: true, // Professional touch: hides bar when typing
                tabBarLabelStyle: styles.tabLabel,
                tabBarStyle: [
                    styles.tabBar,
                    {
                        backgroundColor: colors.background,
                        borderTopColor: dark ? colors.dark3 : '#EEEEEE',
                    },
                ],
                tabBarIcon: ({ focused, color }) => {
                    const iconConfig = TAB_ICONS[route.name]
                    const iconName = focused
                        ? iconConfig.active
                        : iconConfig.inactive

                    return (
                        <View style={focused ? styles.activeIconWrapper : null}>
                            <MaterialCommunityIcons
                                name={iconName}
                                size={24}
                                color={color}
                            />
                        </View>
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
        height: Platform.OS === 'ios' ? 90 : 70,
        paddingBottom: Platform.OS === 'ios' ? 30 : 15,
        paddingTop: 10,
        borderTopWidth: 1,
        elevation: 8, // Standard elevation for shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '700',
        fontFamily: 'medium', // Use your custom font if loaded
        marginTop: 2,
    },
    activeIconWrapper: {
        // Optional: you can add a small dot under the active icon here
    },
    badge: {
        backgroundColor: '#FF3B30', // Standard iOS red
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
