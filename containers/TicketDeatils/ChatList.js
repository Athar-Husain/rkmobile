// containers/TicketDetails/ChatList.js
import React, { useEffect, useRef } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import ChatMessage from './ChatMessage'

const ChatList = ({ messages, currentUser, dark }) => {
    const flatListRef = useRef(null)

    useEffect(() => {
        if (flatListRef.current && messages?.length) {
            flatListRef.current.scrollToOffset({ offset: 0, animated: true })
        }
    }, [messages])

    return (
        <FlatList
            ref={flatListRef}
            data={[...messages].reverse()} // latest at bottom visually
            renderItem={({ item }) => (
                <ChatMessage
                    item={item}
                    currentUser={currentUser}
                    dark={dark}
                />
            )}
            keyExtractor={(item, index) => `${item._id}-${index}`}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            inverted
        />
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingBottom: 90,
    },
})

export default React.memo(ChatList)
