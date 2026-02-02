import React, { useState, useEffect } from 'react'
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
} from 'react-native' // Note: Ensure you import from 'react-native' and use 'react-redux' for hooks
import { useSelector, useDispatch } from 'react-redux'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { fetchStores } from '../redux/features/Stores/StoreSlice' // Adjust path
import { COLORS } from '../constants'

const ShopsScreen = () => {
    const dispatch = useDispatch()

    // ✅ 1. Get real data from Redux
    const { stores, isStoreLoading } = useSelector((state) => state.store)
    const [selectedShop, setSelectedShop] = useState(null)

    // ✅ 2. Fetch stores on mount
    useEffect(() => {
        dispatch(fetchStores())
    }, [dispatch])

    // ✅ 3. Update selected shop once data loads
    useEffect(() => {
        if (stores.length > 0 && !selectedShop) {
            setSelectedShop(stores[0])
        }
    }, [stores])

    const openNativeMap = () => {
        if (!selectedShop) return
        const { lat, lng, name } = selectedShop
        const scheme = Platform.select({
            ios: 'maps:0,0?q=',
            android: 'geo:0,0?q=',
        })
        const latLng = `${lat},${lng}`
        const url = Platform.select({
            ios: `${scheme}${name}@${latLng}`,
            android: `${scheme}${latLng}(${name})`,
        })
        Linking.openURL(url)
    }

    const makeCall = (phoneNumber) => {
        if (phoneNumber) Linking.openURL(`tel:${phoneNumber}`)
    }

    const renderShopCard = ({ item }) => {
        const isSelected = selectedShop?._id === item._id
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.listCard, isSelected && styles.selectedListCard]}
                onPress={() => setSelectedShop(item)}
            >
                <View
                    style={[
                        styles.iconBox,
                        { backgroundColor: isSelected ? '#004AAD' : '#F0F5FF' },
                    ]}
                >
                    <MaterialCommunityIcons
                        name={
                            item.type === 'Retail Store'
                                ? 'store-check'
                                : 'hammer-wrench'
                        }
                        size={24}
                        color={isSelected ? '#fff' : '#004AAD'}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.shopType}>{item.type || 'Branch'}</Text>
                    <Text style={styles.shopName}>{item.name}</Text>
                    <Text style={styles.shopAddr} numberOfLines={1}>
                        {item.address}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.circleCallBtn}
                    onPress={() => makeCall(item.phone)}
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

    // ✅ Loading State
    if (isStoreLoading && stores.length === 0) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color="#004AAD" />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.topHeader}>
                <Text style={styles.header}>Our Presence</Text>
                <Text style={styles.subHeader}>
                    Visit us for exclusive deals
                </Text>
            </View>

            {selectedShop && (
                <View style={styles.mapWrapper}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.mapPlaceholder}
                        onPress={openNativeMap}
                    >
                        <Image
                            source={{
                                // Use coordinates from the selected store
                                uri: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+004AAD(${selectedShop.lng},${selectedShop.lat})/${selectedShop.lng},${selectedShop.lat},14/600x400?access_token=YOUR_MAPBOX_TOKEN`,
                            }}
                            style={styles.mapImage}
                        />
                        {/* Map Overlays remain the same */}
                        <View style={styles.mapOverlay}>
                            <View style={styles.markerContainer}>
                                <View style={styles.markerPulse} />
                                <MaterialCommunityIcons
                                    name="map-marker-radius"
                                    size={44}
                                    color="#004AAD"
                                />
                            </View>
                        </View>

                        <View style={styles.shopDetailsOverlay}>
                            <View style={styles.statusBadge}>
                                <View style={styles.greenDot} />
                                <Text style={styles.statusText}>Open Now</Text>
                            </View>
                            <Text style={styles.overlayShopName}>
                                {selectedShop.name}
                            </Text>
                            <Text style={styles.hoursText}>
                                {selectedShop.timings || '9:00 AM - 9:00 PM'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={stores}
                renderItem={renderShopCard}
                keyExtractor={(item) => item._id} // MongoDB uses _id
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingBottom: 30,
                }}
                ListHeaderComponent={
                    <Text style={styles.listTitle}>Select a Location</Text>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FB' },
    topHeader: { marginTop: 20, marginHorizontal: 20, marginBottom: 10 },
    header: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
    subHeader: { fontSize: 14, color: '#7C7C7C', marginTop: 4 },
    listTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#444',
        marginBottom: 15,
    },

    mapWrapper: {
        shadowColor: '#004AAD',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    mapPlaceholder: {
        height: 200,
        margin: 20,
        borderRadius: 28,
        overflow: 'hidden',
        backgroundColor: '#E0E0E0',
    },
    mapImage: { width: '100%', height: '100%' },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
    },

    markerContainer: { alignItems: 'center', justifyContent: 'center' },
    markerPulse: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(0, 74, 173, 0.15)',
    },

    directionsFloatingBtn: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#004AAD',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 16,
        alignItems: 'center',
    },
    directionsText: { color: '#fff', fontWeight: 'semibold', marginLeft: 8 },

    shopDetailsOverlay: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        width: '65%',
        elevation: 5,
    },
    statusBadge: {
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
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#4CAF50',
        letterSpacing: 0.5,
    },
    overlayShopName: { fontWeight: 'bold', color: '#1A1A1A', fontSize: 14 },
    hoursText: { fontSize: 11, color: '#777', marginTop: 2 },

    listCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 22,
        alignItems: 'center',
        marginBottom: 12,
        elevation: 2,
    },
    selectedListCard: {
        borderWidth: 1.5,
        borderColor: '#004AAD',
        backgroundColor: '#fff',
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    shopType: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#004AAD',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    shopName: { fontWeight: 'bold', fontSize: 14, color: '#333' },
    shopAddr: { fontSize: 13, color: '#888', marginTop: 2 },
    circleCallBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
})

export default ShopsScreen
