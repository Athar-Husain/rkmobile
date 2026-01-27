// sessionManager/CustomerSessionManager
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    getCustomerProfile,
    logoutCustomer,
} from '../redux/features/Customers/CustomerSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'

const CustomerSessionManager = () => {
    const dispatch = useDispatch()
    const { customer, isLoggedIn } = useSelector((state) => state.customer)

    useEffect(() => {
        const initCustomerSession = async () => {
            const token = await AsyncStorage.getItem('access_token')
            const expiry = await AsyncStorage.getItem('token_expiry')
            const isValidToken =
                token && expiry && Date.now() < parseInt(expiry, 10)

            if (!isValidToken) {
                dispatch(logoutCustomer())
                return
            }

            try {
                if (!customer) {
                    await dispatch(getCustomerProfile()).unwrap()
                }
            } catch (error) {
                console.error('Session restoration failed:', error)
                dispatch(logoutCustomer())
            }
        }

        initCustomerSession()
    }, [dispatch])

    return null // No UI, just session logic
}

export default CustomerSessionManager
