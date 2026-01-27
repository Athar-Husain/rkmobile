// SupportTicketsSection.js
import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
    memo,
    useRef,
} from 'react'
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
    RefreshControl,
    Platform,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { DateTime } from 'luxon'
import { useTheme } from '../../theme/ThemeProvider'
import { icons } from '../../constants'
import { useDispatch, useSelector } from 'react-redux'
import { getMyTickets } from '../../redux/features/Tickets/TicketSlice'

// ------------------ Helpers ------------------
const getPriorityColor = (priority) => {
    if (!priority) return '#888'
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

const statusOrder = {
    all: 0,
    open: 1,
    'in progress': 2,
    resolved: 3,
}

// ------------------ TicketItem (memoized) ------------------
const TicketItem = memo(({ item, dark, onPress, isTicketLoadingGlobal }) => {
    // colors
    const priorityColor = getPriorityColor(item?.priority)
    const isResolved = (item?.status || '').toLowerCase() === 'resolved'
    const ticketBgColor = dark ? '#1E1E1F' : '#FFFFFF'
    const textColor = dark ? '#E5E7EB' : '#111827'
    const secondaryColor = dark ? '#9CA3AF' : '#6B7280'

    // times
    const createdAtRelative = item?.createdAt
        ? DateTime.fromISO(item.createdAt).toRelative()
        : null
    const updatedAtRelative = item?.updatedAt
        ? DateTime.fromISO(item.updatedAt).toRelative()
        : null

    const createdAtFormatted = item?.createdAt
        ? `${DateTime.fromISO(item.createdAt).toLocaleString(DateTime.TIME_SIMPLE)} (${createdAtRelative})`
        : 'N/A'
    const updatedAtFormatted = item?.updatedAt
        ? `${DateTime.fromISO(item.updatedAt).toLocaleString(DateTime.TIME_SIMPLE)} (${updatedAtRelative})`
        : 'N/A'

    if (isTicketLoadingGlobal) {
        return (
            <View
                style={[
                    styles.loadingContainer,
                    { backgroundColor: ticketBgColor },
                ]}
            >
                <ActivityIndicator size="small" color={secondaryColor} />
                <Text style={{ color: secondaryColor, marginTop: 8 }}>
                    Loading ticket...
                </Text>
            </View>
        )
    }

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPress}
            style={[
                styles.ticketItem,
                {
                    backgroundColor: ticketBgColor,
                    opacity: isResolved ? 0.6 : 1,
                    borderLeftColor: priorityColor,
                },
            ]}
        >
            <View style={styles.headerRow}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text
                        numberOfLines={1}
                        style={[styles.issueType, { color: textColor }]}
                    >
                        {(item?.issueType || 'N/A').toUpperCase()}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={[styles.smallMuted, { color: secondaryColor }]}
                    >
                        #{item?._id ? item._id.toString().slice(-6) : '—'} •{' '}
                        {item?.userName || 'You'}
                    </Text>
                </View>

                <View style={styles.rightMeta}>
                    <View
                        style={[
                            styles.priorityBadge,
                            { backgroundColor: dark ? '#2A2A2C' : '#F3F4F6' },
                        ]}
                    >
                        <View
                            style={[
                                styles.priorityIndicator,
                                { backgroundColor: priorityColor },
                            ]}
                        />
                        <Text
                            style={[styles.priority, { color: secondaryColor }]}
                        >
                            {item?.priority || 'N/A'}
                        </Text>
                    </View>
                    <Text
                        style={[styles.statusSmall, { color: secondaryColor }]}
                        numberOfLines={1}
                    >
                        {item?.status || 'Unknown'}
                    </Text>
                </View>
            </View>

            <Text
                style={[styles.description, { color: secondaryColor }]}
                numberOfLines={2}
            >
                {item?.description || 'No description available'}
            </Text>

            <View style={styles.metaRow}>
                <Text style={[styles.date, { color: secondaryColor }]}>
                    Created: {createdAtFormatted}
                </Text>
            </View>
            <View style={styles.metaRow}>
                <Text style={[styles.date, { color: secondaryColor }]}>
                    Updated: {updatedAtFormatted}
                </Text>
            </View>

            {isResolved && (
                <Text style={[styles.resolvedText, { color: secondaryColor }]}>
                    Resolved {updatedAtRelative ? updatedAtRelative : 'N/A'}
                </Text>
            )}
        </TouchableOpacity>
    )
}, areEqualTicketItem)

