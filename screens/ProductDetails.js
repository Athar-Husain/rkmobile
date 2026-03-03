import React, { useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Linking,
    Platform,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import {
    fetchProductById,
    CLEAR_PRODUCT_DETAILS,
} from '../redux/features/Products/ProductSlice'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { COLORS } from '../constants'

const ProductDetails = ({ route, navigation }) => {
    const { id } = route.params
    const dispatch = useDispatch()
    const { product, applicableCoupons } = useSelector((state) => state.product)

    useEffect(() => {
        dispatch(fetchProductById(id))
        return () => dispatch(CLEAR_PRODUCT_DETAILS())
    }, [id])

    const handleVisitStore = () => {
        // Navigate to the Shops Tab
        navigation.navigate('Shops')
    }

    if (!product) return null

    return (
        <View style={styles.wrapper}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{
                            uri: product.images?.[0]?.url || product.thumbnail,
                        }}
                        style={styles.mainImg}
                    />
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialCommunityIcons
                            name="arrow-left"
                            size={24}
                            color="#000"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.row}>
                        <Text style={styles.brandTag}>{product.brand}</Text>
                        <View style={styles.stockBadge}>
                            <Text style={styles.stockText}>
                                Available in Store
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.prodName}>{product.name}</Text>

                    <View style={styles.priceContainer}>
                        <Text style={styles.currPrice}>
                            ₹{product.sellingPrice?.toLocaleString()}
                        </Text>
                        {product.discountPercentage > 0 && (
                            <Text style={styles.discountBadge}>
                                {product.discountPercentage}% OFF AT STORE
                            </Text>
                        )}
                    </View>

                    <View style={styles.divider} />

                    {/* Product Description */}
                    <Text style={styles.sectionTitle}>Product Description</Text>
                    <Text style={styles.descriptionText}>
                        {product.description ||
                            'Visit our nearest store to experience this product in person. High quality and durability guaranteed.'}
                    </Text>

                    {/* Store Info Section */}
                    <View style={styles.storeCard}>
                        <MaterialCommunityIcons
                            name="storefront-outline"
                            size={24}
                            color={COLORS.primary}
                        />
                        <View style={styles.storeInfo}>
                            <Text style={styles.storeTitle}>
                                Experience it in person
                            </Text>
                            <Text style={styles.storeSub}>
                                Check availability and try this product at our
                                physical outlets.
                            </Text>
                        </View>
                    </View>

                    {/* Coupons Section */}
                    {applicableCoupons?.length > 0 && (
                        <View style={styles.couponSection}>
                            <Text style={styles.sectionTitle}>
                                In-Store Offers
                            </Text>
                            {applicableCoupons.map((c, i) => (
                                <View key={i} style={styles.couponCard}>
                                    <MaterialCommunityIcons
                                        name="ticket-percent"
                                        size={20}
                                        color="#4CAF50"
                                    />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={styles.couponCode}>
                                            {c.code}
                                        </Text>
                                        <Text style={styles.couponDesc}>
                                            {c.description}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Bar Focused on Visiting Store */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.visitBtn}
                    onPress={handleVisitStore}
                >
                    <MaterialCommunityIcons
                        name="map-marker-radius"
                        size={20}
                        color="#fff"
                        style={{ marginRight: 8 }}
                    />
                    <Text style={styles.visitBtnText}>VISIT STORE TO BUY</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: '#fff' },
    imageContainer: { position: 'relative' },
    mainImg: { width: '100%', height: 350, backgroundColor: '#f9f9f9' },
    backBtn: {
        position: 'absolute',
        top: 40,
        left: 20,
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 8,
        borderRadius: 20,
    },
    detailsContainer: { padding: 20 },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    brandTag: {
        color: COLORS.primary,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 12,
        letterSpacing: 1,
    },
    stockBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    stockText: { color: '#2E7D32', fontSize: 10, fontWeight: 'bold' },
    prodName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginTop: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    currPrice: { fontSize: 28, fontWeight: '900', color: '#000' },
    discountBadge: {
        backgroundColor: '#FFEBEE',
        color: '#D32F2F',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        marginLeft: 15,
        fontSize: 12,
        fontWeight: 'bold',
        overflow: 'hidden',
    },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
        marginBottom: 20,
    },
    storeCard: {
        flexDirection: 'row',
        backgroundColor: '#F5F7FA',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 25,
    },
    storeInfo: { marginLeft: 12, flex: 1 },
    storeTitle: { fontWeight: 'bold', color: '#1e3c72', fontSize: 14 },
    storeSub: { fontSize: 12, color: '#777', marginTop: 2 },
    couponSection: { marginTop: 10 },
    couponCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        borderStyle: 'dashed',
        marginBottom: 10,
    },
    couponCode: { fontWeight: 'bold', color: '#333', fontSize: 14 },
    couponDesc: { color: '#666', fontSize: 12 },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 35 : 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#eee',
    },
    visitBtn: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    visitBtnText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 16,
        letterSpacing: 0.5,
    },
})

export default ProductDetails
