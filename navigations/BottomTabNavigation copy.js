import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Platform, StyleSheet, View } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// Import screens
import { Home } from '../screens'
import CouponsScreen from '../screens/CouponsScreen'
import ShopsScreen from '../screens/ShopsScreen'
import AlertsScreen from '../screens/AlertsScreen'
import OrderHistoryScreen from '../screens/OrderHistoryScreen'

const Tab = createBottomTabNavigator()

// Optimization: Use a map for icons to keep the component clean
const TAB_ICONS = {
    Home: { active: 'home', inactive: 'home-outline' },
    Coupons: { active: 'ticket-percent', inactive: 'ticket-percent-outline' },
    Shops: { active: 'store', inactive: 'store-outline' },
    Alerts: { active: 'bell', inactive: 'bell-outline' },
    Orders: { active: 'clipboard-text', inactive: 'clipboard-text-outline' },
}

const BottomTabNavigation = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#004AAD',
                tabBarInactiveTintColor: '#9DA3B4',
                tabBarShowLabel: true,
                tabBarLabelStyle: styles.tabLabel,
                tabBarStyle: styles.tabBar,
                tabBarIcon: ({ focused, color, size }) => {
                    const iconConfig = TAB_ICONS[route.name]
                    const iconName = focused
                        ? iconConfig.active
                        : iconConfig.inactive

                    return (
                        <View
                            style={focused ? styles.activeIconContainer : null}
                        >
                            <MaterialCommunityIcons
                                name={iconName}
                                size={26}
                                color={color}
                            />
                        </View>
                    )
                },
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Coupons" component={CouponsScreen} />
            <Tab.Screen name="Shops" component={ShopsScreen} />
            <Tab.Screen name="Orders" component={OrderHistoryScreen} />
            <Tab.Screen
                name="Alerts"
                component={AlertsScreen}
                options={{ tabBarBadge: 3, tabBarBadgeStyle: styles.badge }}
            />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute', // Makes it look floating if combined with bottom margin
        height: Platform.OS === 'ios' ? 88 : 70,
        paddingBottom: Platform.OS === 'ios' ? 30 : 12,
        paddingTop: 10,
        backgroundColor: '#ffffff',
        borderTopWidth: 0, // Remove default line
        elevation: 20, // Stronger shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: -4,
    },
    activeIconContainer: {
        // Optional: Add a subtle background circle for the active icon
        // backgroundColor: '#F0F5FF',
        // padding: 8,
        // borderRadius: 15,
    },
    badge: {
        backgroundColor: '#E91E63',
        color: 'white',
        fontSize: 10,
        lineHeight: 15,
    },
})

export default BottomTabNavigation
