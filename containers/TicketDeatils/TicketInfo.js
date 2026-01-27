// containers/TicketDetails/TicketInfo.js
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
        case 'resolved':
            return '#14C9A0'
        case 'in-progress':
            return '#FFD166'
        case 'open':
        default:
            return '#FF6B6B'
    }
}

const getPriorityColor = (priority) => {
    switch ((priority || '').toLowerCase()) {
        case 'high':
            return '#FF6B6B'
        case 'medium':
            return '#FFD166'
        case 'low':
        default:
            return '#999'
    }
}

const TicketInfo = ({ ticket, dark }) => {
    if (!ticket) return null

    return (
        <View
            style={[
                styles.header,
                { borderBottomColor: dark ? '#2C2C2E' : '#E0E0E0' },
            ]}
        >
            <Text
                style={[
                    styles.headerTitle,
                    { color: dark ? '#EAEAEA' : '#222' },
                ]}
            >
                Ticket #{ticket._id.substring(0, 6)}
            </Text>

            <View style={styles.infoRow}>
                <View
                    style={[
                        styles.badge,
                        {
                            backgroundColor:
                                getStatusColor(ticket.status) + '33',
                        },
                    ]}
                >
                    <Icon
                        name="alert-circle-outline"
                        size={14}
                        color={getStatusColor(ticket.status)}
                    />
                    <Text
                        style={[
                            styles.badgeText,
                            { color: getStatusColor(ticket.status) },
                        ]}
                    >
                        {ticket.status}
                    </Text>
                </View>

                <View
                    style={[
                        styles.badge,
                        {
                            backgroundColor:
                                getPriorityColor(ticket.priority) + '33',
                        },
                    ]}
                >
                    <Icon
                        name="pricetag-outline"
                        size={14}
                        color={getPriorityColor(ticket.priority)}
                    />
                    <Text
                        style={[
                            styles.badgeText,
                            { color: getPriorityColor(ticket.priority) },
                        ]}
                    >
                        {ticket.priority}
                    </Text>
                </View>
            </View>

            <Text style={[styles.subject, { color: dark ? '#FFF' : '#111' }]}>
                {ticket.issueType || 'Issue'}: {ticket.subject}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        padding: 20,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    infoRow: {
        flexDirection: 'row',
        marginTop: 8,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginRight: 8,
    },
    badgeText: {
        marginLeft: 4,
        fontSize: 13,
        fontWeight: '500',
    },
    subject: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '600',
    },
})

export default TicketInfo
