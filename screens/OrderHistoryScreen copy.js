import React, { useState } from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const OrderHistoryScreen = () => {
    // Extended Data with Progress and Images
    const orders = [
        {
            id: 'INV-9901',
            item: 'Samsung Galaxy S24 Ultra',
            date: '24 Jan 2026',
            price: '₹74,999',
            status: 'Delivered',
            step: 3, // 1: Processing, 2: Shipped, 3: Delivered
            icon: 'cellphone-check',
            img: 'https://m.media-amazon.com/images/I/71RVuS3q9pL._SL1500_.jpg',
        },
        {
            id: 'INV-8852',
            item: 'LG OLED TV 55"',
            date: '12 Dec 2025',
            price: '₹1,20,000',
            status: 'Shipped',
            step: 2,
            icon: 'television-shimmer',
            img: 'https://m.media-amazon.com/images/I/819L6pNx6FL._SL1500_.jpg',
        },
    ]

    const OrderStats = () => (
        <View style={styles.statsRow}>
            <View style={styles.statBox}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Total Orders</Text>
            </View>
            <View
                style={[
                    styles.statBox,
                    { borderLeftWidth: 1, borderColor: '#EEE' },
                ]}
            >
                <Text style={[styles.statNumber, { color: '#EF6C00' }]}>1</Text>
                <Text style={styles.statLabel}>In Transit</Text>
            </View>
        </View>
    )

    const renderOrderItem = ({ item }) => {
        const isDelivered = item.status === 'Delivered'

        return (
            <View style={styles.card}>
                {/* Header: ID and Status Badge */}
                <View style={styles.cardHeader}>
                    <View style={styles.idGroup}>
                        <Text style={styles.orderLabel}>Order ID</Text>
                        <Text style={styles.orderId}>{item.id}</Text>
                    </View>
                    <View
                        style={[
                            styles.badge,
                            {
                                backgroundColor: isDelivered
                                    ? '#E8F5E9'
                                    : '#FFF3E0',
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.badgeText,
                                { color: isDelivered ? '#2E7D32' : '#EF6C00' },
                            ]}
                        >
                            {item.status}
                        </Text>
                    </View>
                </View>

                {/* Progress Visualizer */}
                <View style={styles.progressWrapper}>
                    <View style={styles.progressBarBackground}>
                        <View
                            style={[
                                styles.progressBarFill,
                                {
                                    width: `${(item.step / 3) * 100}%`,
                                    backgroundColor: isDelivered
                                        ? '#2E7D32'
                                        : '#004AAD',
                                },
                            ]}
                        />
                    </View>
                    <View style={styles.progressDotsRow}>
                        {[1, 2, 3].map((s) => (
                            <View
                                key={s}
                                style={[
                                    styles.dot,
                                    item.step >= s && {
                                        backgroundColor: isDelivered
                                            ? '#2E7D32'
                                            : '#004AAD',
                                    },
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* Body: Image and Price */}
                <View style={styles.cardBody}>
                    <Image
                        source={{ uri: item.img }}
                        style={styles.productImg}
                    />
                    <View style={styles.detailsText}>
                        <Text style={styles.itemName} numberOfLines={1}>
                            {item.item}
                        </Text>
                        <Text style={styles.dateText}>
                            Purchased on {item.date}
                        </Text>
                        <Text style={styles.price}>{item.price}</Text>
                    </View>
                </View>

                {/* Footer: Multi-Actions */}
                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.secondaryBtn}>
                        <MaterialCommunityIcons
                            name="file-document-outline"
                            size={16}
                            color="#666"
                        />
                        <Text style={styles.secondaryBtnText}>Invoice</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.primaryBtn,
                            {
                                backgroundColor: isDelivered
                                    ? '#004AAD'
                                    : '#FF9800',
                            },
                        ]}
                    >
                        <MaterialCommunityIcons
                            name={
                                isDelivered
                                    ? 'refresh'
                                    : 'truck-delivery-outline'
                            }
                            size={18}
                            color="#fff"
                        />
                        <Text style={styles.primaryBtnText}>
                            {isDelivered ? 'Buy Again' : 'Track Order'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerSection}>
                <Text style={styles.headerTitle}>Order History</Text>
                <OrderStats />
            </View>

            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingBottom: 40,
                }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FB' },
    headerSection: { marginTop: 50, paddingHorizontal: 20, marginBottom: 15 },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 20,
    },

    // Stats Section
    statsRow: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 15,
        elevation: 2,
    },
    statBox: { flex: 1, alignItems: 'center' },
    statNumber: { fontSize: 20, fontWeight: 'bold', color: '#004AAD' },
    statLabel: { fontSize: 12, color: '#7C7C7C', marginTop: 2 },

    // Card Layout
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 18,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    orderLabel: {
        fontSize: 10,
        color: '#9E9E9E',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    orderId: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A' },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    badgeText: { fontSize: 11, fontWeight: 'bold' },

    // Progress Bar
    progressWrapper: {
        marginVertical: 20,
        height: 10,
        justifyContent: 'center',
    },
    progressBarBackground: {
        height: 4,
        backgroundColor: '#F0F0F0',
        borderRadius: 2,
        width: '100%',
    },
    progressBarFill: { height: 4, borderRadius: 2 },
    progressDotsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        width: '100%',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#E0E0E0',
        borderWidth: 2,
        borderColor: '#FFF',
    },

    // Body
    cardBody: { flexDirection: 'row', marginBottom: 20 },
    productImg: {
        width: 70,
        height: 70,
        borderRadius: 12,
        backgroundColor: '#F9F9F9',
    },
    detailsText: { flex: 1, marginLeft: 15, justifyContent: 'center' },
    itemName: { fontSize: 16, fontWeight: '700', color: '#333' },
    dateText: { fontSize: 12, color: '#9E9E9E', marginVertical: 2 },
    price: { fontSize: 18, fontWeight: '900', color: '#004AAD' },

    // Actions
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    secondaryBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
    },
    secondaryBtnText: {
        marginLeft: 6,
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
    },
    primaryBtn: {
        flex: 1.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
    },
    primaryBtnText: {
        marginLeft: 8,
        fontSize: 13,
        fontWeight: 'bold',
        color: '#FFF',
    },
})

export default OrderHistoryScreen
