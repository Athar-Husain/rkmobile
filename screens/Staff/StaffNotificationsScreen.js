import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    RefreshControl,
    LayoutAnimation,
    Platform,
    UIManager,
    Alert,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import moment from 'moment'

// Theme and Constants imports
import { useTheme } from '../../theme/ThemeProvider'
import { COLORS } from '../../constants'

import {
    getNotifications,
    markNotificationsRead,
    markAllNotificationsRead,
    resetNotificationState,
} from '../../redux/features/Notifications/NotificationSlice'

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}

const StaffNotificationsScreen = ({ navigation }) => {
    const dispatch = useDispatch()
    const { colors, dark } = useTheme() // Consume theme
    const [activeFilter, setActiveFilter] = useState('All')
    const [expandedId, setExpandedId] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

    const { notifications, unreadCount, pagination, isNotificationLoading } =
        useSelector((state) => state.notifications)

    useEffect(() => {
        fetchData(1)
        return () => dispatch(resetNotificationState())
    }, [])

    const fetchData = (pageNo) => {
        dispatch(getNotifications({ page: pageNo, limit: 15 }))
    }

    const onRefresh = useCallback(async () => {
        setRefreshing(true)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        await dispatch(getNotifications({ page: 1, limit: 15 }))
        setRefreshing(false)
    }, [dispatch])

    const handleMarkAllRead = () => {
        if (unreadCount === 0) return

        Alert.alert(
            'Mark all as read?',
            'This will clear all your unread indicators.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Mark All',
                    onPress: () => {
                        Haptics.notificationAsync(
                            Haptics.NotificationFeedbackType.Success
                        )
                        dispatch(markAllNotificationsRead())
                    },
                },
            ]
        )
    }

    const handleLoadMore = () => {
        if (!isNotificationLoading && pagination?.page < pagination?.pages) {
            fetchData(pagination.page + 1)
        }
    }

    const dynamicCategories = useMemo(() => {
        const categories = notifications
            .map((item) => item.category)
            .filter(Boolean)
        return ['All', ...new Set(categories)]
    }, [notifications])

    const filteredData = useMemo(() => {
        if (activeFilter === 'All') return notifications
        return notifications.filter((item) => item.category === activeFilter)
    }, [activeFilter, notifications])

    const toggleExpand = (item) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

        setExpandedId(expandedId === item._id ? null : item._id)

        if (!item.isRead) {
            dispatch(markNotificationsRead([item._id]))
        }
    }

    const getIconConfig = (category) => {
        const config = {
            COUPON: { name: 'sale', color: '#E91E63' },
            SYSTEM: { name: 'shield-check-outline', color: '#607D8B' },
            ORDER: { name: 'truck-delivery-outline', color: '#4CAF50' },
            OFFER: { name: 'fire', color: '#FF9800' },
            BILLING: {
                name: 'credit-card-outline',
                color: dark ? '#58A6FF' : '#004AAD',
            },
        }
        return (
            config[category] || {
                name: 'bell-outline',
                color: dark ? '#58A6FF' : '#004AAD',
            }
        )
    }

    const renderNotification = ({ item }) => {
        const icon = getIconConfig(item.category)
        const isExpanded = expandedId === item._id

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={[
                    styles.card,
                    { backgroundColor: dark ? '#1C1C1E' : '#FFF' },
                    !item.isRead && [
                        styles.unreadCard,
                        { borderLeftColor: dark ? '#58A6FF' : '#004AAD' },
                    ],
                ]}
                onPress={() => toggleExpand(item)}
            >
                <View
                    style={[
                        styles.iconContainer,
                        { backgroundColor: icon.color + '20' }, // Slightly higher opacity for icons in dark mode
                    ]}
                >
                    <MaterialCommunityIcons
                        name={icon.name}
                        size={22}
                        color={icon.color}
                    />
                </View>

                <View style={styles.textContainer}>
                    <View
                        style={
                            isExpanded
                                ? styles.expandedHeader
                                : styles.cardHeader
                        }
                    >
                        <Text
                            numberOfLines={isExpanded ? undefined : 1}
                            style={[
                                styles.title,
                                { color: colors.text },
                                !item.isRead && styles.boldText,
                            ]}
                        >
                            {item.title}
                        </Text>
                        <Text
                            style={
                                isExpanded
                                    ? styles.expandedTime
                                    : styles.timeText
                            }
                        >
                            {moment(item.createdAt).fromNow(true)}
                        </Text>
                    </View>

                    <Text
                        style={[
                            styles.content,
                            { color: dark ? '#8E8E93' : '#636366' },
                        ]}
                        numberOfLines={isExpanded ? undefined : 2}
                    >
                        {item.content}
                    </Text>

                    {isExpanded && item.targetScreen && (
                        <TouchableOpacity
                            style={[
                                styles.actionBtn,
                                { backgroundColor: icon.color },
                            ]}
                            onPress={() =>
                                navigation.navigate(item.targetScreen, {
                                    id: item.targetId,
                                })
                            }
                        >
                            <Text style={styles.actionBtnText}>
                                View Details
                            </Text>
                            <MaterialCommunityIcons
                                name="arrow-right"
                                size={14}
                                color="#FFF"
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {!item.isRead && (
                    <View
                        style={[
                            styles.unreadDot,
                            { backgroundColor: dark ? '#58A6FF' : '#004AAD' },
                        ]}
                    />
                )}
            </TouchableOpacity>
        )
    }

    return (
        <View
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

            <View
                style={[
                    styles.header,
                    { backgroundColor: dark ? '#121212' : '#FFF' },
                ]}
            >
                <View style={{ flex: 1 }}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        Notifications
                    </Text>
                    <Text style={styles.headerSub}>
                        {unreadCount > 0
                            ? `You have ${unreadCount} unread items`
                            : "You're all caught up"}
                    </Text>
                </View>
                {unreadCount > 0 && (
                    <TouchableOpacity
                        onPress={handleMarkAllRead}
                        style={[
                            styles.markAllBtn,
                            { backgroundColor: dark ? '#1C1C1E' : '#F0F5FF' },
                        ]}
                    >
                        <MaterialCommunityIcons
                            name="check-all"
                            size={18}
                            color={dark ? '#58A6FF' : '#004AAD'}
                        />
                        <Text
                            style={[
                                styles.markAllText,
                                { color: dark ? '#58A6FF' : '#004AAD' },
                            ]}
                        >
                            Clear All
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <View
                style={[
                    styles.filterWrapper,
                    { backgroundColor: dark ? '#121212' : '#FFF' },
                ]}
            >
                <FlatList
                    horizontal
                    data={dynamicCategories}
                    keyExtractor={(item) => item}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.selectionAsync()
                                setActiveFilter(item)
                            }}
                            style={[
                                styles.chip,
                                {
                                    backgroundColor: dark
                                        ? '#1C1C1E'
                                        : '#F2F2F7',
                                    borderColor: dark ? '#2C2C2E' : '#E5E5EA',
                                },
                                activeFilter === item && [
                                    styles.activeChip,
                                    {
                                        backgroundColor: dark
                                            ? '#58A6FF'
                                            : '#004AAD',
                                        borderColor: dark
                                            ? '#58A6FF'
                                            : '#004AAD',
                                    },
                                ],
                            ]}
                        >
                            <Text
                                style={[
                                    styles.chipText,
                                    { color: dark ? '#8E8E93' : '#636366' },
                                    activeFilter === item &&
                                        styles.activeChipText,
                                ]}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item._id}
                renderItem={renderNotification}
                contentContainerStyle={styles.listContainer}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={dark ? '#58A6FF' : '#004AAD'}
                    />
                }
                ListFooterComponent={() =>
                    isNotificationLoading ? (
                        <ActivityIndicator
                            style={{ marginVertical: 20 }}
                            color={dark ? '#58A6FF' : '#004AAD'}
                        />
                    ) : (
                        <View style={{ height: 100 }} />
                    )
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    headerSub: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
    markAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    markAllText: {
        fontSize: 13,
        fontWeight: '700',
        marginLeft: 4,
    },
    filterWrapper: { paddingBottom: 10 },
    filterList: { paddingHorizontal: 15 },
    chip: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
        marginHorizontal: 5,
        borderWidth: 1,
    },
    activeChip: { elevation: 2 },
    chipText: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    activeChipText: { color: '#FFF' },
    listContainer: { paddingHorizontal: 16, paddingTop: 15 },
    card: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 16,
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    unreadCard: {
        borderLeftWidth: 4,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: { flex: 1 },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    expandedHeader: { flexDirection: 'column', marginBottom: 8 },
    title: { fontSize: 15, flexShrink: 1, lineHeight: 20 },
    boldText: { fontWeight: '700' },
    timeText: {
        fontSize: 11,
        color: '#A1A1A1',
        fontWeight: '500',
        marginLeft: 10,
    },
    expandedTime: {
        fontSize: 11,
        color: '#A1A1A1',
        fontWeight: '500',
        marginTop: 2,
    },
    content: { fontSize: 14, lineHeight: 20 },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        position: 'absolute',
        top: 15,
        right: 15,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    actionBtnText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 12,
        marginRight: 5,
    },
})

export default StaffNotificationsScreen
