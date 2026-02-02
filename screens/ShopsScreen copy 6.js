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
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { fetchStores } from '../redux/features/Stores/StoreSlice'

const { width } = Dimensions.get('window')

// 🔐 Replace with env / config
const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN'

const ShopsScreen = () => {
    const dispatch = useDispatch()

    const { stores, isStoreLoading } = useSelector((state) => state.store)

    const [selectedShop, setSelectedShop] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

    // ========================
    // Fetch Stores
    // ========================
    const loadStores = useCallback(() => {
        dispatch(fetchStores())
    }, [dispatch])

    useEffect(() => {
        loadStores()
    }, [loadStores])

    useEffect(() => {
        if (stores?.length > 0) {
            setSelectedShop((prev) => prev ?? stores[0])
        }
    }, [stores])

    // ========================
    // Helpers
    // ========================
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

    // ========================
    // Render Shop Card
    // ========================
    const renderShopCard = ({ item }) => {
        const isActive = selectedShop?._id === item._id

        return (
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setSelectedShop(item)}
                style={[
                    styles.card,
                    isActive && styles.cardActive,
                ]}
            >
                <View
                    style={[
                        styles.iconBox,
                        { backgroundColor: isActive ? '#004AAD' : '#F1F5FF' },
                    ]}
                >
                    <MaterialCommunityIcons
                        name={
                            item.type === 'Retail Store'
                                ? 'storefront'
                                : 'hammer-wrench'
                        }
                        size={24}
                        color={isActive ? '#FFF' : '#004AAD'}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.shopType}>{item.type || 'Store'}</Text>
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
                        name="phone"
                        size={20}
                        color="#004AAD"
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    // ========================
    // Loading State
    // ========================
    if (isStoreLoading && stores.length === 0) {
        return (
            <View style={[styles.center, { backgroundColor: '#F8F9FB' }]}>
                <ActivityIndicator size="large" color="#004AAD" />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* ===== HEADER ===== */}
            <View style={styles.header}>
                <Text style={styles.title}>Our Presence</Text>
                <Text style={styles.subtitle}>
                    Visit us for exclusive deals & offers
                </Text>
            </View>

            {/* ===== MAP ===== */}
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

                    <View style={styles.mapOverlay}>
                        <MaterialCommunityIcons
                            name="map-marker-radius"
                            size={48}
                            color="#004AAD"
                        />
                    </View>

                    <View style={styles.mapInfo}>
                        <View style={styles.openBadge}>
                            <View style={styles.greenDot} />
                            <Text style={styles.openText}>Open Now</Text>
                        </View>
                        <Text style={styles.mapShopName}>
                            {selectedShop.name}
                        </Text>
                        <Text style={styles.mapHours}>
                            {selectedShop.timings || '9:00 AM – 9:00 PM'}
                        </Text>
                    </View>
                </TouchableOpacity>
            )}

            {/* ===== LIST ===== */}
            <FlatList
                data={stores}
                renderItem={renderShopCard}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true)
                            loadStores()
                            setTimeout(() => setRefreshing(false), 800)
                        }}
                        tintColor="#004AAD"
                    />
                }
                ListHeaderComponent={
                    <Text style={styles.listTitle}>Select a Location</Text>
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <MaterialCommunityIcons
                            name="store-off-outline"
                            size={64}
                            color="#CCC"
                        />
                        <Text style={styles.emptyText}>
                            No stores available
                        </Text>
                    </View>
                }
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FB' },

    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1A1A1A',
    },
    subtitle: {
        fontSize: 14,
        color: '#7C7C7C',
        marginTop: 4,
    },

    mapCard: {
        marginHorizontal: 20,
        marginBottom: 15,
        height: 240,
        borderRadius: 26,
        overflow: 'hidden',
        elevation: 10,
        backgroundColor: '#E5ECFF',
    },
    mapImage: { width: '100%', height: '100%' },

    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },

    mapInfo: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 14,
        elevation: 6,
        width: '70%',
    },

    openBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    greenDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4CAF50',
        marginRight: 6,
    },
    openText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#4CAF50',
        letterSpacing: 0.6,
    },

    mapShopName: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1A1A1A',
    },
    mapHours: {
        fontSize: 11,
        color: '#777',
        marginTop: 2,
    },

    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    listTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#444',
        marginBottom: 12,
    },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 22,
        marginBottom: 12,
        elevation: 2,
    },
    cardActive: {
        borderWidth: 1.5,
        borderColor: '#004AAD',
    },

    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    shopType: {
        fontSize: 10,
        fontWeight: '800',
        color: '#004AAD',
        textTransform: 'uppercase',
    },
    shopName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    shopAddress: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },

    callBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },

    empty: {
        alignItems: 'center',
        marginTop: 80,
    },
    emptyText: {
        marginTop: 10,
        color: '#AAA',
        fontSize: 14,
    },
})


export default ShopsScreen
