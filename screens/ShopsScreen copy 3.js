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
import { LinearGradient } from 'expo-linear-gradient' // Added from your package
import * as Haptics from 'expo-haptics' // Added from your package
import * as Clipboard from 'expo-clipboard' // Added from your package
import { fetchStores } from '../redux/features/Stores/StoreSlice'

const { width } = Dimensions.get('window')
const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN'

const ShopsScreen = () => {
    const dispatch = useDispatch()
    const { stores, isStoreLoading } = useSelector((state) => state.store)
    const [selectedShop, setSelectedShop] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        dispatch(fetchStores())
    }, [dispatch])

    useEffect(() => {
        if (stores?.length > 0 && !selectedShop) setSelectedShop(stores[0])
    }, [stores])

    const handleSelectShop = (item) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) // Premium feel
        setSelectedShop(item)
    }

    const copyToClipboard = async (address) => {
        await Clipboard.setStringAsync(address)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        // You can trigger your flash message here if you want
    }

    const openInGoogleMaps = (shop) => {
        const target = shop || selectedShop
        if (!target) return
        const url =
            target.location.gmapsLink ||
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(target.location.address)}`
        Linking.openURL(url)
    }

    const renderShopCard = ({ item }) => {
        const isActive = selectedShop?._id === item._id

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleSelectShop(item)}
                style={[styles.card, isActive && styles.cardActive]}
            >
                <View
                    style={[
                        styles.indicator,
                        { backgroundColor: isActive ? '#4285F4' : '#E1E8EE' },
                    ]}
                />

                <View style={styles.cardMain}>
                    <View style={styles.cardHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.shopType}>{item.type}</Text>
                            <Text style={styles.shopName}>{item.name}</Text>
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

                    <TouchableOpacity
                        onLongPress={() =>
                            copyToClipboard(item.location.address)
                        }
                    >
                        <Text style={styles.shopAddress} numberOfLines={1}>
                            {item.location.address}
                        </Text>
                    </TouchableOpacity>

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
            <StatusBar barStyle="dark-content" />

            <View style={styles.navHeader}>
                <Text style={styles.navSubtitle}>RK ELECTRONICS</Text>
                <Text style={styles.navTitle}>Store Locator</Text>
            </View>

            {selectedShop && (
                <View style={styles.mapWrapper}>
                    <View style={styles.mapHero}>
                        <Image
                            style={styles.mapImg}
                            source={{
                                uri: 'https://content3.jdmagicbox.com/v2/comp/bellary/dc/9999p8392.8392.131002154111.v8d2dc/catalogue/r-k-electronics-brahmin-street-bellary-bellary-electronic-goods-showrooms-rl150r00s3.jpg',
                            }}
                        />
                        {/* Gradient makes the white text pop */}
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.8)']}
                            style={styles.gradient}
                        />

                        <View style={styles.mapContent}>
                            <Text style={styles.heroName}>
                                {selectedShop.name}
                            </Text>
                            <Text style={styles.heroSub}>
                                {selectedShop.location.area},{' '}
                                {selectedShop.location.city}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.fab}
                            onPress={() => openInGoogleMaps()}
                        >
                            <MaterialCommunityIcons
                                name="directions"
                                size={22}
                                color="#FFF"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <FlatList
                data={stores}
                renderItem={renderShopCard}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.list}
                ListHeaderComponent={
                    <Text style={styles.listLabel}>Available Branches</Text>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => dispatch(fetchStores())}
                    />
                }
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    navHeader: { paddingHorizontal: 24, paddingVertical: 15 },
    navSubtitle: {
        fontSize: 10,
        fontWeight: '800',
        color: '#4285F4',
        letterSpacing: 1.5,
    },
    navTitle: { fontSize: 28, fontWeight: '900', color: '#1A1A1A' },

    mapWrapper: { paddingHorizontal: 20, marginBottom: 15 },
    mapHero: {
        height: 200,
        borderRadius: 28,
        overflow: 'hidden',
        backgroundColor: '#F8F9FA',
    },
    mapImg: { width: '100%', height: '100%' },
    gradient: { ...StyleSheet.absoluteFillObject },

    mapContent: { position: 'absolute', bottom: 20, left: 20 },
    heroName: { color: '#FFF', fontSize: 18, fontWeight: '800' },
    heroSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },

    fab: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#4285F4',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },

    list: { paddingHorizontal: 20, paddingBottom: 50 },
    listLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#A0A0A0',
        textTransform: 'uppercase',
        marginBottom: 15,
    },

    card: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F0F2F5',
    },
    cardActive: { borderColor: '#4285F4', backgroundColor: '#F9FBFF' },
    indicator: {
        width: 5,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    cardMain: { flex: 1, padding: 16 },
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
    shopName: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
    mapActionBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
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
