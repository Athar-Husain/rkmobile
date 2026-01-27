// screens/SupportTicketDetail.js

import React, { useState, useEffect, useRef } from 'react'
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
    ActivityIndicator,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import * as ImagePicker from 'expo-image-picker'
import { useRoute } from '@react-navigation/native'
import { useTheme } from '../theme/ThemeProvider'
import { useDispatch, useSelector } from 'react-redux'
import {
    getTicketById,
    getPublicComments,
    addPublicComment,
} from '../redux/features/Tickets/TicketSlice'
import { setupTicketSocketListeners } from '../socket/ticketSocket'

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

    const currentUser = useSelector((state) => state.customer.customer)

    const [message, setMessage] = useState('')
    const [media, setMedia] = useState(null)
    const [isSending, setIsSending] = useState(false)

    const flatListRef = useRef(null)

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getTicketById(ticketId))
            await dispatch(getPublicComments(ticketId))
        }

        if (ticketId) {
            fetchData()
            const cleanup = setupTicketSocketListeners(ticketId)
            return () => cleanup()
        }
    }, [ticketId])

    const isResolved = (ticket?.status || '').toLowerCase() === 'resolved'

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
                name: asset.fileName || `attachment.${asset.type}`,
            })
        }
    }

    const handleSendComment = async () => {
        if (!ticketId || (!message.trim() && !media)) {
            Alert.alert(
                'Cannot send',
                'Please enter a message or attach a file.'
            )
            return
        }

        setIsSending(true)
        try {
            await dispatch(
                addPublicComment({
                    ticketId,
                    content: message.trim(),
                    media,
                })
            )
            setMessage('')
            setMedia(null)

            // Scroll to bottom after sending
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true })
            }, 200)
        } catch (err) {
            console.error('Failed to send comment:', err)
        } finally {
            setIsSending(false)
        }
    }

    const renderComment = ({ item }) => {
        const isUser = item.commentBy?._id === currentUser?._id
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
                {item.content && (
                    <Text style={[styles.commentText, { color: textColor }]}>
                        {item.content}
                    </Text>
                )}
                {item.media?.uri && (
                    <Image
                        source={{ uri: item.media.uri }}
                        style={styles.commentImage}
                    />
                )}
                <Text style={[styles.commentTimestamp, { color: textColor }]}>
                    {new Date(item.createdAt).toLocaleString()}
                </Text>
            </View>
        )
    }

    if (isTicketLoading || !ticket) {
        return (
            <SafeAreaView
                style={[
                    styles.container,
                    {
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: dark ? '#000' : '#F4F5F7',
                    },
                ]}
            >
                <ActivityIndicator size="large" color="#0A84FF" />
                <Text style={{ marginTop: 10, color: dark ? '#fff' : '#000' }}>
                    Loading ticket...
                </Text>
            </SafeAreaView>
        )
    }

    if (isTicketError || !ticket._id) {
        return (
            <SafeAreaView
                style={[
                    styles.container,
                    {
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: dark ? '#000' : '#F4F5F7',
                    },
                ]}
            >
                <Text style={{ color: dark ? '#fff' : '#000' }}>
                    Error loading ticket. Please try again.
                </Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => {
                        dispatch(getTicketById(ticketId))
                        dispatch(getPublicComments(ticketId))
                    }}
                >
                    <Text style={{ color: '#0A84FF' }}>Retry</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: dark ? '#000' : '#F4F5F7' },
            ]}
        >
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
                            {ticket.status}
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
                            {ticket.priority}
                        </Text>
                    </View>
                </View>
                <Text
                    style={[
                        styles.headerSubject,
                        { color: dark ? '#FFF' : '#000' },
                    ]}
                >
                    {ticket.issueType || 'Issue'}: {ticket.subject}
                </Text>
            </View>

            <FlatList
                ref={flatListRef}
                data={publicComments}
                renderItem={renderComment}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.commentsContainer}
            />

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
                        disabled={isResolved || isSending}
                    >
                        {isSending ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Icon name="send" size={20} color="#FFFFFF" />
                        )}
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
        marginRight: 15,
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
        padding: 10,
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
