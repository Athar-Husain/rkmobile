import React, { useState } from 'react'
import {
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Pressable,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient'

const ChatInput = ({
    message,
    setMessage,
    isResolved,
    isSendingComment,
    handleChooseMedia,
    handleSendComment,
    dark,
}) => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            style={styles.wrapper}
        >
            <View
                style={[
                    styles.container,
                    { backgroundColor: dark ? '#1C1C1E' : '#F7F7F7' },
                ]}
            >
                {/* Attachment Icon */}
                <TouchableOpacity
                    onPress={handleChooseMedia}
                    disabled={isResolved}
                    style={styles.iconButton}
                    activeOpacity={0.6}
                >
                    <Icon
                        name="attach-outline"
                        size={24}
                        color={isResolved ? '#999' : dark ? '#EAEAEA' : '#333'}
                    />
                </TouchableOpacity>

                {/* Message Input */}
                <TextInput
                    style={[
                        styles.input,
                        {
                            color: dark ? '#EAEAEA' : '#111',
                            backgroundColor: dark ? '#2C2C2E' : '#FFF',
                        },
                    ]}
                    placeholder={
                        isResolved ? 'Ticket is resolved' : 'Type a message...'
                    }
                    placeholderTextColor={dark ? '#666' : '#999'}
                    value={message}
                    onChangeText={setMessage}
                    editable={!isResolved}
                    multiline
                    numberOfLines={1}
                />

                {/* Send Button with native press feedback */}
                <Pressable
                    onPress={handleSendComment}
                    disabled={isResolved || isSendingComment}
                    android_ripple={{
                        color: 'rgba(255,255,255,0.3)',
                        borderless: true,
                    }}
                    style={({ pressed }) => [
                        {
                            transform: [{ scale: pressed ? 0.95 : 1 }],
                            opacity: pressed ? 0.9 : 1,
                        },
                    ]}
                >
                    <LinearGradient
                        colors={
                            isResolved
                                ? ['#999', '#888']
                                : ['#0A84FF', '#0062FF']
                        }
                        style={styles.sendButton}
                    >
                        {isSendingComment ? (
                            <ActivityIndicator color="#FFF" size="small" />
                        ) : (
                            <Icon name="send" size={20} color="#FFF" />
                        )}
                    </LinearGradient>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 8,
        backgroundColor: 'transparent',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderRadius: 25,
        paddingHorizontal: 10,
        paddingVertical: 6,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    iconButton: {
        padding: 8,
    },
    input: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 15,
        maxHeight: 150,
    },
    sendButton: {
        marginLeft: 8,
        padding: 10,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 42,
        minHeight: 42,
    },
})

export default ChatInput
