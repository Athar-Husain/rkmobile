import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    TextInput,
    StatusBar,
    Platform,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Feather from 'react-native-vector-icons/Feather' // Using Feather for a cleaner look
import moment from 'moment'
import { getMyRecordedPurchases } from '../../redux/features/Purchases/PurchaseSlice'
import StaffOrderDetailsModal from './StaffOrderDetailsModal.js'

const OrderCard = React.memo(({ item, onPress }) => (
    <TouchableOpacity
        style={styles.card}
        activeOpacity={0.6}
        onPress={() => onPress(item)}
    >
        <View style={styles.cardContent}>
            <View style={styles.leftColumn}>
                <Text style={styles.invoiceText}>{item.invoiceNumber}</Text>
                <Text style={styles.dateText}>
                    {moment(item.createdAt).format('MMM DD, YYYY • HH:mm')}
                </Text>
            </View>

            <View style={styles.rightColumn}>
                <Text style={styles.amountText}>
                    ₹
                    {item.finalAmount?.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                    })}
                </Text>
                <View style={styles.statusContainer}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusLabel}>Completed</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>
))

const StaffOrdersScreen = () => {
    const dispatch = useDispatch()
    const { myrecordedpurchases, isPurchaseLoading } = useSelector(
        (state) => state.purchase
    )
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [search, setSearch] = useState('')

    useEffect(() => {
        dispatch(getMyRecordedPurchases())
    }, [dispatch])

    const stats = useMemo(() => {
        const total = myrecordedpurchases?.reduce(
            (acc, curr) => acc + (curr.finalAmount || 0),
            0
        )
        return {
            count: myrecordedpurchases?.length || 0,
            amount: total?.toLocaleString('en-IN') || '0',
        }
    }, [myrecordedpurchases])

    const filteredData = useMemo(() => {
        return myrecordedpurchases?.filter((o) =>
            o.invoiceNumber.toLowerCase().includes(search.toLowerCase())
        )
    }, [search, myrecordedpurchases])

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header Section */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.screenTitle}>Activity</Text>
                    <Text style={styles.screenSubtitle}>
                        Manage and track your sales
                    </Text>
                </View>
                <TouchableOpacity style={styles.profileCircle}>
                    <Feather name="user" size={20} color="#64748B" />
                </TouchableOpacity>
            </View>

            {/* Micro Stats Bar */}
            <View style={styles.statsBar}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{stats.count}</Text>
                    <Text style={styles.statLabelHeader}>Transactions</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>₹{stats.amount}</Text>
                    <Text style={styles.statLabelHeader}>Net Volume</Text>
                </View>
            </View>

            {/* Minimal Search */}
            <View style={styles.searchWrapper}>
                <Feather name="search" size={16} color="#94A3B8" />
                <TextInput
                    placeholder="Search transactions..."
                    placeholderTextColor="#94A3B8"
                    style={styles.searchField}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <FlatList
                data={filteredData}
                renderItem={({ item }) => (
                    <OrderCard item={item} onPress={setSelectedOrder} />
                )}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isPurchaseLoading}
                        onRefresh={() => dispatch(getMyRecordedPurchases())}
                    />
                }
                ListEmptyComponent={
                    !isPurchaseLoading && (
                        <View style={styles.emptyState}>
                            <Feather name="inbox" size={40} color="#E2E8F0" />
                            <Text style={styles.emptyText}>
                                No results found
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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 20 : 10,
        marginBottom: 15,
    },
    screenTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
        letterSpacing: -0.5,
    },
    screenSubtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
    profileCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        borderWeight: 1,
        borderColor: '#F1F5F9',
    },

    // Stats Bar
    statsBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        marginBottom: 20,
        alignItems: 'center',
    },
    statItem: { flex: 1, alignItems: 'center' },
    statDivider: { width: 1, height: '60%', backgroundColor: '#E2E8F0' },
    statValue: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
    statLabelHeader: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '500',
        marginTop: 2,
        textTransform: 'uppercase',
    },

    // Search
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        paddingHorizontal: 15,
        backgroundColor: '#F1F5F9',
        borderRadius: 10,
        height: 40,
        marginBottom: 15,
    },
    searchField: { flex: 1, marginLeft: 10, fontSize: 14, color: '#1E293B' },

    // Modern Card
    listContent: { paddingHorizontal: 20, paddingBottom: 30 },
    card: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9', // Line-based separation looks more professional than cards
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    invoiceText: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
    dateText: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
    amountText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
        textAlign: 'right',
    },

    // Status
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginTop: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
        marginRight: 6,
    },
    statusLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#10B981',
        textTransform: 'uppercase',
    },

    emptyState: { alignItems: 'center', marginTop: 100 },
    emptyText: { marginTop: 10, color: '#94A3B8', fontSize: 14 },
})

export default StaffOrdersScreen
