import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ScrollView,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCategoriesList } from '../redux/features/Products/ProductSlice'

const CategoriesScreen = ({ navigation }) => {
    const dispatch = useDispatch()
    const { categoriesList } = useSelector((state) => state.product)
    const [activeTab, setActiveTab] = useState(null)

    useEffect(() => {
        dispatch(fetchCategoriesList())
    }, [])

    useEffect(() => {
        if (categoriesList.length > 0 && !activeTab) {
            setActiveTab(categoriesList[0])
        }
    }, [categoriesList])

    const renderSidebar = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.sideItem,
                activeTab?.category === item.category && styles.activeSideItem,
            ]}
            onPress={() => setActiveTab(item)}
        >
            <Text
                style={[
                    styles.sideText,
                    activeTab?.category === item.category &&
                        styles.activeSideText,
                ]}
            >
                {item.category}
            </Text>
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            <View style={styles.sidebar}>
                <FlatList
                    data={categoriesList}
                    renderItem={renderSidebar}
                    keyExtractor={(item) => item.category}
                />
            </View>
            <ScrollView style={styles.content}>
                <Text style={styles.header}>{activeTab?.category}</Text>
                <View style={styles.grid}>
                    {activeTab?.subcategories?.map((sub, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.subCard}
                            onPress={() =>
                                navigation.navigate('AllProducts', {
                                    subCategory: sub,
                                })
                            }
                        >
                            <View style={styles.subIcon}>
                                <Text style={styles.iconText}>{sub[0]}</Text>
                            </View>
                            <Text style={styles.subText}>{sub}</Text>
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
        backgroundColor: '#f0f2f5',
        borderRightWidth: 1,
        borderColor: '#e0e0e0',
    },
    sideItem: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    activeSideItem: {
        backgroundColor: '#fff',
        borderLeftWidth: 4,
        borderLeftColor: '#1e3c72',
    },
    sideText: { fontSize: 12, color: '#666', textAlign: 'center' },
    activeSideText: { color: '#1e3c72', fontWeight: 'bold' },
    content: { flex: 1, padding: 15 },
    header: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    subCard: { width: '30%', alignItems: 'center', marginBottom: 20 },
    subIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#e8ecf2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: { fontWeight: 'bold', color: '#1e3c72' },
    subText: { fontSize: 11, textAlign: 'center', marginTop: 5 },
})

export default CategoriesScreen
