import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
// import { fetchProducts } from '../redux/features/Product/ProductSlice'
import { fetchProducts } from '../redux/features/Products/ProductSlice'
import ProductGrid from '../containers/Home/ProductGrid'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const AllProducts = ({ route, navigation }) => {
    const { subCategory } = route.params || {}
    const dispatch = useDispatch()
    const { products, isFetchingProducts } = useSelector(
        (state) => state.product
    )
    const [sortBy, setSortBy] = useState('Newest')

    useEffect(() => {
        dispatch(fetchProducts({ category: subCategory }))
    }, [subCategory])

    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === 'PriceLow') return a.sellingPrice - b.sellingPrice
        if (sortBy === 'PriceHigh') return b.sellingPrice - a.sellingPrice
        return 0
    })

    return (
        <View style={styles.container}>
            {/* Filter/Sort Header */}
            <View style={styles.filterBar}>
                <TouchableOpacity style={styles.filterBtn}>
                    <MaterialCommunityIcons name="sort" size={20} />
                    <Text> Sort</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.filterBtn}>
                    <MaterialCommunityIcons name="filter-variant" size={20} />
                    <Text> Filter</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={[{ id: 'grid' }]} // Wrapper to use your ProductGrid
                renderItem={() => (
                    <ProductGrid
                        products={sortedProducts}
                        onProductPress={(item) =>
                            navigation.navigate('ProductDetails', {
                                id: item._id,
                            })
                        }
                    />
                )}
                keyExtractor={(item) => item.id}
                refreshing={isFetchingProducts}
                onRefresh={() =>
                    dispatch(fetchProducts({ category: subCategory }))
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    filterBar: {
        flexDirection: 'row',
        height: 50,
        borderBottomWidth: 1,
        borderColor: '#eee',
        alignItems: 'center',
    },
    filterBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    divider: { width: 1, height: '60%', backgroundColor: '#eee' },
})

export default AllProducts
