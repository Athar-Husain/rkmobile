import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native'
import { useTheme } from '../theme/ThemeProvider'
import Icon from 'react-native-vector-icons/Ionicons'

// Mock data for a user's billing information
const mockBillingData = {
    currentPlan: {
        name: 'Pro Plan',
        price: '₹599/month',
        status: 'Active',
        nextBillingDate: 'August 31, 2025',
    },
    transactions: [
        {
            id: '1',
            date: 'Jul 21, 2025',
            description: 'Monthly Subscription',
            amount: '-₹599.00',
            status: 'Completed',
        },
        {
            id: '2',
            date: 'Jun 21, 2025',
            description: 'Monthly Subscription',
            amount: '-₹599.00',
            status: 'Completed',
        },
        {
            id: '3',
            date: 'May 21, 2025',
            description: 'Monthly Subscription',
            amount: '-₹599.00',
            status: 'Completed',
        },
        {
            id: '4',
            date: 'Apr 21, 2025',
            description: 'Monthly Subscription',
            amount: '-₹599.00',
            status: 'Completed',
        },
        {
            id: '5',
            date: 'Mar 21, 2025',
            description: 'Monthly Subscription',
            amount: '-₹599.00',
            status: 'Completed',
        },
    ],
}

const BillingScreen = () => {
    const { dark } = useTheme()

    const renderTransactionItem = ({ item }) => (
        <View
            style={[
                styles.transactionItem,
                { backgroundColor: dark ? '#1C1C1E' : '#FFFFFF' },
                { borderBottomColor: dark ? '#333' : '#E0E0E0' },
            ]}
        >
            <View style={styles.transactionIcon}>
                <Icon name="receipt-outline" size={24} color="#14C9A0" />
            </View>
            <View style={styles.transactionDetails}>
                <Text
                    style={[
                        styles.transactionDescription,
                        { color: dark ? '#EAEAEA' : '#333' },
                    ]}
                >
                    {item.description}
                </Text>
                <Text
                    style={[
                        styles.transactionDate,
                        { color: dark ? '#999' : '#666' },
                    ]}
                >
                    {item.date}
                </Text>
            </View>
            <View style={styles.transactionAmountContainer}>
                <Text
                    style={[
                        styles.transactionAmount,
                        { color: dark ? '#EAEAEA' : '#333' },
                    ]}
                >
                    {item.amount}
                </Text>
            </View>
        </View>
    )

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: dark ? '#000' : '#F4F5F7' },
            ]}
        >
            <View
                style={[
                    styles.header,
                    { borderBottomColor: dark ? '#333' : '#E0E0E0' },
                ]}
            >
                <Text
                    style={[
                        styles.headerTitle,
                        { color: dark ? '#EAEAEA' : '#333' },
                    ]}
                >
                    Billing
                </Text>
            </View>

            {/* Plan Summary Card */}
            <View
                style={[
                    styles.planCard,
                    { backgroundColor: dark ? '#1C1C1E' : '#FFFFFF' },
                ]}
            >
                <View style={styles.planHeader}>
                    <Text
                        style={[
                            styles.planTitle,
                            { color: dark ? '#EAEAEA' : '#333' },
                        ]}
                    >
                        {mockBillingData.currentPlan.name}
                    </Text>
                    <Text style={styles.planPrice}>
                        {mockBillingData.currentPlan.price}
                    </Text>
                </View>
                <View style={styles.planStatusContainer}>
                    <Icon
                        name="checkmark-circle-outline"
                        size={16}
                        color="#14C9A0"
                    />
                    <Text style={styles.planStatus}>
                        {mockBillingData.currentPlan.status}
                    </Text>
                </View>
                <Text
                    style={[
                        styles.planBillingDate,
                        { color: dark ? '#999' : '#666' },
                    ]}
                >
                    Next billing date:{' '}
                    {mockBillingData.currentPlan.nextBillingDate}
                </Text>
                <TouchableOpacity style={styles.managePlanButton}>
                    <Text style={styles.managePlanText}>Manage Plan</Text>
                </TouchableOpacity>
            </View>

            {/* Transaction History Section */}
            <Text
                style={[
                    styles.sectionTitle,
                    { color: dark ? '#EAEAEA' : '#333' },
                ]}
            >
                Transaction History
            </Text>
            <FlatList
                data={mockBillingData.transactions}
                renderItem={renderTransactionItem}
                keyExtractor={(item) => item.id}
                style={styles.listContainer}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    planCard: {
        margin: 16,
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    planTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    planPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#14C9A0',
    },
    planStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    planStatus: {
        fontSize: 14,
        color: '#14C9A0',
        marginLeft: 5,
        fontWeight: '500',
    },
    planBillingDate: {
        fontSize: 14,
        marginBottom: 15,
    },
    managePlanButton: {
        backgroundColor: '#335EF7',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    managePlanText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
        marginTop: 10,
        marginBottom: 5,
    },
    listContainer: {
        paddingHorizontal: 16,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    transactionIcon: {
        padding: 8,
        borderRadius: 10,
        marginRight: 15,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionDescription: {
        fontSize: 16,
        fontWeight: '500',
    },
    transactionDate: {
        fontSize: 12,
    },
    transactionAmountContainer: {
        justifyContent: 'center',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
})

export default BillingScreen
