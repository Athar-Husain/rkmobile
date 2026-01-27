// screens/SupportTicketDetail.js

import React, { useState, useEffect, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Image,
    Alert,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import * as ImagePicker from 'expo-image-picker'
import { useFocusEffect, useRoute } from '@react-navigation/native'
import { useTheme } from '../theme/ThemeProvider'
import { useDispatch, useSelector } from 'react-redux'
import {
    addPublicComment,
    getTicketById,
} from '../redux/features/Tickets/TicketSlice'

const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
        case 'resolved':
            return '#14C9A0'
        case 'in-progress':
            return '#FFD166'
        case 'open':
        default:
            return '#FF6B6B'
    }
}

const getPriorityColor = (priority) => {
    switch ((priority || '').toLowerCase()) {
        case 'high':
            return '#FF6B6B'
        case 'medium':
            return '#FFD166'
        case 'low':
            return '#14C9A0'
        default:
            return '#999'
    }
}

const SupportTicketDetail = () => {
    const route = useRoute()
    const { ticketId } = route.params
    const dispatch = useDispatch()
    const { dark } = useTheme()

    const { ticket, publicComments, isTicketLoading, isTicketError } =
        useSelector((state) => state.ticket)

    const [message, setMessage] = useState('')
    const [media, setMedia] = useState(null)

    const handleFetchTicket = async () => {
        try {
            await dispatch(getTicketById(ticketId))
        } catch (error) {
            console.error('Error fetching ticket:', error)
        }
    }

    useFocusEffect(
        useCallback(() => {
            if (ticketId) {
                handleFetchTicket()
            }
        }, [ticketId, dispatch])
    )

    // --- Enhanced Conditional Rendering to prevent null access errors ---
    if (isTicketLoading) {
        return (
            <SafeAreaView
                style={[
                    styles.container,
                    {
                        backgroundColor: dark ? '#000' : '#F4F5F7',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                ]}
            >
                <Text style={{ color: dark ? '#fff' : '#000' }}>
                    Loading ticket...
                </Text>
            </SafeAreaView>
        )
    }

    // Check for error OR null ticket (this is the key fix)
    if (isTicketError || !ticket || ticket === null) {
        return (
            <SafeAreaView
                style={[
                    styles.container,
                    {
                        backgroundColor: dark ? '#000' : '#F4F5F7',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                ]}
            >
                <Text style={{ color: dark ? '#fff' : '#000' }}>
                    {isTicketError
                        ? `Error: ${isTicketError}`
                        : 'Ticket not found or failed to load'}
                </Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={handleFetchTicket}
                >
                    <Text style={{ color: dark ? '#0A84FF' : '#007AFF' }}>
                        Retry
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }

    // Additional safety check - ensure ticket has required properties
    if (!ticket._id) {
        return (
            <SafeAreaView
                style={[
                    styles.container,
                    {
                        backgroundColor: dark ? '#000' : '#F4F5F7',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                ]}
            >
                <Text style={{ color: dark ? '#fff' : '#000' }}>
                    Invalid ticket data
                </Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={handleFetchTicket}
                >
                    <Text style={{ color: dark ? '#0A84FF' : '#007AFF' }}>
                        Retry
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }

    // This code block will only execute if ticket is valid and has _id
    const isResolved = (ticket.status || '').toLowerCase() === 'resolved'

    const handleChooseMedia = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert(
                'Permission Required',
                'We need media permissions to attach files.'
            )
            return
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        })
        if (!result.canceled) {
            const asset = result.assets[0]
            setMedia({
                uri: asset.uri,
                type: asset.type,
                name: asset.fileName,
            })
        }
    }

    const handleSendComment = () => {
        if (!message.trim() && !media) {
            Alert.alert(
                'Cannot send',
                'Please enter a message or attach media.'
            )
            return
        }
        // dispatch(addPublicComment({ ticketId, text: message.trim(), media }))
        dispatch(addPublicComment({ ticketId, content: message.trim(), media }))
        setMessage('')
        setMedia(null)
    }

    const renderComment = ({ item }) => {
        const isUser = item.sender === 'user'
        const alignSelf = isUser ? 'flex-end' : 'flex-start'
        const bubbleColor = isUser
            ? dark
                ? '#0A84FF'
                : '#007AFF'
            : dark
              ? '#2E2E2E'
              : '#E5E5EA'
        const textColor = isUser ? '#fff' : dark ? '#EAEAEA' : '#111'

        return (
            <View
                style={[
                    styles.commentBubble,
                    { alignSelf, backgroundColor: bubbleColor },
                ]}
            >
                {item.text ? (
                    <Text style={[styles.commentText, { color: textColor }]}>
                        {item.text}
                    </Text>
                ) : null}
                {item.media && item.media.uri ? (
                    <Image
                        source={{ uri: item.media.uri }}
                        style={styles.commentImage}
                    />
                ) : null}
                <Text style={[styles.commentTimestamp, { color: textColor }]}>
                    {new Date(item.createdAt).toLocaleString()}
                </Text>
            </View>
        )
    }

    // --- Main component view, only rendered when ticket is valid ---
    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: dark ? '#000' : '#F4F5F7' },
            ]}
        >
            {/* Ticket Header with necessary details */}
            <View
                style={[
                    styles.header,
                    { borderBottomColor: dark ? '#333' : '#DDD' },
                ]}
            >
                <Text
                    style={[
                        styles.headerTitle,
                        { color: dark ? '#EAEAEA' : '#333' },
                    ]}
                >
                    Ticket #{ticket._id.substring(0, 6)}
                </Text>
                <View style={styles.headerInfoRow}>
                    <View style={styles.headerInfoItem}>
                        <Icon
                            name="alert-circle-outline"
                            size={16}
                            color={getStatusColor(ticket.status)}
                        />
                        <Text
                            style={[
                                styles.headerInfoText,
                                { color: dark ? '#AAA' : '#555' },
                            ]}
                        >
                            {ticket.status || 'Unknown'}
                        </Text>
                    </View>
                    <View style={styles.headerInfoItem}>
                        <Icon
                            name="pricetag-outline"
                            size={16}
                            color={getPriorityColor(ticket.priority)}
                        />
                        <Text
                            style={[
                                styles.headerInfoText,
                                { color: dark ? '#AAA' : '#555' },
                            ]}
                        >
                            {ticket.priority || 'medium'}
                        </Text>
                    </View>
                </View>
                <Text
                    style={[
                        styles.headerSubject,
                        { color: dark ? '#FFF' : '#000' },
                    ]}
                >
                    {ticket.issueType || 'Issue'}:{' '}
                    {ticket.subject || ticket.description || ''}
                </Text>
            </View>

            {/* Public Comments chat view */}
            <FlatList
                data={ticket.publicComments || []}
                renderItem={renderComment}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.commentsContainer}
                inverted={false}
            />

            {/* Input for new public comment */}
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
                            isResolved
                                ? 'Ticket is resolved'
                                : 'Type a message...'
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
                        disabled={isResolved}
                    >
                        <Icon name="send" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerInfoRow: {
        flexDirection: 'row',
        marginTop: 8,
    },
    headerInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerInfoText: {
        marginLeft: 5,
        fontSize: 14,
    },
    headerSubject: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    commentsContainer: {
        paddingBottom: 80,
    },
    commentBubble: {
        marginVertical: 5,
        maxWidth: '80%',
        padding: 10,
        borderRadius: 15,
        flexDirection: 'column',
    },
    commentText: {
        fontSize: 14,
    },
    commentImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginTop: 8,
    },
    commentTimestamp: {
        marginTop: 5,
        fontSize: 12,
        textAlign: 'right',
    },
    inputArea: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 10,
        backgroundColor: '#F5F5F5',
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
    retryButton: {
        marginTop: 10,
        padding: 10,
    },
})

export default SupportTicketDetail
