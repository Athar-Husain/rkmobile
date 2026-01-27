import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    useWindowDimensions,
    FlatList,
    TextInput,
    LayoutAnimation,
    Pressable,
    Modal,
} from 'react-native'
import React, { useState } from 'react'
import { COLORS, Icons, SIZES, icons } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import HelpCenterItem from '../components/HelpCenterItem'
import { faqKeywords, faqs } from '../data'
import { useTheme } from '../theme/ThemeProvider'
import { ScrollView } from 'react-native-virtualized-view'
import { useNavigation } from '@react-navigation/native'
import { supportTickets } from '../data/supportTickets'

// A reusable component for the FAB and modal
const CreateTicketFab = () => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const toggleModal = () => setIsModalVisible(!isModalVisible)

    const NewTicketModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={toggleModal}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Create New Ticket</Text>
                    {/* Add your form inputs here */}
                    <Pressable style={styles.closeButton} onPress={toggleModal}>
                        <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )

    return (
        <View>
            <NewTicketModal />
            <Pressable
                style={styles.fab}
                onPress={toggleModal}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Image
                    source={icons.plus} // Using your provided icon constant
                    style={styles.fabIcon}
                />
            </Pressable>
        </View>
    )
}

const faqsRoute = () => {
    const [selectedKeywords, setSelectedKeywords] = useState([])
    const [expanded, setExpanded] = useState(-1)
    const [searchText, setSearchText] = useState('')
    const { dark } = useTheme()

    const handleKeywordPress = (id) => {
        setSelectedKeywords((prevSelectedKeywords) => {
            const selectedKeyword = faqKeywords.find(
                (keyword) => keyword.id === id
            )

            if (!selectedKeyword) {
                return prevSelectedKeywords
            }

            if (prevSelectedKeywords.includes(selectedKeyword.name)) {
                return prevSelectedKeywords.filter(
                    (keyword) => keyword !== selectedKeyword.name
                )
            } else {
                return [...prevSelectedKeywords, selectedKeyword.name]
            }
        })
    }

    const KeywordItem = ({ item, onPress, selected }) => {
        const itemStyle = {
            paddingHorizontal: 14,
            marginHorizontal: 5,
            borderRadius: 21,
            height: 39,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: COLORS.primary,
            borderWidth: 1,
            backgroundColor: selected ? COLORS.primary : 'transparent',
        }

        return (
            <TouchableOpacity
                style={itemStyle}
                onPress={() => onPress(item.id)}
            >
                <Text
                    style={{ color: selected ? COLORS.white : COLORS.primary }}
                >
                    {item.name}
                </Text>
            </TouchableOpacity>
        )
    }

    const toggleExpand = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setExpanded((prevExpanded) => (prevExpanded === index ? -1 : index))
    }

    return (
        <View>
            <View style={{ marginVertical: 16 }}>
                <FlatList
                    data={faqKeywords}
                    horizontal
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <KeywordItem
                            item={item}
                            onPress={handleKeywordPress}
                            selected={selectedKeywords.includes(item.name)}
                        />
                    )}
                />
            </View>
            <View
                style={[
                    styles.searchBar,
                    {
                        backgroundColor: dark
                            ? COLORS.dark2
                            : COLORS.grayscale100,
                    },
                ]}
            >
                <TouchableOpacity>
                    <Image
                        source={icons.search}
                        resizeMode="contain"
                        style={[
                            styles.searchIcon,
                            {
                                tintColor: dark
                                    ? COLORS.greyscale600
                                    : COLORS.grayscale400,
                            },
                        ]}
                    />
                </TouchableOpacity>
                <TextInput
                    style={[
                        styles.input,
                        {
                            color: dark
                                ? COLORS.greyscale600
                                : COLORS.grayscale400,
                        },
                    ]}
                    placeholder="Search"
                    placeholderTextColor={
                        dark ? COLORS.greyscale600 : COLORS.grayscale400
                    }
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                />
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ marginVertical: 22 }}
            >
                {faqs
                    .filter((faq) => {
                        if (selectedKeywords.length === 0) return true
                        return faq.type && selectedKeywords.includes(faq.type)
                    })
                    .filter((faq) =>
                        faq.question
                            .toLowerCase()
                            .includes(searchText.toLowerCase())
                    )
                    .map((faq, index) => (
                        <View
                            key={index}
                            style={[
                                styles.faqContainer,
                                {
                                    backgroundColor: dark
                                        ? COLORS.dark2
                                        : COLORS.grayscale100,
                                },
                            ]}
                        >
                            <TouchableOpacity
                                onPress={() => toggleExpand(index)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.questionContainer}>
                                    <Text
                                        style={[
                                            styles.question,
                                            {
                                                color: dark
                                                    ? COLORS.white
                                                    : COLORS.black,
                                            },
                                        ]}
                                    >
                                        {faq.question}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.icon,
                                            {
                                                color: dark
                                                    ? COLORS.white
                                                    : COLORS.black,
                                            },
                                        ]}
                                    >
                                        {expanded === index ? '-' : '+'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            {expanded === index && (
                                <Text
                                    style={[
                                        styles.answer,
                                        {
                                            color: dark
                                                ? COLORS.secondaryWhite
                                                : COLORS.gray2,
                                        },
                                    ]}
                                >
                                    {faq.answer}
                                </Text>
                            )}
                        </View>
                    ))}
            </ScrollView>
        </View>
    )
}

