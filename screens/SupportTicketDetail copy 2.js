import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Alert,
    ActivityIndicator,
} from 'react-native'
import { useRoute } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'

import {
    getTicketById,
    getPublicComments,
    addPublicComment,
} from '../redux/features/Tickets/TicketSlice'
import { setupTicketSocketListeners } from '../socket/ticketSocket'
import * as ImagePicker from 'expo-image-picker'

import { useTheme } from '../theme/ThemeProvider'
import TicketInfo from '../containers/TicketDeatils/TicketInfo'
import ChatList from '../containers/TicketDeatils/ChatList'
import ChatInput from '../containers/TicketDeatils/ChatInput'

// Components
// import TicketInfo from '../components/chat/TicketInfo'
// import ChatInput from '../components/chat/ChatInput'
// import ChatList from '../components/chat/ChatList'

const SupportTicketDetail = () => {
    const route = useRoute()
    const dispatch = useDispatch()
    const { ticketId } = route.params
    const { dark } = useTheme()

    const {
        ticket,
        publicComments,
        isTicketLoading,
        isTicketError,
        isSendingComment,
    } = useSelector((state) => state.ticket)
    const currentUser = useSelector((state) => state.customer.customer)

    const [message, setMessage] = useState('')
    const [media, setMedia] = useState(null)
    const flatListRef = useRef(null)

    const isResolved = (ticket?.status || '').toLowerCase() === 'resolved'

    useEffect(() => {
        const fetchAll = async () => {
            await dispatch(getTicketById(ticketId))
            await dispatch(getPublicComments(ticketId))
        }

        if (ticketId) {
            fetchAll()
            const cleanup = setupTicketSocketListeners(ticketId, dispatch)
            return () => cleanup()
        }
    }, [ticketId, dispatch])

    // const scrollToBottom = useCallback(() => {
    //     flatListRef.current?.scrollToOffset({ offset: 0, animated: true }) // because list is inverted
    // }, [])
    const scrollToBottom = useCallback(() => {
        flatListRef.current?.scrollToEnd({ animated: true }) // because list is inverted
    }, [])

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
        } catch (err) {
            console.error('Error sending comment:', err)
        }
    }

    if (isTicketLoading || !ticket) {
        return (
            <SafeAreaView
                style={[
                    styles.loadingContainer,
                    { backgroundColor: dark ? '#000' : '#F4F5F7' },
                ]}
            >
                <ActivityIndicator size="large" color="#0A84FF" />
                <Text style={{ marginTop: 10, color: dark ? '#fff' : '#000' }}>
                    Loading ticket...
                </Text>
            </SafeAreaView>
        )
    }

    if (isTicketError) {
        return (
            <SafeAreaView
                style={[
                    styles.loadingContainer,
                    { backgroundColor: dark ? '#000' : '#F4F5F7' },
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
            <TicketInfo ticket={ticket} dark={dark} />

            <ChatList
                messages={publicComments}
                currentUser={currentUser}
                dark={dark}
                flatListRef={flatListRef}
                onContentSizeChange={scrollToBottom}
            />

            <ChatInput
                message={message}
                setMessage={setMessage}
                isResolved={isResolved}
                isSendingComment={isSendingComment}
                handleChooseMedia={handleChooseMedia}
                handleSendComment={handleSendComment}
                dark={dark}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    retryButton: {
        marginTop: 10,
        padding: 10,
    },
})

export default SupportTicketDetail
