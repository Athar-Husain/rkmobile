import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import {
    shouldPromptForNotification,
    requestUserPermission,
    openNotificationSettings,
} from '../hooks/NotificationPermission'

const NotificationBanner = () => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const check = async () => {
            const canPrompt = await shouldPromptForNotification()
            setVisible(canPrompt)
        }
        check()
    }, [])

    const handleEnable = async () => {
        const granted = await requestUserPermission()
        if (!granted) {
            openNotificationSettings()
        }
        setVisible(false)
    }

    if (!visible) return null

    return (
        <View style={styles.banner}>
            <Text style={styles.text}>
                ⚡ Stay updated! Enable notifications to get real-time alerts.
            </Text>
            <TouchableOpacity onPress={handleEnable} style={styles.button}>
                <Text style={styles.buttonText}>Enable</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    banner: {
        backgroundColor: '#fffae6',
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 6,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
})

export default NotificationBanner
