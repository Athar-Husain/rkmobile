// screens/staff/StaffOrdersScreen.js

import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    Dimensions,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment'
import { getMyRecordedPurchases } from '../../redux/features/Purchases/PurchaseSlice'
import StaffOrderDetailsModal from './StaffOrderDetailsModal.js'

const { height } = Dimensions.get('window')

const StaffOrdersScreen = () => {
    const dispatch = useDispatch()
    const { myrecordedpurchases, isPurchaseLoading } = useSelector(
        (state) => state.purchase
    )

    const [selectedOrder, setSelectedOrder] = useState(null)

    useEffect(() => {
        dispatch(getMyRecordedPurchases())
    }, [dispatch])

    const renderOrderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => setSelectedOrder(item)}
        >
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.invoice}>
                        {item.invoiceNumber}
                    </Text>
                    <Text style={styles.date}>
                        {moment(item.createdAt).format(
                            'DD MMM YYYY • hh:mm A'
                        )}
                    </Text>
                </View>

                <Text style={styles.amount}>
                    ₹{item.finalAmount?.toLocaleString('en-IN')}
                </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.footerRow}>
                <Text style={styles.itemCount}>
                    {item.items.length} item(s)
                </Text>

                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>
                        {item.payment?.status || 'PAID'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sales History</Text>

            <FlatList
                data={myrecordedpurchases}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item._id}
                refreshControl={
                    <RefreshControl
                        refreshing={isPurchaseLoading}
                        onRefresh={() =>
                            dispatch(getMyRecordedPurchases())
                        }
                    />
                }
                ListEmptyComponent={
                    !isPurchaseLoading && (
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons
                                name="receipt"
                                size={80}
                                color="#CBD5E1"
                            />
                            <Text style={styles.emptyText}>
                                No sales recorded yet
                            </Text>
                        </View>
                    )
                }
            />

            <StaffOrderDetailsModal
                visible={!!selectedOrder}
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />
        </View>
    )
}

export default StaffOrdersScreen

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
    title: {
        fontSize: 26,
        fontWeight: '800',
        marginBottom: 20,
        marginTop: 50,
    },
    card: {
        backgroundColor: '#FFF',
        padding: 18,
        borderRadius: 18,
        marginBottom: 16,
        elevation: 2,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    invoice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    date: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 4,
    },
    amount: {
        fontSize: 18,
        fontWeight: '800',
        color: '#004AAD',
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 14,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemCount: { fontSize: 13, color: '#64748B' },
    statusBadge: {
        backgroundColor: '#E0F2FE',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#0284C7',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 120,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#94A3B8',
    },
})