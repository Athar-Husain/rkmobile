import React from 'react'
import {
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const ChatInput = ({
    message,
    setMessage,
    isResolved,
    isSendingComment,
    handleChooseMedia,
    handleSendComment,
    dark,
}) => (
    <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputArea}
    >
        <View
            style={[
                styles.inputRow,
                { backgroundColor: dark ? '#1C1C1E' : '#FFFFFF' },
            ]}
        >
            <TouchableOpacity
                style={styles.attachButton}
                onPress={handleChooseMedia}
                disabled={isResolved}
            >
                <Icon
                    name="attach-outline"
                    size={24}
                    color={isResolved ? '#999' : dark ? '#FFF' : '#444'}
                />
            </TouchableOpacity>

            <TextInput
                style={[
                    styles.inputText,
                    { color: dark ? '#EAEAEA' : '#333' },
                    isResolved && styles.disabledInput,
                ]}
                placeholder={
                    isResolved ? 'Ticket is resolved' : 'Type a message...'
                }
                placeholderTextColor={dark ? '#666' : '#999'}
                value={message}
                onChangeText={setMessage}
                editable={!isResolved}
            />

            <TouchableOpacity
                style={[
                    styles.sendButton,
                    isResolved && styles.disabledSendButton,
                ]}
                onPress={handleSendComment}
                disabled={isResolved || isSendingComment}
            >
                {isSendingComment ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                    <Icon name="send" size={20} color="#FFFFFF" />
                )}
            </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
)

const styles = StyleSheet.create({
    inputArea: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 10,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 30,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    attachButton: {
        padding: 5,
        marginRight: 10,
    },
    inputText: {
        flex: 1,
        fontSize: 14,
        maxHeight: 100,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
    },
    sendButton: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: '#0A84FF',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledInput: {
        backgroundColor: '#E0E0E0',
    },
    disabledSendButton: {
        backgroundColor: '#B0B0B0',
    },
})

export default ChatInput
