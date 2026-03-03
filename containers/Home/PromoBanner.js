import React, { useState, useEffect, useRef } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    TouchableOpacity,
    ImageBackground,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

const { width } = Dimensions.get('window')
const CARD_WIDTH = width * 0.75
const CARD_MARGIN = 12
const FULL_STEP = CARD_WIDTH + CARD_MARGIN

const PromoBanner = ({ data }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const flatListRef = useRef(null)
    const timerRef = useRef(null)

    // Auto-slide logic (10 seconds)
    useEffect(() => {
        startAutoSlide()
        return () => stopAutoSlide() // Cleanup on unmount
    }, [currentIndex, data])

    const startAutoSlide = () => {
        stopAutoSlide()
        timerRef.current = setInterval(() => {
            if (data && data.length > 0) {
                const nextIndex = (currentIndex + 1) % data.length
                flatListRef.current?.scrollToOffset({
                    offset: nextIndex * FULL_STEP,
                    animated: true,
                })
            }
        }, 10000) // 10 seconds
    }

    const stopAutoSlide = () => {
        if (timerRef.current) clearInterval(timerRef.current)
    }

    const onScroll = (event) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width
        const index = event.nativeEvent.contentOffset.x / FULL_STEP
        const roundIndex = Math.round(index)
        if (roundIndex !== currentIndex) {
            setCurrentIndex(roundIndex)
        }
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity activeOpacity={0.95} style={styles.cardContainer}>
                <ImageBackground
                    source={{ uri: item.imageUrl }}
                    style={styles.backgroundImage}
                    imageStyle={styles.imageRadius}
                >
                    <LinearGradient
                        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
                        style={styles.gradientOverlay}
                    >
                        <View style={styles.content}>
                            <View>
                                {item.description && (
                                    <Text style={styles.label}>
                                        {item.description.toUpperCase()}
                                    </Text>
                                )}
                                <Text style={styles.title} numberOfLines={2}>
                                    {item.title}
                                </Text>
                            </View>

                            <View style={styles.footer}>
                                <TouchableOpacity style={styles.shopBtn}>
                                    <Text style={styles.shopText}>
                                        Shop Now
                                    </Text>
                                </TouchableOpacity>

                                {item.imageAlt ? (
                                    <Text style={styles.altText}>
                                        {item.imageAlt}
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                    </LinearGradient>
                </ImageBackground>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>Trending Offers</Text>

                {/* Pagination Dots */}
                <View style={styles.dotContainer}>
                    {data?.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                currentIndex === index
                                    ? styles.activeDot
                                    : styles.inactiveDot,
                            ]}
                        />
                    ))}
                </View>
            </View>

            <FlatList
                ref={flatListRef}
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                horizontal
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                snapToInterval={FULL_STEP}
                decelerationRate="fast"
                contentContainerStyle={styles.listPadding}
                onScrollBeginDrag={stopAutoSlide} // Pause auto-slide when user touches
                onScrollEndDrag={startAutoSlide} // Resume when they let go
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    headerRow: {
        paddingHorizontal: 20,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1a1a1a',
        letterSpacing: 0.5,
    },
    dotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        height: 6,
        borderRadius: 3,
        marginHorizontal: 3,
    },
    activeDot: {
        width: 16,
        backgroundColor: '#000',
    },
    inactiveDot: {
        width: 6,
        backgroundColor: '#ccc',
    },
    listPadding: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    cardContainer: {
        width: CARD_WIDTH,
        height: 120, // Increased height slightly for better aspect ratio
        marginRight: CARD_MARGIN,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    imageRadius: {
        borderRadius: 20,
    },
    gradientOverlay: {
        flex: 1,
        borderRadius: 20,
        padding: 20,
        justifyContent: 'flex-end',
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    label: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 4,
        opacity: 0.8,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        lineHeight: 28,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    shopBtn: {
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 30,
    },
    shopText: {
        color: '#000',
        fontWeight: '800',
        fontSize: 13,
    },
    altText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontStyle: 'italic',
    },
})

export default PromoBanner
