// HomeBannerSection.js
import React, { useState } from 'react'
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    Dimensions,
} from 'react-native'
import { banners, COLORS } from '../constants'

const { width } = Dimensions.get('window')

const HomeBannerSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0)

    return (
        <View style={styles.HomeBannerSection}>
            <FlatList
                data={banners}
                renderItem={({ item }) => (
                    <View style={styles.bannerContainer}>
                        <View>
                            <Text style={styles.bannerTopTitle}>
                                {item.discountName}
                            </Text>
                            <Text style={styles.bannerTopSubtitle}>
                                {item.bottomSubtitle}
                            </Text>
                        </View>
                        <Text style={styles.bannerDiscount}>
                            {item.discount} OFF
                        </Text>
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    const newIndex = Math.round(
                        event.nativeEvent.contentOffset.x / (width - 32)
                    )
                    setCurrentIndex(newIndex)
                }}
            />
            <View style={styles.dotContainer}>
                {banners.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            index === currentIndex ? styles.activeDot : null,
                        ]}
                    />
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    // Add all relevant banner and dot styles from Home.js here
    HomeBannerSection: {
        marginBottom: 20,
    },
    bannerContainer: {
        width: width - 32,
        height: 120,
        borderRadius: 16,
        padding: 20,
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bannerTopTitle: {
        fontFamily: 'semiBold',
        fontSize: 16,
        color: COLORS.white,
    },
    bannerTopSubtitle: {
        fontFamily: 'medium',
        fontSize: 12,
        color: COLORS.white,
        marginTop: 4,
    },
    bannerDiscount: {
        fontFamily: 'bold',
        fontSize: 24,
        color: COLORS.white,
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.greyscale400,
        marginHorizontal: 4,
    },
    activeDot: {
        width: 14,
        backgroundColor: COLORS.primary,
    },
})

export default HomeBannerSection
