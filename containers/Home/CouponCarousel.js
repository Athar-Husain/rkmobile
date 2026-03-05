import React, { useRef, memo } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    Animated,
    Platform,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import moment from 'moment'
import * as Haptics from 'expo-haptics'
import { useNavigation } from '@react-navigation/native'
import { COLORS } from '../../constants'

const { width } = Dimensions.get('window')
const CARD_WIDTH = width * 0.82
const SPACING = 10

const CouponCarousel = ({ data, isLoading, onViewAll }) => {
    const navigation = useNavigation();
    const scrollX = useRef(new Animated.Value(0)).current

    if (isLoading && (!data || data.length === 0)) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
        )
    }
    
    if (!data || data.length === 0) return null

    const formatExpiry = (dateStr) => {
        const daysLeft = moment(dateStr).diff(moment(), 'days')
        if (daysLeft < 0) return 'Expired'
        if (daysLeft === 0) return 'Ends Today'
        return `${daysLeft}d left`
    }

    const handleNavigation = (item) => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        }
        
        // Determine which tab to open: active if it's already claimed, discover if not
        const targetTab = item.status ? 'active' : 'discover';
        
        navigation.navigate('Coupons', { 
            initialTab: targetTab 
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.sectionTitle}>Exclusive Rewards</Text>
                    <Text style={styles.subTitle}>
                        Unlock savings on your next order
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

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.6, 1, 0.6],
                        extrapolate: 'clamp',
                    })

                    return (
                        <Animated.View
                            key={item._id || index}
                            style={[styles.cardWrapper, { opacity }]}
                        >
                            <LinearGradient
                                colors={['#1A2980', '#26D0CE']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.card}
                            >
                                <View style={styles.leftPortion}>
                                    <Text style={styles.discountValue}>
                                        {item.type !== 'FIXED_AMOUNT'
                                            ? `${item.value}%`
                                            : `₹${item.value}`}
                                    </Text>
                                    <Text style={styles.offLabel}>REWARD</Text>
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
                                            Min. spend ₹
                                            {item.minPurchaseAmount || 0}
                                        </Text>
                                    </View>

                                    <View style={styles.footer}>
                                        <View style={styles.expiryBox}>
                                            <MaterialCommunityIcons
                                                name="clock-outline"
                                                size={12}
                                                color="#FFF"
                                            />
                                            <Text style={styles.expiryText}>
                                                {formatExpiry(item.validUntil)}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => handleNavigation(item)}
                                            activeOpacity={0.7}
                                            style={styles.applyBtn}
                                        >
                                            <Text style={styles.applyBtnText}>
                                                {item.status ? 'VIEW' : 'CLAIM'}
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
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
    subTitle: { fontSize: 11, color: '#8E8E93', marginTop: 1 },
    viewAllBtn: { paddingVertical: 4 },
    viewAll: { color: COLORS.primary, fontWeight: '700', fontSize: 12 },
    scrollContainer: { paddingHorizontal: 20 },
    cardWrapper: {
        width: CARD_WIDTH,
        marginRight: SPACING,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: { elevation: 4 },
        }),
    },
    card: {
        height: 100,
        borderRadius: 12,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    leftPortion: {
        width: '28%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    discountValue: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    offLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 8,
        fontWeight: '900',
        marginTop: -2,
    },
    dividerContainer: {
        width: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dashedLine: {
        flex: 1,
        width: 1,
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.3)',
        borderStyle: 'dashed',
        marginVertical: 10,
    },
    circleNotchTop: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#F8F9FB', // Matches background
        position: 'absolute',
        top: -8,
        left: -8,
    },
    circleNotchBottom: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#F8F9FB', // Matches background
        position: 'absolute',
        bottom: -8,
        left: -8,
    },
    rightPortion: { flex: 1, padding: 12, justifyContent: 'space-between' },
    couponTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
    minSpend: { color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    expiryBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
    },
    expiryText: {
        color: '#FFF',
        fontSize: 9,
        fontWeight: '700',
        marginLeft: 3,
    },
    applyBtn: {
        backgroundColor: '#fff',
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    applyBtnText: { color: '#1A2980', fontSize: 10, fontWeight: '800' },
    loader: { height: 100, justifyContent: 'center', alignItems: 'center' },
})

export default memo(CouponCarousel)