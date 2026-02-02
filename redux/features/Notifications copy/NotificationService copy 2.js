// redux/features/Notifications/NotificationService.js
import axios from 'axios'
// import { BASE_API_URL } from '../../../utils/baseurl'
import { setNotifications } from './NotificationSlice'
import { BASE_API_URL } from '../../../utils/baseurl'

// Fetch all notifications for a customer
export const fetchNotifications = (customerId) => async (dispatch) => {
    try {
        const res = await axios.get(
            `${BASE_API_URL}/api/notifications/history/${customerId}`
        )
        dispatch(setNotifications(res.data.notifications || []))
    } catch (error) {
        console.error(
            '❌ Failed to fetch notifications:',
            error?.response?.data || error.message
        )
    }
}

// (Optional) Send a notification manually from client (e.g. for testing or team app)
export const sendNotificationToCustomer =
    ({ customerId, title, message, payload = {} }) =>
    async () => {
        try {
            await axios.post(`${BASE_API_URL}/api/notifications/send`, {
                customerId,
                title,
                message,
                payload,
            })
        } catch (error) {
            console.error(
                '❌ Failed to send notification:',
                error?.response?.data || error.message
            )
        }
    }
