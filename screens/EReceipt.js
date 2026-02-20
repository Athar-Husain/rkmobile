import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    Modal,
    TouchableWithoutFeedback,
    FlatList,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { BarcodeCreatorView, BarcodeFormat } from 'react-native-barcode-creator'

import { COLORS, SIZES, icons } from '../constants'
import { useTheme } from '../theme/ThemeProvider'

const EReceipt = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const { colors, dark } = useTheme()

    const transactionId = '5901234123457' // Must be 13 digits for EAN13

    const dropdownItems = [
        { label: 'Share E-Receipt', value: 'share', icon: icons.shareOutline },
        {
            label: 'Download E-Receipt',
            value: 'downloadEReceipt',
            icon: icons.download2,
        },
        { label: 'Print', value: 'print', icon: icons.documentOutline },
    ]

    const handleDropdownSelect = (item) => {
        setSelectedItem(item.value)
        setModalVisible(false)

        switch (item.value) {
            case 'share':
            case 'downloadEReceipt':
            case 'print':
                navigation.navigate('Home')
                break
            default:
                break
        }
    }

    const handleCopyToClipboard = async () => {
        await Clipboard.setStringAsync(transactionId)
        Alert.alert('Copied!', 'Transaction ID copied to clipboard.')
    }

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.headerLeft}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={icons.arrowBack}
                        resizeMode="contain"
                        style={[
                            styles.backIcon,
                            { tintColor: dark ? COLORS.white : COLORS.black },
                        ]}
                    />
                </TouchableOpacity>
                <Text
                    style={[
                        styles.headerTitle,
                        { color: dark ? COLORS.white : COLORS.black },
                    ]}
                >
                    E-Receipt
                </Text>
            </View>

            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image
                    source={icons.moreCircle}
                    resizeMode="contain"
                    style={[
                        styles.moreIcon,
                        {
                            tintColor: dark
                                ? COLORS.secondaryWhite
                                : COLORS.black,
                        },
                    ]}
                />
            </TouchableOpacity>
        </View>
    )

    const renderContent = () => (
        <View style={{ marginVertical: 22 }}>
            {/* ✅ Native Barcode */}
            <BarcodeCreatorView
                value={transactionId}
                format={BarcodeFormat.EAN13}
                background={dark ? COLORS.dark1 : '#FFFFFF'}
                foregroundColor={dark ? '#FFFFFF' : '#000000'}
                style={{
                    width: SIZES.width - 64,
                    height: 100,
                    alignSelf: 'center',
                    marginBottom: 40,
                }}
            />

            {/* Service Summary */}
            <View
                style={[
                    styles.summaryContainer,
                    {
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                    },
                ]}
            >
                <View style={styles.viewContainer}>
                    <Text style={styles.viewLeft}>Services</Text>
                    <Text
                        style={[
                            styles.viewRight,
                            { color: dark ? COLORS.white : COLORS.black },
                        ]}
                    >
                        House Cleaning
                    </Text>
                </View>

                <View style={styles.viewContainer}>
                    <Text style={styles.viewLeft}>Category</Text>
                    <Text
                        style={[
                            styles.viewRight,
                            { color: dark ? COLORS.white : COLORS.black },
                        ]}
                    >
                        Cleaning
                    </Text>
                </View>

                <View style={styles.viewContainer}>
                    <Text style={styles.viewLeft}>Workers</Text>
                    <Text
                        style={[
                            styles.viewRight,
                            { color: dark ? COLORS.white : COLORS.black },
                        ]}
                    >
                        Jenny Wilson
                    </Text>
                </View>

                <View style={styles.viewContainer}>
                    <Text style={styles.viewLeft}>Date & Time</Text>
                    <Text
                        style={[
                            styles.viewRight,
                            { color: dark ? COLORS.white : COLORS.black },
                        ]}
                    >
                        Dec 23, 2024 | 10:00 AM
                    </Text>
                </View>

                <View style={styles.viewContainer}>
                    <Text style={styles.viewLeft}>Working Hours</Text>
                    <Text
                        style={[
                            styles.viewRight,
                            { color: dark ? COLORS.white : COLORS.black },
                        ]}
                    >
                        2 hours
                    </Text>
                </View>
            </View>

            {/* Customer Info */}
            <View
                style={[
                    styles.summaryContainer,
                    {
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                    },
                ]}
            >
                <View style={styles.viewContainer}>
                    <Text style={styles.viewLeft}>Name</Text>
                    <Text
                        style={[
                            styles.viewRight,
                            { color: dark ? COLORS.white : COLORS.black },
                        ]}
                    >
                        Andrew Ainsley
                    </Text>
                </View>

                <View style={styles.viewContainer}>
                    <Text style={styles.viewLeft}>Phone</Text>
                    <Text
                        style={[
                            styles.viewRight,
                            { color: dark ? COLORS.white : COLORS.black },
                        ]}
                    >
                        +1 111 3452 2837 3747
                    </Text>
                </View>

                <View style={styles.viewContainer}>
                    <Text style={styles.viewLeft}>Email</Text>
                    <Text
                        style={[
                            styles.viewRight,
                            { color: dark ? COLORS.white : COLORS.black },
                        ]}
                    >
                        andrew_ainsley@domain.com
                    </Text>
                </View>

                <View style={styles.viewContainer}>
                    <Text style={styles.viewLeft}>Country</Text>
                    <Text
                        style={[
                            styles.viewRight,
                            { color: dark ? COLORS.white : COLORS.black },
                        ]}
                    >
                        United States
                    </Text>
                </View>
            </View>

            {/* Payment Info */}
            <View
                style={[
                    styles.summaryContainer,
                    {
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                    },
                ]}
            >
                <View style={styles.viewContainer}>
                    <Text style={styles.viewLeft}>Price</Text>
                    <Text
                        style={[
                            styles.viewRight,
                            { color: dark ? COLORS.white : COLORS.black },
                        ]}
                    >
                        $40
                    </Text>
                </View>

                <View style={styles.viewContainer}>
                    <Text style={styles.viewLeft}>Payment Method</Text>
                    <Text
                        style={[
                            styles.viewRight,
                            { color: dark ? COLORS.white : COLORS.black },
                        ]}
                    >
                        Credit Card
                    </Text>
                </View>

                <View style={styles.viewContainer}>
                    <Text style={styles.viewLeft}>Transaction ID</Text>
                    <View style={styles.copyContentContainer}>
                        <Text style={styles.viewRight}>{transactionId}</Text>
                        <TouchableOpacity
                            onPress={handleCopyToClipboard}
                            style={{ marginLeft: 8 }}
                        >
                            <MaterialCommunityIcons
                                name="content-copy"
                                size={22}
                                color={COLORS.primary}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.viewContainer}>
                    <Text style={styles.viewLeft}>Status</Text>
                    <View style={styles.statusBtn}>
                        <Text style={styles.statusBtnText}>Paid</Text>
                    </View>
                </View>
            </View>
        </View>
    )

    return (
        <SafeAreaView
            style={[styles.area, { backgroundColor: colors.background }]}
        >
            <View
                style={[
                    styles.container,
                    { backgroundColor: colors.background },
                ]}
            >
                {renderHeader()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                        backgroundColor: dark
                            ? COLORS.dark1
                            : COLORS.tertiaryWhite,
                    }}
                >
                    {renderContent()}
                </ScrollView>
            </View>

            {/* Dropdown Modal */}
            <Modal transparent animationType="fade" visible={modalVisible}>
                <TouchableWithoutFeedback
                    onPress={() => setModalVisible(false)}
                >
                    <View style={{ position: 'absolute', top: 112, right: 12 }}>
                        <View
                            style={{
                                width: 202,
                                padding: 16,
                                borderRadius: 8,
                                backgroundColor: dark
                                    ? COLORS.dark2
                                    : COLORS.tertiaryWhite,
                            }}
                        >
                            <FlatList
                                data={dropdownItems}
                                keyExtractor={(item) => item.value}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginVertical: 12,
                                        }}
                                        onPress={() =>
                                            handleDropdownSelect(item)
                                        }
                                    >
                                        <Image
                                            source={item.icon}
                                            resizeMode="contain"
                                            style={{
                                                width: 20,
                                                height: 20,
                                                marginRight: 16,
                                                tintColor: dark
                                                    ? COLORS.white
                                                    : COLORS.black,
                                            }}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                fontFamily: 'semiBold',
                                                color: dark
                                                    ? COLORS.white
                                                    : COLORS.black,
                                            }}
                                        >
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: { flex: 1 },
    container: { flex: 1, padding: 16 },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 16,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    backIcon: { width: 24, height: 24, marginRight: 16 },
    headerTitle: { fontSize: 24, fontFamily: 'bold' },
    moreIcon: { width: 24, height: 24 },
    summaryContainer: {
        width: SIZES.width - 32,
        alignSelf: 'center',
        padding: 16,
        borderRadius: 6,
        marginVertical: 8,
    },
    viewContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 12,
    },
    viewLeft: { fontSize: 12, fontFamily: 'regular', color: 'gray' },
    viewRight: { fontSize: 14, fontFamily: 'medium' },
    copyContentContainer: { flexDirection: 'row', alignItems: 'center' },
    statusBtn: {
        width: 72,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.tansparentPrimary,
        borderRadius: 6,
    },
    statusBtnText: {
        fontSize: 12,
        fontFamily: 'medium',
        color: COLORS.primary,
    },
})

export default EReceipt
