import React, { useEffect, useState, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Linking,
    Platform,
    Image,
    Dimensions,
    ActivityIndicator,
    SafeAreaView,
    RefreshControl,
    StatusBar,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { fetchStores } from '../redux/features/Stores/StoreSlice'
import { COLORS } from '../constants'

const { width } = Dimensions.get('window')
const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN' // Ensure this is moved to a .env file later

const ShopsScreen = () => {
    const dispatch = useDispatch()
    const { stores, isStoreLoading } = useSelector((state) => state.store)

    const [selectedShop, setSelectedShop] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

    const loadStores = useCallback(() => {
        dispatch(fetchStores())
    }, [dispatch])

    useEffect(() => {
        loadStores()
    }, [loadStores])

    useEffect(() => {
        if (stores?.length > 0 && !selectedShop) {
            setSelectedShop(stores[0])
        }
    }, [stores])

    // ========================
    // Logic Helpers
    // ========================
    const openNativeMap = () => {
        if (!selectedShop) return
        const { lat, lng, name } = selectedShop
        const scheme = Platform.select({
            ios: 'maps:0,0?q=',
            android: 'geo:0,0?q=',
        })
        const latLng = `${lat},${lng}`
        const label = name
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`,
        })
        Linking.openURL(url)
    }

    const isStoreOpen = (timings) => {
        if (!timings?.open || !timings?.close) return true // Default to true if not specified
        const now = new Date()
        const currentTime = now.getHours() * 100 + now.getMinutes()
        const openTime = parseInt(timings.open.replace(':', ''))
        const closeTime = parseInt(timings.close.replace(':', ''))
        return currentTime >= openTime && currentTime <= closeTime
    }

    const renderShopCard = ({ item }) => {
        const isActive = selectedShop?._id === item._id
        const isOpen = isStoreOpen(item.timings)

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setSelectedShop(item)}
                style={[styles.card, isActive && styles.cardActive]}
            >
                <View
                    style={[
                        styles.iconBox,
                        { backgroundColor: isActive ? '#004AAD' : '#F1F5FF' },
                    ]}
                >
                    <MaterialCommunityIcons
                        name="store-marker"
                        size={24}
                        color={isActive ? '#FFF' : '#004AAD'}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.shopType}>
                            {item.type || 'RETAIL STORE'}
                        </Text>
                        <View
                            style={[
                                styles.statusBadge,
                                {
                                    backgroundColor: isOpen
                                        ? '#E8F5E9'
                                        : '#FFEBEE',
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.statusText,
                                    { color: isOpen ? '#2E7D32' : '#D32F2F' },
                                ]}
                            >
                                {isOpen ? 'OPEN' : 'CLOSED'}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.shopName}>{item.name}</Text>
                    <Text style={styles.shopAddress} numberOfLines={1}>
                        {item.address}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => Linking.openURL(`tel:${item.phone}`)}
                    style={styles.callBtn}
                >
                    <MaterialCommunityIcons
                        name="phone-outline"
                        size={20}
                        color="#004AAD"
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    if (isStoreLoading && stores.length === 0) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#004AAD" />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <Text style={styles.title}>Store Locator</Text>
                <Text style={styles.subtitle}>Find our products near you</Text>
            </View>

            {selectedShop && (
                <View style={styles.mapWrapper}>
                    {selectedShop && (
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={styles.mapCard}
                            onPress={openNativeMap}
                        >
                            <Image
                                style={styles.mapImage}
                                source={{
                                    uri: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+004AAD(${selectedShop.lng},${selectedShop.lat})/${selectedShop.lng},${selectedShop.lat},14/${Math.round(
                                        width
                                    )}x240?access_token=${MAPBOX_TOKEN}`,
                                }}
                            />

                            <View style={styles.mapInfo}>
                                <Text style={styles.mapShopName}>
                                    {selectedShop.name}
                                </Text>
                                <Text style={styles.mapHours}>
                                    {formatTimings(selectedShop.timings)}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={styles.directionsFab}
                        onPress={openNativeMap}
                    >
                        <MaterialCommunityIcons
                            name="directions"
                            size={24}
                            color="#FFF"
                        />
                        <Text style={styles.directionsText}>
                            GET DIRECTIONS
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={stores}
                renderItem={renderShopCard}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <Text style={styles.listTitle}>All Branch Locations</Text>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true)
                            loadStores()
                            setTimeout(() => setRefreshing(false), 1000)
                        }}
                    />
                }
            />
        </SafeAreaView>
    )
}

// Dummy LinearGradient if not installed (Use expo-linear-gradient)
const LinearGradient = ({ colors, style, children }) => (
    <View style={[style, { backgroundColor: colors[1] }]}>{children}</View>
)

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F7FA' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { paddingHorizontal: 20, paddingVertical: 15 },
    title: { fontSize: 26, fontWeight: '900', color: '#1A1A1A' },
    subtitle: { fontSize: 14, color: '#666', marginTop: 2 },

    mapWrapper: { position: 'relative', marginBottom: 20 },
    mapCard: {
        marginHorizontal: 20,
        height: 200,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 5,
    },
    mapImage: { width: '100%', height: '100%' },
    mapGradient: { ...StyleSheet.absoluteFillObject },
    mapInfoFloating: { position: 'absolute', bottom: 15, left: 15, right: 80 },
    mapShopNameFloating: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    mapAddressFloating: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },

    directionsFab: {
        position: 'absolute',
        bottom: -20,
        right: 40,
        flexDirection: 'row',
        backgroundColor: '#004AAD',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#004AAD',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    directionsText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 12,
    },

    listContent: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 100 },
    listTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#888',
        textTransform: 'uppercase',
        marginBottom: 15,
        letterSpacing: 1,
    },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 18,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    cardActive: { borderColor: '#004AAD', backgroundColor: '#F9FBFF' },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },

    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    shopType: { fontSize: 10, fontWeight: '900', color: '#004AAD' },
    shopName: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
    shopAddress: { fontSize: 13, color: '#777', marginTop: 2 },

    statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    statusText: { fontSize: 9, fontWeight: 'bold' },

    callBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F1F5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
})

export default ShopsScreen
