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

import Header from '../containers/Header'
import PromotionCarousel from '../containers/Home/PromotionCarousel'
import PromoBanner from '../containers/Home/PromoBanner'
import CouponCarousel from '../containers/Home/CouponCarousel'
import { COLORS } from '../constants'

const Home = ({ navigation }) => {
    const dispatch = useDispatch()

    // Selectors
    const {
        featuredPromotions,
        activeBanners,
        isLoading: homeLoading,
    } = useSelector((state) => state.home)
    const { activeCoupons, discoverCoupons, isCouponLoading } = useSelector(
        (state) => state.coupon
    )
    const { promotions, isPromotionLoading } = useSelector(
        (state) => state.promotions
    )

    const isGlobalLoading = homeLoading || isCouponLoading || isPromotionLoading

    const loadAllData = useCallback(() => {
        dispatch(fetchActivePromotions())
        dispatch(fetchFeaturedPromotions())
        dispatch(fetchActiveBanners())
        dispatch(fetchFeaturedBanners())
        dispatch(fetchActiveCoupons())
        dispatch(fetchDiscoverCoupons())
        dispatch(fetchPromotionsForUser())
    }, [dispatch])

    useEffect(() => {
        loadAllData()
    }, [loadAllData])

    // Data Preparation (Deduplication happened here once)
    const bannerData = useMemo(
        () => [...(featuredPromotions || []), ...(activeBanners || [])],
        [featuredPromotions, activeBanners]
    )

    const uniqueCoupons = useMemo(() => {
        const combined = [...(activeCoupons || []), ...(discoverCoupons || [])]
        return Array.from(
            new Map(combined.map((item) => [item._id, item])).values()
        )
    }, [activeCoupons, discoverCoupons])

    if (isGlobalLoading && bannerData.length === 0) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header />
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={isGlobalLoading}
                        onRefresh={loadAllData}
                    />
                }
            >
                <PromotionCarousel
                    data={promotions}
                    isLoading={isPromotionLoading}
                />

                {bannerData.length > 0 && <PromoBanner data={bannerData} />}

                <CouponCarousel
                    data={uniqueCoupons}
                    isLoading={isCouponLoading}
                    onViewAll={() => navigation.navigate('Coupons')}
                />

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})

export default Home
