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
                { borderBottomColor: dark ? '#333' : '#DDD' },
            ]}
        >
            <Text
                style={[
                    styles.headerTitle,
                    { color: dark ? '#EAEAEA' : '#333' },
                ]}
            >
                Ticket #{ticket._id.substring(0, 6)}
            </Text>
            <View style={styles.headerInfoRow}>
                <View style={styles.headerInfoItem}>
                    <Icon
                        name="alert-circle-outline"
                        size={16}
                        color={getStatusColor(ticket.status)}
                    />
                    <Text
                        style={[
                            styles.headerInfoText,
                            { color: dark ? '#AAA' : '#555' },
                        ]}
                    >
                        {ticket.status}
                    </Text>
                </View>
                <View style={styles.headerInfoItem}>
                    <Icon
                        name="pricetag-outline"
                        size={16}
                        color={getPriorityColor(ticket.priority)}
                    />
                    <Text
                        style={[
                            styles.headerInfoText,
                            { color: dark ? '#AAA' : '#555' },
                        ]}
                    >
                        {ticket.priority}
                    </Text>
                </View>
            </View>
            <Text
                style={[
                    styles.headerSubject,
                    { color: dark ? '#FFF' : '#000' },
                ]}
            >
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
        fontWeight: 'bold',
    },
    headerInfoRow: {
        flexDirection: 'row',
        marginTop: 8,
    },
    headerInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    headerInfoText: {
        marginLeft: 5,
        fontSize: 14,
    },
    headerSubject: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
})

export default TicketInfo
