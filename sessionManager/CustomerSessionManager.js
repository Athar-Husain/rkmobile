import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    checkOnboardingStatus,
    getCustomerProfile,
    logoutCustomer,
} from '../redux/features/Customers/CustomerSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'

const CustomerSessionManager = () => {
    const dispatch = useDispatch()
    const { customer, isLoggedIn, isLoading } = useSelector(
        (state) => state.customer
    )

    useEffect(() => {
        const initCustomerSession = async () => {
            try {
                // Check the token validity
                const token = await AsyncStorage.getItem('access_token')
                const expiry = await AsyncStorage.getItem('token_expiry')

                // Check if the token is still valid
                const isValidToken =
                    token && expiry && Date.now() < parseInt(expiry, 10)

                // Sync the onboarding status only once
                // dispatch(checkOnboardingStatus())

                // If the token is invalid, log out the customer
                if (!isValidToken) {
                    dispatch(logoutCustomer())
                    return
                }

                // If no customer data is present and not already loading, fetch the profile
                if (!customer && !isLoading) {
                    await dispatch(getCustomerProfile()).unwrap()
                }
            } catch (error) {
                console.error('Error during session initialization:', error)
                // In case of an error, log out the user
                dispatch(logoutCustomer())
            }
        }

        initCustomerSession()
    }, [dispatch, customer, isLoading]) // Avoid unnecessary re-renders

    return null // No UI, just session logic
}

export default CustomerSessionManager
