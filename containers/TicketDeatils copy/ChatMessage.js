import React from 'react'
import { View, Text, Image, StyleSheet, Animated } from 'react-native'

const ChatMessage = ({ item, currentUser, dark }) => {
    const isUser = item.commentBy?._id === currentUser?._id
    const alignStyle = isUser ? 'flex-end' : 'flex-start'
    const bubbleColor = isUser
        ? dark
            ? '#0A84FF'
            : '#007AFF'
        : dark
          ? '#2E2E2E'
          : '#E5E5EA'
    const textColor = isUser ? '#fff' : dark ? '#EAEAEA' : '#111'

    return (
        <Animated.View
            style={{ flexDirection: 'row', justifyContent: alignStyle }}
        >
            <View
                style={[
                    styles.bubble,
                    { backgroundColor: bubbleColor, alignSelf: alignStyle },
                ]}
            >
                {!isUser && (
                    <Text style={[styles.senderName, { color: textColor }]}>
                        {item.commentBy?.name || 'Support'}
                    </Text>
                )}
                {item.content && (
                    <Text style={[styles.text, { color: textColor }]}>
                        {item.content}
                    </Text>
                )}
                {item.media?.uri && (
                    <Image
                        source={{ uri: item.media.uri }}
                        style={styles.image}
                    />
                )}
                <Text style={[styles.timestamp, { color: textColor }]}>
                    {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}{' '}
                    {isUser ? '(You)' : ''}
                </Text>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    bubble: {
        maxWidth: '75%',
        borderRadius: 16,
        padding: 10,
        marginVertical: 6,
    },
    text: {
        fontSize: 15,
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 8,
        borderRadius: 10,
    },
    timestamp: {
        fontSize: 11,
        marginTop: 5,
        textAlign: 'right',
        opacity: 0.7,
    },
    senderName: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
})

export default ChatMessage
