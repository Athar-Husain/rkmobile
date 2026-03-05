import React, { useEffect, useRef, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Dimensions,
} from 'react-native'
import PagerView from 'react-native-pager-view'
import { COLORS } from '../../constants'

const { width } = Dimensions.get('window')

const PromotionCarousel = ({ data, isLoading, onPromotionPress }) => {
    const pagerRef = useRef(null)
    const [currentPage, setCurrentPage] = useState(0)

    useEffect(() => {
        if (!data || data.length <= 1) return
        const interval = setInterval(() => {
            const nextPage =
                currentPage === data.length - 1 ? 0 : currentPage + 1
            pagerRef.current?.setPage(nextPage)
        }, 4000)
        return () => clearInterval(interval)
    }, [currentPage, data])

    if (isLoading && (!data || data.length === 0)) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator color={COLORS.primary} />
            </View>
        )
    }

    if (!data || data.length === 0) return null

    return (
        <View style={styles.container}>
            <PagerView
                ref={pagerRef}
                style={styles.pager}
                initialPage={0}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
                {data.map((item, index) => (
                    <View key={item._id || index} style={styles.page}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={styles.card}
                            onPress={() => onPromotionPress?.(item)}
                        >
                            <Image
                                source={{ uri: item.bannerImage }}
                                style={styles.image}
                            />
                            <View style={styles.overlay} />
                            <View style={styles.content}>
                                <Text style={styles.title} numberOfLines={2}>
                                    {item.title}
                                </Text>
                                <View style={styles.btn}>
                                    <Text style={styles.btnText}>Shop Now</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
            </PagerView>
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
    container: { height: 210, marginTop: 10 },
    pager: { flex: 1 },
    page: { paddingHorizontal: 15 },
    card: { flex: 1, borderRadius: 18, overflow: 'hidden' },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    content: { position: 'absolute', bottom: 20, left: 20, right: 20 },
    title: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
    btn: {
        backgroundColor: COLORS.primary,
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        marginHorizontal: 4,
    },
    loader: { height: 200, justifyContent: 'center', alignItems: 'center' },
})

export default PromotionCarousel
