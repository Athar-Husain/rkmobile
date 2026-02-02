import React from 'react'
import { ScrollView, StyleSheet, View, Image } from 'react-native'
// import PromoBanner from '../components/PromoBanner'
// import OfferCarousel from '../components/OfferCarousel'
// import ProductGrid from '../components/ProductGrid'
import { images } from '../constants'
import ProductGrid from '../containers/Home/ProductGrid'
import PromoBanner from '../containers/Home/PromoBanner'
import OfferCarousel from '../containers/Home/OfferCarousel'

const Home = () => {
    // Simulated API Data
    const promoData = [
        { id: 1, amount: '500', image: images.promo1 },
        { id: 2, amount: '1000', image: images.promo1 },
        { id: 3, amount: '1000', image: images.promo1 },
    ]

    const offers = [
        {
            title: 'Summer AC Sale: Up to 20% Off',
            image: images.ac,
            bgColor: '#d0e8ff',
        },
        {
            title: 'Monsoon Offers on Washing Machines',
            image: images.washer,
            bgColor: '#e0f2f1',
        },
        {
            title: 'Summer AC Sale: Up to 20% Off',
            image: images.ac,
            bgColor: '#d0fff7',
        },
        {
            title: 'Monsoon Offers on Washing Machines',
            image: images.washer,
            bgColor: '#e0f2f1',
        },
    ]

    const deals = [
        {
            id: '1',
            name: 'Smart TV - 55 inch',
            price: '₹199,900',
            image: images.tv,
        },
        {
            id: '2',
            name: 'Bluetooth Soundbar',
            price: '-20% Off',
            image: images.speaker,
            discount: '-20% Off',
        },
        {
            id: '3',
            name: 'Bluetooth Soundbar',
            price: '-20% Off',
            image: images.speaker,
            discount: '-20% Off',
        },
        {
            id: '4',
            name: 'Bluetooth Soundbar',
            price: '-20% Off',
            image: images.speaker,
            discount: '-20% Off',
        },
    ]

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            {/* Header / Logo */}
            <View style={styles.header}>
                <Image source={images.logo} style={styles.logo} />
                <Image source={images.since1999} style={styles.badge} />
            </View>

            <PromoBanner data={promoData} />
            <OfferCarousel offers={offers} />
            <ProductGrid deals={deals} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fb' },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    logo: { width: 80, height: 80, resizeMode: 'contain' },
    badge: { width: 50, height: 50, position: 'absolute', right: 20 },
})

export default Home
