import React from 'react'
import {
    ScrollView,
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'

const OfferCarousel = ({ offers }) => {
    if (!offers || offers.length === 0) return null

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 15 }}
        >
            {offers.map((item, index) => (
                <View
                    key={index}
                    style={[
                        styles.card,
                        { backgroundColor: item.bgColor || '#f0f0f0' },
                    ]}
                >
                    <View style={styles.textPart}>
                        <Text style={styles.title} numberOfLines={2}>
                            {item.title}
                        </Text>
                        <TouchableOpacity style={styles.btn}>
                            <Text style={styles.btnText}>Shop Now</Text>
                        </TouchableOpacity>
                    </View>
                    {item.image && (
                        <Image source={item.image} style={styles.image} />
                    )}
                </View>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    card: {
        width: 260,
        height: 140,
        borderRadius: 16,
        marginRight: 15,
        flexDirection: 'row',
        padding: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    textPart: { flex: 1.5, justifyContent: 'center' },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    btn: {
        backgroundColor: '#1e3c72',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    btnText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
    image: { flex: 1, width: 70, height: 70, resizeMode: 'contain' },
})

export default OfferCarousel
