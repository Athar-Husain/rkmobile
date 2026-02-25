import React, { useState, useEffect, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal,
    ActivityIndicator,
} from 'react-native'
import {
    Camera,
    useCameraDevice,
    useCodeScanner,
} from 'react-native-vision-camera'
import { useDispatch } from 'react-redux'
import { validateForStaffAction } from '../../redux/features/Coupons/CouponSlice'
import { useNavigation } from '@react-navigation/native'

const StaffScannerScreen = () => {
    const dispatch = useDispatch()
    const navigation = useNavigation()

    const device = useCameraDevice('back')

    const [hasPermission, setHasPermission] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [couponData, setCouponData] = useState(null)

    // Request camera permission
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

    // When QR is detected
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

    if (!hasPermission) {
        return (
            <View style={styles.center}>
                <Text>No Camera Permission</Text>
            </View>
        )
    }

    if (!device) {
        return (
            <View style={styles.center}>
                <Text>Camera Device Not Found</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={!confirmModal && !isProcessing}
                codeScanner={codeScanner}
            />

            {/* Overlay */}
            <View style={styles.overlay}>
                <View style={styles.scannerFrame}>
                    {isProcessing && !confirmModal && (
                        <ActivityIndicator size="large" color="#004AAD" />
                    )}
                </View>
                <Text style={styles.hintText}>
                    {isProcessing
                        ? 'Validating Coupon...'
                        : 'Align QR code within the frame'}
                </Text>
            </View>

            {/* Enquiry Modal */}
            <Modal visible={confirmModal} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Coupon Details</Text>

                        <View style={styles.couponInfo}>
                            <Text style={styles.userName}>
                                {couponData?.user?.name}
                            </Text>

                            <Text style={styles.couponDetail}>
                                {couponData?.coupon?.title}
                            </Text>

                            <View style={styles.discountBadge}>
                                <Text style={styles.discountBadgeText}>
                                    {couponData?.coupon?.type === 'PERCENTAGE'
                                        ? `${couponData?.coupon?.value}% OFF`
                                        : `₹${couponData?.coupon?.value} OFF`}
                                </Text>
                            </View>

                            <Text style={styles.metaText}>
                                Min Purchase: ₹
                                {couponData?.coupon?.minPurchaseAmount}
                            </Text>

                            <Text style={styles.metaText}>
                                Expires: {couponData?.coupon?.expiresAt}
                            </Text>
                        </View>

                        {/* START BILLING */}
                        <TouchableOpacity
                            style={styles.primaryBtn}
                            onPress={() => {
                                navigation.navigate('StaffPOS', {
                                    couponData,
                                })
                                resetScanner()
                            }}
                        >
                            <Text style={styles.primaryBtnText}>
                                START BILLING
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={resetScanner}>
                            <Text style={styles.cancelText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default StaffScannerScreen

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },

    scannerFrame: {
        width: 260,
        height: 260,
        borderWidth: 3,
        borderColor: '#004AAD',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    hintText: {
        color: '#FFF',
        marginTop: 20,
        fontWeight: 'bold',
    },

    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },

    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30,
        alignItems: 'center',
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },

    couponInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },

    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    couponDetail: {
        color: '#666',
        marginVertical: 5,
    },

    discountBadge: {
        backgroundColor: '#E3F2FD',
        padding: 8,
        borderRadius: 8,
        marginTop: 5,
    },

    discountBadgeText: {
        color: '#004AAD',
        fontWeight: 'bold',
    },

    metaText: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },

    primaryBtn: {
        backgroundColor: '#004AAD',
        width: '100%',
        padding: 18,
        borderRadius: 15,
        alignItems: 'center',
    },

    primaryBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },

    cancelText: {
        color: '#FF3B30',
        marginTop: 20,
        fontWeight: 'bold',
    },
})
