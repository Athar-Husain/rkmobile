import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    Platform,
    StatusBar,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment'
import { getMyPurchases } from '../redux/features/Purchases/PurchaseSlice'
import OrderDetailsModal from '../containers/Purchases/OrderDetailsModal'
import { useTheme } from '../theme/ThemeProvider'
import { COLORS } from '../constants'

const OrderHistoryScreen = () => {
    const dispatch = useDispatch()
    const insets = useSafeAreaInsets()
    const { colors, dark } = useTheme()

    const { mypurchases, isPurchaseLoading } = useSelector(
        (state) => state.purchase
    )

    const [selectedOrder, setSelectedOrder] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        dispatch(getMyPurchases())
    }, [dispatch])

    const handleViewDetails = (order) => {
        setSelectedOrder(order)
        setModalVisible(true)
    }

    const renderOrderItem = ({ item }) => {
        const isCompleted = item.status === 'COMPLETED'
        const deliveryType = item.delivery?.type

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleViewDetails(item)}
                style={[
                    styles.card,
                    { backgroundColor: dark ? COLORS.dark2 : '#FFF' },
                ]}
            >
                {/* Header: Invoice & Status */}
                <View style={styles.cardHeader}>
                    <View
                        style={[
                            styles.iconContainer,
                            {
                                backgroundColor: dark
                                    ? COLORS.dark3
                                    : '#F0F7FF',
                            },
                        ]}
                    >
                        <MaterialCommunityIcons
                            name={
                                deliveryType === 'STORE_PICKUP'
                                    ? 'store-marker'
                                    : 'truck-delivery'
                            }
                            size={20}
                            color={COLORS.primary}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.orderId, { color: colors.text }]}>
                            {item.invoiceNumber}
                        </Text>
                        <Text style={styles.date}>
                            {moment(item.createdAt).format(
                                'DD MMM YYYY • hh:mm A'
                            )}
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.statusBadge,
                            {
                                backgroundColor: isCompleted
                                    ? '#E8F5E9'
                                    : '#FFF3E0',
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.statusText,
                                { color: isCompleted ? '#2E7D32' : '#EF6C00' },
                            ]}
                        >
                            {item.status}
                        </Text>
                    </View>
                </View>

                <View
                    style={[
                        styles.divider,
                        { backgroundColor: dark ? COLORS.dark3 : '#F1F5F9' },
                    ]}
                />

                {/* Body: Item info and Price */}
                <View style={styles.cardBody}>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={[
                                styles.storeName,
                                { color: COLORS.primary },
                            ]}
                        >
                            {item.storeId?.name || 'RK Electronics'}
                        </Text>
                        <Text
                            style={[
                                styles.itemSummary,
                                { color: colors.grayscale700 },
                            ]}
                        >
                            {item.items?.length}{' '}
                            {item.items?.length > 1 ? 'Products' : 'Product'}{' '}
                            ordered
                        </Text>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[styles.price, { color: colors.text }]}>
                            {item.formattedFinalAmount}
                        </Text>
                        {item.discount > 0 && (
                            <View style={styles.savingsBadge}>
                                <Text style={styles.savingsText}>
                                    Saved {item.formattedDiscount}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Footer: Actions */}
                <View style={styles.footer}>
                    <View style={styles.paymentMethod}>
                        <MaterialCommunityIcons
                            name="cash-multiple"
                            size={14}
                            color={colors.grayscale400}
                        />
                        <Text
                            style={[
                                styles.methodText,
                                { color: colors.grayscale400 },
                            ]}
                        >
                            {' '}
                            {item.payment?.method}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.primaryBtn,
                            { backgroundColor: COLORS.primary },
                        ]}
                        onPress={() => handleViewDetails(item)}
                    >
                        <Text style={styles.primaryBtnText}>View Details</Text>
                        <MaterialCommunityIcons
                            name="chevron-right"
                            size={18}
                            color="#FFF"
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

            <View
                style={[styles.headerSection, { paddingTop: insets.top + 10 }]}
            >
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    My Purchases
                </Text>
                <Text style={[styles.subTitle, { color: colors.grayscale700 }]}>
                    {mypurchases?.length || 0} total orders found
                </Text>
            </View>

            <FlatList
                data={mypurchases}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
                refreshControl={
                    <RefreshControl
                        refreshing={isPurchaseLoading}
                        onRefresh={() => dispatch(getMyPurchases())}
                        tintColor={COLORS.primary}
                    />
                }
                ListEmptyComponent={
                    !isPurchaseLoading && (
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons
                                name="shopping-outline"
                                size={60}
                                color={colors.grayscale400}
                            />
                            <Text
                                style={[
                                    styles.emptyText,
                                    { color: colors.grayscale400 },
                                ]}
                            >
                                No orders found
                            </Text>
                        </View>
                    )
                }
            />

            <OrderDetailsModal
                visible={modalVisible}
                order={selectedOrder}
                onClose={() => setModalVisible(false)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 16 },
    headerSection: { marginBottom: 20 },
    headerTitle: { fontSize: 24, fontFamily: 'bold' },
    subTitle: { fontSize: 13, marginTop: 2 },
    card: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOpacity: 0.06,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
            },
            android: { elevation: 3 },
        }),
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center' },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    orderId: { fontSize: 14, fontFamily: 'bold' },
    date: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    statusText: { fontSize: 10, fontWeight: '800' },
    divider: { height: 1, marginVertical: 14 },
    cardBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    storeName: { fontSize: 13, fontWeight: '700', marginBottom: 2 },
    itemSummary: { fontSize: 12 },
    price: { fontSize: 18, fontFamily: 'bold' },
    savingsBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
    },
    savingsText: { fontSize: 10, color: '#2E7D32', fontWeight: '700' },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
    },
    paymentMethod: { flexDirection: 'row', alignItems: 'center' },
    methodText: { fontSize: 12, fontWeight: '600' },
    primaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        gap: 4,
    },
    primaryBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { marginTop: 10, fontSize: 14, fontFamily: 'medium' },
})

export default OrderHistoryScreen
