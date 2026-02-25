import React from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'

const customers = [
    { id: '1', name: 'John Doe', phone: '123-456-7890' },
    { id: '2', name: 'Sarah Smith', phone: '987-654-3210' },
    { id: '3', name: 'Michael Lee', phone: '555-222-1111' },
]

const StaffCustomersScreen = () => {
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.phone}</Text>
        </View>
    )

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Customers</Text>
            <FlatList
                data={customers}
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
    name: {
        fontWeight: 'bold',
        fontSize: 16,
    },
})

export default StaffCustomersScreen
