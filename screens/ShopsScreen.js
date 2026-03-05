import React, { useEffect, useState, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Linking,
    Image,
    SafeAreaView,
    RefreshControl,
    StatusBar,
    Platform,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import * as Clipboard from 'expo-clipboard'
import { fetchStores } from '../redux/features/Stores/StoreSlice'
import { useTheme } from '../theme/ThemeProvider'
import { COLORS } from '../constants'

const ShopsScreen = () => {
    const dispatch = useDispatch()
    const { colors, dark } = useTheme()
    const { stores, isStoreLoading } = useSelector((state) => state.store)
    const [selectedShop, setSelectedShop] = useState(null)

    useEffect(() => {
        dispatch(fetchStores())
    }, [dispatch])

    useEffect(() => {
        if (stores?.length > 0 && !selectedShop) setSelectedShop(stores[0])
    }, [stores, selectedShop])

    const handleSelectShop = useCallback(
        (item) => {
            if (selectedShop?._id !== item._id) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                setSelectedShop(item)
            }
        },
        [selectedShop]
    )

    const copyToClipboard = async (address) => {
        await Clipboard.setStringAsync(address)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    }

    const openMap = (address) => {
        const addr = encodeURIComponent(address)
        const url = Platform.select({
            ios: `maps:0,0?q=${addr}`,
            android: `geo:0,0?q=${addr}`,
        })
        Linking.openURL(url)
    }

    const renderShopCard = useCallback(
        ({ item }) => {
            const isActive = selectedShop?._id === item._id

            return (
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => handleSelectShop(item)}
                    style={[
                        styles.card,
                        {
                            backgroundColor: dark ? '#1C1C1E' : '#FFF',
                            borderColor: isActive
                                ? COLORS.primary
                                : dark
                                  ? '#2C2C2E'
                                  : '#F0F2F5',
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.indicator,
                            {
                                backgroundColor: isActive
                                    ? COLORS.primary
                                    : dark
                                      ? '#3A3A3C'
                                      : '#E1E8EE',
                            },
                        ]}
                    />
                    <View style={styles.cardMain}>
                        <View style={styles.cardHeader}>
                            <View style={{ flex: 1 }}>
                                <View style={styles.statusBadge}>
                                    <Text style={styles.shopType}>
                                        {item.type?.replace('_', ' ')}
                                    </Text>
                                </View>
                                <Text
                                    style={[
                                        styles.shopName,
                                        { color: colors.text },
                                    ]}
                                >
                                    {item.name}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={[
                                    styles.mapActionBtn,
                                    {
                                        backgroundColor: dark
                                            ? '#2C2C2E'
                                            : '#F8F9FA',
                                    },
                                ]}
                                onPress={() => openMap(item.location.address)}
                            >
                                <MaterialCommunityIcons
                                    name="google-maps"
                                    size={18}
                                    color="#EA4335"
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onLongPress={() =>
                                copyToClipboard(item.location.address)
                            }
                        >
                            <Text
                                style={[
                                    styles.shopAddress,
                                    { color: dark ? '#A0A0A0' : '#666' },
                                ]}
                                numberOfLines={2}
                            >
                                {item.location.address}
                            </Text>
                        </TouchableOpacity>
                        <View
                            style={[
                                styles.cardFooter,
                                {
                                    borderTopColor: dark
                                        ? '#2C2C2E'
                                        : '#F0F2F5',
                                },
                            ]}
                        >
                            <View style={styles.timingRow}>
                                <MaterialCommunityIcons
                                    name="clock-outline"
                                    size={14}
                                    color={dark ? '#8E8E93' : '#666'}
                                />
                                <Text
                                    style={[
                                        styles.timingSmall,
                                        { color: dark ? '#8E8E93' : '#666' },
                                    ]}
                                >
                                    {item.timings?.open} - {item.timings?.close}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() =>
                                    Linking.openURL(`tel:${item.contact.phone}`)
                                }
                                style={[
                                    styles.callTouch,
                                    {
                                        backgroundColor: dark
                                            ? '#263238'
                                            : '#E8F0FE',
                                    },
                                ]}
                            >
                                <MaterialCommunityIcons
                                    name="phone"
                                    size={12}
                                    color={COLORS.primary}
                                />
                                <Text style={styles.callText}>Call Store</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        },
        [selectedShop, dark, colors.text, handleSelectShop]
    )

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

            {/* FIXED SECTION: Header & Map */}
            <View style={styles.fixedHeader}>
                <View style={styles.navHeader}>
                    <Text style={styles.navSubtitle}>RK ELECTRONICS</Text>
                    <Text style={[styles.navTitle, { color: colors.text }]}>
                        Store Locator
                    </Text>
                </View>

                {selectedShop && (
                    <View style={styles.mapWrapper}>
                        <View
                            style={[
                                styles.mapHero,
                                {
                                    backgroundColor: dark
                                        ? '#2C2C2E'
                                        : '#F0F0F0',
                                },
                            ]}
                        >
                            <Image
                                style={styles.mapImg}
                                source={{
                                    uri: 'https://content3.jdmagicbox.com/v2/comp/bellary/dc/9999p8392.8392.131002154111.v8d2dc/catalogue/r-k-electronics-brahmin-street-bellary-bellary-electronic-goods-showrooms-rl150r00s3.jpg',
                                }}
                            />
                            <LinearGradient
                                colors={[
                                    'transparent',
                                    dark
                                        ? 'rgba(0,0,0,0.9)'
                                        : 'rgba(0,0,0,0.6)',
                                ]}
                                style={styles.gradient}
                            />
                            <View style={styles.mapContent}>
                                <Text style={styles.heroName}>
                                    {selectedShop.name}
                                </Text>
                                <Text style={styles.heroSub}>
                                    {selectedShop.location?.area?.replace(
                                        '-',
                                        ' '
                                    )}
                                    , {selectedShop.location?.city}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.fab}
                                onPress={() =>
                                    openMap(selectedShop.location.address)
                                }
                            >
                                <MaterialCommunityIcons
                                    name="directions"
                                    size={24}
                                    color="#FFF"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                <Text
                    style={[
                        styles.listLabel,
                        { color: dark ? '#8E8E93' : '#A0A0A0' },
                    ]}
                >
                    Available Branches
                </Text>
            </View>

            {/* SCROLLABLE SECTION: Branch List */}
            <FlatList
                data={stores}
                renderItem={renderShopCard}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={Platform.OS === 'android'}
                initialNumToRender={5}
                refreshControl={
                    <RefreshControl
                        refreshing={isStoreLoading}
                        onRefresh={() => dispatch(fetchStores())}
                        tintColor={COLORS.primary}
                    />
                }
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    fixedHeader: {
        zIndex: 10,
        backgroundColor: 'transparent', // Change to colors.background if you want it solid
    },
    navHeader: { paddingHorizontal: 16, paddingTop: 15, marginBottom: 10 },
    navSubtitle: {
        fontSize: 10,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: 1.5,
    },
    navTitle: { fontSize: 16, fontWeight: '900', marginTop: 2 },
    mapWrapper: { paddingHorizontal: 16, marginBottom: 15 },
    mapHero: {
        height: 180,
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 4,
    },
    mapImg: { width: '100%', height: '100%', opacity: 0.9 },
    gradient: { ...StyleSheet.absoluteFillObject },
    mapContent: { position: 'absolute', bottom: 16, left: 16, right: 80 },
    heroName: { color: '#FFF', fontSize: 20, fontWeight: '800' },
    heroSub: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        marginTop: 2,
        textTransform: 'capitalize',
    },
    fab: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: COLORS.primary,
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
    },
    list: {
        paddingTop: 10,
        paddingBottom: Platform.OS === 'ios' ? 110 : 90, // Accounts for overlapping Bottom Nav
    },
    listLabel: {
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
        marginBottom: 10,
        paddingHorizontal: 18,
        letterSpacing: 1,
    },
    card: {
        flexDirection: 'row',
        borderRadius: 18,
        marginHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        elevation: 2,
    },
    indicator: {
        width: 5,
        borderTopLeftRadius: 18,
        borderBottomLeftRadius: 18,
    },
    cardMain: { flex: 1, padding: 14 },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    shopType: {
        fontSize: 9,
        fontWeight: '800',
        color: COLORS.primary,
        textTransform: 'uppercase',
    },
    shopName: { fontSize: 16, fontWeight: '700' },
    mapActionBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shopAddress: { fontSize: 13, marginTop: 6, lineHeight: 18 },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 1,
    },
    timingRow: { flexDirection: 'row', alignItems: 'center' },
    timingSmall: { fontSize: 12, fontWeight: '600', marginLeft: 6 },
    callTouch: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    callText: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.primary,
        marginLeft: 6,
    },
})

export default ShopsScreen
