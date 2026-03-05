import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const ProductGrid = ({ deals }) => {
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} activeOpacity={0.9}>
            <View style={styles.wishlist}>
                <MaterialCommunityIcons
                    name="heart-outline"
                    size={18}
                    color="#999"
                />
            </View>
            <Image source={item.image} style={styles.img} />
            <Text style={styles.name} numberOfLines={1}>
                {item.name}
            </Text>

            <View style={styles.priceRow}>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.oldPrice}>{item.oldPrice}</Text>
            </View>

            {item.discount && (
                <View style={styles.discountTag}>
                    <Text style={styles.discountText}>{item.discount}</Text>
                </View>
            )}
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Trending Deals</Text>
            <FlatList
                data={deals}
                numColumns={2}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                scrollEnabled={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { padding: 15 },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 5,
        padding: 12,
        borderRadius: 12,
        elevation: 2,
    },
    wishlist: { position: 'absolute', top: 10, right: 10, zIndex: 1 },
    img: {
        width: '100%',
        height: 110,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    name: { fontSize: 14, color: '#444', fontWeight: '500' },
    priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    price: { fontSize: 15, fontWeight: 'bold', color: '#1e3c72' },
    oldPrice: {
        fontSize: 11,
        color: '#999',
        textDecorationLine: 'line-through',
        marginLeft: 6,
    },
    discountTag: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#4CAF50',
        paddingHorizontal: 5,
        borderRadius: 4,
    },
    discountText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
})

export default ProductGrid
