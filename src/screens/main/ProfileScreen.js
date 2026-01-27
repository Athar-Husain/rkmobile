import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native'
import { useDispatch } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { logout } from '../../store/slices/authSlice'

const ProfileScreen = () => {
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout())
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>RK</Text>
                </View>
                <Text style={styles.name}>Ravi Kumar</Text>
                <Text style={styles.email}>ravi@rkelectronics.com</Text>
            </View>
            {/* Add profile options */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Icon name="logout" size={24} color="#e74c3c" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default ProfileScreen
