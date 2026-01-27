import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

const HomeScreen = ({ navigation }) => {
    // Your home screen content here
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcome}>Welcome to RK Electronics</Text>
                <Text style={styles.subtitle}>
                    Your one-stop electronics shop
                </Text>
            </View>
            {/* Add more components as shown in your design */}
        </ScrollView>
    )
}

export default HomeScreen
