import React, { useEffect } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import ChatMessage from './ChatMessage'

const ChatList = ({
    messages,
    currentUser,
    dark,
    flatListRef,
    onContentSizeChange,
    onLayout,
}) => {
    // const handleContentSizeChange = () => {
    //     if (flatListRef?.current) {
    //         flatListRef.current.scrollToEnd({ animated: true })
    //     }
    //     if (onContentSizeChange) {
    //         onContentSizeChange()
    //     }
    // }

    return (
        <FlatList
            ref={flatListRef}
            data={messages}
            // data={[...messages].reverse()}
            extraData={messages}
            renderItem={({ item }) => (
                <ChatMessage
                    item={item}
                    currentUser={currentUser}
                    dark={dark}
                />
            )}
            keyExtractor={(item, index) => `${item._id}-${index}`}
            contentContainerStyle={styles.container}
            onContentSizeChange={onContentSizeChange}
            onLayout={onLayout}
            // inverted
        />
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingBottom: 80,
    },
})

export default ChatList
