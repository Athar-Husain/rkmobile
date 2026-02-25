import React, { useState, useEffect, useCallback } from 'react'
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
    Appearance,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import {
    clearPOSSummary,
    previewPurchase,
    recordPurchase,
    resetPreview,
} from '../../redux/features/Purchases/PurchaseSlice'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width } = Dimensions.get('window')
const scale = (size) => (width / 375) * size

const StaffPOSScreen = ({ route, navigation }) => {
    const dispatch = useDispatch()
    const colorScheme = Appearance.getColorScheme()
    const isDark = colorScheme === 'dark'

    const { staffPOSSummary, isPurchaseLoading } = useSelector(
        (state) => state.purchase
    )

    const [cartItems, setCartItems] = useState([])
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [qty, setQty] = useState('1')
    const [tax, setTax] = useState('0')
    const [showReceipt, setShowReceipt] = useState(false)

    const couponCode = route.params?.couponData?.userCoupon?.uniqueCode || null
    const userId = route.params?.couponData?.user?.id || null
    const storeId = route.params?.storeId || 'STORE_DEFAULT'

    // Add Item
    const addItem = () => {
        if (!name.trim() || !price) {
            Alert.alert('Error', 'Please enter item name and price')
            return
        }
        if (Number(price) <= 0 || Number(qty) <= 0) {
            Alert.alert('Error', 'Price and quantity must be greater than 0')
            return
        }

        const newItem = {
            name: name.trim(),
            unitPrice: parseFloat(price),
            quantity: parseInt(qty),
            taxPercent: parseFloat(tax) || 0,
        }

        setCartItems((prev) => [...prev, newItem])
        setName('')
        setPrice('')
        setQty('1')
        setTax('0')
    }

    // Update Preview
    useEffect(() => {
        if (!cartItems.length || !userId || !storeId) return

        const timer = setTimeout(() => {
            dispatch(
                previewPurchase({
                    userId,
                    storeId,
                    items: cartItems,
                    couponCode,
                })
            )
        }, 300)

        return () => clearTimeout(timer)
    }, [cartItems, couponCode, userId, storeId, dispatch])

    // Remove Item
    const removeItem = (index) => {
        setCartItems((prev) => prev.filter((_, i) => i !== index))
    }

    // Adjust Quantity
    const adjustQuantity = (index, delta) => {
        setCartItems((prev) => {
            const updated = [...prev]
            updated[index].quantity = Math.max(
                1,
                updated[index].quantity + delta
            )
            return updated
        })
    }

    // Complete Purchase
    const completePurchase = async () => {
        if (cartItems.length === 0) {
            Alert.alert('Error', 'Cart is empty')
            return
        }

        try {
            const res = await dispatch(
                recordPurchase({
                    userId,
                    storeId,
                    items: cartItems,
                    couponCode,
                })
            )

            if (res.meta.requestStatus === 'fulfilled') {
                setShowReceipt(true)
            } else {
                Alert.alert('Error', res.payload?.message || 'Purchase failed')
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong')
        }
    }

    // Cancel Purchase
    const cancelPurchase = () => {
        setCartItems([])
        dispatch(clearPOSSummary())
        setShowReceipt(false)
    }

    const renderItem = useCallback(
        ({ item, index }) => (
            <View
                style={[
                    styles.cartRow,
                    { backgroundColor: isDark ? '#222' : '#f9f9f9' },
                ]}
            >
                <View style={{ flex: 1 }}>
                    <Text
                        style={[
                            styles.cartItem,
                            { color: isDark ? '#fff' : '#000' },
                        ]}
                    >
                        {item.name} - ₹{item.unitPrice}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            gap: scale(8),
                            marginTop: 4,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => adjustQuantity(index, -1)}
                            style={styles.qtyBtn}
                        >
                            <Text style={styles.qtyText}>-</Text>
                        </TouchableOpacity>
                        <Text
                            style={{
                                color: isDark ? '#fff' : '#000',
                                minWidth: scale(20),
                            }}
                        >
                            {item.quantity}
                        </Text>
                        <TouchableOpacity
                            onPress={() => adjustQuantity(index, 1)}
                            style={styles.qtyBtn}
                        >
                            <Text style={styles.qtyText}>+</Text>
                        </TouchableOpacity>
                        {item.taxPercent > 0 && (
                            <Text style={styles.subText}>
                                Tax: {item.taxPercent}%
                            </Text>
                        )}
                    </View>
                </View>
                <TouchableOpacity onPress={() => removeItem(index)}>
                    <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
            </View>
        ),
        [isDark]
    )

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: isDark ? '#000' : '#fff' }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <FlatList
                    data={cartItems}
                    keyExtractor={(item, index) => item.name + index.toString()}
                    renderItem={renderItem}
                    ListHeaderComponent={
                        <View style={styles.container}>
                            <Text
                                style={[
                                    styles.header,
                                    { color: isDark ? '#fff' : '#000' },
                                ]}
                            >
                                POS Billing
                            </Text>

                            {/* Inputs */}
                            <View style={styles.row}>
                                <TextInput
                                    placeholder="Item Name"
                                    value={name}
                                    onChangeText={setName}
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: isDark
                                                ? '#333'
                                                : '#fff',
                                            color: isDark ? '#fff' : '#000',
                                        },
                                    ]}
                                    placeholderTextColor={
                                        isDark ? '#aaa' : '#999'
                                    }
                                />
                                <TextInput
                                    placeholder="Price"
                                    keyboardType="numeric"
                                    value={price}
                                    onChangeText={setPrice}
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: isDark
                                                ? '#333'
                                                : '#fff',
                                            color: isDark ? '#fff' : '#000',
                                        },
                                    ]}
                                    placeholderTextColor={
                                        isDark ? '#aaa' : '#999'
                                    }
                                />
                            </View>

                            <View style={styles.row}>
                                <TextInput
                                    placeholder="Quantity"
                                    keyboardType="numeric"
                                    value={qty}
                                    onChangeText={setQty}
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: isDark
                                                ? '#333'
                                                : '#fff',
                                            color: isDark ? '#fff' : '#000',
                                        },
                                    ]}
                                    placeholderTextColor={
                                        isDark ? '#aaa' : '#999'
                                    }
                                />
                                <TextInput
                                    placeholder="Tax %"
                                    keyboardType="numeric"
                                    value={tax}
                                    onChangeText={setTax}
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: isDark
                                                ? '#333'
                                                : '#fff',
                                            color: isDark ? '#fff' : '#000',
                                        },
                                    ]}
                                    placeholderTextColor={
                                        isDark ? '#aaa' : '#999'
                                    }
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.addBtn}
                                onPress={addItem}
                            >
                                <Text style={styles.btnText}>Add Item</Text>
                            </TouchableOpacity>

                            {/* Summary */}
                            {staffPOSSummary && (
                                <View
                                    style={[
                                        styles.summary,
                                        {
                                            backgroundColor: isDark
                                                ? '#111'
                                                : '#f5f7fa',
                                        },
                                    ]}
                                >
                                    <Text
                                        style={{
                                            color: isDark ? '#fff' : '#000',
                                        }}
                                    >
                                        Subtotal: ₹{staffPOSSummary.subtotal}
                                    </Text>
                                    <Text
                                        style={{
                                            color: isDark ? '#fff' : '#000',
                                        }}
                                    >
                                        Tax: ₹{staffPOSSummary.tax}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.finalAmount,
                                            { color: isDark ? '#fff' : '#000' },
                                        ]}
                                    >
                                        Final: ₹{staffPOSSummary.finalAmount}
                                    </Text>
                                </View>
                            )}

                            {/* Complete / Cancel */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    gap: scale(10),
                                    marginTop: scale(20),
                                }}
                            >
                                <TouchableOpacity
                                    style={[
                                        styles.completeBtn,
                                        (!staffPOSSummary ||
                                            isPurchaseLoading) && {
                                            opacity: 0.6,
                                        },
                                        { flex: 1 },
                                    ]}
                                    onPress={completePurchase}
                                    disabled={
                                        !staffPOSSummary || isPurchaseLoading
                                    }
                                >
                                    <Text style={styles.btnText}>
                                        {isPurchaseLoading
                                            ? 'Processing...'
                                            : 'Complete Purchase'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.cancelBtn, { flex: 1 }]}
                                    onPress={cancelPurchase}
                                >
                                    <Text style={styles.btnText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                    ListFooterComponent={<View style={{ height: scale(20) }} />}
                />

                {/* Receipt Modal */}
                <Modal
                    visible={showReceipt}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalBackground}>
                        <View
                            style={[
                                styles.modalContainer,
                                { backgroundColor: isDark ? '#222' : '#fff' },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.modalHeader,
                                    { color: isDark ? '#fff' : '#000' },
                                ]}
                            >
                                Receipt Preview
                            </Text>
                            {cartItems.map((item, i) => (
                                <Text
                                    key={i}
                                    style={{
                                        color: isDark ? '#fff' : '#000',
                                        marginBottom: 4,
                                    }}
                                >
                                    {item.name} x {item.quantity} = ₹
                                    {item.unitPrice * item.quantity}
                                </Text>
                            ))}
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    marginTop: 10,
                                    color: isDark ? '#fff' : '#000',
                                }}
                            >
                                Total: ₹{staffPOSSummary?.finalAmount || 0}
                            </Text>
                            <TouchableOpacity
                                style={[styles.completeBtn, { marginTop: 10 }]}
                                onPress={() => setShowReceipt(false)}
                            >
                                <Text style={styles.btnText}>Close</Text>
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
    container: {
        flex: 1,
        padding: scale(20),
    },
    header: {
        fontSize: scale(24),
        fontWeight: 'bold',
        marginBottom: scale(10),
    },
    row: {
        flexDirection: 'row',
        gap: scale(8),
        marginBottom: scale(10),
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: scale(10),
        borderRadius: scale(8),
        fontSize: scale(14),
    },
    addBtn: {
        backgroundColor: '#004AAD',
        padding: scale(12),
        borderRadius: scale(10),
        alignItems: 'center',
        marginBottom: scale(10),
    },
    cancelBtn: {
        backgroundColor: 'red',
        padding: scale(12),
        borderRadius: scale(10),
        alignItems: 'center',
    },
    completeBtn: {
        backgroundColor: 'green',
        padding: scale(12),
        borderRadius: scale(10),
        alignItems: 'center',
    },
    btnText: {
        color: '#fff',
        fontSize: scale(16),
        fontWeight: '600',
    },
    cartRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scale(8),
        padding: scale(8),
        borderRadius: scale(8),
    },
    cartItem: {
        fontSize: scale(14),
        fontWeight: '500',
    },
    subText: {
        fontSize: scale(12),
        color: '#555',
        marginLeft: scale(8),
    },
    removeText: {
        color: 'red',
        fontSize: scale(13),
    },
    qtyBtn: {
        borderWidth: 1,
        borderColor: '#888',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    qtyText: {
        fontSize: scale(14),
        fontWeight: '600',
    },
    summary: {
        marginTop: scale(20),
        padding: scale(16),
        borderRadius: scale(12),
        elevation: 2,
    },
    finalAmount: {
        fontWeight: 'bold',
        fontSize: scale(18),
        marginTop: scale(8),
    },
    modalBackground: {
        flex: 1,
        backgroundColor: '#00000099',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width * 0.8,
        padding: scale(20),
        borderRadius: scale(12),
    },
    modalHeader: {
        fontSize: scale(20),
        fontWeight: 'bold',
        marginBottom: scale(10),
    },
})
