// components/ConnectionModal.js

import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    ScrollView,
} from 'react-native'
import { useTheme } from '../../theme/ThemeProvider'
import { COLORS } from '../../constants'

const ConnectionModal = ({
    visible,
    onClose,
    connectionDetails, // expects the connection object from Redux
    onSwitchConnection,
}) => {
    const { dark } = useTheme()

    if (!connectionDetails) {
        // Show some fallback UI
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}
                onRequestClose={onClose}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={onClose}
                >
                    <View
                        style={[
                            styles.modalContainer,
                            {
                                backgroundColor: dark
                                    ? COLORS.dark2
                                    : COLORS.white,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.modalTitle,
                                {
                                    color: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                },
                            ]}
                        >
                            Connection details unavailable
                        </Text>

                        <TouchableOpacity
                            style={[
                                styles.closeButton,
                                {
                                    backgroundColor: dark
                                        ? COLORS.dark3
                                        : '#E0E0E0',
                                },
                            ]}
                            onPress={onClose}
                        >
                            <Text
                                style={[
                                    styles.closeButtonText,
                                    {
                                        color: dark
                                            ? COLORS.white
                                            : COLORS.black,
                                    },
                                ]}
                            >
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }

    const {
        aliasName,
        userName,
        connectionStatus,
        activePlan,
        installedAt,
        serviceArea,
        // you may add other fields like ipAddress, dataUsed if available
    } = connectionDetails

    // Format dates safely
    const installedDateStr = installedAt
        ? new Date(installedAt).toLocaleDateString()
        : '--'
    const planStart = activePlan?.startDate
        ? new Date(activePlan.startDate).toLocaleDateString()
        : '--'
    const planEnd = activePlan?.endDate
        ? new Date(activePlan.endDate).toLocaleDateString()
        : '--'
    const planPrice = activePlan?.price != null ? `₹${activePlan.price}` : '--'
    const planStatus = activePlan?.status || '--'
    const planDuration =
        activePlan?.duration != null ? `${activePlan.duration} days` : '--'
    const region = serviceArea?.region || '--'

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPressOut={onClose}
            >
                <View
                    style={[
                        styles.modalContainer,
                        { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
                    ]}
                >
                    <ScrollView>
                        <Text
                            style={[
                                styles.modalTitle,
                                {
                                    color: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                },
                            ]}
                        >
                            {aliasName || userName || 'Connection'}
                        </Text>

                        <View style={styles.modalDetailRow}>
                            <Text
                                style={[
                                    styles.modalDetailLabel,
                                    {
                                        color: dark
                                            ? COLORS.white
                                            : COLORS.greyscale700,
                                    },
                                ]}
                            >
                                Status:
                            </Text>
                            <Text
                                style={[
                                    styles.modalDetailValue,
                                    {
                                        color: dark
                                            ? COLORS.white
                                            : COLORS.greyscale900,
                                    },
                                ]}
                            >
                                {connectionStatus}
                            </Text>
                        </View>

                        <View style={styles.modalDetailRow}>
                            <Text
                                style={[
                                    styles.modalDetailLabel,
                                    {
                                        color: dark
                                            ? COLORS.white
                                            : COLORS.greyscale700,
                                    },
                                ]}
                            >
                                Price:
                            </Text>
                            <Text
                                style={[
                                    styles.modalDetailValue,
                                    {
                                        color: dark
                                            ? COLORS.white
                                            : COLORS.greyscale900,
                                    },
                                ]}
                            >
                                {planPrice}
                            </Text>
                        </View>

                        <View style={styles.modalDetailRow}>
                            <Text
                                style={[
                                    styles.modalDetailLabel,
                                    {
                                        color: dark
                                            ? COLORS.white
                                            : COLORS.greyscale700,
                                    },
                                ]}
                            >
                                Plan Duration:
                            </Text>
                            <Text
                                style={[
                                    styles.modalDetailValue,
                                    {
                                        color: dark
                                            ? COLORS.white
                                            : COLORS.greyscale900,
                                    },
                                ]}
                            >
                                {planDuration}
                            </Text>
                        </View>

                        <View style={styles.modalDetailRow}>
                            <Text
                                style={[
                                    styles.modalDetailLabel,
                                    {
                                        color: dark
                                            ? COLORS.white
                                            : COLORS.greyscale700,
                                    },
                                ]}
                            >
                                Plan Period:
                            </Text>
                            <Text
                                style={[
                                    styles.modalDetailValue,
                                    {
                                        color: dark
                                            ? COLORS.white
                                            : COLORS.greyscale900,
                                    },
                                ]}
                            >
                                {`${planStart} — ${planEnd}`}
                            </Text>
                        </View>

                        <View style={styles.modalDetailRow}>
                            <Text
                                style={[
                                    styles.modalDetailLabel,
                                    {
                                        color: dark
                                            ? COLORS.white
                                            : COLORS.greyscale700,
                                    },
                                ]}
                            >
                                Installed On:
                            </Text>
                            <Text
                                style={[
                                    styles.modalDetailValue,
                                    {
                                        color: dark
                                            ? COLORS.white
                                            : COLORS.greyscale900,
                                    },
                                ]}
                            >
                                {installedDateStr}
                            </Text>
                        </View>

                        <View style={styles.modalDetailRow}>
                            <Text
                                style={[
                                    styles.modalDetailLabel,
                                    {
                                        color: dark
                                            ? COLORS.white
                                            : COLORS.greyscale700,
                                    },
                                ]}
                            >
                                Region:
                            </Text>
                            <Text
                                style={[
                                    styles.modalDetailValue,
                                    {
                                        color: dark
                                            ? COLORS.white
                                            : COLORS.greyscale900,
                                    },
                                ]}
                            >
                                {region}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.manageButton}
                            onPress={onSwitchConnection}
                        >
                            <Text
                                style={[
                                    styles.manageButtonText,
                                    { color: COLORS.white },
                                ]}
                            >
                                Switch or Manage Connections
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.closeButton,
                                {
                                    backgroundColor: dark
                                        ? COLORS.dark3
                                        : '#E0E0E0',
                                },
                            ]}
                            onPress={onClose}
                        >
                            <Text
                                style={[
                                    styles.closeButtonText,
                                    {
                                        color: dark
                                            ? COLORS.white
                                            : COLORS.black,
                                    },
                                ]}
                            >
                                Close
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </TouchableOpacity>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    modalDetailLabel: {
        fontSize: 14,
        fontFamily: 'medium',
    },
    modalDetailValue: {
        fontSize: 14,
        fontFamily: 'semiBold',
    },
    manageButton: {
        marginTop: 24,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        marginBottom: 10,
    },
    manageButtonText: {
        fontSize: 16,
        fontFamily: 'semiBold',
    },
    closeButton: {
        marginTop: 10,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        fontFamily: 'semiBold',
    },
})

export default React.memo(ConnectionModal)
