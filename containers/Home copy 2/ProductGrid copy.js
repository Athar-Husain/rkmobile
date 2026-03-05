import React from 'react'
import { View, Text, StyleSheet, Image, FlatList } from 'react-native'

const ProductGrid = ({ deals }) => {
    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Image source={item.image} style={styles.img} />
            <Text style={styles.name} numberOfLines={1}>
                {item.name}
            </Text>
            <Text style={styles.price}>{item.price}</Text>
            {item.discount && (
                <Text style={styles.discount}>{item.discount}</Text>
            )}
        </View>
    )

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Trending Deals</Text>
            <FlatList
                data={deals}
                numColumns={2}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                scrollEnabled={false} // Since it's inside a main ScrollView
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    item: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 5,
        padding: 15,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#eee',
    },
    img: {
        width: '100%',
        height: 100,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    name: { fontSize: 14, fontWeight: '500' },
    price: { fontSize: 16, fontWeight: 'bold', marginTop: 5 },
    discount: { color: 'orange', fontSize: 12, fontWeight: 'bold' },
})

export default ProductGrid
