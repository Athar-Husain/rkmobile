import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TextInput,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Modal,
    useColorScheme,
    ActivityIndicator,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import {
    clearPOSSummary,
    previewPurchase,
    recordPurchase,
} from '../../redux/features/Purchases/PurchaseSlice'
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window')
const scale = (size) => (width / 375) * size

const StaffPOSScreen = ({ route, navigation }) => {
    const dispatch = useDispatch()
    const systemTheme = useColorScheme()
    const isDark = systemTheme === 'dark'

    // Refs for better UX
    const nameInputRef = useRef(null)

    // Selectors
    const { staffPOSSummary, isPurchaseLoading } = useSelector(
        (state) => state.purchase
    )

    // Local State
    const [cartItems, setCartItems] = useState([])
    const [form, setForm] = useState({ name: '', price: '', qty: '1' })
    const [showReceipt, setShowReceipt] = useState(false)

    const couponCode = route.params?.couponData?.userCoupon?.uniqueCode || null
    const userId = route.params?.couponData?.user?.id || null
    const storeId = route.params?.storeId || 'STORE_DEFAULT'

    // Theme Object
    const theme = useMemo(
        () => ({
            background: isDark ? '#121212' : '#FFFFFF',
            surface: isDark ? '#1E1E1E' : '#F9F9F9',
            text: isDark ? '#FFFFFF' : '#000000',
            subtext: isDark ? '#AAAAAA' : '#666666',
            border: isDark ? '#333333' : '#E0E0E0',
            primary: '#004AAD',
        }),
        [isDark]
    )

    // Handlers
    const updateFormField = (key, value) =>
        setForm((prev) => ({ ...prev, [key]: value }))

    const addItem = useCallback(() => {
        const { name, price, qty } = form
        if (!name.trim() || !price) {
            Alert.alert('Missing Fields', 'Please enter item name and price')
            return
        }

        const newItem = {
            name: name.trim(),
            unitPrice: parseFloat(price),
            quantity: parseInt(qty) || 1,
        }

        setCartItems((prev) => [...prev, newItem])
        setForm({ name: '', price: '', qty: '1' })
        nameInputRef.current?.focus()
    }, [form])

    const removeItem = useCallback(
        (index) => {
            setCartItems((prev) => {
                const newCart = prev.filter((_, i) => i !== index)
                if (newCart.length === 0) dispatch(clearPOSSummary())
                return newCart
            })
        },
        [dispatch]
    )

    const adjustQuantity = useCallback((index, delta) => {
        setCartItems((prev) =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        )
    }, [])

    // Debounced Preview
    useEffect(() => {
        if (cartItems.length === 0) return

        const timer = setTimeout(() => {
            dispatch(
                previewPurchase({
                    userId,
                    storeId,
                    items: cartItems,
                    couponCode,
                })
            )
        }, 400)

        return () => clearTimeout(timer)
    }, [cartItems, couponCode, userId, storeId, dispatch])

    const handleCompletePurchase = async () => {
        if (!cartItems.length) return Alert.alert('Error', 'Cart is empty')

        Alert.alert(
            'Confirm Purchase',
            `Complete transaction for ₹${staffPOSSummary?.finalAmount || 0}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        const res = await dispatch(
                            recordPurchase({
                                userId,
                                storeId,
                                items: cartItems,
                                couponCode,
                            })
                        )
                        if (res.meta.requestStatus === 'fulfilled')
                            setShowReceipt(true)
                    },
                },
            ]
        )
    }

    const resetSession = () => {
        setCartItems([])
        dispatch(clearPOSSummary())
        setShowReceipt(false)
    }

    // UI Components
    const renderCartItem = useCallback(
        ({ item, index }) => (
            <View
                style={[
                    styles.cartRow,
                    {
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                    },
                ]}
            >
                <View style={{ flex: 1 }}>
                    <Text style={[styles.cartItemName, { color: theme.text }]}>
                        {item.name}
                    </Text>
                    <Text style={{ color: theme.subtext }}>
                        ₹{item.unitPrice} per unit
                    </Text>
                </View>
                <View style={styles.qtyContainer}>
                    <TouchableOpacity
                        onPress={() => adjustQuantity(index, -1)}
                        style={styles.qtyBtn}
                    >
                        <Text style={[styles.qtyText, { color: theme.text }]}>
                            −
                        </Text>
                    </TouchableOpacity>
                    <Text style={[styles.qtyValue, { color: theme.text }]}>
                        {item.quantity}
                    </Text>
                    <TouchableOpacity
                        onPress={() => adjustQuantity(index, 1)}
                        style={styles.qtyBtn}
                    >
                        <Text style={[styles.qtyText, { color: theme.text }]}>
                            +
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => removeItem(index)}
                        style={styles.deleteBtn}
                    >
                        <Text style={styles.deleteText}>Remove</Text>
                    </TouchableOpacity>
                </View>
            </View>
        ),
        [theme, adjustQuantity, removeItem]
    )

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <FlatList
                    data={cartItems}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderCartItem}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={{ color: theme.subtext }}>
                                No items in cart
                            </Text>
                        </View>
                    }
                    ListHeaderComponent={
                        <View style={styles.container}>
                            <Text
                                style={[styles.header, { color: theme.text }]}
                            >
                                POS Billing
                            </Text>

                            <View style={styles.inputGroup}>
                                <TextInput
                                    ref={nameInputRef}
                                    placeholder="Item Name"
                                    value={form.name}
                                    onChangeText={(v) =>
                                        updateFormField('name', v)
                                    }
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: theme.surface,
                                            color: theme.text,
                                            borderColor: theme.border,
                                        },
                                    ]}
                                    placeholderTextColor={theme.subtext}
                                />
                                <View style={styles.row}>
                                    <TextInput
                                        placeholder="Price"
                                        keyboardType="numeric"
                                        value={form.price}
                                        onChangeText={(v) =>
                                            updateFormField('price', v)
                                        }
                                        style={[
                                            styles.input,
                                            {
                                                flex: 2,
                                                backgroundColor: theme.surface,
                                                color: theme.text,
                                                borderColor: theme.border,
                                            },
                                        ]}
                                        placeholderTextColor={theme.subtext}
                                    />
                                    <TextInput
                                        placeholder="Qty"
                                        keyboardType="numeric"
                                        value={form.qty}
                                        onChangeText={(v) =>
                                            updateFormField('qty', v)
                                        }
                                        style={[
                                            styles.input,
                                            {
                                                flex: 1,
                                                backgroundColor: theme.surface,
                                                color: theme.text,
                                                borderColor: theme.border,
                                            },
                                        ]}
                                        placeholderTextColor={theme.subtext}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={styles.addBtn}
                                    onPress={addItem}
                                >
                                    <Text style={styles.btnText}>
                                        Add to Cart
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {staffPOSSummary && cartItems.length > 0 && (
                                <View
                                    style={[
                                        styles.summary,
                                        { backgroundColor: theme.surface },
                                    ]}
                                >
                                    <View style={styles.summaryRow}>
                                        <Text style={{ color: theme.subtext }}>
                                            Subtotal
                                        </Text>
                                        <Text style={{ color: theme.text }}>
                                            ₹{staffPOSSummary.subtotal}
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.summaryRow,
                                            styles.totalRow,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.finalAmount,
                                                { color: theme.text },
                                            ]}
                                        >
                                            Total Amount
                                        </Text>
                                        <Text
                                            style={[
                                                styles.finalAmount,
                                                { color: theme.primary },
                                            ]}
                                        >
                                            ₹{staffPOSSummary.finalAmount}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    }
                />

                {/* Sticky Bottom Actions */}
                <View
                    style={[
                        styles.footer,
                        {
                            backgroundColor: theme.background,
                            borderTopColor: theme.border,
                        },
                    ]}
                >
                    <TouchableOpacity
                        style={[
                            styles.completeBtn,
                            (!staffPOSSummary || isPurchaseLoading) &&
                                styles.disabled,
                        ]}
                        onPress={handleCompletePurchase}
                        disabled={!staffPOSSummary || isPurchaseLoading}
                    >
                        {isPurchaseLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.btnText}>
                                Complete Purchase
                            </Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={resetSession}
                    >
                        <Text style={styles.btnText}>Clear</Text>
                    </TouchableOpacity>
                </View>

                {/* Receipt Modal (Briefly styled) */}
                <Modal visible={showReceipt} transparent animationType="fade">
                    <View style={styles.modalBackground}>
                        <View
                            style={[
                                styles.modalContainer,
                                { backgroundColor: theme.surface },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.modalHeader,
                                    { color: theme.text },
                                ]}
                            >
                                Success!
                            </Text>
                            <Text
                                style={{
                                    color: theme.subtext,
                                    textAlign: 'center',
                                    marginBottom: 20,
                                }}
                            >
                                Purchase recorded successfully.
                            </Text>
                            <TouchableOpacity
                                style={styles.addBtn}
                                onPress={resetSession}
                            >
                                <Text style={styles.btnText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default StaffPOSScreen

const styles = StyleSheet.create({
    container: { padding: scale(20) },
    header: { fontSize: scale(22), fontWeight: '800', marginBottom: scale(20) },
    inputGroup: { gap: scale(10) },
    row: { flexDirection: 'row', gap: scale(10) },
    input: {
        borderWidth: 1,
        padding: scale(12),
        borderRadius: scale(10),
        fontSize: scale(15),
    },
    addBtn: {
        backgroundColor: '#004AAD',
        padding: scale(14),
        borderRadius: scale(10),
        alignItems: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: scale(20),
        flexDirection: 'row',
        gap: scale(10),
        borderTopWidth: 1,
    },
    completeBtn: {
        flex: 2,
        backgroundColor: '#28a745',
        padding: scale(15),
        borderRadius: scale(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: '#dc3545',
        padding: scale(15),
        borderRadius: scale(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabled: { opacity: 0.5 },
    btnText: { color: '#fff', fontSize: scale(15), fontWeight: 'bold' },
    cartRow: {
        marginHorizontal: scale(20),
        marginVertical: scale(4),
        padding: scale(12),
        borderRadius: scale(10),
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartItemName: { fontSize: scale(15), fontWeight: '600' },
    qtyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
    },
    qtyBtn: {
        width: scale(28),
        height: scale(28),
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyValue: {
        fontSize: scale(14),
        fontWeight: 'bold',
        minWidth: scale(20),
        textAlign: 'center',
    },
    deleteBtn: { marginLeft: scale(10) },
    deleteText: { color: '#dc3545', fontSize: scale(12), fontWeight: '600' },
    summary: {
        marginTop: scale(20),
        padding: scale(15),
        borderRadius: scale(12),
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 10,
        marginTop: 5,
    },
    finalAmount: { fontSize: scale(18), fontWeight: 'bold' },
    emptyContainer: { alignItems: 'center', marginTop: scale(40) },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        padding: scale(25),
        borderRadius: scale(20),
    },
    modalHeader: {
        fontSize: scale(20),
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
})
