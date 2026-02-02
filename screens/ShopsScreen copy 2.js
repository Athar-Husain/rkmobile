import React, { useState, useEffect, useRef } from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Linking,
    Platform,
    Dimensions,
} from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const { width } = Dimensions.get('window')

const ShopsScreen = () => {
    const mapRef = useRef(null)
    const [selectedShopId, setSelectedShopId] = useState('1')
    const [shops, setShops] = useState([])

    // Ballari Initial Region
    const initialRegion = {
        latitude: 15.1394,
        longitude: 76.9214,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    }

    useEffect(() => {
        setShops([
            {
                id: '1',
                name: 'RK Electronics - Main Branch',
                address: 'Cowl Bazaar, Ballari',
                phone: '+919876543210',
                lat: 15.1394,
                lng: 76.9214,
            },
            {
                id: '2',
                name: 'RK Electronics - Service Center',
                address: 'Station Road, Ballari',
                phone: '+919876543211',
                lat: 15.145,
                lng: 76.924,
            },
        ])
    }, [])

    const onShopPress = (shop) => {
        setSelectedShopId(shop.id)
        mapRef.current?.animateToRegion(
            {
                latitude: shop.lat,
                longitude: shop.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            },
            1000
        )
    }

    const handleDirections = (lat, lng, label) => {
        const scheme = Platform.select({
            ios: 'maps:0,0?q=',
            android: 'geo:0,0?q=',
        })
        const latLng = `${lat},${lng}`
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`,
        })
        Linking.openURL(url)
    }

    const renderShop = ({ item }) => {
        const isSelected = selectedShopId === item.id
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => onShopPress(item)}
                style={[styles.shopCard, isSelected && styles.selectedCard]}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.shopIconContainer}>
                        <MaterialCommunityIcons
                            name="store"
                            size={24}
                            color="#004AAD"
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.shopName}>{item.name}</Text>
                        <Text style={styles.shopAddr}>{item.address}</Text>
                    </View>
                </View>

                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => Linking.openURL(`tel:${item.phone}`)}
                    >
                        <MaterialCommunityIcons
                            name="phone"
                            size={18}
                            color="#fff"
                        />
                        <Text style={styles.btnLabel}>Call Store</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.btn, styles.btnMap]}
                        onPress={() =>
                            handleDirections(item.lat, item.lng, item.name)
                        }
                    >
                        <MaterialCommunityIcons
                            name="directions"
                            size={18}
                            color="#004AAD"
                        />
                        <Text style={[styles.btnLabel, { color: '#004AAD' }]}>
                            Directions
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            {/* TOP MAP VIEW */}
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={initialRegion}
                >
                    {shops.map((shop) => (
                        <Marker
                            key={shop.id}
                            coordinate={{
                                latitude: shop.lat,
                                longitude: shop.lng,
                            }}
                            title={shop.name}
                            description={shop.address}
                            pinColor={
                                selectedShopId === shop.id
                                    ? '#E91E63'
                                    : '#004AAD'
                            }
                        />
                    ))}
                </MapView>
                <View style={styles.mapOverlay}>
                    <Text style={styles.mapTag}>Find Us in Ballari</Text>
                </View>
            </View>

            {/* SHOP LIST */}
            <View style={styles.listContainer}>
                <View style={styles.dragHandle} />
                <FlatList
                    data={shops}
                    renderItem={renderShop}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    mapContainer: {
        height: '40%',
        width: '100%',
    },
    map: { ...StyleSheet.absoluteFillObject },
    mapOverlay: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        elevation: 5,
    },
    mapTag: { fontWeight: 'bold', color: '#004AAD', fontSize: 12 },

    listContainer: {
        flex: 1,
        backgroundColor: '#F8F9FB',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -25, // Overlap effect
    },
    dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#DDD',
        borderRadius: 3,
        alignSelf: 'center',
        marginTop: 10,
    },
    shopCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 15,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedCard: {
        borderColor: '#004AAD',
        backgroundColor: '#F0F5FF',
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center' },
    shopIconContainer: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: '#F0F5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    shopName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    shopAddr: { fontSize: 13, color: '#777', marginTop: 2 },

    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    btn: {
        flexDirection: 'row',
        backgroundColor: '#004AAD',
        flex: 0.48,
        paddingVertical: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnMap: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#004AAD',
    },
    btnLabel: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
        marginLeft: 6,
    },
})

export default ShopsScreen
