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
    Platform,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '../theme/ThemeProvider'

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
import ProductGrid from '../containers/Home/ProductGrid'
import { COLORS, SIZES } from '../constants'

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

    /**
     * PRODUCTION LOGIC: Refined Loading States
     * We only show a full-screen loader on the VERY first launch.
     * Subsequent updates use the RefreshControl for a smoother experience.
     */
    const hasData = featuredProducts?.length > 0 || promotions?.length > 0
    const isInitialLoading = !hasData && (isFetchingFeatured || homeLoading)

    const isRefreshing = useMemo(
        () =>
            homeLoading ||
            isCouponLoading ||
            isPromotionLoading ||
            isFetchingFeatured,
        [homeLoading, isCouponLoading, isPromotionLoading, isFetchingFeatured]
    )

    const loadAllData = useCallback(() => {
        // Dispatching all in parallel
        return Promise.all([
            dispatch(fetchActiveBanners()),
            dispatch(fetchActivePromotions()),
            dispatch(fetchActiveCoupons()),
            dispatch(fetchDiscoverCoupons()),
            dispatch(fetchPromotionsForUser()),
            dispatch(fetchFeaturedProducts()),
        ])
    }, [dispatch])

    useEffect(() => {
        loadAllData()
    }, [loadAllData])

    // Optimize Coupon Data (Remove duplicates by ID)
    const uniqueCoupons = useMemo(() => {
        const combined = [...(activeCoupons || []), ...(discoverCoupons || [])]
        return Array.from(
            new Map(
                combined.map((item) => [item._id || item.id, item])
            ).values()
        )
    }, [activeCoupons, discoverCoupons])

    // Handle Product Navigation
    const handleProductPress = useCallback(
        (item) => {
            navigation.navigate('ProductDetails', { id: item._id || item.id })
        },
        [navigation]
    )

    if (isInitialLoading) {
        return (
            <SafeAreaView
                style={[styles.center, { backgroundColor: colors.background }]}
            >
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text
                    style={[styles.loadingText, { color: colors.grayscale700 }]}
                >
                    Curating your experience...
                </Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <StatusBar
                barStyle={dark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />

            <Header />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                removeClippedSubviews={Platform.OS === 'android'} // Performance boost for long lists
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={loadAllData}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
            >
                {/* Promotions Section */}
                {promotions?.length > 0 && (
                    <View style={styles.section}>
                        <PromotionCarousel data={promotions} />
                    </View>
                )}

                {/* Coupons Section */}
                <View style={styles.section}>
                    <CouponCarousel
                        data={uniqueCoupons}
                        onViewAll={() => navigation.navigate('Coupons')}
                    />
                </View>

                {/* Dynamic Banners */}
                {activeBanners?.length > 0 && (
                    <View style={styles.bannerSection}>
                        <PromoBanner data={activeBanners} />
                    </View>
                )}

                {/* Featured Products Grid */}
                <View style={styles.productSection}>
                    <View style={styles.sectionHeader}>
                        <Text
                            style={[
                                styles.sectionTitle,
                                { color: colors.text },
                            ]}
                        >
                            Featured for You
                        </Text>
                        <Text
                            style={[
                                styles.sectionSubtitle,
                                { color: colors.grayscale700 },
                            ]}
                        >
                            Handpicked premium products
                        </Text>
                    </View>

                    <ProductGrid
                        products={featuredProducts}
                        onProductPress={handleProductPress}
                    />
                </View>

                {/* Bottom Spacer for TabBar visibility */}
                <View style={{ height: 80 }} />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 15,
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    scrollContent: {
        paddingBottom: SIZES.padding,
    },
    section: {
        marginBottom: 10,
    },
    bannerSection: {
        marginVertical: 10,
        paddingHorizontal: 0,
    },
    productSection: {
        marginTop: 10,
    },
    sectionHeader: {
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '800',
    },
    sectionSubtitle: {
        fontSize: 13,
        marginTop: 2,
    },
})

export default Home
