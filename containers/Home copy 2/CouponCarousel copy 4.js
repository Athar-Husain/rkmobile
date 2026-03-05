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
const CARD_WIDTH = width * 0.82
const SPACING = 12

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
        return daysLeft <= 0
            ? daysLeft === 0
                ? 'Expires Today'
                : 'Expired'
            : `Valid for ${daysLeft} days`
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>Exclusive Cashback</Text>
                <TouchableOpacity onPress={onViewAll}>
                    <Text style={styles.viewAll}>View All</Text>
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
                    const scale = scrollX.interpolate({
                        inputRange: [
                            (index - 1) * (CARD_WIDTH + SPACING),
                            index * (CARD_WIDTH + SPACING),
                            (index + 1) * (CARD_WIDTH + SPACING),
                        ],
                        outputRange: [0.94, 1, 0.94],
                        extrapolate: 'clamp',
                    })

                    return (
                        <Animated.View
                            key={item._id || index}
                            style={[
                                styles.cardWrapper,
                                { transform: [{ scale }] },
                            ]}
                        >
                            <LinearGradient
                                colors={[
                                    COLORS.primary || '#1e3c72',
                                    '#1a1a1a',
                                ]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.card}
                            >
                                <View style={styles.leftPortion}>
                                    <Text style={styles.discountValue}>
                                        {item.type !== 'FIXED_AMOUNT'
                                            ? `${item.value}%`
                                            : `₹${item.value}`}
                                    </Text>
                                    <Text style={styles.offLabel}>OFF</Text>
                                </View>
                                <View style={styles.dividerContainer}>
                                    <View style={styles.circleNotchTop} />
                                    <View style={styles.dashedLine} />
                                    <View style={styles.circleNotchBottom} />
                                </View>
                                <View style={styles.rightPortion}>
                                    <View>
                                        <Text
                                            style={styles.couponTitle}
                                            numberOfLines={1}
                                        >
                                            {item.title}
                                        </Text>
                                        <Text style={styles.minSpend}>
                                            Min. Spend: ₹
                                            {item.minPurchaseAmount || 0}
                                        </Text>
                                    </View>
                                    <View style={styles.footer}>
                                        <View style={styles.expiryBox}>
                                            <MaterialCommunityIcons
                                                name="clock-outline"
                                                size={12}
                                                color="#fff"
                                                style={{ opacity: 0.8 }}
                                            />
                                            <Text style={styles.expiryText}>
                                                {formatExpiry(item.validUntil)}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.shopBtn}
                                        >
                                            <Text style={styles.shopBtnText}>
                                                CLAIM
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
    container: { marginVertical: 10 },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
    viewAll: { color: COLORS.primary, fontWeight: '600', fontSize: 13 },
    scrollContainer: { paddingLeft: 10, paddingRight: 20, paddingBottom: 10 },
    cardWrapper: { width: CARD_WIDTH, marginRight: SPACING },
    card: {
        height: 140,
        borderRadius: 16,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    leftPortion: {
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    discountValue: { color: '#fff', fontSize: 24, fontWeight: '800' },
    offLabel: { color: '#fff', fontSize: 12, opacity: 0.8 },
    dividerContainer: {
        width: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dashedLine: {
        flex: 1,
        width: 1,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderStyle: 'dashed',
        marginVertical: 10,
    },
    circleNotchTop: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        position: 'absolute',
        top: -10,
    },
    circleNotchBottom: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: -10,
    },
    rightPortion: { flex: 1, padding: 15, justifyContent: 'space-between' },
    couponTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
    minSpend: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    expiryBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    expiryText: { color: '#fff', fontSize: 11 },
    shopBtn: {
        backgroundColor: '#fff',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    shopBtnText: { color: '#000', fontSize: 10, fontWeight: '800' },
    loader: { height: 140, justifyContent: 'center', alignItems: 'center' },
})

export default CouponCarousel
