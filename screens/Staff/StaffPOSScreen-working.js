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
    ScrollView,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import {
    previewPurchase,
    recordPurchase,
} from '../../redux/features/Purchases/PurchaseSlice'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width, height } = Dimensions.get('window')
const scale = (size) => (width / 375) * size

const StaffPOSScreen = ({ route, navigation }) => {
    const dispatch = useDispatch()

    const { staffPOSSummary, isPurchaseLoading } = useSelector(
        (state) => state.purchase
    )

    const [cartItems, setCartItems] = useState([])
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [qty, setQty] = useState('1')
    const [tax, setTax] = useState('0')
    const [discount, setDiscount] = useState('0')

    const couponCode = route.params?.couponData?.userCoupon?.uniqueCode || null
    const userId = route.params?.couponData?.user?.id || null
    const storeId = 'YOUR_STORE_ID' // Replace with real store id

    // Add / Update Item
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
            tax: parseFloat(tax) || 0,
            discount: parseFloat(discount) || 0,
        }

        setCartItems((prev) => {
            const existingIndex = prev.findIndex(
                (i) => i.name.toLowerCase() === newItem.name.toLowerCase()
            )

            if (existingIndex >= 0) {
                const updated = [...prev]
                updated[existingIndex].quantity += newItem.quantity
                updated[existingIndex].tax = newItem.tax
                updated[existingIndex].discount = newItem.discount
                return updated
            }

            return [...prev, newItem]
        })

        setName('')
        setPrice('')
        setQty('1')
        setTax('0')
        setDiscount('0')
    }

    // Debounced Preview
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
        }, 400)

        return () => clearTimeout(timer)
    }, [cartItems, couponCode, userId, storeId, dispatch])

    // Remove Item
    const removeItem = (index) => {
        setCartItems((prev) => prev.filter((_, i) => i !== index))
    }

    // Complete Purchase
    const completePurchase = async () => {
        if (cartItems.length === 0) {
            Alert.alert('Error', 'Cart is empty')
            return
        }
        if (!userId || !storeId) {
            Alert.alert('Error', 'Missing user or store information')
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
                navigation.replace('PurchaseSuccess', {
                    purchase: res.payload.purchase,
                })
            } else {
                Alert.alert('Error', res.payload?.message || 'Purchase failed')
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong')
        }
    }

    const renderItem = useCallback(
        ({ item, index }) => (
            <View style={styles.cartRow}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.cartItem}>
                        {item.name} - ₹{item.unitPrice} x {item.quantity}
                    </Text>
                    {item.tax > 0 && (
                        <Text style={styles.subText}>Tax: ₹{item.tax}</Text>
                    )}
                    {item.discount > 0 && (
                        <Text style={styles.subText}>
                            Discount: ₹{item.discount}
                        </Text>
                    )}
                </View>
                <TouchableOpacity onPress={() => removeItem(index)}>
                    <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
            </View>
        ),
        []
    )

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingBottom: scale(100),
                    }} // Avoid bottom nav overlap
                >
                    <View style={styles.container}>
                        <Text style={styles.header}>POS Billing</Text>

                        <Text style={styles.cartCount}>
                            Items in Cart: {cartItems.length}
                        </Text>

                        <View style={styles.row}>
                            <TextInput
                                placeholder="Item Name"
                                value={name}
                                onChangeText={setName}
                                style={styles.input}
                            />
                            <TextInput
                                placeholder="Price"
                                keyboardType="numeric"
                                value={price}
                                onChangeText={setPrice}
                                style={styles.input}
                            />
                        </View>

                        <View style={styles.row}>
                            <TextInput
                                placeholder="Qty"
                                keyboardType="numeric"
                                value={qty}
                                onChangeText={setQty}
                                style={styles.input}
                            />
                            <TextInput
                                placeholder="Tax"
                                keyboardType="numeric"
                                value={tax}
                                onChangeText={setTax}
                                style={styles.input}
                            />
                            <TextInput
                                placeholder="Discount"
                                keyboardType="numeric"
                                value={discount}
                                onChangeText={setDiscount}
                                style={styles.input}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.addBtn}
                            onPress={addItem}
                        >
                            <Text style={styles.btnText}>Add Item</Text>
                        </TouchableOpacity>

                        <FlatList
                            data={cartItems}
                            keyExtractor={(item, index) =>
                                item.name + index.toString()
                            }
                            renderItem={renderItem}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />

                        {staffPOSSummary && (
                            <View style={styles.summary}>
                                <Text>
                                    Subtotal: ₹{staffPOSSummary.subtotal}
                                </Text>
                                <Text>
                                    Discount: ₹{staffPOSSummary.discount}
                                </Text>
                                <Text>Tax: ₹{staffPOSSummary.tax}</Text>
                                <Text style={styles.finalAmount}>
                                    Final: ₹{staffPOSSummary.finalAmount}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.completeBtn,
                                (!staffPOSSummary || isPurchaseLoading) && {
                                    opacity: 0.6,
                                },
                            ]}
                            onPress={completePurchase}
                            disabled={!staffPOSSummary || isPurchaseLoading}
                        >
                            <Text style={styles.btnText}>
                                {isPurchaseLoading
                                    ? 'Processing...'
                                    : 'Complete Purchase'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default StaffPOSScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: scale(20),
        backgroundColor: '#fff',
    },
    header: {
        fontSize: scale(24),
        fontWeight: 'bold',
        marginBottom: scale(10),
    },
    cartCount: {
        marginBottom: scale(10),
        fontSize: scale(14),
        color: '#444',
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
        marginVertical: scale(10),
        alignItems: 'center',
    },
    cartRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scale(8),
        backgroundColor: '#f9f9f9',
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
    },
    removeText: {
        color: 'red',
        fontSize: scale(13),
    },
    summary: {
        marginTop: scale(20),
        padding: scale(16),
        backgroundColor: '#f5f7fa',
        borderRadius: scale(12),
        elevation: 2,
    },
    finalAmount: {
        fontWeight: 'bold',
        fontSize: scale(18),
        marginTop: scale(8),
    },
    completeBtn: {
        backgroundColor: 'green',
        padding: scale(18),
        borderRadius: scale(12),
        marginTop: scale(20),
        alignItems: 'center',
    },
    btnText: {
        color: '#fff',
        fontSize: scale(16),
        fontWeight: '600',
    },
})
