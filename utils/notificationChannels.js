import notifee, {
    AndroidImportance,
    AndroidVisibility,
} from '@notifee/react-native'

export const createNotificationChannels = async () => {
    // Create high priority channel for urgent notifications
    await notifee.createChannel({
        id: 'high_priority',
        name: 'High Priority Notifications',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
        lights: true,
        lightColor: '#FF0000',
        visibility: AndroidVisibility.PUBLIC,
        description:
            'Channel for urgent notifications that require immediate attention',
    })

    // Create default channel for regular notifications
    await notifee.createChannel({
        id: 'default',
        name: 'Default Notifications',
        importance: AndroidImportance.DEFAULT,
        sound: 'default',
        vibration: true,
    })
}
