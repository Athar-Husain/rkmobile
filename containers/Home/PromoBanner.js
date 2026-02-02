import React, { useState, useRef, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import PagerView from 'react-native-pager-view'
import { LinearGradient } from 'expo-linear-gradient'

const PromoBanner = ({ data }) => {
    const [currentPage, setCurrentPage] = useState(0)
    const pagerRef = useRef(null)

    useEffect(() => {
        if (data && data.length > 1) {
            const interval = setInterval(() => {
                const nextPage =
                    currentPage === data.length - 1 ? 0 : currentPage + 1
                pagerRef.current?.setPage(nextPage)
            }, 4000)
            return () => clearInterval(interval)
        }
    }, [currentPage, data])

    if (!data || data.length === 0) return null

    const renderCard = (item) => {
        switch (item.type) {
            case 'COUPON':
                return (
                    <LinearGradient
                        colors={['#ff9966', '#ff5e62']}
                        style={styles.card}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <View style={styles.info}>
                            <Text style={styles.label}>AVAILABLE COUPON</Text>
                            <Text style={styles.amount}>
                                ₹{item.amount} OFF
                            </Text>
                            <Text style={styles.subText}>
                                Code: {item.code}
                            </Text>
                            <TouchableOpacity style={styles.btn}>
                                <Text
                                    style={[
                                        styles.btnText,
                                        { color: '#ff5e62' },
                                    ]}
                                >
                                    Claim Coupon
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Image source={item.image} style={styles.img} />
                    </LinearGradient>
                )
            case 'PROMO':
                return (
                    <LinearGradient
                        colors={['#00b09b', '#96c93d']}
                        style={styles.card}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <View style={styles.info}>
                            <Text style={styles.label}>
                                PROMOTIONAL CONNECT
                            </Text>
                            <Text
                                style={[styles.amount, { fontSize: 24 }]}
                                numberOfLines={2}
                            >
                                {item.title}
                            </Text>
                            <TouchableOpacity style={styles.btn}>
                                <Text
                                    style={[
                                        styles.btnText,
                                        { color: '#00b09b' },
                                    ]}
                                >
                                    Check Details
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Image source={item.image} style={styles.img} />
                    </LinearGradient>
                )
            default: // CASHBACK style
                return (
                    <LinearGradient
                        colors={['#1e3c72', '#2a5298']}
                        style={styles.card}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <View style={styles.info}>
                            <Text style={styles.label}>CASHBACK EARNED</Text>
                            <Text style={styles.amount}>₹{item.amount}</Text>
                            <TouchableOpacity style={styles.btn}>
                                <Text
                                    style={[
                                        styles.btnText,
                                        { color: '#1e3c72' },
                                    ]}
                                >
                                    Redeem to Wallet
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Image source={item.image} style={styles.img} />
                    </LinearGradient>
                )
        }
    }

    return (
        <View style={styles.wrapper}>
            <PagerView
                style={styles.pager}
                initialPage={0}
                ref={pagerRef}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
                {data.map((item, index) => (
                    <View key={item.id || index} style={styles.page}>
                        {renderCard(item)}
                    </View>
                ))}
            </PagerView>
            <View style={styles.dots}>
                {data.map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.dot,
                            {
                                opacity: i === currentPage ? 1 : 0.3,
                                width: i === currentPage ? 15 : 6,
                            },
                        ]}
                    />
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: { height: 190, marginTop: 15 },
    pager: { flex: 1 },
    page: { paddingHorizontal: 15 },
    card: {
        flex: 1,
        borderRadius: 20,
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    info: { flex: 1, justifyContent: 'center' },
    label: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1.2,
        marginBottom: 4,
    },
    amount: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    subText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        fontStyle: 'italic',
        marginVertical: 4,
    },
    btn: {
        backgroundColor: '#fff',
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    btnText: { fontWeight: 'bold', fontSize: 12 },
    img: { width: 90, height: 90, resizeMode: 'contain' },
    dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
    dot: {
        height: 6,
        borderRadius: 3,
        backgroundColor: '#1e3c72',
        marginHorizontal: 3,
    },
})

export default PromoBanner
