// src/redux/features/Customers/CustomerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import CustomerService from './CustomerService';

// This is the single, unified initialization thunk
export const initializeApplication = createAsyncThunk(
    'customer/initializeApplication',
    async (_, { dispatch }) => {
        try {
            // Step 1: Request Notification Permissions
            if (Platform.OS === 'android' && Platform.Version >= 33) {
                await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
            } else if (Platform.OS === 'ios') {
                await messaging().requestPermission();
            }

            // Step 2: Get the FCM Token
            const fcmToken = await messaging().getToken();
            console.log("FCM Token obtained during initialization:", fcmToken);

            // Step 3: Check if a user is already logged in
            const jwtToken = await AsyncStorage.getItem('jwt');
            if (jwtToken) {
                // Attempt to get the customer profile
                const customerProfile = await CustomerService.getProfile();
                
                // If profile is found, update the customer state
                if (customerProfile) {
                     // Register the FCM token with the backend immediately
                    dispatch(registerFCMToken({
                        userId: customerProfile._id,
                        fcmToken,
                        userType: 'Customer',
                    }));
                    return { ...customerProfile, isLoggedIn: true };
                }
            }

            // Step 4: Handle onboarding status
            const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');

            return {
                isLoggedIn: false,
                hasCompletedOnboarding: hasCompletedOnboarding === 'true'
            };
        } catch (error) {
            console.error('App initialization failed:', error);
            // Even on error, we should return a state to unblock the UI
            return {
                isLoggedIn: false,
                hasCompletedOnboarding: false
            };
        }
    }
);

// ... (Rest of the slice remains the same)