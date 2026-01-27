// /socket/ticketSocket.js

import socket from './socket.js'
import { showMessage } from 'react-native-flash-message'
import { store } from '../redux/store.js'
import {
    // ❌ These are async thunks, we can't dispatch them directly from a socket event
    // addPublicComment,
    // addPrivateComment,

    // ✅ Import the new, synchronous reducers
    addRealTimePublicComment,
    addRealTimePrivateComment,
} from '../redux/features/Tickets/TicketSlice.js'

export const setupTicketSocketListeners = (ticketId) => {
    if (!socket.connected) {
        socket.connect()
    }

    // Join the specific ticket room
    socket.emit('joinTicketRoom', ticketId)

    // Listener for new public comments
    socket.on('ticketPublicCommentAdded', (newComment) => {
        console.log('New public comment received from socket:', newComment)
        // ✅ Use the new reducer action
        store.dispatch(addRealTimePublicComment(newComment))
        showMessage({
            message: 'New message received',
            type: 'info',
        })
    })

    // Listener for new private comments
    socket.on('ticketPrivateCommentAdded', (newComment) => {
        console.log('New private comment received from socket:', newComment)
        // ✅ Use the new reducer action
        store.dispatch(addRealTimePrivateComment(newComment))
        showMessage({
            message: 'New private note received',
            type: 'info',
        })
    })

    // Cleanup function
    return () => {
        socket.emit('leaveTicketRoom', ticketId)
        socket.off('ticketPublicCommentAdded')
        socket.off('ticketPrivateCommentAdded')
    }
}