const contactUsRoute = () => {
    const navigation = useNavigation()
    const { colors, dark } = useTheme()

    return (
        <View
            style={[
                styles.routeContainer,
                {
                    backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite,
                },
            ]}
        >
            <HelpCenterItem
                icon={icons.headset}
                title="Customer Service"
                onPress={() => navigation.navigate('CustomerService')}
            />
            <HelpCenterItem
                icon={icons.whatsapp}
                title="Whatsapp"
                onPress={() => console.log('Whatsapp')}
            />
            <HelpCenterItem
                icon={icons.world}
                title="Website"
                onPress={() => console.log('Website')}
            />
            <HelpCenterItem
                icon={icons.facebook2}
                title="Facebook"
                onPress={() => console.log('Facebook')}
            />
            <HelpCenterItem
                icon={icons.twitter}
                title="Twitter"
                onPress={() => console.log('Twitter')}
            />
            <HelpCenterItem
                icon={icons.instagram}
                title="Instagram"
                onPress={() => console.log('Instagram')}
            />
        </View>
    )
}

const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
        case 'high':
            return '#E53E3E' // A strong red for high priority
        case 'medium':
            return '#D69E2E' // An amber/orange for medium
        case 'low':
            return '#38A169' // A solid green for low
        default:
            return '#888'
    }
}

