import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Dimensions,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCategoriesList } from '../redux/features/Products/ProductSlice'
import { useTheme } from '../theme/ThemeProvider'
import { COLORS } from '../constants'

const { width } = Dimensions.get('window')

const CategoriesScreen = ({ navigation }) => {
    const dispatch = useDispatch()
    const { colors, dark } = useTheme()
    const { categoriesList, isFetchingCategories } = useSelector(
        (state) => state.product
    )
    const [activeTab, setActiveTab] = useState(null)

    useEffect(() => {
        dispatch(fetchCategoriesList())
    }, [dispatch])

    useEffect(() => {
        if (categoriesList?.length > 0 && !activeTab) {
            setActiveTab(categoriesList[0])
        }
    }, [categoriesList, activeTab])

    const renderSidebar = ({ item }) => {
        const isActive = activeTab?.category === item.category
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={[
                    styles.sideItem,
                    {
                        backgroundColor: isActive
                            ? colors.background
                            : 'transparent',
                    },
                    isActive && styles.activeSideItem,
                ]}
                onPress={() => setActiveTab(item)}
            >
                {isActive && (
                    <View
                        style={[
                            styles.activeIndicator,
                            { backgroundColor: COLORS.primary },
                        ]}
                    />
                )}
                <Text
                    style={[
                        styles.sideText,
                        {
                            color: isActive
                                ? COLORS.primary
                                : colors.grayscale700,
                        },
                        isActive && styles.activeSideText,
                    ]}
                >
                    {item.category}
                </Text>
            </TouchableOpacity>
        )
    }

    if (isFetchingCategories && !categoriesList?.length) {
        return (
            <View
                style={[styles.loader, { backgroundColor: colors.background }]}
            >
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        )
    }

    return (
        <View
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            {/* Left Sidebar */}
            <View
                style={[
                    styles.sidebar,
                    {
                        backgroundColor: dark ? COLORS.dark2 : '#F5F7F9',
                        borderRightColor: dark ? COLORS.dark3 : '#E5E9EF',
                    },
                ]}
            >
                <FlatList
                    data={categoriesList}
                    renderItem={renderSidebar}
                    keyExtractor={(item) => item.category}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            {/* Right Content */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.contentHeader}>
                    <Text style={[styles.header, { color: colors.text }]}>
                        {activeTab?.category}
                    </Text>
                    <Text
                        style={[
                            styles.itemCount,
                            { color: colors.grayscale400 },
                        ]}
                    >
                        {activeTab?.subcategories?.length || 0} Subcategories
                    </Text>
                </View>

                <View style={styles.grid}>
                    {activeTab?.subcategories?.map((sub, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.subCard}
                            activeOpacity={0.7}
                            onPress={() =>
                                navigation.navigate('AllProducts', {
                                    subCategory: sub,
                                    categoryName: sub,
                                })
                            }
                        >
                            <View
                                style={[
                                    styles.subIcon,
                                    {
                                        backgroundColor: dark
                                            ? COLORS.dark3
                                            : '#F0F3F8',
                                    },
                                ]}
                            >
                                {/* Using the first letter as a placeholder, but styled like an icon */}
                                <Text
                                    style={[
                                        styles.iconText,
                                        { color: COLORS.primary },
                                    ]}
                                >
                                    {sub[0].toUpperCase()}
                                </Text>
                            </View>
                            <Text
                                style={[styles.subText, { color: colors.text }]}
                                numberOfLines={2}
                            >
                                {sub}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    sidebar: {
        width: width * 0.28,
        borderRightWidth: 1,
    },
    sideItem: {
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        position: 'relative',
    },
    activeSideItem: {
        // Shadow for the active item to make it "pop"
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
    },
    activeIndicator: {
        position: 'absolute',
        left: 0,
        width: 4,
        height: 30,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
    },
    sideText: {
        fontSize: 12,
        textAlign: 'center',
        fontFamily: 'medium',
    },
    activeSideText: {
        fontFamily: 'bold',
    },
    content: { flex: 1, paddingHorizontal: 16 },
    contentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginTop: 20,
        marginBottom: 20,
    },
    header: {
        fontSize: 18,
        fontFamily: 'bold',
    },
    itemCount: {
        fontSize: 11,
        fontFamily: 'regular',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    subCard: {
        width: '33%', // 3 Items per row
        alignItems: 'center',
        marginBottom: 25,
    },
    subIcon: {
        width: 65,
        height: 65,
        borderRadius: 12, // Modern "Squircle"
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconText: {
        fontSize: 20,
        fontFamily: 'bold',
    },
    subText: {
        fontSize: 11,
        textAlign: 'center',
        fontFamily: 'medium',
        paddingHorizontal: 4,
    },
})

export default CategoriesScreen
