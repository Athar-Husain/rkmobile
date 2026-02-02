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
            contentContainerStyle={{ paddingLeft: 15, paddingVertical: 10 }}
        >
            {offers.map((item, index) => (
                <View
                    key={index}
                    style={[styles.card, { backgroundColor: item.bgColor }]}
                >
                    <View style={styles.textPart}>
                        <Text style={styles.title}>{item.title}</Text>
                        <TouchableOpacity style={styles.shopBtn}>
                            <Text style={styles.shopText}>Shop Now</Text>
                        </TouchableOpacity>
                    </View>
                    <Image source={item.image} style={styles.image} />
                </View>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    card: {
        width: 280,
        height: 130,
        borderRadius: 16,
        marginRight: 15,
        flexDirection: 'row',
        padding: 15,
        elevation: 3,
    },
    textPart: { flex: 1.5, justifyContent: 'center' },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    shopBtn: {
        backgroundColor: '#1e3c72',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    shopText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
    image: { flex: 1, width: 80, height: 80, resizeMode: 'contain' },
})

export default OfferCarousel
