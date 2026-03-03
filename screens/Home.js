// app / screens / Home.js

import React, { useEffect, useMemo, useCallback } from 'react'
import {
    ScrollView,
    StyleSheet,
    View,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    RefreshControl,
    Text,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

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

import Header from '../containers/Header'
import PromotionCarousel from '../containers/Home/PromotionCarousel'
import PromoBanner from '../containers/Home/PromoBanner'
import CouponCarousel from '../containers/Home/CouponCarousel'
import ProductGrid from '../containers/Home/ProductGrid'
import { COLORS } from '../constants'

const Home = ({ navigation }) => {
    const dispatch = useDispatch()

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

    // FIX: Only block the UI if we have absolutely NO data.
    // If we have products, we show the screen and let RefreshControl show the spinner.
    const isInitialLoading =
        (isFetchingFeatured || homeLoading) && featuredProducts.length === 0

    // Refreshing state for the Pull-to-Refresh
    const isRefreshing =
        homeLoading ||
        isCouponLoading ||
        isPromotionLoading ||
        isFetchingFeatured

    const loadAllData = useCallback(() => {
        dispatch(fetchActiveBanners())
        dispatch(fetchActivePromotions()) // Added this back
        dispatch(fetchActiveCoupons())
        dispatch(fetchDiscoverCoupons())
        dispatch(fetchPromotionsForUser())
        dispatch(fetchFeaturedProducts())
    }, [dispatch])

    useEffect(() => {
        loadAllData()
    }, []) // Empty array to prevent the nav-loop

    const uniqueCoupons = useMemo(() => {
        const combined = [...(activeCoupons || []), ...(discoverCoupons || [])]
        return Array.from(
            new Map(combined.map((item) => [item._id, item])).values()
        )
    }, [activeCoupons, discoverCoupons])

    if (isInitialLoading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>
                    Curating your experience... 
                </Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <Header />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={loadAllData}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
            >
                <View style={styles.section}>
                    <PromotionCarousel data={promotions} />
                </View>

                <View style={styles.section}>
                    <CouponCarousel
                        data={uniqueCoupons}
                        onViewAll={() => navigation.navigate('Coupons')}
                    />
                </View>

                {activeBanners?.length > 0 && (
                    <View style={styles.bannerSection}>
                        <PromoBanner data={activeBanners} />
                    </View>
                )}

                <View style={styles.productSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            Featured for You
                        </Text>
                        <Text style={styles.sectionSubtitle}>
                            Handpicked premium products
                        </Text>
                    </View>
                    <ProductGrid
                        products={featuredProducts}
                        onProductPress={(item) =>
                            navigation.navigate('ProductDetails', {
                                id: item._id,
                            })
                        }
                    />
                </View>
                <View style={{ height: 60 }} />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 15,
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    scrollContent: { paddingBottom: 20 },
    section: { marginBottom: 5 },
    bannerSection: { marginVertical: 5, paddingHorizontal: 5 },
    productSection: { marginTop: 5 },
    sectionHeader: { paddingHorizontal: 20, marginBottom: 15 },
    sectionTitle: { fontSize: 22, fontWeight: '800', color: '#000' },
    sectionSubtitle: { fontSize: 13, color: '#666', marginTop: 2 },
})

export default Home