// Custom comparator: only re-render if these props changed.
function areEqualTicketItem(prev, next) {
    // shallow compare item id and important fields
    const a = prev.item || {}
    const b = next.item || {}
    if (a._id !== b._id) return false
    if (a.status !== b.status) return false
    if (a.priority !== b.priority) return false
    if (a.description !== b.description) return false
    if (prev.dark !== next.dark) return false
    if (prev.isTicketLoadingGlobal !== next.isTicketLoadingGlobal) return false
    return true
}

// ------------------ Create New Ticket Modal ------------------
const CreateNewTicketModal = ({ isVisible, onClose, onSubmit }) => {
    const [issueType, setIssueType] = useState('not working')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState('medium')
    const { dark } = useTheme()

    useEffect(() => {
        if (!isVisible) {
            // reset on close
            setIssueType('not working')
            setDescription('')
            setPriority('medium')
        }
    }, [isVisible])

    const handleOnSubmit = () => {
        const payload = { issueType, description, priority }
        if (onSubmit) onSubmit(payload)
        onClose()
    }

    const modalBgColor = dark ? '#1C1C1E' : '#FFFFFF'
    const textColor = dark ? '#E5E7EB' : '#111827'
    const inputBgColor = dark ? '#333' : '#F3F4F6'
    const placeholderColor = dark ? '#9CA3AF' : '#6B7280'
    const pickerColor = dark ? '#E5E7EB' : '#000000'

    return (
        <Modal
            animationType="slide"
            transparent
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
                            onValueChange={setIssueType}
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
                            onValueChange={setPriority}
                            style={[styles.pickerStyle, { color: pickerColor }]}
                        >
                            <Picker.Item label="Low" value="low" />
                            <Picker.Item label="Medium" value="medium" />
                            <Picker.Item label="High" value="high" />
                        </Picker>
                    </View>

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

// ------------------ Create Ticket FAB ------------------
const CreateTicketFab = ({ onPress }) => {
    return (
        <Pressable
            style={styles.fab}
            onPress={onPress}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
            <Image source={icons.plus} style={styles.fabIcon} />
        </Pressable>
    )
}

// ------------------ Main Component ------------------
const SupportTicketsSection = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { dark } = useTheme()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [search, setSearch] = useState('')
    const [activeFilter, setActiveFilter] = useState('all')
    const [refreshing, setRefreshing] = useState(false)

    const { customerTickets = [], isTicketLoading = false } = useSelector(
        (state) => state.ticket || {}
    )

    // fetch on focus
    useFocusEffect(
        useCallback(() => {
            dispatch(getMyTickets())
        }, [dispatch])
    )

    // pull-to-refresh handler
    const onRefresh = useCallback(async () => {
        try {
            setRefreshing(true)
            await dispatch(getMyTickets())
        } finally {
            setRefreshing(false)
        }
    }, [dispatch])

    // toggle modal
    const toggleModal = useCallback(() => setIsModalVisible((s) => !s), [])

    // handle new ticket submission (hook to redux or API)
    const handleSubmitTicket = useCallback(
        (newTicket) => {
            // TODO: dispatch action to create ticket, e.g.
            // dispatch(createTicket(newTicket))
            // For now: optimistic UI console log
            // console.log('New ticket submitted:', newTicket)
            // You can push to local list or refetch
            dispatch(getMyTickets()) // simple approach: refetch after submit
        },
        [dispatch]
    )

    // Search + filter computed list
    const filteredTickets = useMemo(() => {
        const q = (search || '').trim().toLowerCase()
        return (customerTickets || [])
            .filter((t) => {
                if (!t) return false
                if (activeFilter !== 'all') {
                    const s = (t.status || '').toLowerCase()
                    if (activeFilter === 'in progress') {
                        if (
                            !s.includes('in progress') &&
                            !s.includes('inprogress') &&
                            !s.includes('progress')
                        )
                            return false
                    } else if (!s.includes(activeFilter)) {
                        return false
                    }
                }
                if (!q) return true
                const idMatch =
                    t._id && t._id.toString().toLowerCase().includes(q)
                const issueMatch = (t.issueType || '').toLowerCase().includes(q)
                const descMatch = (t.description || '')
                    .toLowerCase()
                    .includes(q)
                return idMatch || issueMatch || descMatch
            })
            .sort((a, b) => {
                // stable sort: unresolved first, then by createdAt desc
                const sa = (a.status || '').toLowerCase()
                const sb = (b.status || '').toLowerCase()
                if (sa === 'resolved' && sb !== 'resolved') return 1
                if (sb === 'resolved' && sa !== 'resolved') return -1
                const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
                const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
                return tb - ta
            })
    }, [customerTickets, search, activeFilter])

    // stable renderItem
    const renderItem = useCallback(
        ({ item }) => (
            <TicketItem
                item={item}
                dark={dark}
                onPress={() =>
                    navigation.navigate('TicketDetail', { ticketId: item._id })
                }
                isTicketLoadingGlobal={isTicketLoading}
            />
        ),
        [dark, navigation, isTicketLoading]
    )

    const keyExtractor = useCallback(
        (item) => (item?._id ? item._id.toString() : Math.random().toString()),
        []
    )

    // quick skeleton placeholder when loading and list is empty
    const renderSkeleton = () => {
        const dummy = Array.from({ length: 4 })
        return dummy.map((_, i) => (
            <View
                key={`sk-${i}`}
                style={[
                    styles.ticketItem,
                    { backgroundColor: dark ? '#161616' : '#F9FAFB' },
                ]}
            >
                <View
                    style={{
                        height: 14,
                        width: '60%',
                        borderRadius: 6,
                        backgroundColor: dark ? '#2a2a2a' : '#eaeaea',
                        marginBottom: 8,
                    }}
                />
                <View
                    style={{
                        height: 10,
                        width: '40%',
                        borderRadius: 6,
                        backgroundColor: dark ? '#2a2a2a' : '#eaeaea',
                        marginBottom: 12,
                    }}
                />
                <View
                    style={{
                        height: 48,
                        width: '100%',
                        borderRadius: 8,
                        backgroundColor: dark ? '#222' : '#efefef',
                    }}
                />
            </View>
        ))
    }

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: dark ? '#0B0B0C' : '#FAFAFB' },
            ]}
        >
            {/* Header / Search */}
            <View style={styles.header}>
                {/* <Text
                    style={[styles.title, { color: dark ? '#FFF' : '#111827' }]}
                >
                    Support Tickets
                </Text> */}

                <View
                    style={[
                        styles.searchContainer,
                        { backgroundColor: dark ? '#1A1A1B' : '#fff' },
                    ]}
                >
                    <TextInput
                        placeholder="Search by ID, issue or description..."
                        placeholderTextColor={dark ? '#6B7280' : '#9CA3AF'}
                        style={[
                            styles.searchInput,
                            { color: dark ? '#fff' : '#111827' },
                        ]}
                        value={search}
                        onChangeText={setSearch}
                        returnKeyType="search"
                    />
                    <TouchableOpacity
                        onPress={() => {
                            setSearch('')
                        }}
                        style={styles.clearButton}
                    >
                        <Text style={{ color: '#007AFF', fontWeight: '600' }}>
                            {search ? 'Clear' : 'Filter'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Filter Tabs */}
                <View style={styles.tabsRow}>
                    {['all', 'open', 'in progress', 'resolved'].map((f) => {
                        const active = activeFilter === f
                        return (
                            <TouchableOpacity
                                key={f}
                                onPress={() => setActiveFilter(f)}
                                style={[
                                    styles.tab,
                                    active
                                        ? { backgroundColor: '#007AFF' }
                                        : {
                                              backgroundColor: dark
                                                  ? '#151515'
                                                  : '#FFF',
                                          },
                                ]}
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        active
                                            ? { color: '#fff' }
                                            : {
                                                  color: dark
                                                      ? '#E5E7EB'
                                                      : '#111827',
                                              },
                                    ]}
                                >
                                    {f === 'in progress'
                                        ? 'In Progress'
                                        : f.charAt(0).toUpperCase() +
                                          f.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>

            {/* List */}
            {isTicketLoading &&
            (!customerTickets || customerTickets.length === 0) ? (
                <View style={{ padding: 16 }}>{renderSkeleton()}</View>
            ) : (
                <FlatList
                    data={filteredTickets}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    style={{ flex: 1 }}
                    contentContainerStyle={[
                        styles.listContentContainer,
                        filteredTickets.length === 0 && { flex: 1 },
                    ]}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#007AFF"
                        />
                    }
                    removeClippedSubviews={true}
                    initialNumToRender={8}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                    updateCellsBatchingPeriod={100}
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
                            <TouchableOpacity
                                onPress={toggleModal}
                                style={styles.emptyCTA}
                            >
                                <Text style={styles.emptyCTAText}>
                                    Create Ticket
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}

            <CreateTicketFab onPress={toggleModal} />
            <CreateNewTicketModal
                isVisible={isModalVisible}
                onClose={toggleModal}
                onSubmit={handleSubmitTicket}
            />
        </SafeAreaView>
    )
}

// ------------------ Styles ------------------
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 14 : 12,
        paddingBottom: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
        elevation: 1,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        paddingVertical: 6,
    },
    clearButton: {
        marginLeft: 8,
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    tabsRow: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 8,
    },
    tab: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
    },
    listContentContainer: {
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    ticketItem: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    issueType: {
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    smallMuted: {
        fontSize: 12,
        marginTop: 2,
    },
    rightMeta: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    priorityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
        marginBottom: 6,
    },
    priorityIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    priority: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    statusSmall: {
        fontSize: 12,
        textTransform: 'capitalize',
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 10,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    date: {
        fontSize: 12,
    },
    resolvedText: {
        fontSize: 12,
        marginTop: 8,
        fontStyle: 'italic',
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
        shadowOpacity: 0.25,
        shadowRadius: 6,
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
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    modalView: {
        width: '90%',
        borderRadius: 14,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 6,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 14,
        textAlign: 'center',
    },
    formLabel: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 6,
        marginTop: 10,
    },
    inputContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 6,
    },
    pickerStyle: {
        width: '100%',
        height: 44,
    },
    textInput: {
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        minHeight: 88,
        textAlignVertical: 'top',
        fontSize: 14,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 18,
    },
    button: {
        borderRadius: 12,
        padding: 12,
        elevation: 2,
        width: '48%',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#6B7280',
    },
    submitButton: {
        backgroundColor: '#007AFF',
    },
    textStyle: {
        color: 'white',
        fontWeight: '700',
        fontSize: 15,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyIcon: {
        width: 96,
        height: 96,
        marginBottom: 16,
        resizeMode: 'contain',
    },
    emptyText: {
        fontSize: 16,
        marginBottom: 6,
    },
    emptySubText: {
        fontSize: 14,
        marginBottom: 16,
    },
    emptyCTA: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 12,
    },
    emptyCTAText: {
        color: '#fff',
        fontWeight: '700',
    },
    loadingContainer: {
        padding: 20,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default SupportTicketsSection
