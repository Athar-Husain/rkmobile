// screens/staff/StaffOrderDetailsModal.js

import React from 'react'
import {
    View,
    Text,
    Modal,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment'

const { height } = Dimensions.get('window')

const StaffOrderDetailsModal = ({ visible, order, onClose }) => {
    if (!order) return null

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Invoice Details</Text>
                        <TouchableOpacity onPress={onClose}>
                            <MaterialCommunityIcons name="close" size={24} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.invoice}>
                            {order.invoiceNumber}
                        </Text>
                        <Text style={styles.date}>
                            {moment(order.createdAt).format('LLLL')}
                        </Text>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Items</Text>

                            {order.items.map((item, index) => (
                                <View key={index} style={styles.itemRow}>
                                    <Text style={styles.itemName}>
                                        {item.name}
                                    </Text>
                                    <Text>x{item.quantity}</Text>
                                    <Text>
                                        ₹
                                        {item.totalPrice?.toLocaleString(
                                            'en-IN'
                                        )}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                Payment Summary
                            </Text>

                            <View style={styles.row}>
                                <Text>Subtotal</Text>
                                <Text>
                                    ₹{order.subtotal?.toLocaleString('en-IN')}
                                </Text>
                            </View>

                            <View style={styles.row}>
                                <Text>Tax</Text>
                                <Text>
                                    ₹{order.tax?.toLocaleString('en-IN')}
                                </Text>
                            </View>

                            <View style={styles.rowTotal}>
                                <Text style={styles.totalText}>Total</Text>
                                <Text style={styles.totalText}>
                                    ₹
                                    {order.finalAmount?.toLocaleString('en-IN')}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}

export default StaffOrderDetailsModal

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: '#FFF',
        height: height * 0.85,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
    },
    invoice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#004AAD',
    },
    date: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    itemName: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    rowTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    totalText: {
        fontSize: 16,
        fontWeight: '800',
    },
})
