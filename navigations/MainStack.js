// navigation/MainStack.js
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useTheme } from '../theme/ThemeProvider'

// Main Navigation
import BottomTabNavigation from './BottomTabNavigation'

// Screens
import {
    EditProfile,
    SettingsNotifications,
    SettingsPayment,
    AddNewCard,
    SettingsSecurity,
    ChangePIN,
    ChangePassword,
    ChangeEmail,
    SettingsLanguage,
    SettingsPrivacyPolicy,
    InviteFriends,
    HelpCenter,
    CustomerService,
    EReceipt,
    Call,
    Chat,
    Notifications,
    Search,
    PopularServices,
    ServiceDetails,
    ServiceDetailsReviews,
    BookingStep1,
    BookingDetails,
    YourAddress,
    PaymentMethods,
    AddNewPaymentMethod,
    AddNewPaymentMethodDeclined,
    AddNewPaymentMethodSuccess,
    PaymentMethod,
    CancelBooking,
    CancelBookingPaymentMethods,
    MyBookings,
    ReviewSummary,
    Profile,
} from '../screens'

import SupportTicketDetail from '../screens/SupportTicketDetail'
import PlansScreen from '../screens/Plans'
import ConnectionsScreen from '../screens/Connections'
import Menu from '../screens/Menu'

const Stack = createNativeStackNavigator()

const MainStack = () => {
    const { dark } = useTheme()
    const backgroundColor = dark ? '#000' : '#FFF'
    const barStyle = dark ? 'light-content' : 'dark-content'

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
            <StatusBar
                style={barStyle}
                backgroundColor={backgroundColor}
                translucent={false}
            />

            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="MainTabs" component={BottomTabNavigation} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="Menu" component={Menu} />
                <Stack.Screen
                    name="SettingsNotifications"
                    component={SettingsNotifications}
                />
                <Stack.Screen
                    name="SettingsPayment"
                    component={SettingsPayment}
                />
                <Stack.Screen name="AddNewCard" component={AddNewCard} />
                <Stack.Screen
                    name="SettingsSecurity"
                    component={SettingsSecurity}
                />
                <Stack.Screen name="ChangePIN" component={ChangePIN} />
                <Stack.Screen
                    name="ChangePassword"
                    component={ChangePassword}
                />
                <Stack.Screen name="ChangeEmail" component={ChangeEmail} />
                <Stack.Screen
                    name="SettingsLanguage"
                    component={SettingsLanguage}
                />
                <Stack.Screen
                    name="SettingsPrivacyPolicy"
                    component={SettingsPrivacyPolicy}
                />
                <Stack.Screen name="InviteFriends" component={InviteFriends} />
                <Stack.Screen
                    name="CustomerService"
                    component={CustomerService}
                />
                <Stack.Screen name="HelpCenter" component={HelpCenter} />
                <Stack.Screen name="EReceipt" component={EReceipt} />
                <Stack.Screen name="Call" component={Call} />
                <Stack.Screen name="Chat" component={Chat} />
                <Stack.Screen name="Notifications" component={Notifications} />
                <Stack.Screen name="Search" component={Search} />
                <Stack.Screen
                    name="PopularServices"
                    component={PopularServices}
                />
                <Stack.Screen
                    name="ServiceDetails"
                    component={ServiceDetails}
                />
                <Stack.Screen
                    name="ServiceDetailsReviews"
                    component={ServiceDetailsReviews}
                />
                <Stack.Screen name="Plans" component={PlansScreen} />
                <Stack.Screen
                    name="Connections"
                    component={ConnectionsScreen}
                />
                <Stack.Screen name="BookingStep1" component={BookingStep1} />
                <Stack.Screen
                    name="BookingDetails"
                    component={BookingDetails}
                />
                <Stack.Screen name="YourAddress" component={YourAddress} />
                <Stack.Screen
                    name="PaymentMethods"
                    component={PaymentMethods}
                />
                <Stack.Screen
                    name="AddNewPaymentMethod"
                    component={AddNewPaymentMethod}
                />
                <Stack.Screen
                    name="AddNewPaymentMethodDeclined"
                    component={AddNewPaymentMethodDeclined}
                />
                <Stack.Screen
                    name="AddNewPaymentMethodSuccess"
                    component={AddNewPaymentMethodSuccess}
                />
                <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
                <Stack.Screen name="CancelBooking" component={CancelBooking} />
                <Stack.Screen
                    name="CancelBookingPaymentMethods"
                    component={CancelBookingPaymentMethods}
                />
                <Stack.Screen
                    name="TicketDetail"
                    component={SupportTicketDetail}
                />
                <Stack.Screen name="MyBookings" component={MyBookings} />
                <Stack.Screen name="ReviewSummary" component={ReviewSummary} />
            </Stack.Navigator>
        </SafeAreaView>
    )
}

export default MainStack
