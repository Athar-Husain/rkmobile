import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCategoriesList } from '../redux/features/Product/ProductSlice'

const CategoriesScreen = ({ navigation }) => {
    const dispatch = useDispatch()
    const { categoriesList, isFetchingCategories } = useSelector(
        (state) => state.product
    )
    const [selectedCategory, setSelectedCategory] = useState(null)

    useEffect(() => {
        dispatch(fetchCategoriesList())
    }, [dispatch])

    useEffect(() => {
        if (categoriesList.length > 0 && !selectedCategory) {
            setSelectedCategory(categoriesList[0])
        }
    }, [categoriesList])

    const renderSidebarItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.sidebarItem,
                selectedCategory?.category === item.category &&
                    styles.activeSidebar,
            ]}
            onPress={() => setSelectedCategory(item)}
        >
            <Text
                style={[
                    styles.sidebarText,
                    selectedCategory?.category === item.category &&
                        styles.activeText,
                ]}
            >
                {item.category}
            </Text>
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            {/* Left Sidebar */}
            <View style={styles.sidebar}>
                <FlatList
                    data={categoriesList}
                    renderItem={renderSidebarItem}
                    keyExtractor={(item) => item.category}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            {/* Right Content */}
            <ScrollView style={styles.mainContent}>
                <Text style={styles.contentTitle}>
                    {selectedCategory?.category}
                </Text>
                <View style={styles.subCatGrid}>
                    {selectedCategory?.subcategories?.map((sub, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.subCatCard}
                            onPress={() =>
                                navigation.navigate('AllProducts', {
                                    category: sub,
                                })
                            }
                        >
                            <View style={styles.subCatCircle}>
                                <Text style={styles.subCatInitial}>
                                    {sub[0]}
                                </Text>
                            </View>
                            <Text style={styles.subCatLabel}>{sub}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row', backgroundColor: '#fff' },
    sidebar: {
        width: '30%',
        backgroundColor: '#f5f7fa',
        borderRightWidth: 1,
        borderColor: '#e0e0e0',
    },
    sidebarItem: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderLeftWidth: 4,
        borderLeftColor: 'transparent',
    },
    activeSidebar: { backgroundColor: '#fff', borderLeftColor: '#1e3c72' },
    sidebarText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
        textAlign: 'center',
    },
    activeText: { color: '#1e3c72', fontWeight: '800' },
    mainContent: { flex: 1, padding: 15 },
    contentTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 20,
        color: '#333',
    },
    subCatGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    subCatCard: { width: '30%', alignItems: 'center', marginBottom: 20 },
    subCatCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f0f2f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    subCatInitial: { fontSize: 20, fontWeight: 'bold', color: '#1e3c72' },
    subCatLabel: { fontSize: 11, textAlign: 'center', color: '#444' },
})

export default CategoriesScreen
