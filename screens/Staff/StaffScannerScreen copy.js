import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal,
    TextInput,
} from 'react-native'
import {
    Camera,
    useCameraDevices,
    useFrameProcessor,
} from 'react-native-vision-camera'
import { barcodeScanner } from 'vision-camera-code-scanner' // Optional high-speed scanner
import { useDispatch, useSelector } from 'react-redux'
import {
    validateForStaffAction,
    redeemCouponStaff,
} from '../redux/features/Coupons/CouponSlice'

const StaffScannerScreen = () => {
    const dispatch = useDispatch()
    const devices = useCameraDevices()
    const device = devices.back

    const [hasPermission, setHasPermission] = useState(false)
    const [scannedCode, setScannedCode] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)

    // Redemption Modal State
    const [confirmModal, setConfirmModal] = useState(false)
    const [couponData, setCouponData] = useState(null)
    const [orderAmount, setOrderAmount] = useState('')

    useEffect(() => {
        ;(async () => {
            const status = await Camera.requestCameraPermission()
            setHasPermission(status === 'authorized')
        })()
    }, [])

    // Simulated scanner logic (Simplified for clarity)
    const onCodeScanned = (code) => {
        if (isProcessing || confirmModal) return
        setIsProcessing(true)

        // 1. Validate the code scanned from the QR
        dispatch(validateForStaffAction({ code })).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') {
                setCouponData(res.payload) // Set data returned by validateForStaff
                setScannedCode(code)
                setConfirmModal(true)
            } else {
                Alert.alert('Error', res.payload || 'Invalid Coupon')
                setIsProcessing(false)
            }
        })
    }

    const handleFinalRedeem = () => {
        if (!orderAmount || isNaN(orderAmount)) {
            return Alert.alert('Required', 'Please enter a valid order amount')
        }

        const payload = {
            uniqueCode: scannedCode,
            orderAmount: parseFloat(orderAmount),
            storeId: 'YOUR_STORE_ID', // Usually from staff profile/auth
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
            }
        })
    }

    if (!device || !hasPermission)
        return (
            <View style={styles.center}>
                <Text>Initializing Camera...</Text>
            </View>
        )

    return (
        <View style={styles.container}>
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={!confirmModal}
                // Vision camera frame processor logic goes here in a real app
            />

            {/* Overlay UI */}
            <View style={styles.overlay}>
                <View style={styles.scannerFrame} />
                <Text style={styles.hintText}>
                    Align QR code within the frame
                </Text>
            </View>

            {/* Redemption Confirmation Modal */}
            <Modal visible={confirmModal} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Redeem Coupon</Text>

                        <View style={styles.couponInfo}>
                            <Text style={styles.userName}>
                                {couponData?.user?.name}
                            </Text>
                            <Text style={styles.couponDetail}>
                                {couponData?.coupon?.title}
                            </Text>
                            <Text style={styles.discountBadge}>
                                {couponData?.coupon?.type === 'PERCENTAGE'
                                    ? `${couponData.coupon.value}% OFF`
                                    : `₹${couponData.coupon.value} OFF`}
                            </Text>
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
        color: '#004AAD',
        padding: 8,
        borderRadius: 8,
        fontWeight: 'bold',
        marginTop: 5,
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
