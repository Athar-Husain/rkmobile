import React, { useMemo } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Platform, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// Screens
import StaffDashboardScreen from '../screens/Staff/StaffDashboardScreen'
import StaffOrdersScreen from '../screens/Staff/StaffOrdersScreen'
import StaffScanScreen from '../screens/Staff/StaffScannerScreen'
import StaffProfileScreen from '../screens/Staff/StaffProfileScreen'
import StaffNotificationsScreen from '../screens/Staff/StaffNotificationsScreen.js' // New Notifications Screen

const Tab = createBottomTabNavigator()

/* =====================================================
   TAB CONFIG (Clean + Scalable)
   ===================================================== */

const TAB_CONFIG = [
    {
        name: 'Dashboard',
        component: StaffDashboardScreen,
        icon: { active: 'view-dashboard', inactive: 'view-dashboard-outline' },
    },
    {
        name: 'Orders',
        component: StaffOrdersScreen,
        icon: { active: 'clipboard-list', inactive: 'clipboard-list-outline' },
    },
    {
        name: 'Scan',
        component: StaffScanScreen,
        icon: { active: 'qrcode-scan', inactive: 'qrcode-scan' },
    },
    {
        name: 'Notifications',
        component: StaffNotificationsScreen, // New Notifications Screen
        // component: StaffProfileScreen, // New Notifications Screen
        icon: { active: 'bell', inactive: 'bell-outline' },
    },
    {
        name: 'Profile',
        component: StaffProfileScreen,
        icon: { active: 'account', inactive: 'account-outline' },
    },
]

/* =====================================================
   MAIN COMPONENT
   ===================================================== */

const StaffBottomTabNavigation = () => {
    // Example: dynamic badge from Redux
    const pendingOrders = useSelector(
        (state) => state.purchase?.pendingOrdersCount
    )

    const screenOptions = useMemo(
        () => ({
            headerShown: false,
            tabBarActiveTintColor: '#004AAD',
            tabBarInactiveTintColor: '#9DA3B4',
            tabBarShowLabel: true,
            tabBarLabelStyle: styles.tabLabel,
            tabBarStyle: styles.tabBar,
        }),
        []
    )

    return (
        <Tab.Navigator screenOptions={screenOptions}>
            {TAB_CONFIG.map((tab) => (
                <Tab.Screen
                    key={tab.name}
                    name={tab.name}
                    component={tab.component}
                    options={{
                        tabBarIcon: ({ focused, color }) => {
                            const iconName = focused
                                ? tab.icon.active
                                : tab.icon.inactive

                            return (
                                <MaterialCommunityIcons
                                    name={iconName}
                                    size={24}
                                    color={color}
                                />
                            )
                        },
                        tabBarBadge:
                            tab.name === 'Orders' && pendingOrders > 0
                                ? pendingOrders
                                : undefined,
                        tabBarBadgeStyle: styles.badge,
                    }}
                />
            ))}
        </Tab.Navigator>
    )
}

export default StaffBottomTabNavigation

/* =====================================================
   STYLES
   ===================================================== */

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        height: Platform.OS === 'ios' ? 90 : 70,
        paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        paddingTop: 8,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 0,
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
    },

    tabLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: -2,
    },

    badge: {
        backgroundColor: '#E53935',
        fontSize: 10,
        fontWeight: '700',
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        lineHeight: 16,
    },
})
