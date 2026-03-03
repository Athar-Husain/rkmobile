import React, { useState, useRef, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native'
import PagerView from 'react-native-pager-view'
import { LinearGradient } from 'expo-linear-gradient'

const { width } = Dimensions.get('window')


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
        const gradientColors =
            item.type === 'COUPON'
                ? ['#ff9966', '#ff5e62']
                : ['#00b09b', '#96c93d']

        return (
            <LinearGradient
                key={item.id}
                colors={gradientColors}
                style={styles.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <View style={styles.info}>
                    <Text style={styles.label}>
                        {item.type === 'COUPON'
                            ? 'AVAILABLE COUPON'
                            : 'PROMOTION'}
                    </Text>
                    <Text style={styles.title} numberOfLines={2}>
                        {item.type === 'COUPON'
                            ? `₹${item.amount} OFF`
                            : item.title}
                    </Text>
                    {item.code && (
                        <Text style={styles.subText}>Code: {item.code}</Text>
                    )}
                    <TouchableOpacity style={styles.btn}>
                        <Text style={styles.btnText}>
                            {item.type === 'COUPON'
                                ? 'Claim Coupon'
                                : 'Check Details'}
                        </Text>
                    </TouchableOpacity>
                </View>
                {item.image && <Image source={item.image} style={styles.img} />}
            </LinearGradient>
        )
    }

    return (
        <View style={styles.wrapper}>
            <PagerView
                style={styles.pager}
                initialPage={0}
                ref={pagerRef}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
                {data.map(renderCard)}
            </PagerView>

            <View style={styles.dots}>
                {data.map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.dot,
                            {
                                opacity: i === currentPage ? 1 : 0.3,
                                width: i === currentPage ? 16 : 6,
                            },
                        ]}
                    />
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: { height: 210, marginTop: 15 },
    pager: { flex: 1 },
    card: {
        flex: 1,
        borderRadius: 20,
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    info: { flex: 1, justifyContent: 'center' },
    label: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1.2,
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        marginVertical: 4,
    },
    subText: { color: '#fff', fontSize: 14, marginVertical: 4 },
    btn: {
        backgroundColor: '#fff',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginTop: 8,
    },
    btnText: { fontWeight: 'bold', fontSize: 12, color: '#000' },
    img: { width: 100, height: 100, resizeMode: 'contain' },
    dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
    dot: {
        height: 6,
        borderRadius: 3,
        backgroundColor: '#1e3c72',
        marginHorizontal: 3,
    },
})

export default PromoBanner
