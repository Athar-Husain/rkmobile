import React, { useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Share,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import {
    fetchProductById,
    CLEAR_PRODUCT_DETAILS,
} from '../redux/features/Products/ProductSlice'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const ProductDetails = ({ route }) => {
    const { id } = route.params
    const dispatch = useDispatch()
    const { product, similarProducts, applicableCoupons } = useSelector(
        (state) => state.product
    )

    useEffect(() => {
        dispatch(fetchProductById(id))
        return () => dispatch(CLEAR_PRODUCT_DETAILS())
    }, [id])

    if (!product) return null

    return (
        <View style={styles.wrapper}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                    source={{
                        uri: product.images?.[0]?.url || product.thumbnail,
                    }}
                    style={styles.mainImg}
                />

                <View style={styles.detailsContainer}>
                    <Text style={styles.brandTag}>{product.brand}</Text>
                    <Text style={styles.prodName}>{product.name}</Text>

                    <View style={styles.priceContainer}>
                        <Text style={styles.currPrice}>
                            ₹{product.sellingPrice?.toLocaleString()}
                        </Text>
                        <Text style={styles.discountBadge}>
                            {product.discountPercentage}% OFF
                        </Text>
                    </View>

                    {/* Coupons Section */}
                    {applicableCoupons.length > 0 && (
                        <View style={styles.couponSection}>
                            <Text style={styles.sectionTitle}>
                                Available Offers
                            </Text>
                            {applicableCoupons.map((c, i) => (
                                <View key={i} style={styles.couponCard}>
                                    <MaterialCommunityIcons
                                        name="tag"
                                        size={16}
                                        color="#4CAF50"
                                    />
                                    <Text style={styles.couponText}>
                                        {c.code} - {c.description}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.cartBtn}>
                    <Text style={styles.cartBtnText}>ADD TO CART</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buyBtn}>
                    <Text style={styles.buyBtnText}>BUY NOW</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: '#fff' },
    mainImg: { width: '100%', height: 400, resizeMode: 'contain' },
    detailsContainer: { padding: 20 },
    brandTag: {
        color: '#1e3c72',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 12,
    },
    prodName: { fontSize: 22, fontWeight: '600', color: '#333', marginTop: 5 },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    currPrice: { fontSize: 26, fontWeight: '900', color: '#000' },
    discountBadge: {
        backgroundColor: '#e41e31',
        color: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 5,
        marginLeft: 15,
        fontWeight: 'bold',
    },
    bottomBar: {
        flexDirection: 'row',
        padding: 15,
        borderTopWidth: 1,
        borderColor: '#eee',
    },
    cartBtn: {
        flex: 1,
        padding: 15,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#1e3c72',
        marginRight: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    cartBtnText: { color: '#1e3c72', fontWeight: 'bold' },
    buyBtn: {
        flex: 1,
        padding: 15,
        backgroundColor: '#1e3c72',
        borderRadius: 8,
        alignItems: 'center',
    },
    buyBtnText: { color: '#fff', fontWeight: 'bold' },
})

export default ProductDetails
