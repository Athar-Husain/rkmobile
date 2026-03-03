import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal,
    ActivityIndicator,
    StatusBar,
    Animated,
    AppState,
} from 'react-native'
import {
    Camera,
    useCameraDevice,
    useCodeScanner,
} from 'react-native-vision-camera'
import { useIsFocused } from '@react-navigation/native'
import * as Haptics from 'expo-haptics'
import { DateTime } from 'luxon'
import { useDispatch } from 'react-redux'
import { validateForStaffAction } from '../../redux/features/Coupons/CouponSlice'
import { useNavigation } from '@react-navigation/native'

const StaffScannerScreen = () => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const device = useCameraDevice('back')

    const [hasPermission, setHasPermission] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [couponData, setCouponData] = useState(null)
    const [appState, setAppState] = useState(AppState.currentState)

    const scanAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            (nextState) => {
                setAppState(nextState)
            }
        )
        return () => subscription.remove()
    }, [])

    useEffect(() => {
        ;(async () => {
            const status = await Camera.requestCameraPermission()
            setHasPermission(status === 'granted')
        })()
    }, [])

    useEffect(() => {
        if (
            !confirmModal &&
            !isProcessing &&
            isFocused &&
            appState === 'active'
        ) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scanAnim, {
                        toValue: 210,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scanAnim, {
                        toValue: 0,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                ])
            ).start()
        } else {
            scanAnim.stopAnimation()
        }
    }, [confirmModal, isProcessing, isFocused, appState])

    const handleScan = useCallback(
        (code) => {
            if (isProcessing || confirmModal) return
            setIsProcessing(true)

            dispatch(validateForStaffAction({ code })).then((res) => {
                if (res.meta.requestStatus === 'fulfilled') {
                    Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Success
                    )
                    setCouponData(res.payload)
                    setConfirmModal(true)
                } else {
                    Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Error
                    )
                    Alert.alert('Invalid Coupon', res.payload || 'Try again', [
                        { text: 'OK', onPress: () => setIsProcessing(false) },
                    ])
                }
            })
        },
        [dispatch, isProcessing, confirmModal]
    )

    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13', 'code-128'],
        onCodeScanned: (codes) => {
            if (codes.length > 0 && codes[0].value) handleScan(codes[0].value)
        },
    })

    const formatDate = (data) => {
        const dateStr = data?.userCoupon?.validUntil
        if (!dateStr) return 'N/A'
        return DateTime.fromISO(dateStr).toFormat('dd LLL yyyy')
    }

    const getDaysRemaining = (data) => {
        const dateStr = data?.userCoupon?.validUntil
        if (!dateStr) return null
        const expiry = DateTime.fromISO(dateStr).endOf('day')
        const diff = expiry.diffNow('days').as('days')

        if (diff < 0) return 'Expired'
        return diff < 1 ? 'Expires today' : `${Math.ceil(diff)} days left`
    }

    const isCameraActive =
        isFocused && appState === 'active' && !confirmModal && !isProcessing

    if (!hasPermission || !device) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#004AAD" />
                <Text style={{ marginTop: 12, color: '#64748B' }}>
                    Initializing Camera...
                </Text>
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
                isActive={isCameraActive}
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

                        {isCameraActive && (
                            <Animated.View
                                style={[
                                    styles.scanLine,
                                    { transform: [{ translateY: scanAnim }] },
                                ]}
                            />
                        )}

                        {isProcessing && (
                            <View style={styles.processingOverlay}>
                                <ActivityIndicator size="large" color="#FFF" />
                            </View>
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
                            {/* <div style={styles.divider} /> */}
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
                                Haptics.impactAsync(
                                    Haptics.ImpactFeedbackStyle.Light
                                )
                                navigation.navigate('StaffPOS', { couponData })
                                setConfirmModal(false)
                                setIsProcessing(false)
                            }}
                        >
                            <Text style={styles.actionButtonText}>
                                APPLY & START BILLING
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setConfirmModal(false)
                                setIsProcessing(false)
                            }}
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
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
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
        position: 'relative',
    },
    processingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    scanLine: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        height: 2,
        backgroundColor: '#004AAD',
        elevation: 5,
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
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
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
