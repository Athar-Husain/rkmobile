import React, { useEffect, useMemo, useCallback } from 'react'
import {
    StyleSheet,
    View,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    RefreshControl,
    Text,
    Platform,
    FlatList,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '../theme/ThemeProvider'
import * as Haptics from 'expo-haptics'

// Actions
import {
    fetchActiveBanners,
    fetchActivePromotions,
} from '../redux/features/Home/HomeSlice'
import {
    fetchActiveCoupons,
    fetchDiscoverCoupons,
} from '../redux/features/Coupons/CouponSlice'
import { fetchPromotionsForUser } from '../redux/features/Promotion/PromotionSlice'
import { fetchFeaturedProducts } from '../redux/features/Products/ProductSlice'

// Components
import Header from '../containers/Header'
import PromotionCarousel from '../containers/Home/PromotionCarousel'
import PromoBanner from '../containers/Home/PromoBanner'
import CouponCarousel from '../containers/Home/CouponCarousel'
import ProductCard from '../components/ProductCard' // Assume a memoized card exists
import { COLORS } from '../constants'

const Home = ({ navigation }) => {
    const dispatch = useDispatch()
    const { colors, dark } = useTheme()

    // Selectors
    const { activeBanners, isLoading: homeLoading } = useSelector(
        (state) => state.home
    )
    const { activeCoupons, discoverCoupons, isCouponLoading } = useSelector(
        (state) => state.coupon
    )
    const { promotions, isPromotionLoading } = useSelector(
        (state) => state.promotions
    )
    const { featuredProducts, isFetchingFeatured } = useSelector(
        (state) => state.product
    )

    const loadAllData = useCallback(() => {
        dispatch(fetchActiveBanners())
        dispatch(fetchActivePromotions())
        dispatch(fetchActiveCoupons())
        dispatch(fetchDiscoverCoupons())
        dispatch(fetchPromotionsForUser())
        dispatch(fetchFeaturedProducts())
    }, [dispatch])

    useEffect(() => {
        loadAllData()
    }, [loadAllData])

    const isRefreshing = useMemo(
        () =>
            homeLoading ||
            isCouponLoading ||
            isPromotionLoading ||
            isFetchingFeatured,
        [homeLoading, isCouponLoading, isPromotionLoading, isFetchingFeatured]
    )

    // Data Processing (Memoized to prevent re-renders)
    const uniqueCoupons = useMemo(() => {
        const combined = [...(activeCoupons || []), ...(discoverCoupons || [])]
        const map = new Map()
        combined.forEach((item) => {
            if (item._id) map.set(item._id, item)
        })
        return Array.from(map.values())
    }, [activeCoupons, discoverCoupons])

    // Performance Optimized RenderItem
    const renderProduct = useCallback(
        ({ item }) => (
            <ProductCard
                item={item}
                onPress={() =>
                    navigation.navigate('ProductDetails', { id: item._id })
                }
            />
        ),
        [navigation]
    )

    // --- The Secret Sauce: ListHeaderComponent ---
    const renderHeader = useMemo(
        () => (
            <View style={styles.headerContainer}>
                {promotions?.length > 0 && (
                    <PromotionCarousel data={promotions} />
                )}

                <View style={styles.section}>
                    <CouponCarousel
                        data={uniqueCoupons}
                        onViewAll={() => navigation.navigate('Coupons')}
                    />
                </View>

                {activeBanners?.length > 0 && (
                    <PromoBanner data={activeBanners} />
                )}

                <View style={styles.productSectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Featured for You
                    </Text>
                    <Text style={styles.sectionSubtitle}>
                        Handpicked premium products
                    </Text>
                </View>
            </View>
        ),
        [promotions, uniqueCoupons, activeBanners, colors.text, navigation]
    )

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
            <Header />

            <FlatList
                data={featuredProducts}
                renderItem={renderProduct}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={renderHeader}
                numColumns={2} // Efficiently handles the grid
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                // PERFORMANCE PROPS
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={5}
                initialNumToRender={6}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={loadAllData}
                        tintColor={COLORS.primary}
                    />
                }
                ListFooterComponent={<View style={{ height: 80 }} />}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerContainer: { width: '100%' },
    listContent: { paddingBottom: 20 },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    section: { marginBottom: 15 },
    productSectionHeader: {
        paddingHorizontal: 20,
        marginVertical: 12,
    },
    sectionTitle: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
    sectionSubtitle: { fontSize: 11, color: '#8E8E93', marginTop: 1 },
})

export default Home
