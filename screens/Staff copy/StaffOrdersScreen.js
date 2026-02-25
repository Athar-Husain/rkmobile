import React from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'

const orders = [
    { id: '1', customer: 'John Doe', total: '$45.00', status: 'Pending' },
    { id: '2', customer: 'Sarah Smith', total: '$78.00', status: 'Completed' },
    { id: '3', customer: 'Michael Lee', total: '$23.50', status: 'Preparing' },
]

const StaffOrdersScreen = () => {
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.customer}>{item.customer}</Text>
            <Text>Total: {item.total}</Text>
            <Text>Status: {item.status}</Text>
        </View>
    )

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Manage Orders</Text>
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F4F6FA',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 15,
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 12,
        elevation: 3,
    },
    customer: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
})

export default StaffOrdersScreen
