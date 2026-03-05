import React, { useEffect, useMemo } from 'react'
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import {
    fetchActiveCoupons,
    fetchDiscoverCoupons,
} from '../../redux/features/Coupons/CouponSlice.js'
import { COLORS } from '../../constants'
import { LinearGradient } from 'expo-linear-gradient'

const { width } = Dimensions.get('window')
const CARD_WIDTH = width * 0.85
const CARD_HEIGHT = 140

const gradients = [
    ['#6a11cb', '#2575fc'],
    ['#ff7e5f', '#feb47b'],
    ['#00c6ff', '#0072ff'],
    ['#f7971e', '#ffd200'],
    ['#f953c6', '#b91d73'],
]

const CouponCarousel = () => {
    const dispatch = useDispatch()

    const { activeCoupons, discoverCoupons, isCouponLoading } = useSelector(
        (state) => state.coupon
    )

    // Fetch Coupons
    useEffect(() => {
        dispatch(fetchActiveCoupons())
        dispatch(fetchDiscoverCoupons())
    }, [dispatch])

    // Combine and dedupe coupons
    const couponsData = useMemo(() => {
        const combined = [...(activeCoupons || []), ...(discoverCoupons || [])]
        const unique = Array.from(
            new Map(combined.map((item) => [item._id, item])).values()
        )
        return unique.length > 0 ? unique : null
    }, [activeCoupons, discoverCoupons])


    console.log("couponsData", couponsData)

    if (isCouponLoading) {
        return (
            <View style={[styles.loaderContainer, { width }]}>
                <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
        )
    }

    if (!couponsData) return null

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + 15}
            decelerationRate="fast"
            contentContainerStyle={styles.scrollContainer}
        >
            {couponsData.map((item, index) => {
                const gradientColors = gradients[index % gradients.length]

                return (
                    <TouchableOpacity
                        key={item._id || index}
                        activeOpacity={0.9}
                        style={styles.cardWrapper}
                    >
                        <LinearGradient
                            colors={gradientColors}
                            style={[
                                styles.card,
                                { width: CARD_WIDTH, height: CARD_HEIGHT },
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View style={styles.overlay}>
                                <Text style={styles.title} numberOfLines={2}>
                                    {item.title}
                                </Text>
                                <View style={styles.btn}>
                                    <Text style={styles.btnText}>Shop Now</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                )
            })}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        paddingLeft: 15,
        paddingBottom: 10,
    },
    cardWrapper: {
        marginRight: 15,
    },
    card: {
        borderRadius: 18,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        justifyContent: 'flex-end',
    },
    overlay: {
        padding: 12,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    btn: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    btnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: CARD_HEIGHT,
    },
})

export default CouponCarousel
