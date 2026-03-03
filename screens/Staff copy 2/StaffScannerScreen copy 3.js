import React, { useState, useEffect, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput,
    ActivityIndicator,
} from 'react-native'
import {
    Camera,
    useCameraDevice,
    useCodeScanner,
} from 'react-native-vision-camera'
import { useDispatch } from 'react-redux'
import {
    validateForStaffAction,
    redeemCouponStaff,
} from '../../redux/features/Coupons/CouponSlice'

const StaffScannerScreen = () => {
    const dispatch = useDispatch()

    // In V4, useCameraDevice('back') is the standard way to get the camera
    const device = useCameraDevice('back')

    const [hasPermission, setHasPermission] = useState(false)
    const [scannedCode, setScannedCode] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)

    // Redemption Modal State
    const [confirmModal, setConfirmModal] = useState(false)
    const [couponData, setCouponData] = useState(null)
    const [orderAmount, setOrderAmount] = useState('')

    // Request Permissions
    useEffect(() => {
        ;(async () => {
            const status = await Camera.requestCameraPermission()
            setHasPermission(status === 'granted')
        })()
    }, [])

    // 1. Logic to handle the scanned code
    const onCodeScanned = useCallback(
        (code) => {
            if (isProcessing || confirmModal) return

            setIsProcessing(true)

            // Validate the code with your Redux action
            dispatch(validateForStaffAction({ code })).then((res) => {
                if (res.meta.requestStatus === 'fulfilled') {
                    setCouponData(res.payload)
                    setScannedCode(code)
                    setConfirmModal(true)
                } else {
                    Alert.alert('Error', res.payload || 'Invalid Coupon', [
                        { text: 'OK', onPress: () => setIsProcessing(false) },
                    ])
                }
            })
        },
        [isProcessing, confirmModal, dispatch]
    )

    // 2. Built-in Code Scanner Configuration (Vision Camera V4)
    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13', 'code-128'], // Add types you need
        onCodeScanned: (codes) => {
            if (codes.length > 0 && codes[0].value) {
                onCodeScanned(codes[0].value)
            }
        },
    })

    const handleFinalRedeem = () => {
        if (!orderAmount || isNaN(orderAmount)) {
            return Alert.alert('Required', 'Please enter a valid order amount')
        }

        const payload = {
            uniqueCode: scannedCode,
            orderAmount: parseFloat(orderAmount),
            // storeId: 'YOUR_STORE_ID',
            
        }

        dispatch(redeemCouponStaff(payload)).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') {
                setConfirmModal(false)
                setScannedCode(null)
                setOrderAmount('')
                setIsProcessing(false)
                Alert.alert(
                    'Success',
                    'Discount Applied and Coupon Marked as Used!'
                )
            } else {
                Alert.alert(
                    'Redemption Failed',
                    res.payload || 'Something went wrong'
                )
            }
        })
    }

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
                isActive={!confirmModal && !isProcessing} // Stop camera when processing
                codeScanner={codeScanner} // Native scanning logic
            />

            {/* Overlay UI */}
            <View style={styles.overlay}>
                <View style={styles.scannerFrame}>
                    {isProcessing && !confirmModal && (
                        <ActivityIndicator size="large" color="#004AAD" />
                    )}
                </View>
                <Text style={styles.hintText}>
                    {isProcessing
                        ? 'Validating...'
                        : 'Align QR code within the frame'}
                </Text>
            </View>

            {/* Redemption Confirmation Modal */}
            <Modal visible={confirmModal} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Redeem Coupon</Text>

                        <View style={styles.couponInfo}>
                            <Text style={styles.userName}>
                                {couponData?.user?.name || 'Customer'}
                            </Text>
                            <Text style={styles.couponDetail}>
                                {couponData?.coupon?.title}
                            </Text>
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountBadgeText}>
                                    {couponData?.coupon?.type === 'PERCENTAGE'
                                        ? `${couponData.coupon.value}% OFF`
                                        : `₹${couponData?.coupon?.value} OFF`}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.inputLabel}>
                            Enter Total Bill Amount (₹)
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 1200"
                            keyboardType="numeric"
                            value={orderAmount}
                            onChangeText={setOrderAmount}
                            autoFocus
                        />

                        <TouchableOpacity
                            style={styles.redeemBtn}
                            onPress={handleFinalRedeem}
                        >
                            <Text style={styles.redeemBtnText}>
                                CONFIRM REDEMPTION
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setConfirmModal(false)
                                setIsProcessing(false)
                                setScannedCode(null)
                            }}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
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
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    scannerFrame: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: '#004AAD',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hintText: { color: '#FFF', marginTop: 20, fontWeight: 'bold' },
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
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    couponInfo: { alignItems: 'center', marginBottom: 20 },
    userName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    couponDetail: { color: '#666', marginVertical: 4 },
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
    inputLabel: {
        alignSelf: 'flex-start',
        color: '#666',
        marginBottom: 8,
        fontSize: 12,
    },
    input: {
        width: '100%',
        height: 55,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 20,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    redeemBtn: {
        backgroundColor: '#004AAD',
        width: '100%',
        padding: 18,
        borderRadius: 15,
        alignItems: 'center',
    },
    redeemBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    cancelText: { color: '#FF3B30', marginTop: 20, fontWeight: 'bold' },
})

export default StaffScannerScreen
