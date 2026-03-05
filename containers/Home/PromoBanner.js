import React, { useState, useEffect, useRef } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ImageBackground,
    Animated,
    Platform,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

const { width } = Dimensions.get('window')
const CARD_WIDTH = width * 0.82 // Slightly narrower to show a peek of the next card
const CARD_MARGIN = 10
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN

const PromoBanner = ({ data }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const flatListRef = useRef(null)
    const scrollX = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (!data || data.length <= 1) return
        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % data.length
            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            })
        }, 6000)
        return () => clearInterval(interval)
    }, [currentIndex, data])

    const renderItem = ({ item }) => (
        <TouchableOpacity activeOpacity={0.9} style={styles.cardContainer}>
            <ImageBackground
                source={{ uri: item.imageUrl }}
                style={styles.backgroundImage}
                imageStyle={styles.imageRadius}
            >
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.gradient}
                >
                    <View style={styles.content}>
                        <Text style={styles.label}>
                            {item.description?.toUpperCase() || 'OFFER'}
                        </Text>
                        <Text style={styles.title} numberOfLines={1}>
                            {item.title}
                        </Text>

                        <View style={styles.footer}>
                            <View style={styles.miniBtn}>
                                <Text style={styles.btnText}>Shop Now</Text>
                            </View>
                            {item.imageAlt && (
                                <Text style={styles.altText}>
                                    {item.imageAlt}
                                </Text>
                            )}
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </TouchableOpacity>
    )

    return (
        <View style={styles.wrapper}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Trending</Text>
                <View style={styles.dotContainer}>
                    {data.map((_, i) => {
                        const dotWidth = scrollX.interpolate({
                            inputRange: [
                                (i - 1) * SNAP_INTERVAL,
                                i * SNAP_INTERVAL,
                                (i + 1) * SNAP_INTERVAL,
                            ],
                            outputRange: [4, 12, 4],
                            extrapolate: 'clamp',
                        })
                        return (
                            <Animated.View
                                key={i}
                                style={[styles.dot, { width: dotWidth }]}
                            />
                        )
                    })}
                </View>
            </View>

            <Animated.FlatList
                ref={flatListRef}
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                horizontal
                snapToInterval={SNAP_INTERVAL}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    {
                        useNativeDriver: false,
                        listener: (e) =>
                            setCurrentIndex(
                                Math.round(
                                    e.nativeEvent.contentOffset.x /
                                        SNAP_INTERVAL
                                )
                            ),
                    }
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: { marginVertical: 10 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 10,
        alignItems: 'center',
    },
    headerTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
    dotContainer: { flexDirection: 'row' },
    dot: {
        height: 4,
        borderRadius: 2,
        backgroundColor: '#004AAD',
        marginHorizontal: 2,
    },
    cardContainer: {
        width: CARD_WIDTH,
        height: 140,
        marginRight: CARD_MARGIN,
        borderRadius: 16,
        overflow: 'hidden',
    },
    backgroundImage: { flex: 1 },
    imageRadius: { borderRadius: 16 },
    gradient: { flex: 1, padding: 15, justifyContent: 'flex-end' },
    label: {
        color: '#FFD700',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: 2,
    },
    title: { color: '#FFF', fontSize: 18, fontWeight: '700' },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    miniBtn: {
        backgroundColor: '#FFF',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    btnText: { color: '#000', fontSize: 11, fontWeight: '700' },
    altText: { color: 'rgba(255,255,255,0.5)', fontSize: 10 },
})

export default PromoBanner
