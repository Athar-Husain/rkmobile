import React, { useMemo } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Platform, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTheme } from '../theme/ThemeProvider' // Added theme hook
import { COLORS } from '../constants'

// Screens
import StaffDashboardScreen from '../screens/Staff/StaffDashboardScreen'
import StaffOrdersScreen from '../screens/Staff/StaffOrdersScreen'
import StaffScanScreen from '../screens/Staff/StaffScannerScreen'
import StaffProfileScreen from '../screens/Staff/StaffProfileScreen'
import StaffNotificationsScreen from '../screens/Staff/StaffNotificationsScreen.js'

const Tab = createBottomTabNavigator()

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
        component: StaffNotificationsScreen,
        icon: { active: 'bell', inactive: 'bell-outline' },
    },
    {
        name: 'Profile',
        component: StaffProfileScreen,
        icon: { active: 'account', inactive: 'account-outline' },
    },
]

const StaffBottomTabNavigation = () => {
    const { colors, dark } = useTheme()
    const pendingOrders = useSelector(
        (state) => state.purchase?.pendingOrdersCount
    )

    const screenOptions = useMemo(
        () => ({
            headerShown: false,
            tabBarActiveTintColor: dark ? '#58A6FF' : '#004AAD',
            tabBarInactiveTintColor: dark ? '#8E8E93' : '#9DA3B4',
            tabBarShowLabel: true,
            tabBarLabelStyle: styles.tabLabel,
            tabBarStyle: [
                styles.tabBar,
                {
                    backgroundColor: dark ? '#1C1C1E' : '#FFFFFF',
                    shadowOpacity: dark ? 0.3 : 0.08,
                },
            ],
        }),
        [dark, colors]
    )

    return (
        <Tab.Navigator screenOptions={screenOptions}>
            {TAB_CONFIG.map((tab) => (
                <Tab.Screen
                    key={tab.name}
                    name={tab.name}
                    component={tab.component}
                    options={{
                        tabBarIcon: ({ focused, color }) => (
                            <MaterialCommunityIcons
                                name={
                                    focused
                                        ? tab.icon.active
                                        : tab.icon.inactive
                                }
                                size={24}
                                color={color}
                            />
                        ),
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

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        height: Platform.OS === 'ios' ? 90 : 70,
        paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        paddingTop: 8,
        borderTopWidth: 0,
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowRadius: 12,
    },
    tabLabel: { fontSize: 11, fontWeight: '600', marginTop: -2 },
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

export default StaffBottomTabNavigation
