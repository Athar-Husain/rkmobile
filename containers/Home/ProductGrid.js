import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    Dimensions,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const { width } = Dimensions.get('window')
const COLUMN_WIDTH = (width - 40) / 2

const ProductGrid = ({ products, onProductPress }) => {
    const renderItem = ({ item }) => {
        // --- DATA MAPPING & MATH CORRECTION ---
        // Using sellingPrice from your logs
        const price = item.sellingPrice || 0
        const discount = item.discountPercentage || 0

        // Reverse calculate MRP: MRP = Price / (1 - Discount/100)
        const calculatedMRP =
            discount > 0 ? Math.round(price / (1 - discount / 100)) : price

        // Actual Savings = MRP - Price
        const actualSavings = calculatedMRP - price

        // --- IMAGE EXTRACTION ---
        // Extracting from your logs: images: [[Object]]
        const rawImage = item.images?.[0]
        const imageUri =
            typeof rawImage === 'string'
                ? rawImage
                : rawImage?.imageUrl || rawImage?.url

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => onProductPress?.(item)}
            >
                {/* Status Badges */}
                <View style={styles.badgeContainer}>
                    {item.isNewArrival && (
                        <View
                            style={[
                                styles.statusBadge,
                                { backgroundColor: '#4CAF50' },
                            ]}
                        >
                            <Text style={styles.badgeText}>NEW</Text>
                        </View>
                    )}
                    {item.isBestSeller && (
                        <View
                            style={[
                                styles.statusBadge,
                                { backgroundColor: '#FF9800' },
                            ]}
                        >
                            <Text style={styles.badgeText}>BEST</Text>
                        </View>
                    )}
                </View>

                {/* Wishlist Button */}
                <TouchableOpacity style={styles.wishlist} activeOpacity={0.7}>
                    <MaterialCommunityIcons
                        name="heart-outline"
                        size={18}
                        color="#999"
                    />
                </TouchableOpacity>

                {/* Product Image */}
                <View style={styles.imageContainer}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.img} />
                    ) : (
                        <View style={styles.placeholder}>
                            <MaterialCommunityIcons
                                name="cellphone-off"
                                size={40}
                                color="#eee"
                            />
                            <Text style={styles.noImgText}>No Preview</Text>
                        </View>
                    )}
                </View>

                {/* Product Info */}
                <View style={styles.info}>
                    <Text style={styles.brand} numberOfLines={1}>
                        {item.brand}
                    </Text>
                    <Text style={styles.name} numberOfLines={1}>
                        {item.name}
                    </Text>

                    <View style={styles.priceRow}>
                        <Text style={styles.price}>
                            ₹{price.toLocaleString()}
                        </Text>
                        {discount > 0 && (
                            <Text style={styles.oldPrice}>
                                ₹{calculatedMRP.toLocaleString()}
                            </Text>
                        )}
                    </View>

                    {/* Corrected Math Display */}
                    {discount > 0 && (
                        <Text style={styles.savingsText}>
                            Save ₹{actualSavings.toLocaleString()} ({discount}%)
                        </Text>
                    )}
                </View>

                {/* Add to Cart Button */}
                <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
                    <MaterialCommunityIcons
                        name="plus"
                        size={20}
                        color="#fff"
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.heading}>Trending in Store</Text>
                    <View style={styles.titleUnderline} />
                </View>
                <TouchableOpacity style={styles.seeAllBtn}>
                    <Text style={styles.seeAll}>View All</Text>
                    <MaterialCommunityIcons
                        name="chevron-right"
                        size={16}
                        color="#1e3c72"
                    />
                </TouchableOpacity>
            </View>

            <FlatList
                data={products || []}
                numColumns={2}
                keyExtractor={(item) => item._id || item.id}
                renderItem={renderItem}
                scrollEnabled={false}
                columnWrapperStyle={styles.row}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { paddingHorizontal: 15, paddingBottom: 20, marginTop: 10 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 5,
    },
    heading: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1a1a1a',
        letterSpacing: -0.5,
    },
    titleUnderline: {
        width: 40,
        height: 3,
        backgroundColor: '#1e3c72',
        marginTop: 4,
        borderRadius: 2,
    },
    seeAllBtn: { flexDirection: 'row', alignItems: 'center' },
    seeAll: { fontSize: 14, color: '#1e3c72', fontWeight: '700' },
    row: { justifyContent: 'space-between' },
    card: {
        width: COLUMN_WIDTH,
        backgroundColor: '#fff',
        marginBottom: 16,
        borderRadius: 24,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        borderWidth: 1,
        borderColor: '#f5f5f5',
        overflow: 'hidden',
    },
    badgeContainer: {
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 2,
        gap: 4,
    },
    statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    badgeText: { color: '#fff', fontSize: 9, fontWeight: '900' },
    wishlist: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 2,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 5,
        elevation: 2,
    },
    imageContainer: {
        backgroundColor: '#fcfcfc',
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: { width: '80%', height: '80%', resizeMode: 'contain' },
    placeholder: { alignItems: 'center' },
    noImgText: { fontSize: 10, color: '#ccc', marginTop: 4, fontWeight: '600' },
    info: { padding: 12, paddingBottom: 15 },
    brand: {
        fontSize: 11,
        color: '#1e3c72',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 2,
    },
    name: { fontSize: 15, color: '#333', fontWeight: '600', marginBottom: 6 },
    priceRow: { flexDirection: 'row', alignItems: 'center' },
    price: { fontSize: 17, fontWeight: '800', color: '#1a1a1a' },
    oldPrice: {
        fontSize: 12,
        color: '#bbb',
        textDecorationLine: 'line-through',
        marginLeft: 6,
        fontWeight: '500',
    },
    savingsText: {
        fontSize: 11,
        color: '#4CAF50',
        fontWeight: '700',
        marginTop: 2,
    },
    addBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#1a1a1a',
        padding: 12,
        borderTopLeftRadius: 20,
    },
})

export default ProductGrid
