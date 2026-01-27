import notifee from '@notifee/react-native'

export const createNotificationChannel = async () => {
    const channelId = await notifee.createChannel({
        id: 'high_priority', // your custom channel ID
        name: 'High Priority Notifications',
        sound: 'default', // Ensure sound is enabled
        importance: notifee.AndroidImportance.HIGH, // Ensures heads-up notifications
    })
    console.log('Notification channel created:', channelId)
}
