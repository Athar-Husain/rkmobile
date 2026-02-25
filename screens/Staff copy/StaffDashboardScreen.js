import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'

const StaffDashboardScreen = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Staff Dashboard</Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Today's Orders</Text>
                <Text style={styles.cardValue}>24</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Pending Orders</Text>
                <Text style={styles.cardValue}>6</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Total Customers</Text>
                <Text style={styles.cardValue}>132</Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#F4F6FA',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 20,
        color: '#222',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        elevation: 4,
    },
    cardTitle: {
        fontSize: 14,
        color: '#777',
    },
    cardValue: {
        fontSize: 26,
        fontWeight: 'bold',
        marginTop: 5,
        color: '#004AAD',
    },
})

export default StaffDashboardScreen
