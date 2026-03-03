import React, { useEffect, useMemo, useCallback } from 'react'
import {
    ScrollView,
    StyleSheet,
    View,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    RefreshControl,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

// Actions
import { fetchActiveBanners } from '../redux/features/Home/HomeSlice'
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
import ProductGrid from '../containers/Home/ProductGrid'
import { COLORS } from '../constants'

const Home = ({ navigation }) => {
    const dispatch = useDispatch()

    // Redux Selectors
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

    const isGlobalLoading =
        homeLoading ||
        isCouponLoading ||
        isPromotionLoading ||
        isFetchingFeatured

    const loadAllData = useCallback(() => {
        dispatch(fetchActiveBanners())
        dispatch(fetchActiveCoupons())
        dispatch(fetchDiscoverCoupons())
        dispatch(fetchPromotionsForUser())
        dispatch(fetchFeaturedProducts())
    }, [dispatch])

    useEffect(() => {
        loadAllData()
    }, [loadAllData])

    const uniqueCoupons = useMemo(() => {
        const combined = [...(activeCoupons || []), ...(discoverCoupons || [])]
        return Array.from(
            new Map(combined.map((item) => [item._id, item])).values()
        )
    }, [activeCoupons, discoverCoupons])

    if (isGlobalLoading && featuredProducts.length === 0) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator
                    size="large"
                    color={COLORS.primary || '#1e3c72'}
                />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <Header />

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isGlobalLoading}
                        onRefresh={loadAllData}
                    />
                }
            >
                {/* 1. Main Promotion Slider */}
                <PromotionCarousel data={promotions} />

                {/* 2. Horizontal Coupons */}
                <CouponCarousel
                    data={uniqueCoupons}
                    onViewAll={() => navigation.navigate('Coupons')}
                />

                {/* 3. Trending Secondary Banners */}
                {activeBanners?.length > 0 && (
                    <PromoBanner data={activeBanners} />
                )}

                {/* 4. The Product Grid */}
                <ProductGrid
                    products={featuredProducts}
                    onProductPress={(item) =>
                        navigation.navigate('ProductDetails', { id: item._id })
                    }
                />

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})

export default Home
