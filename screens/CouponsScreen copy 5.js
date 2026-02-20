// import React, { useState, useEffect } from 'react'
// import {
//     View,
//     Text,
//     FlatList,
//     StyleSheet,
//     TouchableOpacity,
//     ActivityIndicator,
//     Modal,
//     Pressable,
//     SafeAreaView,
//     Dimensions,
// } from 'react-native'
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
// import * as Clipboard from 'expo-clipboard'
// import Barcode from '@kichiyaki/react-native-barcode-generator' // Using your existing dependency
// import { useDispatch, useSelector } from 'react-redux'
// import { useFocusEffect } from '@react-navigation/native'
// import {
//     fetchMyCoupons,
//     claimCouponAction,
// } from '../redux/features/Coupons/CouponSlice'

// const { width } = Dimensions.get('window')

// const CouponsScreen = () => {
//     const dispatch = useDispatch()
//     const [activeTab, setActiveTab] = useState('active')
//     const [modalVisible, setModalVisible] = useState(false)
//     const [selectedCoupon, setSelectedCoupon] = useState(null)
//     const [copiedId, setCopiedId] = useState(null)

//     // Get data from your Redux state
//     const { myCoupons, isCouponLoading } = useSelector((state) => state.coupon)

//     useFocusEffect(
//         React.useCallback(() => {
//             dispatch(fetchMyCoupons())
//         }, [dispatch])
//     )

//     // Filter logic based on the backend status field
//     const filteredCoupons =
//         myCoupons?.filter((c) =>
//             activeTab === 'active'
//                 ? c.status === 'ACTIVE'
//                 : c.status !== 'ACTIVE'
//         ) || []

//     // Calculate savings from redeemed coupons
//     const totalSaved =
//         myCoupons
//             ?.filter((c) => c.status === 'REDEEMED')
//             .reduce((sum, item) => sum + (item.savingsValue || 0), 0) || 0

//     const copyToClipboard = async (code, id) => {
//         await Clipboard.setStringAsync(code)
//         setCopiedId(id)
//         setTimeout(() => setCopiedId(null), 2000)
//     }

//     const renderCoupon = ({ item }) => {
//         const isHistory = item.status !== 'ACTIVE'
//         const themeColor = item.color || '#004AAD'

//         return (
//             <View
//                 style={[
//                     styles.couponWrapper,
//                     isHistory && styles.historyOpacity,
//                 ]}
//             >
//                 <TouchableOpacity
//                     activeOpacity={isHistory ? 1 : 0.8}
//                     onPress={() => {
//                         if (!isHistory) {
//                             setSelectedCoupon(item)
//                             setModalVisible(true)
//                         }
//                     }}
//                     style={styles.couponCard}
//                 >
//                     <View
//                         style={[
//                             styles.leftTab,
//                             {
//                                 backgroundColor: isHistory
//                                     ? '#BDC3C7'
//                                     : themeColor,
//                             },
//                         ]}
//                     >
//                         <Text style={styles.discountText}>
//                             {item.discountType === 'PERCENTAGE'
//                                 ? `${item.discountValue}%`
//                                 : `₹${item.discountValue}`}
//                             {'\n'}OFF
//                         </Text>
//                         <MaterialCommunityIcons
//                             name={
//                                 item.status === 'REDEEMED'
//                                     ? 'check-circle'
//                                     : item.status === 'EXPIRED'
//                                       ? 'close-circle'
//                                       : 'ticket-percent'
//                             }
//                             size={20}
//                             color="white"
//                         />
//                     </View>

//                     <View style={styles.rightContent}>
//                         <View style={styles.cardHeader}>
//                             <Text style={styles.couponDesc} numberOfLines={2}>
//                                 {item.title}
//                             </Text>
//                             {isHistory && (
//                                 <View
//                                     style={[
//                                         styles.statusBadge,
//                                         {
//                                             backgroundColor:
//                                                 item.status === 'EXPIRED'
//                                                     ? '#FDEDEC'
//                                                     : '#EAFAF1',
//                                         },
//                                     ]}
//                                 >
//                                     <Text
//                                         style={[
//                                             styles.statusText,
//                                             {
//                                                 color:
//                                                     item.status === 'EXPIRED'
//                                                         ? '#E74C3C'
//                                                         : '#27AE60',
//                                             },
//                                         ]}
//                                     >
//                                         {item.status}
//                                     </Text>
//                                 </View>
//                             )}
//                         </View>

//                         <TouchableOpacity
//                             disabled={isHistory}
//                             onPress={() => copyToClipboard(item.code, item._id)}
//                             style={[
//                                 styles.codeContainer,
//                                 copiedId === item._id && styles.copiedContainer,
//                             ]}
//                         >
//                             <Text
//                                 style={[
//                                     styles.codeText,
//                                     isHistory && { color: '#999' },
//                                 ]}
//                             >
//                                 {copiedId === item._id ? 'COPIED!' : item.code}
//                             </Text>
//                             {!isHistory && (
//                                 <MaterialCommunityIcons
//                                     name="content-copy"
//                                     size={14}
//                                     color="#004AAD"
//                                 />
//                             )}
//                         </TouchableOpacity>
//                     </View>

