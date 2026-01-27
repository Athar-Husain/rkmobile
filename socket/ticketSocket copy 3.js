// /socket/ticketSocket.js

import socket from './socket.js'
import { showMessage } from 'react-native-flash-message'
import { store } from '../redux/store.js'
import {
    addRealTimePublicComment,
    addRealTimePrivateComment,
} from '../redux/features/Tickets/TicketSlice.js'

export const setupTicketSocketListeners = (ticketId) => {
    if (!socket.connected) {
        socket.connect()
    }

    socket.emit('joinTicketRoom', ticketId)

    const publicListener = (data) => {
        console.log('New public comment received from socket:', data)
        // If backend is sending { newComment: {...} }
        const commentObj = data.newComment ? data.newComment : data
        store.dispatch(addRealTimePublicComment(commentObj))
    }

    socket.on('ticketPublicCommentAdded', publicListener)

    const privateListener = (data) => {
        const commentObj = data.newComment ? data.newComment : data
        store.dispatch(addRealTimePrivateComment(commentObj))
    }

    socket.on('ticketPrivateCommentAdded', privateListener)

    return () => {
        socket.emit('leaveTicketRoom', ticketId)
        socket.off('ticketPublicCommentAdded', publicListener)
        socket.off('ticketPrivateCommentAdded', privateListener)
    }
}