const supportTicketsRoute = () => {
    const navigation = useNavigation()
    const { dark } = useTheme()

    

    const renderItem = ({ item }) => {
        const priorityColor = getPriorityColor(item.priority)
        const isResolved = item.status === 'resolved'
        const ticketBgColor = dark ? '#222' : '#F9FAFB'
        const textColor = dark ? '#E5E7EB' : '#111827'
        const secondaryColor = dark ? '#9CA3AF' : '#6B7280'

        return (
            <TouchableOpacity
                style={[
                    styles.ticketItem,
                    {
                        backgroundColor: ticketBgColor,
                        opacity: isResolved ? 0.6 : 1,
                    },
                ]}
                onPress={() =>
                    navigation.navigate('TicketDetail', { ticket: item })
                }
            >
                <View style={styles.headerRow}>
                    <Text
                        style={[
                            styles.issueType,
                            { color: textColor, fontWeight: 'bold' },
                        ]}
                    >
                        {item.issueType.toUpperCase()}
                    </Text>
                    <View style={styles.priorityBadge}>
                        <View
                            style={[
                                styles.priorityIndicator,
                                { backgroundColor: priorityColor },
                            ]}
                        />
                        <Text
                            style={[styles.priority, { color: secondaryColor }]}
                        >
                            {item.priority}
                        </Text>
                    </View>
                </View>

                <Text style={[styles.description, { color: secondaryColor }]}>
                    {item.description}
                </Text>

                <View style={styles.metaRow}>
                    <Text style={[styles.status, { color: secondaryColor }]}>
                        Status: {item.status}
                    </Text>
                    <Text style={[styles.date, { color: secondaryColor }]}>
                        Created: 2 days ago
                    </Text>
                </View>

                {isResolved && (
                    <Text
                        style={[styles.resolvedText, { color: secondaryColor }]}
                    >
                        Resolved in: 3 hours
                    </Text>
                )}
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={supportTickets}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                style={{ flex: 1 }} // Style to let the FlatList take full space
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
            <CreateTicketFab />
            {/* <Pressable
                style={styles.fab}
                onPress={toggleModal}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Image source={icons.add} style={styles.fabIcon} />
            </Pressable> */}
        </View>
    )
}

const renderScene = SceneMap({
    first: faqsRoute,
    second: supportTicketsRoute,
    third: contactUsRoute,
})

const HelpCenter = ({ navigation }) => {
    const layout = useWindowDimensions()
    const { dark, colors } = useTheme()

    const [index, setIndex] = React.useState(0)
    const [routes] = React.useState([
        { key: 'first', title: 'FAQ' },
        { key: 'second', title: 'Support' },
        { key: 'third', title: 'Connect Us' },
    ])

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{
                backgroundColor: COLORS.primary,
            }}
            style={{
                backgroundColor: dark ? COLORS.dark1 : COLORS.white,
            }}
            renderLabel={({ route, focused, color }) => (
                <Text
                    style={[
                        {
                            color: focused ? COLORS.primary : 'gray',
                            fontSize: 16,
                            fontFamily: 'bold',
                        },
                    ]}
                >
                    {route.title}
                </Text>
            )}
        />
    )
    /**
     * Render Header
     */
    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            source={icons.back}
                            resizeMode="contain"
                            style={[
                                styles.backIcon,
                                {
                                    tintColor: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                },
                            ]}
                        />
                    </TouchableOpacity>
                    <Text
                        style={[
                            styles.headerTitle,
                            {
                                color: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    >
                        Help Center
                    </Text>
                </View>
                <TouchableOpacity>
                    <Image
                        source={icons.moreCircle}
                        resizeMode="contain"
                        style={[
                            styles.moreIcon,
                            {
                                tintColor: dark
                                    ? COLORS.secondaryWhite
                                    : COLORS.greyscale900,
                            },
                        ]}
                    />
                </TouchableOpacity>
            </View>
        )
    }
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
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={renderTabBar}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.black,
    },
    moreIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    routeContainer: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingVertical: 22,
    },
    searchBar: {
        width: SIZES.width - 32,
        height: 56,
        borderRadius: 16,
        backgroundColor: COLORS.grayscale100,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    searchIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.grayscale400,
    },
    input: {
        flex: 1,
        color: COLORS.grayscale400,
        marginHorizontal: 12,
    },
    faqContainer: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    questionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    question: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'semiBold',
        color: '#333',
    },
    icon: {
        fontSize: 18,
        color: COLORS.gray2,
    },
    answer: {
        fontSize: 14,
        marginTop: 10,
        paddingHorizontal: 16,
        paddingBottom: 10,
        fontFamily: 'regular',
        color: COLORS.gray2,
    },
    ticketItem: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderLeftWidth: 4, // Added for visual separation
        borderLeftColor: '#007AFF', // Use a brand color
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
        color: '#111827',
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        color: '#6B7280',
        marginBottom: 12,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    status: {
        fontSize: 12,
        fontWeight: '500',
        color: '#38A169', // Consistent green for status
        textTransform: 'capitalize',
    },
    date: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    resolvedText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 8,
        fontStyle: 'italic',
    },
    priorityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
        backgroundColor: '#F3F4F6', // A light background for the badge
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
        color: '#6B7280',
        textTransform: 'capitalize',
    },
    // Styles for the FlatList empty state
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 80, // More generous spacing
        paddingHorizontal: 20,
    },
    emptyIcon: {
        width: 100,
        height: 100,
        marginBottom: 16,
        resizeMode: 'contain',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4B5563',
        textAlign: 'center',
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
    },

    // Styles for the Floating Action Button (FAB)
    fab: {
        position: 'absolute',
        bottom: 50,
        right: 5,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#007AFF', // A nice blue, or use your brand color
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
        zIndex: 10, // Ensure it's above other elements
    },
    fabIcon: {
        width: 32,
        height: 32,
        tintColor: '#FFFFFF', // To change the color of the icon if it's a vector image
    },

    // Styles for the Modal
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#2196F3',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1, // Ensure this view fills the available space
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50, // Or whatever works for your layout
    },
    emptyIcon: {
        width: 80,
        height: 80,
        tintColor: COLORS.gray2,
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.gray2,
        textAlign: 'center',
    },
})

export default HelpCenter
