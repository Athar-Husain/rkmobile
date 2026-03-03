import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    TouchableOpacity,
} from 'react-native'

const { width } = Dimensions.get('window')
// Adjusting width so the next card peaks in like the image
const CARD_WIDTH = width * 0.75
const CARD_MARGIN = 12

const PromoBanner = ({ data }) => {
    const renderItem = ({ item }) => {
        // You can assign different pastel colors based on index or item property
        const bgColor = item.backgroundColor || '#D8EAFE' // Light blue from image

        return (
            <View style={[styles.card, { backgroundColor: bgColor }]}>
                <View style={styles.content}>
                    <Text style={styles.title} numberOfLines={2}>
                        {item.title || 'Summer AC Sale: Up to 20% Off'}
                    </Text>

                    <TouchableOpacity
                        style={styles.shopBtn}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.shopText}>Shop Now</Text>
                    </TouchableOpacity>
                </View>

                {/* Image is optional/positioned as per layout needs */}
                {/* <Image source={item.image} style={styles.bannerImage} /> */}
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + CARD_MARGIN}
                decelerationRate="fast"
                contentContainerStyle={styles.listPadding}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 15,
    },
    listPadding: {
        paddingLeft: 16, // Align with screen margin
        paddingRight: 16,
    },
    card: {
        width: CARD_WIDTH,
        height: 140, // More compact for a secondary banner
        borderRadius: 24, // High border radius like the image
        marginRight: CARD_MARGIN,
        padding: 20,
        justifyContent: 'center',
        // Subtle shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingRight: 40, // Leave space if you add an image on the right later
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        lineHeight: 24,
    },
    shopBtn: {
        backgroundColor: '#1e3c72', // Dark blue button from image
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    shopText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
})

export default PromoBanner
