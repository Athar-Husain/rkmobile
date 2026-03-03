// app/containers/Home/CouponCarousel.js
import React, { useRef } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    Animated,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import moment from 'moment'
import { COLORS } from '../../constants'

const { width } = Dimensions.get('window')
const CARD_WIDTH = width * 0.85
const SPACING = 15

const CouponCarousel = ({ data, isLoading, onViewAll }) => {
    const scrollX = useRef(new Animated.Value(0)).current

    if (isLoading && (!data || data.length === 0)) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator color={COLORS.primary} />
            </View>
        )
    }
    if (!data || data.length === 0) return null

    const formatExpiry = (dateStr) => {
        const daysLeft = moment(dateStr).diff(moment(), 'days')
        if (daysLeft < 0) return 'Expired'
        if (daysLeft === 0) return 'Expires Today'
        return `${daysLeft} days remaining`
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.sectionTitle}>Exclusive Rewards</Text>
                    <Text style={styles.subTitle}>
                        Save more on your favorites
                    </Text>
                </View>
                <TouchableOpacity onPress={onViewAll} style={styles.viewAllBtn}>
                    <Text style={styles.viewAll}>See All</Text>
                </TouchableOpacity>
            </View>

            <Animated.ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + SPACING}
                decelerationRate="fast"
                contentContainerStyle={styles.scrollContainer}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            >
                {data.map((item, index) => {
                    const inputRange = [
                        (index - 1) * (CARD_WIDTH + SPACING),
                        index * (CARD_WIDTH + SPACING),
                        (index + 1) * (CARD_WIDTH + SPACING),
                    ]

                    const scale = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.9, 1, 0.9],
                        extrapolate: 'clamp',
                    })

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.7, 1, 0.7],
                        extrapolate: 'clamp',
                    })

                    return (
                        <Animated.View
                            key={item._id || index}
                            style={[
                                styles.cardWrapper,
                                { transform: [{ scale }], opacity },
                            ]}
                        >
                            <LinearGradient
                                colors={['#1e3c72', '#2a5298', '#1a1a1a']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.card}
                            >
                                {/* Left Side: Discount Info */}
                                <View style={styles.leftPortion}>
                                    <Text style={styles.discountValue}>
                                        {item.type !== 'FIXED_AMOUNT'
                                            ? `${item.value}%`
                                            : `₹${item.value}`}
                                    </Text>
                                    <Text style={styles.offLabel}>
                                        CASHBACK
                                    </Text>
                                </View>

                                {/* Center: Ticket Perforation */}
                                <View style={styles.dividerContainer}>
                                    <View style={styles.circleNotchTop} />
                                    <View style={styles.dashedLine} />
                                    <View style={styles.circleNotchBottom} />
                                </View>

                                {/* Right Side: Content */}
                                <View style={styles.rightPortion}>
                                    <View>
                                        <Text
                                            style={styles.couponTitle}
                                            numberOfLines={1}
                                        >
                                            {item.title}
                                        </Text>
                                        <Text style={styles.minSpend}>
                                            On orders above ₹
                                            {item.minPurchaseAmount || 0}
                                        </Text>
                                    </View>

                                    <View style={styles.footer}>
                                        <View style={styles.expiryBox}>
                                            <MaterialCommunityIcons
                                                name="timer-sand"
                                                size={14}
                                                color="#FFD700"
                                            />
                                            <Text style={styles.expiryText}>
                                                {formatExpiry(item.validUntil)}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={styles.shopBtn}
                                        >
                                            <Text style={styles.shopBtnText}>
                                                APPLY
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </LinearGradient>
                        </Animated.View>
                    )
                })}
            </Animated.ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { marginVertical: 15 },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sectionTitle: { fontSize: 20, fontWeight: '800', color: '#1a1a1a' },
    subTitle: { fontSize: 12, color: '#666', marginTop: 2 },
    viewAllBtn: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        backgroundColor: '#E8EBF2',
        borderRadius: 12,
    },
    viewAll: { color: '#1e3c72', fontWeight: '700', fontSize: 12 },
    scrollContainer: { paddingLeft: 10, paddingRight: 20 },
    cardWrapper: {
        width: CARD_WIDTH,
        marginRight: SPACING,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    card: {
        height: 130,
        borderRadius: 20,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    leftPortion: {
        width: '32%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 0,
    },
    discountValue: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: -1,
    },
    offLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
        fontWeight: 'bold',
    },
    dividerContainer: {
        width: 2,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dashedLine: {
        flex: 1,
        width: 1,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderStyle: 'dashed',
        marginVertical: 12,
    },
    circleNotchTop: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
        position: 'absolute',
        top: -12,
    },
    circleNotchBottom: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
        position: 'absolute',
        bottom: -12,
    },
    rightPortion: { flex: 1, padding: 16, justifyContent: 'space-between' },
    couponTitle: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
    minSpend: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 4 },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    expiryBox: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    expiryText: { color: '#FFD700', fontSize: 11, fontWeight: '600' },
    shopBtn: {
        backgroundColor: '#fff',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 25,
    },
    shopBtnText: { color: '#1e3c72', fontSize: 11, fontWeight: '900' },
    loader: { height: 140, justifyContent: 'center', alignItems: 'center' },
})

export default CouponCarousel
