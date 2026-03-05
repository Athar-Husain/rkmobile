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

    const openGmaps = (item) => {
        const shop = item || selectedShop
        if (!shop) return

        // Using address + city + landmark for accurate search since lat/lng is missing
        const query = encodeURIComponent(
            `${shop.name}, ${shop.location.address}, ${shop.location.city}`
        )
        const url = Platform.select({
            ios: `maps:0,0?q=${query}`,
            android: `geo:0,0?q=${query}`,
        })
        Linking.openURL(url)
    }

    const renderShopCard = ({ item }) => {
        const isActive = selectedShop?._id === item._id

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setSelectedShop(item)}
                style={[styles.card, isActive && styles.cardActive]}
            >
                <View style={styles.cardTop}>
                    <View
                        style={[
                            styles.typeBadge,
                            {
                                backgroundColor: isActive
                                    ? '#004AAD'
                                    : '#E8EDF2',
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.typeText,
                                { color: isActive ? '#FFF' : '#004AAD' },
                            ]}
                        >
                            {item.type}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() =>
                            Linking.openURL(`tel:${item.contact.phone}`)
                        }
                    >
                        <MaterialCommunityIcons
                            name="phone-outline"
                            size={22}
                            color="#004AAD"
                        />
                    </TouchableOpacity>
                </View>

                <Text style={styles.shopName}>{item.name}</Text>

                <View style={styles.locationRow}>
                    <MaterialCommunityIcons
                        name="map-marker-outline"
                        size={16}
                        color="#7F8C8D"
                    />
                    <Text style={styles.addressText} numberOfLines={2}>
                        {item.location.address}, {item.location.landmark}
                    </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                    <View style={styles.timeInfo}>
                        <MaterialCommunityIcons
                            name="clock-check-outline"
                            size={16}
                            color="#27AE60"
                        />
                        <Text style={styles.timeText}>
                            {item.timings.open} - {item.timings.close}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.goBtn}
                        onPress={() => openGmaps(item)}
                    >
                        <Text style={styles.goBtnText}>Directions</Text>
                        <MaterialCommunityIcons
                            name="chevron-right"
                            size={18}
                            color="#004AAD"
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <View>
                    <Text style={styles.brandTitle}>RK ELECTRONICS</Text>
                    <Text style={styles.mainTitle}>Store Locator</Text>
                </View>
                <TouchableOpacity
                    style={styles.refreshCircle}
                    onPress={loadStores}
                >
                    <MaterialCommunityIcons
                        name="refresh"
                        size={24}
                        color="#004AAD"
                    />
                </TouchableOpacity>
            </View>

            {/* Visual Header / Map Placeholder */}
            {selectedShop && (
                <View style={styles.heroContainer}>
                    <TouchableOpacity
                        style={styles.heroCard}
                        activeOpacity={0.9}
                        onPress={() => openGmaps()}
                    >
                        <Image
                            source={{
                                uri: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=500&auto=format&fit=crop',
                            }}
                            style={styles.heroImage}
                        />
                        <View style={styles.overlay}>
                            <Text style={styles.overlayArea}>
                                {selectedShop.location.area}
                            </Text>
                            <Text style={styles.overlayCity}>
                                {selectedShop.location.city}
                            </Text>
                            <View style={styles.navigateChip}>
                                <MaterialCommunityIcons
                                    name="navigation-variant"
                                    size={16}
                                    color="#FFF"
                                />
                                <Text style={styles.navigateText}>
                                    Open in Google Maps
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={stores}
                renderItem={renderShopCard}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listPadding}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <Text style={styles.sectionLabel}>All Outlets</Text>
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
    container: { flex: 1, backgroundColor: '#F8F9FB' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    brandTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#004AAD',
        letterSpacing: 2,
    },
    mainTitle: { fontSize: 28, fontWeight: '900', color: '#1A1A1A' },
    refreshCircle: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },

    // Hero Section
    heroContainer: { paddingHorizontal: 20, marginBottom: 10 },
    heroCard: {
        height: 180,
        borderRadius: 30,
        overflow: 'hidden',
        elevation: 10,
    },
    heroImage: { width: '100%', height: '100%', opacity: 0.9 },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    overlayArea: { color: '#FFF', fontSize: 24, fontWeight: '900' },
    overlayCity: {
        color: '#FFF',
        fontSize: 14,
        opacity: 0.8,
        fontWeight: '600',
    },
    navigateChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#004AAD',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 10,
    },
    navigateText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '800',
        marginLeft: 5,
    },

    // List Styles
    sectionLabel: {
        fontSize: 13,
        fontWeight: '800',
        color: '#95A5A6',
        marginHorizontal: 25,
        marginBottom: 15,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    listPadding: { paddingBottom: 120 },

    // Card Styles
    card: {
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        borderRadius: 24,
        padding: 20,
        marginBottom: 15,
        elevation: 4,
    },
    cardActive: { borderWidth: 2, borderColor: '#004AAD' },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    typeText: { fontSize: 10, fontWeight: '800' },
    shopName: {
        fontSize: 20,
        fontWeight: '900',
        color: '#2C3E50',
        marginBottom: 6,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    addressText: {
        flex: 1,
        fontSize: 13,
        color: '#7F8C8D',
        marginLeft: 5,
        lineHeight: 18,
    },
    divider: { height: 1, backgroundColor: '#F1F3F5', marginBottom: 15 },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeInfo: { flexDirection: 'row', alignItems: 'center' },
    timeText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#27AE60',
        marginLeft: 5,
    },
    goBtn: { flexDirection: 'row', alignItems: 'center' },
    goBtnText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#004AAD',
        marginRight: 2,
    },
})

export default ShopsScreen
