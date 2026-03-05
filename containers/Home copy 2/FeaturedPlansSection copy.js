import React from 'react'
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
import { useTheme } from '../../theme/ThemeProvider'

const { width } = Dimensions.get('window')

// Calculates card dimensions to show ~2.2 cards on screen, encouraging horizontal scroll.
const CARD_WIDTH = (width - 40) / 2.2
const CARD_MARGIN = 12

const PlanCard = ({ item, dark }) => {
    const gradientColors = dark
        ? ['#2C2C2E', '#1C1C1E']
        : ['#FFFBF4', '#F4F5F7']

    return (
        <TouchableOpacity
            style={[
                styles.card,
                {
                    borderColor: '#FFD166', // Golden border for featured plans
                },
            ]}
            activeOpacity={0.8}
            testID={`featured-plan-${item.id}`}
            accessibilityRole="button"
            accessibilityLabel={`${item.name}, ${item.speed}, ${item.description}, $${item.price} per month`}
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
                        {item.name}
                    </Text>

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
                        {item.speed}
                    </Text>

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
                        {item.description}
                    </Text>

                    <View style={styles.featuresList}>
                        <View style={styles.featureItem}>
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
                                Unlimited Data
                            </Text>
                        </View>
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
                            ${item.price}
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
                            / month
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

const FeaturedPlansSection = ({ data, onPressSeeAll }) => {
    const { dark } = useTheme()

    return (
        <View style={styles.container}>
            <SubHeaderItem
                title="Featured Plans"
                navTitle="See all"
                onPress={onPressSeeAll}
            />
            <FlatList
                data={data}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <PlanCard item={item} dark={dark} />}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    )
}

FeaturedPlansSection.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            name: PropTypes.string.isRequired,
            speed: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            price: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
        })
    ).isRequired,
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
        // height: CARD_WIDTH * 1.2,
        height: 240,
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
        fontSize: 20,
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
        gap: 6,
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
        fontSize: 22,
        fontFamily: FONTS.bold,
        marginRight: 4,
    },
    priceSuffix: {
        fontSize: 14,
        fontFamily: FONTS.regular,
    },
    selectButton: {
        marginTop: 12,
        backgroundColor: '#335EF7',
        paddingVertical: 8,
        borderRadius: 10,
        alignItems: 'center',
    },
    selectButtonText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
})

export default React.memo(FeaturedPlansSection)
