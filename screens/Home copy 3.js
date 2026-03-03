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

// Redux Actions
import {
    fetchActivePromotions,
    fetchFeaturedPromotions,
    fetchActiveBanners,
    fetchFeaturedBanners,
} from '../redux/features/Home/HomeSlice'
import {
    fetchDiscoverCoupons,
    fetchActiveCoupons,
} from '../redux/features/Coupons/CouponSlice'
import { fetchPromotionsForUser } from '../redux/features/Promotion/PromotionSlice'

// Components
import Header from '../containers/Header'
import PromotionCarousel from '../containers/Home/PromotionCarousel'
import PromoBanner from '../containers/Home/PromoBanner'
import CouponCarousel from '../containers/Home/CouponCarousel'
import { COLORS } from '../constants'
import ProductGrid from '../containers/Home/ProductGrid'

const Home = ({ navigation }) => {
    const dispatch = useDispatch()

    // Selectors from all slices
    const {
        featuredPromotions,
        activeBanners,
        isLoading: homeLoading,
    } = useSelector((state) => state.home)

    // console.log('activeBanners', activeBanners)
    const { activeCoupons, discoverCoupons, isCouponLoading } = useSelector(
        (state) => state.coupon
    )
    const { promotions, isPromotionLoading } = useSelector(
        (state) => state.promotions
    )

    const isGlobalLoading = homeLoading || isCouponLoading || isPromotionLoading

    const loadAllData = useCallback(() => {
        // Home Data
        // dispatch(fetchfe())
        dispatch(fetchActivePromotions())
        dispatch(fetchFeaturedPromotions())
        dispatch(fetchActiveBanners())
        dispatch(fetchFeaturedBanners())
        // Coupon Data
        dispatch(fetchActiveCoupons())
        dispatch(fetchDiscoverCoupons())
        // User Promotions
        dispatch(fetchPromotionsForUser())

    }, [dispatch])

    useEffect(() => {
        loadAllData()
    }, [loadAllData])

    // Deduplicate Banner Data
    const bannerData = useMemo(
        () => [...(activeBanners || [])],
        [activeBanners]
    )

    // Deduplicate Coupon Data
    const uniqueCoupons = useMemo(() => {
        const combined = [...(activeCoupons || []), ...(discoverCoupons || [])]
        return Array.from(
            new Map(combined.map((item) => [item._id, item])).values()
        )
    }, [activeCoupons, discoverCoupons])

    if (
        isGlobalLoading &&
        bannerData.length === 0 &&
        uniqueCoupons.length === 0
    ) {
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
                        colors={[COLORS.primary || '#1e3c72']}
                    />
                }
            >
                {/* Section 1: Top Dynamic Promotions */}
                <PromotionCarousel
                    data={promotions}
                    isLoading={isPromotionLoading}
                />

                {/* Section 2: Cashback Banners */}
                <CouponCarousel
                    data={uniqueCoupons}
                    isLoading={isCouponLoading}
                    onViewAll={() => navigation.navigate('Coupons')}
                />

                {/* Section 3: Exclusive Coupons */}
                {bannerData.length > 0 && (
                    <View style={styles.sectionMargin}>
                        <PromoBanner data={bannerData} />
                    </View>
                )}

                <ProductGrid deals={deals} />
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    sectionMargin: { marginTop: 10 },
})

export default Home
