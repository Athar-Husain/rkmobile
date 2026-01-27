import { useEffect } from 'react'
import { showMessage } from 'react-native-flash-message'
import { useDispatch, useSelector } from 'react-redux'

const CustomerSessionManager = () => {
    const dispatch = useDispatch()
    const { customer, isLoggedIn } = useSelector((state) => state.customer)

    useEffect(() => {
        const initCustomerSession = async () => {
            const token = await AsyncStorage.getItem('access_token')
            const expiry = await AsyncStorage.getItem('token_expiry')
            const isValidToken =
                token && expiry && Date.now() < parseInt(expiry, 10)

            dispatch(checkOnboardingStatus())

            if (!isValidToken) {
                showMessage({
                    message: 'Session expired, please log in again.',
                    type: 'danger',
                })
                dispatch(logoutCustomer())
                return
            }

            if (!customer) {
                try {
                    await dispatch(getCustomerProfile()).unwrap()
                } catch (error) {
                    console.error('Session restoration failed:', error)
                    showMessage({
                        message: 'Failed to restore session. Please try again.',
                        type: 'danger',
                    })
                    dispatch(logoutCustomer())
                }
            }
        }

        initCustomerSession()
    }, [dispatch, customer])

    return null
}

export default CustomerSessionManager
