import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Animated,
    Dimensions,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as Clipboard from 'expo-clipboard'

const { width } = Dimensions.get('window')

const CouponsScreen = () => {
    const [loading, setLoading] = useState(true)
    const [coupons, setCoupons] = useState([])
    const [copiedId, setCopiedId] = useState(null)

    useEffect(() => {
        // Simulate API Fetch with RK Electronics specific data
        setTimeout(() => {
            setCoupons([
                {
                    id: '1',
                    code: 'RKESTAR20',
                    discount: '20% OFF',
                    desc: 'On all AC installations',
                    expiry: 'Ends 15 Feb',
                    color: '#004AAD',
                },
                {
                    id: '2',
                    code: 'SAVE500',
                    discount: '₹500 OFF',
                    desc: 'Min. purchase of ₹10,000',
                    expiry: 'Valid for 3 days',
                    color: '#E91E63',
                },
                {
                    id: '3',
                    code: 'FREEFIX',
                    discount: 'FREE SVC',
                    desc: 'First service for new users',
                    expiry: 'Limited Period',
                    color: '#4CAF50',
                },
            ])
            setLoading(false)
        }, 800)
    }, [])

    const copyToClipboard = async (code, id) => {
        await Clipboard.setStringAsync(code)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000) // Reset success state
    }

    const renderCoupon = ({ item }) => {
        const isCopied = copiedId === item.id

        return (
            <View style={styles.couponWrapper}>
                <View style={styles.couponCard}>
                    {/* Left Discount Section */}
                    <View
                        style={[
                            styles.leftTab,
                            { backgroundColor: item.color },
                        ]}
                    >
                        <Text style={styles.discountText}>{item.discount}</Text>
                        <View style={styles.dashLine} />
                        <MaterialCommunityIcons
                            name="ticket-percent"
                            size={24}
                            color="rgba(255,255,255,0.5)"
                        />
                    </View>

                    {/* Right Content Section */}
                    <View style={styles.rightContent}>
                        <View>
                            <Text style={styles.couponDesc}>{item.desc}</Text>
                            <Text style={styles.expiryText}>{item.expiry}</Text>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                                styles.codeContainer,
                                isCopied && {
                                    borderColor: '#4CAF50',
                                    backgroundColor: '#E8F5E9',
                                },
                            ]}
                            onPress={() => copyToClipboard(item.code, item.id)}
                        >
                            <Text
                                style={[
                                    styles.codeText,
                                    isCopied && { color: '#2E7D32' },
                                ]}
                            >
                                {isCopied ? 'COPIED!' : item.code}
                            </Text>
                            <MaterialCommunityIcons
                                name={
                                    isCopied ? 'check-circle' : 'content-copy'
                                }
                                size={14}
                                color={isCopied ? '#2E7D32' : '#666'}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Aesthetic Coupon Cutouts */}
                    <View style={styles.cutoutTop} />
                    <View style={styles.cutoutBottom} />
                </View>
            </View>
        )
    }

    if (loading)
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#004AAD" />
                <Text style={styles.loaderText}>
                    Fetching exclusive deals...
                </Text>
            </View>
        )

    return (
        <View style={styles.container}>
            <View style={styles.headerSection}>
                <Text style={styles.headerTitle}>Vouchers</Text>
                <Text style={styles.subTitle}>
                    Exclusive rewards for your tech needs
                </Text>
            </View>

            <FlatList
                data={coupons}
                renderItem={renderCoupon}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FB', paddingHorizontal: 20 },
    headerSection: { marginTop: 50, marginBottom: 25 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A' },
    subTitle: { fontSize: 14, color: '#7C7C7C', marginTop: 4 },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderText: { marginTop: 10, color: '#004AAD', fontWeight: '600' },

    couponWrapper: {
        marginBottom: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    couponCard: {
        backgroundColor: '#fff',
        height: 110,
        borderRadius: 16,
        flexDirection: 'row',
        overflow: 'hidden', // Required for cutouts
    },
    leftTab: {
        width: '32%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    dashLine: {
        height: 1,
        width: '60%',
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginVertical: 8,
    },
    discountText: {
        color: '#fff',
        fontWeight: '900',
        textAlign: 'center',
        fontSize: 18,
    },
    rightContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 15,
        justifyContent: 'space-between',
    },
    couponDesc: { fontSize: 15, fontWeight: '700', color: '#333' },
    expiryText: { fontSize: 12, color: '#9E9E9E', marginTop: 2 },

    codeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
        borderStyle: 'dashed',
        borderWidth: 1.5,
        borderColor: '#D1D1D1',
    },
    codeText: {
        fontWeight: 'bold',
        marginRight: 8,
        color: '#1A1A1A',
        fontSize: 13,
        letterSpacing: 1,
    },

    // Cutout Circles
    cutoutTop: {
        position: 'absolute',
        top: -10,
        left: '32%',
        marginLeft: -10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F8F9FB', // Matches screen background
    },
    cutoutBottom: {
        position: 'absolute',
        bottom: -10,
        left: '32%',
        marginLeft: -10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F8F9FB',
    },
})

export default CouponsScreen