//                     <View style={styles.cutoutTop} />
//                     <View style={styles.cutoutBottom} />
//                 </TouchableOpacity>
//             </View>
//         )
//     }

//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={{ flex: 1 }}>
//                 {/* Header / Savings Dashboard */}
//                 <View style={styles.header}>
//                     <Text style={styles.headerTitle}>Rewards Center</Text>
//                     <View style={styles.dashboardCard}>
//                         <View>
//                             <Text style={styles.dashLabel}>
//                                 Lifetime Savings
//                             </Text>
//                             <Text style={styles.dashAmount}>₹{totalSaved}</Text>
//                         </View>
//                         <View style={styles.progressContainer}>
//                             <Text style={styles.progressText}>
//                                 Platinum Member
//                             </Text>
//                             <View style={styles.progressBarBg}>
//                                 <View
//                                     style={[
//                                         styles.progressBarFill,
//                                         { width: '85%' },
//                                     ]}
//                                 />
//                             </View>
//                         </View>
//                     </View>
//                 </View>

//                 {/* Navigation Tabs */}
//                 <View style={styles.tabContainer}>
//                     {['active', 'history'].map((tab) => (
//                         <TouchableOpacity
//                             key={tab}
//                             style={[
//                                 styles.tab,
//                                 activeTab === tab && styles.activeTab,
//                             ]}
//                             onPress={() => setActiveTab(tab)}
//                         >
//                             <Text
//                                 style={[
//                                     styles.tabText,
//                                     activeTab === tab && styles.activeTabText,
//                                 ]}
//                             >
//                                 {tab === 'active'
//                                     ? 'Available'
//                                     : 'Past Vouchers'}
//                             </Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>

//                 {isCouponLoading ? (
//                     <ActivityIndicator
//                         size="large"
//                         color="#004AAD"
//                         style={{ marginTop: 50 }}
//                     />
//                 ) : (
//                     <FlatList
//                         data={filteredCoupons}
//                         renderItem={renderCoupon}
//                         keyExtractor={(item) => item._id}
//                         contentContainerStyle={styles.listPadding}
//                         showsVerticalScrollIndicator={false}
//                         ListEmptyComponent={
//                             <View style={styles.emptyState}>
//                                 <MaterialCommunityIcons
//                                     name="ticket-outline"
//                                     size={80}
//                                     color="#DCDDE1"
//                                 />
//                                 <Text style={styles.emptyTitle}>
//                                     No Vouchers Yet
//                                 </Text>
//                                 <Text style={styles.emptySub}>
//                                     Vouchers you claim will appear here.
//                                 </Text>
//                             </View>
//                         }
//                     />
//                 )}

//                 {/* QR Modal for Store Redemption */}
//                 <Modal
//                     animationType="fade"
//                     transparent
//                     visible={modalVisible}
//                     onRequestClose={() => setModalVisible(false)}
//                 >
//                     <Pressable
//                         style={styles.modalOverlay}
//                         onPress={() => setModalVisible(false)}
//                     >
//                         <View style={styles.modalContent}>
//                             <View
//                                 style={[
//                                     styles.modalHeader,
//                                     {
//                                         backgroundColor:
//                                             selectedCoupon?.color || '#004AAD',
//                                     },
//                                 ]}
//                             >
//                                 <Text style={styles.modalHeaderText}>
//                                     Redeem at Store
//                                 </Text>
//                             </View>
//                             <View style={styles.modalBody}>
//                                 <Text style={styles.modalDesc}>
//                                     {selectedCoupon?.title}
//                                 </Text>

//                                 <View style={styles.qrFrame}>
//                                     {selectedCoupon && (
//                                         <Barcode
//                                             value={selectedCoupon._id} // Sending MongoID for staff scanning
//                                             format="QR"
//                                             maxWidth={width * 0.6}
//                                             height={width * 0.6}
//                                         />
//                                     )}
//                                 </View>

//                                 <Text style={styles.modalCodeDisplay}>
//                                     {selectedCoupon?.code}
//                                 </Text>
//                                 <Text style={styles.modalHint}>
//                                     Let the store executive scan this QR to
//                                     apply your discount.
//                                 </Text>

