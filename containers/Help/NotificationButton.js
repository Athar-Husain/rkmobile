import React from 'react'
import { Button, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import messaging from '@react-native-firebase/messaging'
import notifee from '@notifee/react-native'
import { addNotification } from '../../redux/features/Notifications/NotificationSlice'
import { displayLocalNotification } from '../../hooks/useNotifications'
// import { addNotification } from '../redux/features/Notifications/NotificationSlice'
// import { displayLocalNotification } from './useNotifications' // Assuming displayLocalNotification is in useNotifications.js

const NotificationButton = () => {
    const dispatch = useDispatch()
    const { customer, isLoggedIn } = useSelector((state) => state.customer)

    const handleManualNotification = async () => {
        if (!isLoggedIn || !customer?._id) {
            console.log('User is not logged in or missing customer info')
            return
        }

        // Sample notification data
        const remoteMessage = {
            data: {
                title: '📢 Manual Notification',
                message: 'This is a manually triggered notification',
                image: '', // Optional: add image URL if needed
            },
            notification: {
                title: 'Manual Trigger',
                body: 'You triggered this manually',
            },
        }

        // Dispatch data to your Redux store
        dispatch(addNotification(remoteMessage.data))

        // Display the notification manually
        await displayLocalNotification(remoteMessage)
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Trigger Notification" onPress={handleManualNotification} />
        </View>
    )
}

export default NotificationButton
