import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/MaterialIcons'

import HomeScreen from '../screens/main/HomeScreen'
import ProfileScreen from '../screens/main/ProfileScreen'
import WalletScreen from '../screens/main/WalletScreen'
import OurShopsScreen from '../screens/main/OurShopsScreen'
import SupportScreen from '../screens/main/SupportScreen'

const Tab = createBottomTabNavigator()

const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName

                    switch (route.name) {
                        case 'Home':
                            iconName = focused ? 'home' : 'home'
                            break
                        case 'Profile':
                            iconName = focused ? 'person' : 'person-outline'
                            break
                        case 'Wallet':
                            iconName = focused
                                ? 'account-balance-wallet'
                                : 'account-balance-wallet'
                            break
                        case 'OurShops':
                            iconName = focused ? 'store' : 'store'
                            break
                        case 'Support':
                            iconName = focused
                                ? 'support-agent'
                                : 'support-agent'
                            break
                    }

                    return <Icon name={iconName} size={size} color={color} />
                },
                tabBarActiveTintColor: '#3498db',
                tabBarInactiveTintColor: '#95a5a6',
                tabBarStyle: {
                    paddingBottom: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 5,
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Home', headerShown: false }}
            />
            <Tab.Screen
                name="Wallet"
                component={WalletScreen}
                options={{ title: 'Wallet', headerShown: false }}
            />
            <Tab.Screen
                name="OurShops"
                component={OurShopsScreen}
                options={{ title: 'Our Shops', headerShown: false }}
            />
            <Tab.Screen
                name="Support"
                component={SupportScreen}
                options={{ title: 'Support', headerShown: false }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Profile', headerShown: false }}
            />
        </Tab.Navigator>
    )
}

export default MainTabNavigator
