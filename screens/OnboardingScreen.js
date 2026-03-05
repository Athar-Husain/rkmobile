import React, { useRef, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native'
import PagerView from 'react-native-pager-view'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    Extrapolate,
    useDerivedValue,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, images } from '../constants' // Adjust path

import { markOnboardingComplete } from '../redux/features/Auth/AuthSlice'
import { useDispatch } from 'react-redux'

const { width } = Dimensions.get('window')

/**
 * We wrap PagerView in Reanimated's handler to track
 * the exact swipe position in real-time.
 */
const AnimatedPagerView = Animated.createAnimatedComponent(PagerView)

const OnboardingScreen = ({ navigation, data }) => {
    const dispatch = useDispatch()
    const pagerRef = useRef(null)
    const insets = useSafeAreaInsets()
    const [currentPage, setCurrentPage] = useState(0)

    // Reanimated Shared Values to track swipe progress
    const scrollOffset = useSharedValue(0)
    const position = useSharedValue(0)

    /**
     * Total progress is calculated by combining current page position
     * and the swipe offset. A value of 1.5 means user is halfway
     * swiping between page 1 and page 2.
     */
    const combinedProgress = useDerivedValue(() => {
        return position.value + scrollOffset.value
    })

    const onPageScroll = (e) => {
        position.value = e.nativeEvent.position
        scrollOffset.value = e.nativeEvent.offset
    }

    const onPageSelected = (e) => {
        const page = e.nativeEvent.position
        setCurrentPage(page)
        // HAPTICS UX: Tiny pulse on actual page change
        Haptics.selectionAsync()
    }
    const handleSkip = () => {
        dispatch(markOnboardingComplete())
        // navigation.replace('Auth')
    }

    const handleNext = () => {
        if (currentPage < data.length - 1) {
            // Smoothly animate to the next page
            pagerRef.current?.setPage(currentPage + 1)
        } else {
            dispatch(markOnboardingComplete())
            // navigation.replace('Welcome') // Navigate to your fixed Welcome screen
        }
    }

    // ANIMATION STYLE: Text Content
    const animatedTextContentStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            combinedProgress.value,
            [currentPage - 1, currentPage, currentPage + 1],
            [0, 1, 0],
            Extrapolate.CLAMP
        )

        const translateY = interpolate(
            combinedProgress.value,
            [currentPage - 1, currentPage, currentPage + 1],
            [30, 0, -30],
            Extrapolate.CLAMP
        )

        return {
            opacity,
            transform: [{ translateY }],
        }
    })

    return (
        <View style={styles.container}>
            {/* Safe Area Top Padding */}
            <View style={{ height: insets.top }} />

            {/* Skip Button (Keeps its theme, doesn't animate) */}
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.skipBtn}
                onPress={() => handleSkip()}
            >
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <AnimatedPagerView
                ref={pagerRef}
                style={styles.pagerView}
                initialPage={0}
                onPageScroll={onPageScroll}
                onPageSelected={onPageSelected}
            >
                {data.map((item, index) => (
                    <View key={item.id} style={styles.page}>
                        {/* 1. Dynamic Background Transition */}
                        <LinearGradient
                            colors={item.bgGradient}
                            style={StyleSheet.absoluteFill}
                        />

                        {/* 2. Image Section (Slides natives) */}
                        <View style={styles.imageContainer}>
                            <Image
                                source={images[item.image]}
                                style={styles.image}
                            />
                        </View>

                        {/* 3. Animated Text Section */}
                        <Animated.View
                            style={[
                                styles.textContainer,
                                animatedTextContentStyle,
                            ]}
                        >
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.subTitle}>{item.subTitle}</Text>
                            <Text style={styles.description}>
                                {item.description}
                            </Text>
                        </Animated.View>
                    </View>
                ))}
            </AnimatedPagerView>

            {/* shared Footer Section */}
            <View
                style={[styles.footer, { paddingBottom: insets.bottom + 30 }]}
            >
                {/* Dynamic Pagination Dots */}
                <View style={styles.dotContainer}>
                    {data.map((_, index) => {
                        // REANIMATED: Dots animate width during swipe
                        const dotWidth = useAnimatedStyle(() => {
                            const width = interpolate(
                                combinedProgress.value,
                                [index - 1, index, index + 1],
                                [8, 20, 8],
                                Extrapolate.CLAMP
                            )
                            const opacity = interpolate(
                                combinedProgress.value,
                                [index - 1, index, index + 1],
                                [0.4, 1, 0.4],
                                Extrapolate.CLAMP
                            )
                            return { width, opacity }
                        })

                        return (
                            <Animated.View
                                key={index}
                                style={[
                                    styles.dot,
                                    dotWidth,
                                    { backgroundColor: COLORS.primary },
                                ]}
                            />
                        )
                    })}
                </View>

                {/* Modern LinearGradient Button */}
                <TouchableOpacity onPress={handleNext}>
                    <LinearGradient
                        colors={[COLORS.primary, '#335EF7']}
                        style={styles.nextBtn}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.nextBtnText}>
                            {currentPage === data.length - 1
                                ? 'Get Started'
                                : 'Next'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    skipBtn: {
        alignSelf: 'flex-end',
        paddingHorizontal: 20,
        paddingVertical: 10,
        zIndex: 10,
    },
    skipText: { fontSize: 16, color: '#A0A3BD', fontWeight: '700' },
    pagerView: { flex: 1 },
    page: { alignItems: 'center', position: 'relative' },
    imageContainer: { flex: 0.55, justifyContent: 'center', marginTop: -20 },
    image: { width: 280, height: 280, resizeMode: 'contain' },
    textContainer: { flex: 0.4, alignItems: 'center', paddingHorizontal: 30 },
    title: {
        fontSize: 13,
        textAlign: 'center',
        color: '#64748B',
        fontFamily: 'regular',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    subTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: COLORS.black,
        marginTop: 4,
        letterSpacing: -1,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#64748B',
        lineHeight: 26,
        marginTop: 15,
        fontFamily: 'regular',
    },
    footer: {
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    dotContainer: { flexDirection: 'row' },
    dot: { height: 8, borderRadius: 4, marginHorizontal: 4 },
    nextBtn: { paddingHorizontal: 32, paddingVertical: 18, borderRadius: 20 },
    nextBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 1,
    },
})

export default OnboardingScreen
