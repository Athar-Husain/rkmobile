import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '../constants'
import { useTheme } from '../theme/ThemeProvider'

const { width } = Dimensions.get('window')
const cardWidth = (width - 40) / 2

const ProductCard = ({ item, onPress }) => {
    const { colors, dark } = useTheme()

    // YOUR DATA FIX: Accessing images from your log structure [Object]
    const imageUrl = item.images?.[0]?.url || 'https://via.placeholder.com/150'

    // Check if product is out of stock
    const isOutOfStock = item.overallStock === 0

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            disabled={isOutOfStock} // Optionally disable clicks if out of stock
            style={[
                styles.container,
                {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                    opacity: isOutOfStock ? 0.8 : 1,
                },
            ]}
        >
            {/* Image Section */}
            <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="contain"
                />

                {/* YOUR DATA: Using formatted strings from your logs */}
                {item.discountPercentage > 0 && !isOutOfStock && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>
                            {item.discountPercentage}% OFF
                        </Text>
                    </View>
                )}

                {isOutOfStock && (
                    <View style={styles.outOfStockOverlay}>
                        <Text style={styles.outOfStockText}>OUT OF STOCK</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.favBtn}>
                    <MaterialCommunityIcons
                        name="heart-outline"
                        size={18}
                        color={COLORS.grayscale400}
                    />
                </TouchableOpacity>
            </View>

            {/* Content Section */}
            <View style={styles.content}>
                <Text
                    style={[styles.brand, { color: colors.grayscale700 }]}
                    numberOfLines={1}
                >
                    {item.brand}
                </Text>

                <Text
                    style={[styles.name, { color: colors.text }]}
                    numberOfLines={1}
                >
                    {item.name}
                </Text>

                {/* Price Row using your log's formatted strings */}
                <View style={styles.priceRow}>
                    <Text style={[styles.sellingPrice, { color: colors.text }]}>
                        {item.formattedSellingPrice}
                    </Text>
                    {item.mrp > item.sellingPrice && (
                        <Text style={styles.originalPrice}>
                            {item.formattedMRP}
                        </Text>
                    )}
                </View>

                {/* Add Button - Hidden if Out of Stock */}
                {!isOutOfStock && (
                    <TouchableOpacity style={styles.addBtn}>
                        <LinearGradient
                            colors={[COLORS.primary, '#335EF7']}
                            style={styles.gradientBtn}
                        >
                            <MaterialCommunityIcons
                                name="plus"
                                size={20}
                                color="white"
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: cardWidth,
        borderRadius: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        overflow: 'hidden',
    },
    imageWrapper: {
        width: '100%',
        height: 160,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: { width: '90%', height: '90%' },
    discountBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: COLORS.red,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    discountText: { color: 'white', fontSize: 9, fontFamily: 'bold' },
    outOfStockOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    outOfStockText: {
        color: COLORS.grayscale700,
        fontSize: 10,
        fontFamily: 'bold',
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 4,
        borderRadius: 4,
    },
    favBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'white',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: { padding: 10 },
    brand: { fontSize: 10, fontFamily: 'medium', textTransform: 'uppercase' },
    name: { fontSize: 13, fontFamily: 'bold', marginTop: 2 },
    priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 6 },
    sellingPrice: { fontSize: 15, fontFamily: 'bold' },
    originalPrice: {
        fontSize: 11,
        color: COLORS.grayscale400,
        textDecorationLine: 'line-through',
        marginLeft: 4,
    },
    addBtn: { position: 'absolute', right: 8, bottom: 8 },
    gradientBtn: {
        width: 30,
        height: 30,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default ProductCard