//                                 <TouchableOpacity
//                                     style={styles.doneButton}
//                                     onPress={() => setModalVisible(false)}
//                                 >
//                                     <Text style={styles.doneButtonText}>
//                                         Done
//                                     </Text>
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
//                     </Pressable>
//                 </Modal>
//             </View>
//         </SafeAreaView>
//     )
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#F8F9FB' },
//     header: { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 20 },
//     headerTitle: {
//         fontSize: 28,
//         fontWeight: 'bold',
//         color: '#1A1A1A',
//         marginBottom: 20,
//     },
//     dashboardCard: {
//         backgroundColor: '#004AAD',
//         borderRadius: 20,
//         padding: 20,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     dashLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
//     dashAmount: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
//     progressContainer: { alignItems: 'flex-end', width: '40%' },
//     progressText: { color: '#FFF', fontSize: 10, marginBottom: 5 },
//     progressBarBg: {
//         width: '100%',
//         height: 6,
//         backgroundColor: 'rgba(255,255,255,0.2)',
//         borderRadius: 3,
//     },
//     progressBarFill: { height: 6, backgroundColor: '#FFF', borderRadius: 3 },
//     tabContainer: {
//         flexDirection: 'row',
//         marginHorizontal: 20,
//         marginBottom: 20,
//         backgroundColor: '#EEE',
//         borderRadius: 12,
//         padding: 4,
//     },
//     tab: {
//         flex: 1,
//         paddingVertical: 10,
//         alignItems: 'center',
//         borderRadius: 10,
//     },
//     activeTab: { backgroundColor: '#FFF', elevation: 2 },
//     tabText: { fontSize: 14, color: '#7F8C8D', fontWeight: '600' },
//     activeTabText: { color: '#004AAD' },
//     listPadding: { paddingHorizontal: 20, paddingBottom: 30 },
//     couponWrapper: { marginBottom: 15 },
//     historyOpacity: { opacity: 0.6 },
//     couponCard: {
//         backgroundColor: '#FFF',
//         borderRadius: 16,
//         height: 110,
//         flexDirection: 'row',
//         overflow: 'hidden',
//         elevation: 3,
//     },
//     leftTab: { width: '28%', justifyContent: 'center', alignItems: 'center' },
//     discountText: {
//         color: '#FFF',
//         fontWeight: 'bold',
//         fontSize: 16,
//         textAlign: 'center',
//     },
//     rightContent: { flex: 1, padding: 15, justifyContent: 'space-between' },
//     cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
//     couponDesc: { fontSize: 14, fontWeight: '700', color: '#2C3E50', flex: 1 },
//     codeContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         alignSelf: 'flex-start',
//         padding: 8,
//         borderRadius: 8,
//         backgroundColor: '#F0F5FF',
//         borderStyle: 'dashed',
//         borderWidth: 1,
//         borderColor: '#004AAD',
//     },
//     copiedContainer: { backgroundColor: '#EAFAF1', borderColor: '#27AE60' },
//     codeText: {
//         fontSize: 12,
//         fontWeight: 'bold',
//         color: '#004AAD',
//         marginRight: 10,
//     },
//     cutoutTop: {
//         position: 'absolute',
//         top: -10,
//         left: '28%',
//         marginLeft: -10,
//         width: 20,
//         height: 20,
//         borderRadius: 10,
//         backgroundColor: '#F8F9FB',
//     },
//     cutoutBottom: {
//         position: 'absolute',
//         bottom: -10,
//         left: '28%',
//         marginLeft: -10,
//         width: 20,
//         height: 20,
//         borderRadius: 10,
//         backgroundColor: '#F8F9FB',
//     },
//     statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
//     statusText: { fontSize: 10, fontWeight: 'bold' },
//     emptyState: { alignItems: 'center', marginTop: 60 },
//     emptyTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#7F8C8D',
//         marginTop: 15,
//     },
//     emptySub: { color: '#95A5A6', marginTop: 5, textAlign: 'center' },
//     modalOverlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0,0,0,0.8)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     modalContent: {
//         width: '85%',
//         backgroundColor: '#fff',
//         borderRadius: 25,
//         overflow: 'hidden',
//     },
//     modalHeader: { padding: 20, alignItems: 'center' },
//     modalHeaderText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
//     modalBody: { padding: 25, alignItems: 'center' },
//     modalDesc: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#444',
//         textAlign: 'center',
//         marginBottom: 20,
//     },
//     qrFrame: {
//         padding: 15,
//         backgroundColor: 'white',
//         borderRadius: 15,
//         marginBottom: 20,
//         borderWeight: 1,
//         borderColor: '#eee',
//     },
//     modalCodeDisplay: {
//         fontSize: 24,
//         fontWeight: '900',
//         letterSpacing: 3,
//         color: '#1A1A1A',
//         marginBottom: 10,
//     },
//     modalHint: {
//         fontSize: 12,
//         color: '#888',
//         textAlign: 'center',
//         marginBottom: 20,
//     },
//     doneButton: {
//         backgroundColor: '#004AAD',
//         width: '100%',
//         padding: 15,
//         borderRadius: 12,
//         alignItems: 'center',
//     },
//     doneButtonText: { color: '#fff', fontWeight: 'bold' },
// })

// export default CouponsScreen
