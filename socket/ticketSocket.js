// /socket/ticketSocket.js

import socket from './socket.js'
import { showMessage } from 'react-native-flash-message'
import {
    addRealTimePublicComment,
    addRealTimePrivateComment,
} from '../redux/features/Tickets/TicketSlice.js'

export const setupTicketSocketListeners = (ticketId, dispatch) => {
    if (!socket.connected) {
        socket.connect()
    }

    socket.emit('joinTicketRoom', ticketId)

    const publicListener = (data) => {
        // console.log('New public comment received from socket:', data)
        const commentObj = data.newComment ? data.newComment : data

        // ✅ Call dispatch directly, no need for setTimeout
        dispatch(addRealTimePublicComment(commentObj))

        showMessage({
            message: 'New public comment received',
            type: 'info',
        })
    }

    const privateListener = (data) => {
        const commentObj = data.newComment ? data.newComment : data

        dispatch(addRealTimePrivateComment(commentObj))

        showMessage({
            message: 'New private comment received',
            type: 'info',
        })
    }

    // io.to(ticketId).emit('ticketPublicCommentAdded', {
    //   newComment: populatedNewComment,
    // });
    // res.status(201).json(populatedNewComment);

    socket.on('ticketPublicCommentAdded', publicListener)
    socket.on('ticketPrivateCommentAdded', privateListener)

    return () => {
        socket.emit('leaveTicketRoom', ticketId)
        socket.off('ticketPublicCommentAdded', publicListener)
        socket.off('ticketPrivateCommentAdded', privateListener)
    }
}
