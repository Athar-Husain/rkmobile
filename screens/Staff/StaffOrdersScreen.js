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
import Feather from 'react-native-vector-icons/Feather'
import moment from 'moment'
import { useTheme } from '../../theme/ThemeProvider' // Added theme hook
import { COLORS } from '../../constants'
import { getMyRecordedPurchases } from '../../redux/features/Purchases/PurchaseSlice'
import StaffOrderDetailsModal from './StaffOrderDetailsModal.js'

const OrderCard = React.memo(({ item, onPress, dark, colors }) => (
    <TouchableOpacity
        style={[
            styles.card,
            { borderBottomColor: dark ? '#2C2C2E' : '#F1F5F9' },
        ]}
        activeOpacity={0.6}
        onPress={() => onPress(item)}
    >
        <View style={styles.cardContent}>
            <View style={styles.leftColumn}>
                <Text style={[styles.invoiceText, { color: colors.text }]}>
                    {item.invoiceNumber}
                </Text>
                <Text
                    style={[
                        styles.dateText,
                        { color: dark ? '#8E8E93' : '#94A3B8' },
                    ]}
                >
                    {moment(item.createdAt).format('MMM DD, YYYY • HH:mm')}
                </Text>
            </View>

            <View style={styles.rightColumn}>
                <Text style={[styles.amountText, { color: colors.text }]}>
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
    const { colors, dark } = useTheme()
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
        <View
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <StatusBar
                barStyle={dark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />

            <View style={styles.header}>
                <View>
                    <Text style={[styles.screenTitle, { color: colors.text }]}>
                        Activity
                    </Text>
                    <Text
                        style={[
                            styles.screenSubtitle,
                            { color: dark ? '#8E8E93' : '#64748B' },
                        ]}
                    >
                        Manage and track your sales
                    </Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.profileCircle,
                        {
                            backgroundColor: dark ? '#1C1C1E' : '#F8FAFC',
                            borderColor: dark ? '#2C2C2E' : '#F1F5F9',
                        },
                    ]}
                >
                    <Feather
                        name="user"
                        size={20}
                        color={dark ? '#8E8E93' : '#64748B'}
                    />
                </TouchableOpacity>
            </View>

            <View
                style={[
                    styles.statsBar,
                    { backgroundColor: dark ? '#1C1C1E' : '#F8FAFC' },
                ]}
            >
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.text }]}>
                        {stats.count}
                    </Text>
                    <Text style={styles.statLabelHeader}>Transactions</Text>
                </View>
                <View
                    style={[
                        styles.statDivider,
                        { backgroundColor: dark ? '#2C2C2E' : '#E2E8F0' },
                    ]}
                />
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.text }]}>
                        ₹{stats.amount}
                    </Text>
                    <Text style={styles.statLabelHeader}>Net Volume</Text>
                </View>
            </View>

            <View
                style={[
                    styles.searchWrapper,
                    { backgroundColor: dark ? '#1C1C1E' : '#F1F5F9' },
                ]}
            >
                <Feather name="search" size={16} color="#94A3B8" />
                <TextInput
                    placeholder="Search transactions..."
                    placeholderTextColor="#94A3B8"
                    style={[styles.searchField, { color: colors.text }]}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <FlatList
                data={filteredData}
                renderItem={({ item }) => (
                    <OrderCard
                        item={item}
                        onPress={setSelectedOrder}
                        dark={dark}
                        colors={colors}
                    />
                )}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={isPurchaseLoading}
                        tintColor={COLORS.primary}
                        onRefresh={() => dispatch(getMyRecordedPurchases())}
                    />
                }
                ListEmptyComponent={
                    !isPurchaseLoading && (
                        <View style={styles.emptyState}>
                            <Feather
                                name="inbox"
                                size={40}
                                color={dark ? '#2C2C2E' : '#E2E8F0'}
                            />
                            <Text
                                style={[styles.emptyText, { color: '#94A3B8' }]}
                            >
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
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 20 : 10,
        marginBottom: 15,
    },
    screenTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.5 },
    screenSubtitle: { fontSize: 13, marginTop: 2 },
    profileCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    statsBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 12,
        marginBottom: 20,
        alignItems: 'center',
    },
    statItem: { flex: 1, alignItems: 'center' },
    statDivider: { width: 1, height: '60%' },
    statValue: { fontSize: 16, fontWeight: '700' },
    statLabelHeader: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '500',
        marginTop: 2,
        textTransform: 'uppercase',
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        paddingHorizontal: 15,
        borderRadius: 10,
        height: 40,
        marginBottom: 15,
    },
    searchField: { flex: 1, marginLeft: 10, fontSize: 14 },
    listContent: { paddingHorizontal: 20, paddingBottom: 30 },
    card: { paddingVertical: 16, borderBottomWidth: 1 },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    invoiceText: { fontSize: 15, fontWeight: '600' },
    dateText: { fontSize: 12, marginTop: 4 },
    amountText: { fontSize: 15, fontWeight: '700', textAlign: 'right' },
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
    emptyText: { marginTop: 10, fontSize: 14 },
})

export default StaffOrdersScreen
