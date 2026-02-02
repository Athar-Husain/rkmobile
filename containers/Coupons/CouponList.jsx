import React, { useState } from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from 'react-native'

const coupons = [
    {
        code: 'WELCOME100',
        title: 'Welcome Offer',
        type: 'FIXED_AMOUNT',
        value: 100,
        minPurchaseAmount: 500,
        validFrom: '2026-01-29T07:46:16.013Z',
        validUntil: '2026-02-28T07:46:16.013Z',
        isActive: true,
        isExpired: false,
        currentRedemptions: 0,
        maxRedemptions: 1000,
        perUserLimit: 1,
        manualCode: 'RK-WELCOME100-123',
        description: 'Flat ₹100 off',
    },
    {
        code: 'IUGIUGUI',
        title: 'iuhihiu',
        type: 'FIXED_AMOUNT',
        value: 790,
        minPurchaseAmount: 10000,
        validFrom: '2026-01-31T00:00:00.000Z',
        validUntil: '2026-02-28T00:00:00.000Z',
        isActive: true,
        isExpired: false,
        currentRedemptions: 0,
        maxRedemptions: 1000,
        perUserLimit: 1,
        manualCode: 'RK-IUGIUGUI-584',
    },
    // Add all your other coupon objects here...
]

const CouponList = () => {
    const [expandedId, setExpandedId] = useState(null)

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id)
    }

    const renderItem = ({ item }) => {
        const isExpanded = item.code === expandedId
        return (
            <View style={styles.itemContainer}>
                <TouchableOpacity
                    onPress={() => toggleExpand(item.code)}
                    style={styles.header}
                >
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.code}>{item.code}</Text>
                </TouchableOpacity>
                {isExpanded && (
                    <View style={styles.details}>
                        {Object.entries(item).map(([key, value]) => (
                            <Text key={key} style={styles.detailText}>
                                {key}:{' '}
                                {typeof value === 'object'
                                    ? JSON.stringify(value)
                                    : value.toString()}
                            </Text>
                        ))}
                    </View>
                )}
            </View>
        )
    }

    return (
        <FlatList
            data={coupons}
            keyExtractor={(item) => item.code}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
        />
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        marginBottom: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    header: {
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    code: {
        fontSize: 14,
        color: '#555',
    },
    details: {
        padding: 12,
        borderTopWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#f9f9f9',
    },
    detailText: {
        fontSize: 14,
        marginBottom: 4,
    },
})

export default CouponList
