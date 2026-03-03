import React, { useState, useEffect, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal,
    ActivityIndicator,
    StatusBar,
    Dimensions,
} from 'react-native'
import {
    Camera,
    useCameraDevice,
    useCodeScanner,
} from 'react-native-vision-camera'
import { useDispatch } from 'react-redux'
import { validateForStaffAction } from '../../redux/features/Coupons/CouponSlice'
import { useNavigation } from '@react-navigation/native'

const { width } = Dimensions.get('window')

const StaffScannerScreen = () => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const device = useCameraDevice('back')

    const [hasPermission, setHasPermission] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [couponData, setCouponData] = useState(null)

    useEffect(() => {
        ;(async () => {
            const status = await Camera.requestCameraPermission()
            setHasPermission(status === 'granted')
        })()
    }, [])

    const resetScanner = () => {
        setConfirmModal(false)
        setCouponData(null)
        setIsProcessing(false)
    }

    const handleScan = useCallback(
        (code) => {
            if (isProcessing || confirmModal) return
            setIsProcessing(true)

            dispatch(validateForStaffAction({ code })).then((res) => {
                if (res.meta.requestStatus === 'fulfilled') {
                    setCouponData(res.payload)
                    setConfirmModal(true)
                } else {
                    Alert.alert('Invalid Coupon', res.payload || 'Try again')
                    setIsProcessing(false)
                }
            })
        },
        [dispatch, isProcessing, confirmModal]
    )

    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13', 'code-128'],
        onCodeScanned: (codes) => {
            if (codes.length > 0 && codes[0].value) {
                handleScan(codes[0].value)
            }
        },
    })

    // Updated expiry logic: uses userCoupon
    const formatDate = (couponData) => {
        const userCoupon = couponData?.userCoupon
        if (!userCoupon?.validUntil) return 'N/A'
        const date = new Date(userCoupon.validUntil)
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    }

    const getDaysRemaining = (couponData) => {
        const userCoupon = couponData?.userCoupon
        if (!userCoupon?.validUntil) return null
        const diffTime = new Date(userCoupon.validUntil) - new Date()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        if (diffDays > 0) return `${diffDays} days left`
        return 'Expires today'
    }

    if (!hasPermission || !device) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#004AAD" />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="light-content"
                translucent
                backgroundColor="transparent"
            />

            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={!confirmModal && !isProcessing}
                codeScanner={codeScanner}
            />

            <View style={styles.overlayContainer}>
                <View style={styles.maskTop} />
                <View style={styles.maskMiddle}>
                    <View style={styles.maskSide} />
                    <View style={styles.focusedSpace}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                        {isProcessing && (
                            <ActivityIndicator size="large" color="#FFF" />
                        )}
                    </View>
                    <View style={styles.maskSide} />
                </View>
                <View style={styles.maskBottom}>
                    <Text style={styles.hintText}>
                        {isProcessing ? 'VERIFYING...' : 'ALIGN QR TO SCAN'}
                    </Text>
                </View>
            </View>

            <Modal visible={confirmModal} animationType="slide" transparent>
                <View style={styles.modalBackdrop}>
                    <View style={styles.bottomSheet}>
                        <View style={styles.handle} />

                        <View style={styles.statusHeader}>
                            <View style={styles.validBadge}>
                                <Text style={styles.validBadgeText}>
                                    VALID COUPON
                                </Text>
                            </View>
                        </View>

                        <View style={styles.card}>
                            <View style={styles.userInfoRow}>
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarText}>
                                        {couponData?.user?.name?.charAt(0)}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.userNameText}>
                                        {couponData?.user?.name}
                                    </Text>
                                    <Text style={styles.userSubText}>
                                        {couponData?.user?.maskedMobile ||
                                            couponData?.user?.mobile}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <Text style={styles.couponTitle}>
                                {couponData?.coupon?.title}
                            </Text>

                            <View style={styles.valueRow}>
                                <Text style={styles.valueAmount}>
                                    {couponData?.coupon?.type === 'PERCENTAGE'
                                        ? `${couponData?.coupon?.value}%`
                                        : `₹${couponData?.coupon?.value}`}
                                </Text>
                                <Text style={styles.valueLabel}>OFF</Text>
                            </View>

                            <View style={styles.infoGrid}>
                                <View style={styles.gridItem}>
                                    <Text style={styles.gridLabel}>
                                        MINIMUM BILL
                                    </Text>
                                    <Text style={styles.gridValue}>
                                        ₹
                                        {couponData?.coupon?.minPurchaseAmount?.toLocaleString()}
                                    </Text>
                                </View>
                                <View
                                    style={[
                                        styles.gridItem,
                                        { alignItems: 'flex-end' },
                                    ]}
                                >
                                    <Text style={styles.gridLabel}>
                                        EXPIRES ON
                                    </Text>
                                    <Text style={styles.gridValue}>
                                        {formatDate(couponData)}
                                    </Text>
                                    <Text style={styles.expiryCount}>
                                        {getDaysRemaining(couponData)}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => {
                                navigation.navigate('StaffPOS', { couponData })
                                resetScanner()
                            }}
                        >
                            <Text style={styles.actionButtonText}>
                                APPLY & START BILLING
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={resetScanner}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>CANCEL</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    overlayContainer: { ...StyleSheet.absoluteFillObject },
    maskTop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
    maskBottom: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        alignItems: 'center',
        paddingTop: 40,
    },
    maskMiddle: { flexDirection: 'row', height: 260 },
    maskSide: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
    focusedSpace: {
        width: 260,
        height: 260,
        justifyContent: 'center',
        alignItems: 'center',
    },
    corner: {
        width: 35,
        height: 35,
        borderColor: '#004AAD',
        position: 'absolute',
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 5,
        borderLeftWidth: 5,
        borderTopLeftRadius: 15,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: 5,
        borderRightWidth: 5,
        borderTopRightRadius: 15,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 5,
        borderLeftWidth: 5,
        borderBottomLeftRadius: 15,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 5,
        borderRightWidth: 5,
        borderBottomRightRadius: 15,
    },
    hintText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 2,
        opacity: 0.9,
    },

    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 12,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },

    statusHeader: { alignItems: 'center', marginBottom: 15 },
    validBadge: {
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    validBadgeText: {
        color: '#15803D',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1,
    },

    card: {
        backgroundColor: '#F8FAFC',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 25,
    },
    userInfoRow: { flexDirection: 'row', alignItems: 'center' },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#004AAD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 20 },
    userNameText: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
    userSubText: { fontSize: 14, color: '#64748B', marginTop: 2 },

    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 20,
        borderStyle: 'dashed',
    },

    couponTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#94A3B8',
        textAlign: 'center',
        letterSpacing: 1,
    },
    valueRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginVertical: 10,
    },
    valueAmount: { fontSize: 48, fontWeight: '900', color: '#004AAD' },
    valueLabel: {
        fontSize: 16,
        fontWeight: '800',
        color: '#004AAD',
        marginLeft: 4,
    },

    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    gridItem: { flex: 1 },
    gridLabel: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    gridValue: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1E293B',
        marginTop: 2,
    },
    expiryCount: {
        fontSize: 11,
        color: '#EF4444',
        fontWeight: '700',
        marginTop: 2,
    },

    actionButton: {
        backgroundColor: '#004AAD',
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#004AAD',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
    },
    actionButtonText: {
        color: '#FFF',
        fontWeight: '900',
        fontSize: 16,
        letterSpacing: 1,
    },
    closeButton: { marginTop: 20, padding: 10 },
    closeButtonText: {
        color: '#64748B',
        fontWeight: '700',
        textAlign: 'center',
        fontSize: 14,
    },
})

export default StaffScannerScreen
