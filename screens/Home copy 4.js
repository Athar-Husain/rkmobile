import React from 'react'
import {
    ScrollView,
    StyleSheet,
    View,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// Sub-components (Assuming these are in your project structure)
// import PromoBanner from './PromoBanner'
import OfferCarousel from '../containers/Home/OfferCarousel'
import ProductGrid from '../containers/Home/ProductGrid'
import PromoBanner from '../containers/Home/PromoBanner'

// Simulated constants (Replace with your actual constants/images)
const images = {
    logo: { uri: 'https://via.placeholder.com/100' },
    promo1: { uri: 'https://via.placeholder.com/150' },
    ac: { uri: 'https://via.placeholder.com/150' },
    washer: { uri: 'https://via.placeholder.com/150' },
    tv: { uri: 'https://via.placeholder.com/150' },
    speaker: { uri: 'https://via.placeholder.com/150' },
}

const Home = () => {
    const promoData = [
        {
            type: 'CASHBACK',
            amount: '500',
            image: images.promo1,
        },
        {
            type: 'COUPON',
            code: 'SAVE20',
            discountValue: '20%',
            image: images.washer,
        },
        {
            type: 'PROMO',
            title: 'New Store Opening!',
            image: images.logo,
        },
    ]

    const coupons = [
        {
            id: 'c1',
            amount: '200',
            image: images.promo1,
            type: 'COUPON',
            code: 'SAVE200',
        },
        {
            id: 'c2',
            amount: '150',
            image: images.promo1,
            type: 'COUPON',
            code: 'ELECTRO150',
        },
    ]

    // Combine both arrays for the banner
    const bannerData = [...promoData, ...coupons]

    const offers = [
        {
            title: 'Summer AC Sale: Up to 20% Off',
            image: images.ac,
            bgColor: '#D0E8FF',
        },
        {
            title: 'Monsoon Offers on Washers',
            image: images.washer,
            bgColor: '#E0F2F1',
        },
    ]

    const deals = [
        {
            id: '1',
            name: 'Smart TV - 55 inch',
            price: '₹1,99,900',
            oldPrice: '₹2,50,000',
            image: images.tv,
            discount: '20% Off',
        },
        {
            id: '2',
            name: 'Bluetooth Soundbar',
            price: '₹12,500',
            oldPrice: '₹15,000',
            image: images.speaker,
            discount: '15% Off',
        },
        {
            id: '3',
            name: 'Split AC 1.5 Ton',
            price: '₹35,000',
            oldPrice: '₹42,000',
            image: images.ac,
            discount: '16% Off',
        },
        {
            id: '4',
            name: 'Top Load Washer',
            price: '₹18,900',
            oldPrice: '₹22,000',
            image: images.washer,
            discount: '14% Off',
        },
    ]

    const categories = [
        { name: 'AC', icon: 'air-conditioner' },
        { name: 'TV', icon: 'television' },
        { name: 'Washers', icon: 'washing-machine' },
        { name: 'Audio', icon: 'speaker-wireless' },
        { name: 'Kitchen', icon: 'fridge' },
    ]

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <Image source={images.logo} style={styles.logo} />
                <View style={styles.searchBar}>
                    <MaterialCommunityIcons
                        name="magnify"
                        size={20}
                        color="#888"
                    />
                    <TextInput
                        placeholder="Search RK Electronics..."
                        style={styles.searchInput}
                    />
                </View>
                <TouchableOpacity style={styles.iconBtn}>
                    <MaterialCommunityIcons
                        name="cart-outline"
                        size={26}
                        color="#1e3c72"
                    />
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>3</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* 1. Promo Banner */}
                <PromoBanner data={bannerData} />

                {/* 2. Quick Categories */}
                <View style={styles.catSection}>
                    <Text style={styles.sectionTitle}>Shop by Category</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 20 }}
                    >
                        {categories.map((cat, i) => (
                            <TouchableOpacity key={i} style={styles.catItem}>
                                <View style={styles.catIconBox}>
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

                {/* 3. Offer Carousel */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Limited Time Offers</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAll}>View All</Text>
                    </TouchableOpacity>
                </View>
                <OfferCarousel offers={offers} />

                {/* 4. Product Grid */}
                <ProductGrid deals={deals} />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fb' },
    header: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        elevation: 2,
    },
    logo: { width: 35, height: 35, resizeMode: 'contain' },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#f0f2f5',
        marginHorizontal: 12,
        borderRadius: 8,
        paddingHorizontal: 10,
        alignItems: 'center',
        height: 40,
    },
    searchInput: { flex: 1, marginLeft: 5, fontSize: 14 },
    iconBtn: { padding: 5 },
    badge: {
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: '#E91E63',
        borderRadius: 9,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    catSection: { marginTop: 20, paddingLeft: 15 },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    catItem: { alignItems: 'center', marginRight: 15 },
    catIconBox: {
        width: 55,
        height: 55,
        backgroundColor: '#fff',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 1,
    },
    catText: { fontSize: 12, marginTop: 5, color: '#666', fontWeight: '500' },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginTop: 25,
        alignItems: 'center',
    },
    viewAll: { color: '#1e3c72', fontWeight: 'bold', fontSize: 14 },
})

export default Home
