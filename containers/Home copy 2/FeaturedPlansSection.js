// components/FeaturedPlansSection.js

import React, { useEffect } from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/Ionicons'
import { LinearGradient } from 'expo-linear-gradient'

import { COLORS, FONTS } from '../../constants'
import SubHeaderItem from '../../components/SubHeaderItem'
import { getAllPlans } from '../../redux/features/Plan/PlanSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '../../theme/ThemeProvider'

const { width } = Dimensions.get('window')

// Calculates card dimensions to show ~2.2 cards on screen horizontally
const CARD_WIDTH = (width - 40) / 2.2
const CARD_MARGIN = 12

const PlanCard = ({ item, dark }) => {
    // Defensive extraction
    const planName = item?.name || 'Unknown Plan'
    const internetSpeed = item?.internetSpeed ?? ''
    const internetSpeedUnit = item?.internetSpeedUnit ?? ''
    const description = item?.description || 'No description available'
    const price = item?.price != null ? `₹${item.price}` : '--'
    const duration = item?.duration ? item.duration.replace('_', ' ') : '--'
    const features = Array.isArray(item?.features)
        ? item.features.slice(0, 2)
        : []

    const gradientColors = dark
        ? ['#2C2C2E', '#1C1C1E']
        : ['#FFFBF4', '#F4F5F7']

    return (
        <TouchableOpacity
            style={[styles.card, { borderColor: '#FFD166' }]}
            activeOpacity={0.8}
            testID={`featured-plan-${item?._id || ''}`}
        >
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientOverlay}
            >
                <View style={styles.contentContainer}>
                    <Text
                        style={[
                            styles.name,
                            {
                                color: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                        numberOfLines={1}
                    >
                        {planName}
                    </Text>
                    {internetSpeed !== '' && (
                        <Text
                            style={[
                                styles.speed,
                                {
                                    color: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                },
                            ]}
                        >
                            {`${internetSpeed} ${internetSpeedUnit}`}
                        </Text>
                    )}
                    <Text
                        style={[
                            styles.description,
                            {
                                color: dark
                                    ? COLORS.greyscale500
                                    : COLORS.greyscale700,
                            },
                        ]}
                        numberOfLines={2}
                    >
                        {description}
                    </Text>

                    <View style={styles.featuresList}>
                        {features.length > 0 ? (
                            features.map((feature, index) => (
                                <View key={index} style={styles.featureItem}>
                                    <Icon
                                        name="checkmark-circle"
                                        size={14}
                                        color="#14C9A0"
                                    />
                                    <Text
                                        style={[
                                            styles.featureText,
                                            {
                                                color: dark
                                                    ? COLORS.white
                                                    : COLORS.greyscale900,
                                            },
                                        ]}
                                    >
                                        {feature}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <View style={styles.featureItem}>
                                <Text
                                    style={[
                                        styles.featureText,
                                        {
                                            color: dark
                                                ? COLORS.greyscale500
                                                : COLORS.greyscale700,
                                        },
                                    ]}
                                >
                                    No features listed.
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.priceContainer}>
                        <Text
                            style={[
                                styles.price,
                                {
                                    color: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                },
                            ]}
                        >
                            {price}
                        </Text>
                        <Text
                            style={[
                                styles.priceSuffix,
                                {
                                    color: dark
                                        ? COLORS.greyscale500
                                        : COLORS.greyscale700,
                                },
                            ]}
                        >
                            / {duration}
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.selectButton}>
                        <Text style={styles.selectButtonText}>Select Plan</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    )
}

const FeaturedPlansSection = ({ onPressSeeAll }) => {
    const dispatch = useDispatch()
    const { dark } = useTheme()

    const { allPlans, loading, error } = useSelector((state) => state.plan)

    useEffect(() => {
        dispatch(getAllPlans())
    }, [dispatch])

    const featuredPlans = Array.isArray(allPlans)
        ? allPlans.filter((plan) => plan.featured)
        : []

    return (
        <View style={styles.container}>
            <SubHeaderItem
                title="Featured Plans"
                navTitle="See all"
                onPress={onPressSeeAll}
            />
            {loading && (
                <Text style={{ textAlign: 'center', marginVertical: 20 }}>
                    Loading plans...
                </Text>
            )}
            {!loading && error && (
                <Text
                    style={{
                        textAlign: 'center',
                        marginVertical: 20,
                        color: COLORS.red,
                    }}
                >
                    Error loading plans: {error}
                </Text>
            )}
            <FlatList
                data={featuredPlans}
                horizontal
                keyExtractor={(item) =>
                    item?._id?.toString() || Math.random().toString()
                }
                renderItem={({ item }) => <PlanCard item={item} dark={dark} />}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    )
}

FeaturedPlansSection.propTypes = {
    onPressSeeAll: PropTypes.func,
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    listContainer: {
        paddingHorizontal: 20,
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_WIDTH * 1.6,
        borderRadius: 16,
        borderWidth: 1,
        marginRight: CARD_MARGIN,
        justifyContent: 'flex-end',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 6,
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 16,
        padding: 16,
        justifyContent: 'flex-end',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    name: {
        fontSize: 16,
        fontFamily: FONTS.bold,
        marginBottom: 4,
    },
    speed: {
        fontSize: 15,
        fontFamily: FONTS.bold,
        marginBottom: 8,
    },
    description: {
        fontSize: 13,
        fontFamily: FONTS.regular,
        marginBottom: 8,
    },
    featuresList: {
        marginBottom: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    featureText: {
        marginLeft: 8,
        fontSize: 11,
        fontFamily: FONTS.regular,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 8,
    },
    price: {
        fontSize: 15,
        fontFamily: FONTS.bold,
        marginRight: 4,
    },
    priceSuffix: {
        fontSize: 10,
        fontFamily: FONTS.regular,
    },
    selectButton: {
        marginTop: 12,
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    selectButtonText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
})

export default React.memo(FeaturedPlansSection)
