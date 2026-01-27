import socket from './socket.js'
// import { store } from '../../redux/store.js' // Assuming your store is exported from here
// import {
//     addPublicComment,
//     addPrivateComment,
// } from '../../redux/features/Tickets/TicketSlice'
import { showMessage } from 'react-native-flash-message'
import { store } from '../redux/store.js'
import {
    addPublicComment,
    addPrivateComment,
} from '../redux/features/Tickets/TicketSlice.js'

export const setupTicketSocketListeners = (ticketId) => {
    if (!socket.connected) {
        socket.connect()
    }

    // Join the specific ticket room
    socket.emit('joinTicketRoom', ticketId)

    // Listener for new public comments
    socket.on('ticketPublicCommentAdded', ({ newComment }) => {
        console.log('New public comment received from socket:', newComment)
        store.dispatch(addPublicComment(newComment)) // Dispatch the action to update state
        showMessage({
            message: 'New message received',
            type: 'info',
        })
    })

    // Listener for new private comments
    socket.on('ticketPrivateCommentAdded', ({ newComment }) => {
        console.log('New private comment received from socket:', newComment)
        store.dispatch(addPrivateComment(newComment)) // Dispatch the action to update state
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
