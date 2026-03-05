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

const { width } = Dimensions.get('window')
const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN'

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

    const openNativeMap = () => {
        if (!selectedShop) return
        const { lat, lng, name } = selectedShop
        const latLng = `${lat},${lng}`
        const url = Platform.select({
            ios: `maps:0,0?q=${name}@${latLng}`,
            android: `geo:0,0?q=${latLng}(${name})`,
        })
        Linking.openURL(url)
    }

    const makeCall = (phone) => {
        if (phone) Linking.openURL(`tel:${phone}`)
    }

    const formatTimings = (timings) => {
        if (!timings || typeof timings !== 'object')
            return 'Hours not available'
        const { open, close, workingDays } = timings
        const days =
            Array.isArray(workingDays) && workingDays.length > 0
                ? workingDays.join(', ')
                : 'All days'
        return open && close
            ? `${open} - ${close} (${days})`
            : 'Hours not available'
    }

    const renderShopCard = ({ item }) => {
        const isActive = selectedShop?._id === item._id

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSelectedShop(item)}
                style={[styles.card, isActive && styles.cardActive]}
            >
                <View
                    style={[
                        styles.iconBox,
                        { backgroundColor: isActive ? '#004AAD' : '#F0F4FF' },
                    ]}
                >
                    <MaterialCommunityIcons
                        name={isActive ? 'storefront' : 'storefront-outline'}
                        size={24}
                        color={isActive ? '#FFF' : '#004AAD'}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.shopType}>
                        {item.type || 'RETAIL STORE'}
                    </Text>
                    <Text style={styles.shopName}>{item.name}</Text>
                    <Text style={styles.shopAddress} numberOfLines={1}>
                        {item.address}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => makeCall(item.phone)}
                    style={styles.callBtn}
                >
                    <MaterialCommunityIcons
                        name="phone-in-talk"
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
                <Text style={styles.title}>Find a Store</Text>
                <Text style={styles.subtitle}>
                    Visit us to experience products in person
                </Text>
            </View>

            {selectedShop && (
                <View style={styles.mapWrapper}>
                    <TouchableOpacity
                        activeOpacity={0.95}
                        style={styles.mapCard}
                        onPress={openNativeMap}
                    >
                        <Image
                            style={styles.mapImage}
                            source={{
                                uri: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+004AAD(${selectedShop.lng},${selectedShop.lat})/${selectedShop.lng},${selectedShop.lat},14/${Math.round(width)}x240?access_token=${MAPBOX_TOKEN}`,
                            }}
                        />
                        {/* Soft Gradient Overlay for text readability */}
                        <View style={styles.mapOverlayGradient} />

                        <View style={styles.mapInfo}>
                            <Text style={styles.mapShopName}>
                                {selectedShop.name}
                            </Text>
                            <View style={styles.timingRow}>
                                <MaterialCommunityIcons
                                    name="clock-outline"
                                    size={14}
                                    color="#666"
                                />
                                <Text style={styles.mapHours}>
                                    {formatTimings(selectedShop.timings)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.directionsBadge}>
                            <MaterialCommunityIcons
                                name="directions"
                                size={18}
                                color="#FFF"
                            />
                            <Text style={styles.directionsText}>
                                Directions
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={stores}
                renderItem={renderShopCard}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true)
                            loadStores()
                            setTimeout(() => setRefreshing(false), 1000)
                        }}
                        tintColor="#004AAD"
                    />
                }
                ListHeaderComponent={
                    <Text style={styles.listTitle}>Available Locations</Text>
                }
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { paddingHorizontal: 22, paddingVertical: 20 },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#1A1A1A',
        letterSpacing: -0.5,
    },
    subtitle: { fontSize: 15, color: '#666', marginTop: 4 },

    mapWrapper: { paddingHorizontal: 20, marginBottom: 10 },
    mapCard: {
        height: 220,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#FFF',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
            },
            android: { elevation: 8 },
        }),
    },
    mapImage: { width: '100%', height: '100%' },
    mapOverlayGradient: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.1)', // Subtle tint
    },
    mapInfo: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 16,
        width: '65%',
        elevation: 5,
    },
    mapShopName: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
    timingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    mapHours: { fontSize: 11, color: '#666', marginLeft: 4 },

    directionsBadge: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        backgroundColor: '#004AAD',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        elevation: 5,
    },
    directionsText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 5,
    },

    listContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
    listTitle: {
        fontSize: 13,
        fontWeight: '800',
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
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E1E8EE',
    },
    cardActive: {
        borderColor: '#004AAD',
        backgroundColor: '#F9FBFF',
        ...Platform.select({
            ios: {
                shadowColor: '#004AAD',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: { elevation: 4 },
        }),
    },
    iconBox: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    shopType: {
        fontSize: 10,
        fontWeight: '900',
        color: '#004AAD',
        letterSpacing: 1,
    },
    shopName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
        marginTop: 1,
    },
    shopAddress: { fontSize: 13, color: '#777', marginTop: 3 },
    callBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#F0F4FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default ShopsScreen
