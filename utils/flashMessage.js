import { showMessage } from 'react-native-flash-message'

export const showToast = (type, message) => {
    showMessage({
        message,
        type, // success | danger | info | warning
        duration: 3000,
    })
}
