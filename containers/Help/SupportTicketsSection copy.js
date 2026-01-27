import React, { useCallback, useEffect, useState } from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    Modal,
    Pressable,
    TextInput,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { DateTime } from 'luxon'
import { useTheme } from '../../theme/ThemeProvider'
import { icons } from '../../constants'
import { useDispatch, useSelector } from 'react-redux'
import { getMyTickets } from '../../redux/features/Tickets/TicketSlice'
import NotificationButton from './NotificationButton'

// Helper function to get priority color
const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
        case 'high':
            return '#E53E3E'
        case 'medium':
            return '#D69E2E'
        case 'low':
            return '#38A169'
        default:
            return '#888'
    }
}

// Component for a single ticket item
const TicketItem = ({ item, dark, onPress }) => {
    // console.log('item in Ticket Item ', item)
    // TicketItem state (loading, error, etc.)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Redux state
    const dispatch = useDispatch()
    // const ticketData = useSelector((state) => state.ticket.data)

    const { getMyTicketStatus, isTicketLoading } = useSelector(
        (state) => state.ticket
    )

    // priority color determination
    const priorityColor = getPriorityColor(item?.priority)
    const isResolved = (item.status || '').toLowerCase() === 'resolved'

    // Define background and text colors based on dark mode
    const ticketBgColor = dark ? '#222' : '#F9FAFB'
    const textColor = dark ? '#E5E7EB' : '#111827'
    const secondaryColor = dark ? '#9CA3AF' : '#6B7280'

    // Format the created and updated times using Luxon
    const createdAt = item.createdAt
        ? DateTime.fromISO(item.createdAt).toRelative()
        : 'N/A'
    const updatedAt = item.updatedAt
        ? DateTime.fromISO(item.updatedAt).toRelative()
        : 'N/A'

    // Optionally show the exact time (hour/minute) along with the relative time
    const createdAtFormatted = item.createdAt
        ? `${DateTime.fromISO(item.createdAt).toLocaleString(DateTime.TIME_SIMPLE)} (${createdAt})`
        : 'N/A'
    const updatedAtFormatted = item.updatedAt
        ? `${DateTime.fromISO(item.updatedAt).toLocaleString(DateTime.TIME_SIMPLE)} (${updatedAt})`
        : 'N/A'

    // Simulating a fetch function (replace with actual API call)
    const fetchTicketData = async () => {
        setLoading(true)
        setError(null)
        try {
            // Replace with actual fetch logic
            //await dispatch(getTicketById(item.ticketId)) // Example action
            setLoading(false)
        } catch (err) {
            setError('Error loading ticket data.')
            setLoading(false)
        }
    }

    useEffect(() => {
        if (item?.ticketId) {
            fetchTicketData()
        }
    }, [item?.ticketId])

    // Retry fetch if error occurs
    const handleRetry = () => {
        fetchTicketData()
    }

    const loadingStatus =
        getMyTicketStatus === 'pending' || getMyTicketStatus === 'idle'

    if (isTicketLoading) {
        return (
            <View
                style={[
                    styles.loadingContainer,
                    { backgroundColor: ticketBgColor },
                ]}
            >
                <ActivityIndicator size="large" color={secondaryColor} />
                <Text style={{ color: secondaryColor, marginTop: 10 }}>
                    Loading ticket...
                </Text>
            </View>
        )
    }

    if (error) {
        return (
            <View
                style={[
                    styles.loadingContainer,
                    { backgroundColor: ticketBgColor },
                ]}
            >
                <Text style={{ color: secondaryColor }}>{error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={handleRetry}
                >
                    <Text style={{ color: '#0A84FF' }}>Retry</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <TouchableOpacity
            style={[
                styles.ticketItem,
                {
                    backgroundColor: ticketBgColor,
                    opacity: isResolved ? 0.6 : 1,
                    borderLeftColor: priorityColor,
                },
            ]}
            onPress={onPress}
        >
            <View style={styles.headerRow}>
                <Text style={[styles.issueType, { color: textColor }]}>
                    {(item.issueType || 'N/A').toUpperCase()}
                </Text>
                <View style={styles.priorityBadge}>
                    <View
                        style={[
                            styles.priorityIndicator,
                            { backgroundColor: priorityColor },
                        ]}
                    />
                    <Text style={[styles.priority, { color: secondaryColor }]}>
                        {item.priority || 'N/A'}
                    </Text>
                </View>
            </View>

            <Text style={[styles.description, { color: secondaryColor }]}>
                {item.description || 'No description available'}
            </Text>

            <View style={styles.metaRow}>
                <View style={styles.metaDetail}>
                    <Text style={[styles.status, { color: secondaryColor }]}>
                        Status: {item.status || 'Unknown'}
                    </Text>
                </View>
                <View style={styles.dateContainer}>
                    <Text style={[styles.date, { color: secondaryColor }]}>
                        Created: {createdAtFormatted}
                    </Text>
                    <Text style={[styles.date, { color: secondaryColor }]}>
                        Updated: {updatedAtFormatted}
                    </Text>
                </View>
            </View>

            {isResolved && (
                <Text style={[styles.resolvedText, { color: secondaryColor }]}>
                    Resolved {updatedAt ? updatedAt : 'N/A'}
                </Text>
            )}
        </TouchableOpacity>
    )
}

// --- NEW COMPONENT: CreateNewTicketModal ---
const CreateNewTicketModal = ({ isVisible, onClose, onSubmit }) => {
    const [issueType, setIssueType] = useState('not working')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState('medium')

    const { dark } = useTheme()
    const modalBgColor = dark ? '#1C1C1E' : '#FFFFFF'
    const textColor = dark ? '#E5E7EB' : '#111827'
    const inputBgColor = dark ? '#333' : '#F3F4F6'
    const placeholderColor = dark ? '#9CA3AF' : '#6B7280'
    const pickerColor = dark ? '#E5E7EB' : '#000000'

    const handleOnSubmit = () => {
        onSubmit({ issueType, description, priority })
        onClose()
        // Reset form fields
        setIssueType('not working')
        setDescription('')
        setPriority('medium')
        const data = {
            issueType,
            description,
            priority,
        }
        // console.log('submit data ', data)
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable
                    onPress={(e) => e.stopPropagation()}
                    style={[
                        styles.modalView,
                        { backgroundColor: modalBgColor },
                    ]}
                >
                    <Text style={[styles.modalTitle, { color: textColor }]}>
                        Create New Ticket
                    </Text>

                    {/* Issue Type Dropdown */}
                    <Text style={[styles.formLabel, { color: textColor }]}>
                        Issue Type:
                    </Text>
                    <View
                        style={[
                            styles.inputContainer,
                            { backgroundColor: inputBgColor },
                        ]}
                    >
                        <Picker
                            selectedValue={issueType}
                            onValueChange={(itemValue) =>
                                setIssueType(itemValue)
                            }
                            style={[styles.pickerStyle, { color: pickerColor }]}
                        >
                            <Picker.Item
                                label="Not Working"
                                value="not working"
                            />
                            <Picker.Item
                                label="Network Slow"
                                value="network slow"
                            />
                            <Picker.Item label="Other" value="other" />
                        </Picker>
                    </View>

                    {/* Description Input */}
                    <Text style={[styles.formLabel, { color: textColor }]}>
                        Description:
                    </Text>
                    <TextInput
                        style={[
                            styles.textInput,
                            { backgroundColor: inputBgColor, color: textColor },
                        ]}
                        placeholder="Describe your issue..."
                        placeholderTextColor={placeholderColor}
                        multiline
                        numberOfLines={4}
                        value={description}
                        onChangeText={setDescription}
                    />

                    {/* Priority Dropdown */}
                    <Text style={[styles.formLabel, { color: textColor }]}>
                        Priority:
                    </Text>
                    <View
                        style={[
                            styles.inputContainer,
                            { backgroundColor: inputBgColor },
                        ]}
                    >
                        <Picker
                            selectedValue={priority}
                            onValueChange={(itemValue) =>
                                setPriority(itemValue)
                            }
                            style={[styles.pickerStyle, { color: pickerColor }]}
                        >
                            <Picker.Item label="Low" value="low" />
                            <Picker.Item label="Medium" value="medium" />
                            <Picker.Item label="High" value="high" />
                        </Picker>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.textStyle}>Cancel</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.submitButton]}
                            onPress={handleOnSubmit}
                        >
                            <Text style={styles.textStyle}>Submit</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    )
}

