import React, { useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    ActivityIndicator,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import { fetchActivePromotions, fetchPromotionsForUser } from '../../redux/features/Promotion/PromotionSlice'
import { COLORS } from '../../constants'

const { width } = Dimensions.get('window')

const PromotionCarousel = ({ onPromotionPress }) => {
    const dispatch = useDispatch()

    const { promotions, isPromotionLoading, isPromotionError, message } =
        useSelector((state) => state.promotions)

    // Fetch promotions every time the screen is focused
    useFocusEffect(
        useCallback(() => {
            dispatch(fetchPromotionsForUser())
            dispatch(fetchActivePromotions())
        }, [dispatch])
    )

    console.log('promotions in carousel', promotions)

    if (isPromotionLoading) {
        return (
            <View style={[styles.loaderContainer, { width }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        )
    }

    if (!isPromotionLoading && isPromotionError) {
        return (
            <View style={[styles.loaderContainer, { width }]}>
                <Text style={[styles.errorText, { color: COLORS.red }]}>
                    {message || 'Failed to load promotions'}
                </Text>
            </View>
        )
    }

    if (!promotions || promotions.length === 0) return null

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 0 }}
            >
                {promotions.map((item) => (
                    <View key={item._id} style={styles.card}>
                        {item.bannerImage && (
                            <Image
                                source={{ uri: item.bannerImage }}
                                style={styles.image}
                            />
                        )}
                        <View style={styles.overlay}>
                            <Text style={styles.title} numberOfLines={2}>
                                {item.title}
                            </Text>
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={() =>
                                    onPromotionPress && onPromotionPress(item)
                                }
                            >
                                <Text style={styles.btnText}>Shop Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        width,
        height: 200,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        bottom: 20,
        left: 15,
        right: 15,
        backgroundColor: 'rgba(0,0,0,0.35)',
        padding: 15,
        borderRadius: 12,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    btn: {
        backgroundColor: COLORS.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
    },
    errorText: {
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
})

export default PromotionCarousel
