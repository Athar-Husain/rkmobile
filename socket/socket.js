// socket/scoket.js
import { io } from 'socket.io-client'
import { BASE_API_URL } from '../utils/baseurl'
import { TokenManager } from '../redux/features/Customers/CustomerService'

const socket = io(BASE_API_URL, {
    autoConnect: false, // Prevents automatic connection on import
    auth: async (cb) => {
        const token = await TokenManager.getToken()
        cb({ token })
    },
})

export default socket
