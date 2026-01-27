import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native'

const WalletScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Wallet</Text>
                <Text style={styles.balance}>₹5,000.00</Text>
                <Text style={styles.balanceLabel}>Available Balance</Text>
            </View>
            {/* Add wallet functionality as per your design */}
        </ScrollView>
    )
}

export default WalletScreen
