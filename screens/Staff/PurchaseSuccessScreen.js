import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

const PurchaseSuccessScreen = ({ route, navigation }) => {
    const { purchase } = route.params

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Purchase Successful</Text>
            <Text>Invoice: {purchase.invoiceNumber}</Text>
            <Text>Final Amount: ₹{purchase.summary.finalAmount}</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('StaffHome')}
            >
                <Text style={{ color: '#fff' }}>Back to Home</Text>
            </TouchableOpacity>
        </View>
    )
}

export default PurchaseSuccessScreen

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    button: {
        marginTop: 30,
        backgroundColor: '#004AAD',
        padding: 15,
        borderRadius: 10,
    },
})
