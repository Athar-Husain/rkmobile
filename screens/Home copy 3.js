import React from 'react'
import {
    ScrollView,
    StyleSheet,
    View,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { images } from '../constants'
import ProductGrid from '../containers/Home/ProductGrid'
import PromoBanner from '../containers/Home/PromoBanner'
import OfferCarousel from '../containers/Home/OfferCarousel'

const Home = () => {
    // Categories for quick navigation
    const categories = [
        { name: 'AC', icon: 'air-conditioner' },
        { name: 'TV', icon: 'television' },
        { name: 'Washing', icon: 'washing-machine' },
        { name: 'Audio', icon: 'speaker-wireless' },
        { name: 'Kitchen', icon: 'fridge' },
    ]

    return (
        <View style={styles.mainContainer}>
            {/* 1. Custom Sticky Header */}
            <View style={styles.header}>
                <Image source={images.logo} style={styles.logo} />
                <View style={styles.searchBar}>
                    <MaterialCommunityIcons
                        name="magnify"
                        size={20}
                        color="#888"
                    />
                    <TextInput
                        placeholder="Search electronics..."
                        style={styles.searchInput}
                    />
                </View>
                <TouchableOpacity>
                    <MaterialCommunityIcons
                        name="cart-outline"
                        size={28}
                        color="#1e3c72"
                    />
                    <View style={styles.cartBadge}>
                        <Text style={styles.badgeText}>2</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
            >
                {/* 2. Promo Cashback Banner */}
                <PromoBanner data={promoData} />

                {/* 3. Category Quick Links */}
                <View style={styles.catSection}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {categories.map((cat, i) => (
                            <TouchableOpacity key={i} style={styles.catItem}>
                                <View style={styles.catIcon}>
                                    <MaterialCommunityIcons
                                        name={cat.icon}
                                        size={24}
                                        color="#1e3c72"
                                    />
                                </View>
                                <Text style={styles.catText}>{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* 4. Seasonal Offers */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Exclusive Seasonal Offers
                    </Text>
                    <Text style={styles.viewAll}>View All</Text>
                </View>
                <OfferCarousel offers={offers} />

                {/* 5. Trending Deals */}
                <ProductGrid deals={deals} />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#f8f9fb' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
    },
    logo: { width: 40, height: 40, resizeMode: 'contain' },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#f0f2f5',
        marginHorizontal: 15,
        borderRadius: 10,
        paddingHorizontal: 10,
        alignItems: 'center',
        height: 40,
    },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 14 },
    cartBadge: {
        position: 'absolute',
        right: -5,
        top: -5,
        backgroundColor: '#E91E63',
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    catSection: { marginTop: 20, paddingLeft: 15 },
    catItem: { alignItems: 'center', marginRight: 20 },
    catIcon: {
        width: 50,
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    catText: { fontSize: 11, marginTop: 5, color: '#444', fontWeight: '600' },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
    viewAll: { color: '#1e3c72', fontWeight: 'bold' },
})

export default Home
