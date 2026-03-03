import React from 'react'
import { View, Image, StyleSheet, ScrollView, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

const SecondaryBanners = ({ data }) => {
    if (!data || data.length === 0) return null

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 15, paddingVertical: 10 }}
        >
            {data.map((item, index) => (
                <View key={index} style={styles.card}>
                    <Image source={item.image} style={styles.image} />
                </View>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    card: {
        width: width * 0.8,
        height: 120,
        borderRadius: 16,
        marginRight: 15,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
})

export default SecondaryBanners
