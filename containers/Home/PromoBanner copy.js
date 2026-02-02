import React, { useEffect, useRef, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
} from 'react-native'
import PagerView from 'react-native-pager-view'
import { LinearGradient } from 'expo-linear-gradient'
// import { COLORS } from '../constants'

const { width } = Dimensions.get('window')

const PromoBanner = ({ data }) => {
    const pagerRef = useRef(null)
    const [currentPage, setCurrentPage] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            const nextPage =
                currentPage === data.length - 1 ? 0 : currentPage + 1
            pagerRef.current?.setPage(nextPage)
        }, 4000) // 4 seconds auto-slide
        return () => clearInterval(interval)
    }, [currentPage])

    return (
        <View style={styles.container}>
            <PagerView
                style={styles.pager}
                initialPage={0}
                ref={pagerRef}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
                {data.map((item, index) => (
                    <View key={index} style={styles.page}>
                        <LinearGradient
                            colors={['#1e3c72', '#2a5298']} // Blue gradients like the image
                            style={styles.card}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View style={styles.info}>
                                <Text style={styles.cashbackLabel}>
                                    Your Cashback:
                                </Text>
                                <Text style={styles.amount}>
                                    ₹{item.amount}
                                </Text>
                                <TouchableOpacity style={styles.redeemBtn}>
                                    <Text style={styles.redeemText}>
                                        Redeem
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <Image
                                source={item.image}
                                style={styles.bannerImage}
                            />
                        </LinearGradient>
                    </View>
                ))}
            </PagerView>
            {/* Pagination Dots */}
            <View style={styles.dotContainer}>
                {data.map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.dot,
                            { opacity: i === currentPage ? 1 : 0.3 },
                        ]}
                    />
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { height: 200, marginTop: 10 },
    pager: { flex: 1 },
    page: { paddingHorizontal: 20 },
    card: {
        flex: 1,
        borderRadius: 20,
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    info: { flex: 1 },
    cashbackLabel: { color: '#fff', fontSize: 16, fontWeight: '600' },
    amount: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    redeemBtn: {
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    redeemText: { color: '#1e3c72', fontWeight: 'bold' },
    bannerImage: { width: 120, height: 120, resizeMode: 'contain' },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#1e3c72',
        mx: 4,
        marginHorizontal: 3,
    },
})

export default PromoBanner
