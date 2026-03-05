import React, { useEffect, useState, useCallback, useMemo } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Platform,
    StatusBar as RNStatusBar,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { fetchProducts } from '../redux/features/Products/ProductSlice'
import { useTheme } from '../theme/ThemeProvider'
import { COLORS } from '../constants'
import ProductCard from '../components/ProductCard.js'

const AllProducts = ({ route, navigation }) => {
    const { subCategory, categoryName } = route.params || {}
    const insets = useSafeAreaInsets()
    const dispatch = useDispatch()
    const { colors, dark } = useTheme()

    // Redux State
    const { products, isFetchingProducts } = useSelector(
        (state) => state.product
    )

    // Local State
    const [sortBy, setSortBy] = useState('Newest')

    // 1. Initial Data Fetch
    const loadProducts = useCallback(() => {
        dispatch(fetchProducts({ category: subCategory }))
    }, [dispatch, subCategory])

    useEffect(() => {
        loadProducts()
    }, [loadProducts])

    // 2. Memoized Sorting (Handles the specific keys from your log: sellingPrice)
    const sortedProducts = useMemo(() => {
        if (!products) return []
        const list = [...products]
        if (sortBy === 'PriceLow') {
            return list.sort((a, b) => a.sellingPrice - b.sellingPrice)
        }
        if (sortBy === 'PriceHigh') {
            return list.sort((a, b) => b.sellingPrice - a.sellingPrice)
        }
        return list // Default: 'Newest' based on array order from server
    }, [products, sortBy])

    // 3. Refresh Handler
    const handleRefresh = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        }
        loadProducts()
    }

    // 4. Empty State
    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
                name="package-variant-closed"
                size={80}
                color={colors.grayscale400}
            />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No Products Found
            </Text>
            <Text
                style={[styles.emptySubtitle, { color: colors.grayscale700 }]}
            >
                We couldn't find any items in {categoryName || 'this category'}.
            </Text>
        </View>
    )

    return (
        <View
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            {/* Header / Filter Bar */}
            <View
                style={[
                    styles.filterBar,
                    {
                        backgroundColor: colors.background,
                        borderBottomColor: dark ? COLORS.dark3 : '#eee',
                        paddingTop: insets.top > 0 ? insets.top : 10,
                    },
                ]}
            >
                <TouchableOpacity
                    style={styles.filterBtn}
                    onPress={() => {
                        // Logic to toggle sortBy state or open BottomSheet
                        setSortBy(
                            sortBy === 'PriceLow' ? 'PriceHigh' : 'PriceLow'
                        )
                    }}
                >
                    <MaterialCommunityIcons
                        name="swap-vertical"
                        size={20}
                        color={colors.text}
                    />
                    <Text style={[styles.filterText, { color: colors.text }]}>
                        {sortBy === 'Newest'
                            ? ' SORT'
                            : ` ${sortBy.toUpperCase()}`}
                    </Text>
                </TouchableOpacity>

                <View
                    style={[
                        styles.divider,
                        { backgroundColor: dark ? COLORS.dark3 : '#eee' },
                    ]}
                />

                <TouchableOpacity
                    style={styles.filterBtn}
                    onPress={() => {
                        // Logic for Filter BottomSheet
                    }}
                >
                    <MaterialCommunityIcons
                        name="filter-variant"
                        size={20}
                        color={colors.text}
                    />
                    <Text style={[styles.filterText, { color: colors.text }]}>
                        {' '}
                        FILTER
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Product List */}
            <FlatList
                data={sortedProducts}
                keyExtractor={(item) => item._id || item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={[
                    styles.listContent,
                    { paddingBottom: insets.bottom + 20 },
                ]}
                showsVerticalScrollIndicator={false}
                refreshing={!!isFetchingProducts}
                onRefresh={handleRefresh}
                ListEmptyComponent={!isFetchingProducts ? renderEmpty : null}
                renderItem={({ item }) => (
                    <ProductCard
                        item={item}
                        onPress={() =>
                            navigation.navigate('ProductDetails', {
                                id: item._id,
                            })
                        }
                    />
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    filterBar: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingBottom: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        zIndex: 10,
    },
    filterBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
    },
    filterText: {
        fontSize: 12,
        fontFamily: 'bold',
        letterSpacing: 0.5,
    },
    divider: {
        width: 1,
        height: '60%',
    },
    listContent: {
        paddingHorizontal: 12,
        paddingTop: 16,
        flexGrow: 1,
    },
    row: {
        justifyContent: 'space-between',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyTitle: {
        fontSize: 18,
        fontFamily: 'bold',
        marginTop: 20,
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 40,
        lineHeight: 20,
    },
})

export default AllProducts
