import React from 'react'
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native'

const OfferCarousel = ({ offers }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingVertical: 20 }}
        >
            {offers.map((item, index) => (
                <View
                    key={index}
                    style={[styles.card, { backgroundColor: item.bgColor }]}
                >
                    <View style={styles.textSection}>
                        <Text style={styles.title}>{item.title}</Text>
                        <TouchableOpacity style={styles.shopBtn}>
                            <Text style={styles.shopText}>Shop Now</Text>
                        </TouchableOpacity>
                    </View>
                    <Image source={item.image} style={styles.productImg} />
                </View>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    card: {
        width: 280,
        height: 120,
        borderRadius: 15,
        marginRight: 15,
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    textSection: { flex: 1.5 },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    shopBtn: {
        backgroundColor: '#1e3c72',
        padding: 6,
        borderRadius: 5,
        alignSelf: 'flex-start',
    },
    shopText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    productImg: { flex: 1, width: 80, height: 80, resizeMode: 'contain' },
})

export default OfferCarousel
