import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator,
} from 'react-native'
import PagerView from 'react-native-pager-view'
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import { fetchPromotionsForUser } from '../../redux/features/Promotion/PromotionSlice'
import { COLORS } from '../../constants'

const { width } = Dimensions.get('window')

const PromotionCarousel = ({ onPromotionPress }) => {
    const dispatch = useDispatch()
    const pagerRef = useRef(null)
    const [currentPage, setCurrentPage] = useState(0)

    const {
        promotions,
        isPromotionLoading,
        isPromotionError,
        message,
    } = useSelector((state) => state.promotions)

    // console.log('promotions in promotioncarousel', promotions)

    /* ===============================
       Fetch Promotions On Screen Focus
    =============================== */
    useFocusEffect(
        useCallback(() => {
            dispatch(fetchPromotionsForUser())
        }, [dispatch])
    )

    /* ===============================
       Auto Slide Logic
    =============================== */
    useEffect(() => {
        if (!promotions || promotions.length <= 1) return

        const interval = setInterval(() => {
            const nextPage =
                currentPage === promotions.length - 1
                    ? 0
                    : currentPage + 1

            pagerRef.current?.setPage(nextPage)
        }, 4000)

        return () => clearInterval(interval)
    }, [currentPage, promotions])

    /* ===============================
       Loading State
    =============================== */
    if (isPromotionLoading) {
        return (
            <View style={[styles.loaderContainer, { width }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        )
    }

    /* ===============================
       Error State
    =============================== */
    if (!isPromotionLoading && isPromotionError) {
        return (
            <View style={[styles.loaderContainer, { width }]}>
                <Text style={styles.errorText}>
                    {message || 'Failed to load promotions'}
                </Text>
            </View>
        )
    }

    /* ===============================
       Empty State
    =============================== */
    if (!promotions || promotions.length === 0) {
        return null
    }

    return (
        <SafeAreaView style={styles.container}>
            <PagerView
                ref={pagerRef}
                style={styles.pager}
                initialPage={0}
                onPageSelected={(e) =>
                    setCurrentPage(e.nativeEvent.position)
                }
            >
                {promotions.map((item, index) => (
                    <View key={item._id || index} style={styles.page}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={styles.card}
                            onPress={() =>
                                onPromotionPress &&
                                onPromotionPress(item)
                            }
                        >
                            {/* Background Image */}
                            <Image
                                source={{ uri: item.bannerImage }}
                                style={styles.image}
                            />

                            {/* Dark Overlay */}
                            <View style={styles.overlay} />

                            {/* Content */}
                            <View style={styles.content}>
                                <Text
                                    style={styles.title}
                                    numberOfLines={2}
                                >
                                    {item.title}
                                </Text>

                                <View style={styles.btn}>
                                    <Text style={styles.btnText}>
                                        Shop Now
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
            </PagerView>

            {/* Pagination Dots */}
            {promotions.length > 1 && (
                <View style={styles.dotContainer}>
                    {promotions.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                {
                                    opacity:
                                        i === currentPage ? 1 : 0.3,
                                },
                            ]}
                        />
                    ))}
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 200,
        marginTop: 10,
    },
    pager: {
        flex: 1,
    },
    page: {
        paddingHorizontal: 15,
    },
    card: {
        flex: 1,
        borderRadius: 18,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    content: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    btn: {
        backgroundColor: COLORS.primary,
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        marginHorizontal: 4,
    },
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
    },
    errorText: {
        color: COLORS.red,
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
})

export default PromotionCarousel