// Component for the "Create New Ticket" Floating Action Button
const CreateTicketFab = ({ onPress }) => {
    return (
        <Pressable
            style={styles.fab}
            onPress={onPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <Image source={icons.plus} style={styles.fabIcon} />
        </Pressable>
    )
}
// --- END NEW COMPONENTS ---

// const SupportTicketsSection = ({ ticketsData }) => {
const SupportTicketsSection = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { dark } = useTheme()
    const [isModalVisible, setIsModalVisible] = useState(false)

    const toggleModal = () => setIsModalVisible(!isModalVisible)

    // const { customerTickets } = useSelector(state.ticket)

    const { customerTickets } = useSelector((state) => state.ticket)

    // console.log('customerTickets ', customerTickets)

    useFocusEffect(
        useCallback(() => {
            dispatch(getMyTickets())
        }, [dispatch])
    )

    const handleSubmitTicket = (newTicket) => {
        // Here you would typically handle the submission to a backend or state management
        // For now, let's just log the new ticket data
        // console.log('New ticket submitted:', newTicket)
        // You can add logic to update ticketsData here
    }

    const renderItem = ({ item }) => (
        <TicketItem
            item={item}
            dark={dark}
            onPress={() =>
                navigation.navigate('TicketDetail', { ticketId: item._id })
            }
        />
    )

    return (
        <SafeAreaView style={styles.container}>
            <NotificationButton />
            <FlatList
                data={customerTickets}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                style={{ flex: 1 }}
                contentContainerStyle={styles.listContentContainer}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Image
                            source={icons.noTickets}
                            style={[
                                styles.emptyIcon,
                                { tintColor: dark ? '#555' : '#BBB' },
                            ]}
                        />
                        <Text
                            style={[
                                styles.emptyText,
                                { color: dark ? '#777' : '#999' },
                            ]}
                        >
                            You have no support tickets yet.
                        </Text>
                        <Text
                            style={[
                                styles.emptySubText,
                                { color: dark ? '#777' : '#999' },
                            ]}
                        >
                            Tap the + button to create a new one.
                        </Text>
                    </View>
                )}
            />
            <CreateTicketFab onPress={toggleModal} />
            <CreateNewTicketModal
                isVisible={isModalVisible}
                onClose={toggleModal}
                onSubmit={handleSubmitTicket}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContentContainer: {
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 100, // Add padding at the bottom to prevent FAB from hiding the last item
    },
    ticketItem: {
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF', // This will be dynamically overridden
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    issueType: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    metaDetail: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateContainer: {
        alignItems: 'flex-end',
    },
    status: {
        fontSize: 12,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    date: {
        fontSize: 12,
    },
    resolvedText: {
        fontSize: 12,
        marginTop: 8,
        fontStyle: 'italic',
    },
    priorityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
    },
    priorityIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 4,
    },
    priority: {
        fontSize: 12,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    fab: {
        position: 'absolute',
        bottom: 50,
        right: 16,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
        zIndex: 10,
    },
    fabIcon: {
        width: 32,
        height: 32,
        tintColor: '#FFFFFF',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '90%',
        borderRadius: 20,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    formLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        marginTop: 15,
    },
    inputContainer: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    pickerStyle: {
        width: '100%',
        height: 50,
    },
    textInput: {
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        minHeight: 100,
        textAlignVertical: 'top',
        fontSize: 14,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 30,
        width: '100%',
    },
    button: {
        borderRadius: 20,
        padding: 12,
        elevation: 2,
        width: '45%',
    },
    cancelButton: {
        backgroundColor: '#6B7280',
    },
    submitButton: {
        backgroundColor: '#007AFF',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        marginBottom: 10,
        resizeMode: 'contain',
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
    emptySubText: {
        fontSize: 14,
        textAlign: 'center',
    },
    loadingContainer: {
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    retryButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#E5E7EB',
        borderRadius: 8,
    },
})

export default SupportTicketsSection
