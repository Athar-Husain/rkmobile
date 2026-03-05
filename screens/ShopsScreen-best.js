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

    const openInGoogleMaps = (shop) => {
        const target = shop || selectedShop
        if (!target) return

        const { lat, lng } = target.location.coordinates || {}
        const label = encodeURIComponent(target.name)

        // Use coordinates if available, otherwise use address string
        const url =
            lat && lng
                ? Platform.select({
                      ios: `comgooglemaps://?q=${lat},${lng}(${label})`,
                      android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`,
                  })
                : Platform.select({
                      ios: `comgooglemaps://?q=${encodeURIComponent(target.location.address)}`,
                      android: `geo:0,0?q=${encodeURIComponent(target.location.address)}`,
                  })

        Linking.canOpenURL(url).then((supported) => {
            if (supported) {
                Linking.openURL(url)
            } else {
                // Fallback to web browser if Google Maps app isn't installed
                const browserUrl = `https://www.google.com/maps/search/?api=1&query=${label}&query_place_id=${target.location.address}`
                Linking.openURL(browserUrl)
            }
        })
    }

    const renderShopCard = ({ item }) => {
        const isActive = selectedShop?._id === item._id

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedShop(item)}
                style={[styles.card, isActive && styles.cardActive]}
            >
                <View
                    style={[
                        styles.statusIndicator,
                        { backgroundColor: isActive ? '#4285F4' : '#E1E8EE' },
                    ]}
                />

                <View style={styles.cardMain}>
                    <View style={styles.cardHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.shopType}>{item.type}</Text>
                            <Text style={styles.shopName} numberOfLines={1}>
                                {item.name}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.mapActionBtn}
                            onPress={() => openInGoogleMaps(item)}
                        >
                            <MaterialCommunityIcons
                                name="google-maps"
                                size={22}
                                color="#EA4335"
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.shopAddress} numberOfLines={1}>
                        {item.location.address}
                    </Text>

                    <View style={styles.cardFooter}>
                        <View style={styles.timingRow}>
                            <MaterialCommunityIcons
                                name="clock-outline"
                                size={12}
                                color="#999"
                            />
                            <Text style={styles.timingSmall}>
                                {item.timings.open} - {item.timings.close}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() =>
                                Linking.openURL(`tel:${item.contact.phone}`)
                            }
                        >
                            <Text style={styles.callText}>Call Store</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

            <View style={styles.navHeader}>
                <View>
                    <Text style={styles.navSubtitle}>RK ELECTRONICS</Text>
                    <Text style={styles.navTitle}>Store Locator</Text>
                </View>
            </View>

            {selectedShop && (
                <View style={styles.mapContainer}>
                    <View style={styles.mapHero}>
                        <Image
                            style={styles.mapImg}
                            source={{
                                uri: selectedShop.location.coordinates?.lat
                                    ? `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+4285F4(${selectedShop.location.coordinates.lng},${selectedShop.location.coordinates.lat})/${selectedShop.location.coordinates.lng},${selectedShop.location.coordinates.lat},14/${Math.round(width)}x200?access_token=${MAPBOX_TOKEN}`
                                    : 'https://images.unsplash.com/photo-1580913189445-21945c15b8b0?q=80&w=1000&auto=format&fit=crop',
                            }}
                        />
                        <TouchableOpacity
                            style={styles.openInMapsBadge}
                            onPress={() => openInGoogleMaps()}
                        >
                            <MaterialCommunityIcons
                                name="google-maps"
                                size={16}
                                color="#FFF"
                            />
                            <Text style={styles.openInMapsText}>
                                Open in Google Maps
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.mapOverlayInfo}>
                            <Text style={styles.overlayName}>
                                {selectedShop.name}
                            </Text>
                            <Text style={styles.overlayAddress}>
                                {selectedShop.location.area},{' '}
                                {selectedShop.location.city}
                            </Text>
                        </View>
                    </View>
                </View>
            )}

            <FlatList
                data={stores}
                renderItem={renderShopCard}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <Text style={styles.listLabel}>Nearby Outlets</Text>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={loadStores}
                    />
                }
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    navHeader: { paddingHorizontal: 24, paddingVertical: 15 },
    navSubtitle: {
        fontSize: 10,
        fontWeight: '800',
        color: '#4285F4',
        letterSpacing: 1.5,
    },
    navTitle: { fontSize: 28, fontWeight: '900', color: '#1A1A1A' },

    // Map Hero
    mapContainer: { paddingHorizontal: 20, marginBottom: 15 },
    mapHero: {
        height: 190,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#F8F9FA',
    },
    mapImg: { width: '100%', height: '100%' },
    openInMapsBadge: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: '#4285F4',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        elevation: 4,
    },
    openInMapsText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '800',
        marginLeft: 6,
    },
    mapOverlayInfo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 15,
    },
    overlayName: { fontSize: 15, fontWeight: '800', color: '#1A1A1A' },
    overlayAddress: { fontSize: 12, color: '#666', marginTop: 2 },

    // List & Cards
    listContainer: { paddingHorizontal: 20, paddingBottom: 100 },
    listLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#A0A0A0',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
    },

    card: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 20,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#F0F2F5',
    },
    cardActive: { borderColor: '#4285F4', backgroundColor: '#F9FBFF' },
    statusIndicator: {
        width: 4,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    cardMain: { flex: 1, padding: 15 },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    shopType: {
        fontSize: 9,
        fontWeight: '800',
        color: '#4285F4',
        textTransform: 'uppercase',
    },
    shopName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginTop: 1,
    },
    mapActionBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },

    shopAddress: { fontSize: 12, color: '#666', marginTop: 4 },

    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    timingRow: { flexDirection: 'row', alignItems: 'center' },
    timingSmall: {
        fontSize: 11,
        color: '#999',
        fontWeight: '600',
        marginLeft: 4,
    },
    callText: { fontSize: 12, fontWeight: '700', color: '#4285F4' },
})

export default ShopsScreen
