import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    FlatList,
    ScrollView,
    Dimensions,
    Modal,
    Platform,
} from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images, COLORS, SIZES, icons } from '../constants'
import { banners, categories, mostPopularServices } from '../data'
import SubHeaderItem from '../components/SubHeaderItem'
import Category from '../components/Category'
import ServiceCard from '../components/ServiceCard'
import { useTheme } from '../theme/ThemeProvider'

const BOTTOM_NAV_HEIGHT = Platform.OS === 'ios' ? 90 : 60

// Constants for layout
const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - 48) / 2

// Refined Overview Data with a more professional color palette
const overviewData = [
    {
        title: 'Active Connections',
        value: 3,
        icon: icons.wifi,
        bg: COLORS.primary, // Using the primary brand color
    },
    {
        title: 'Monthly Bill',
        value: '$42.00',
        icon: icons.wallet,
        bg: '#6C63FF', // A professional, desaturated blue/purple
    },
    {
        title: 'Pending Balance',
        value: '$10.00',
        icon: icons.infoCircle,
        bg: '#FF6B6B', // A subtle, professional red
    },
    {
        title: 'Subscribed Plan',
        value: 'Pro Max',
        icon: icons.box,
        bg: '#3DD598', // A clean, professional green
    },
    {
        title: 'Open Tickets',
        value: 1,
        icon: icons.ticket,
        bg: '#FEC260', // A warm, friendly orange
    },
    {
        title: 'Last Payment',
        value: '$32.00',
        icon: icons.check,
        bg: '#4D9DE0', // A calming, professional blue
    },
]

// Sample data for featured plans
const featuredPlansData = [
    {
        id: '1',
        name: 'Pro Plan',
        speed: '100 Mbps',
        description: 'Best for professionals',
        price: 50,
    },
    {
        id: '2',
        name: 'Business Plan',
        speed: '200 Mbps',
        description: 'Ideal for businesses',
        price: 80,
    },
    {
        id: '3',
        name: 'Ultra Plan',
        speed: '300 Mbps',
        description: 'For heavy usage',
        price: 100,
    },
    {
        id: '4',
        name: 'Mega Plan',
        speed: '500 Mbps',
        description: 'Ultimate speed',
        price: 150,
    },
    {
        id: '5',
        name: 'Lite Plan',
        speed: '50 Mbps',
        description: 'Budget friendly',
        price: 30,
    },
]

const Home = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [modalVisible, setModalVisible] = useState(false)
    const { dark, colors } = useTheme()

    // Connection data can be managed in a state or context
    const [selectedConnection, setSelectedConnection] = useState('Home WiFi')
    const connectionDetails = {
        name: selectedConnection,
        status: 'Active',
        ipAddress: '192.168.0.101',
        speed: '150 Mbps',
        dataUsed: '120 GB',
    }

    // --- Render Functions ---

    // Header component for a cleaner look
    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Image
                            source={images.user5}
                            resizeMode="cover"
                            style={styles.avatar}
                        />
                    </TouchableOpacity>
                    <Text
                        style={[
                            styles.username,
                            {
                                color: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    >
                        Hi, Joanna!
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Notifications')}
                >
                    <Image
                        source={icons.bell}
                        resizeMode="contain"
                        style={[
                            styles.bellIcon,
                            {
                                tintColor: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    />
                    <View style={styles.noti} />
                </TouchableOpacity>
            </View>
        )
    }

    // A clean, simple banner with dots
    const renderBanner = () => {
        return (
            <View style={styles.bannerSection}>
                <FlatList
                    data={banners}
                    renderItem={({ item }) => (
                        <View style={styles.bannerContainer}>
                            <View>
                                <Text style={styles.bannerTopTitle}>
                                    {item.discountName}
                                </Text>
                                <Text style={styles.bannerTopSubtitle}>
                                    {item.bottomSubtitle}
                                </Text>
                            </View>
                            <Text style={styles.bannerDiscount}>
                                {item.discount} OFF
                            </Text>
                        </View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(event) => {
                        const newIndex = Math.round(
                            event.nativeEvent.contentOffset.x / (width - 32)
                        )
                        setCurrentIndex(newIndex)
                    }}
                />
                <View style={styles.dotContainer}>
                    {banners.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentIndex
                                    ? styles.activeDot
                                    : null,
                            ]}
                        />
                    ))}
                </View>
            </View>
        )
    }

    // Welcome and Connection Info section
    const renderWelcomeAndConnection = () => {
        return (
            <View style={styles.welcomeContainer}>
                <Text
                    style={[
                        styles.welcomeText,
                        { color: dark ? COLORS.white : COLORS.greyscale900 },
                    ]}
                >
                    Welcome back,
                    <Text style={styles.boldUsername}> Joanna</Text>
                </Text>
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={styles.connectionDropdown}
                >
                    <Text style={styles.connectionText}>
                        {selectedConnection} ⌄
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    // Refactored Modal to its own function for clarity
    const renderConnectionModal = () => {
        return (
            <Modal
                animationType="fade" // Changed from slide to fade for a smoother effect
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>
                            Connection Details
                        </Text>
                        <View style={styles.modalDetailRow}>
                            <Text style={styles.modalDetailLabel}>Name:</Text>
                            <Text style={styles.modalDetailValue}>
                                {connectionDetails.name}
                            </Text>
                        </View>
                        <View style={styles.modalDetailRow}>
                            <Text style={styles.modalDetailLabel}>Status:</Text>
                            <Text style={styles.modalDetailValue}>
                                {connectionDetails.status}
                            </Text>
                        </View>
                        <View style={styles.modalDetailRow}>
                            <Text style={styles.modalDetailLabel}>
                                IP Address:
                            </Text>
                            <Text style={styles.modalDetailValue}>
                                {connectionDetails.ipAddress}
                            </Text>
                        </View>
                        <View style={styles.modalDetailRow}>
                            <Text style={styles.modalDetailLabel}>Speed:</Text>
                            <Text style={styles.modalDetailValue}>
                                {connectionDetails.speed}
                            </Text>
                        </View>
                        <View style={styles.modalDetailRow}>
                            <Text style={styles.modalDetailLabel}>
                                Data Used:
                            </Text>
                            <Text style={styles.modalDetailValue}>
                                {connectionDetails.dataUsed}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }

    // Overview Cards section
    const renderOverviewCards = () => {
        return (
            <View>
                <SubHeaderItem title="Overview" navTitle="" />
                <FlatList
                    data={overviewData}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3}
                    scrollEnabled={false}
                    columnWrapperStyle={styles.overviewRow}
                    renderItem={({ item }) => (
                        <View
                            style={[
                                styles.overviewCard,
                                { backgroundColor: item.bg },
                            ]}
                        >
                            <Image
                                source={item.icon}
                                style={styles.overviewIcon}
                            />
                            <Text style={styles.overviewValue}>
                                {item.value}
                            </Text>
                            <Text style={styles.overviewTitle}>
                                {item.title}
                            </Text>
                        </View>
                    )}
                />
            </View>
        )
    }

    // Featured Plans Section with simplified horizontal scroll
    const renderFeaturedPlansSection = () => {
        return (
            <View>
                <SubHeaderItem
                    title="Featured Plans"
                    navTitle="See all"
                    onPress={() => navigation.navigate('plans')}
                />
                <FlatList
                    data={featuredPlansData}
                    horizontal
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View
                            style={[styles.featuredCard, { width: CARD_WIDTH }]}
                        >
                            <Text style={styles.featuredName}>{item.name}</Text>
                            <Text style={styles.featuredSpeed}>
                                {item.speed}
                            </Text>
                            <Text style={styles.featuredDescription}>
                                {item.description}
                            </Text>
                            <Text style={styles.featuredPrice}>
                                ${item.price} / month
                            </Text>
                        </View>
                    )}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.featuredListContainer}
                />
            </View>
        )
    }

    return (
        <SafeAreaView
            style={[styles.area, { backgroundColor: colors.background }]}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: BOTTOM_NAV_HEIGHT }}
                style={styles.container}
            >
                {renderHeader()}
                {renderBanner()}
                {renderWelcomeAndConnection()}
                {renderOverviewCards()}
                {renderFeaturedPlansSection()}
            </ScrollView>
            {renderConnectionModal()}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 8,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 20,
    },
    username: {
        fontFamily: 'semiBold',
        fontSize: 16,
        marginLeft: 12,
    },
    bellIcon: {
        width: 24,
        height: 24,
    },
    noti: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 8,
        backgroundColor: COLORS.red,
        right: 0,
        top: 0,
    },
    // Banner styles
    bannerSection: {
        marginBottom: 20,
    },
    bannerContainer: {
        width: width - 32,
        height: 120, // Adjusted height for a more compact look
        borderRadius: 16,
        padding: 20,
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bannerTopTitle: {
        fontFamily: 'semiBold',
        fontSize: 16,
        color: COLORS.white,
    },
    bannerTopSubtitle: {
        fontFamily: 'medium',
        fontSize: 12,
        color: COLORS.white,
        marginTop: 4,
    },
    bannerDiscount: {
        fontFamily: 'bold',
        fontSize: 24, // Made this more prominent
        color: COLORS.white,
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.greyscale400,
        marginHorizontal: 4,
    },
    activeDot: {
        width: 14,
        backgroundColor: COLORS.primary,
    },
    // Welcome and Connection styles
    welcomeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 16,
    },
    welcomeText: {
        fontFamily: 'semiBold',
        fontSize: 18,
    },
    boldUsername: {
        fontWeight: 'bold',
    },
    connectionDropdown: {
        borderWidth: 1,
        borderColor: COLORS.greyscale300,
        borderRadius: 20, // More rounded for a softer look
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    connectionText: {
        fontFamily: 'medium',
        fontSize: 13,
        color: COLORS.greyscale700,
    },
    // Overview Cards styles
    overviewRow: {
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    overviewCard: {
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 8,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 4,
        minWidth: '30%',
        maxWidth: '31%',
        aspectRatio: 1, // Keep cards square for visual consistency
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        justifyContent: 'center', // Center content vertically
    },
    overviewIcon: {
        width: 24,
        height: 24,
        marginBottom: 8,
        tintColor: COLORS.white,
    },
    overviewValue: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.white,
    },
    overviewTitle: {
        fontSize: 10,
        fontFamily: 'semiBold',
        color: COLORS.white,
        textAlign: 'center',
        marginTop: 4,
    },
    // Featured Plans styles
    featuredListContainer: {
        paddingHorizontal: 0,
    },
    featuredCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginRight: 12, // Use a consistent margin for spacing
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 3,
        justifyContent: 'space-between',
        minHeight: 120, // Give the card a minimum height
    },
    featuredName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.greyscale900,
        marginBottom: 4,
    },
    featuredSpeed: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
        marginBottom: 4,
    },
    featuredDescription: {
        fontSize: 13,
        color: COLORS.greyscale700,
        marginBottom: 8,
    },
    featuredPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.greyscale900,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)', // Slightly lighter overlay
        justifyContent: 'flex-end', // Aligns modal to the bottom
    },
    modalContainer: {
        width: '100%',
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: COLORS.greyscale900,
    },
    modalDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    modalDetailLabel: {
        fontSize: 14,
        fontFamily: 'medium',
        color: COLORS.greyscale700,
    },
    modalDetailValue: {
        fontSize: 14,
        fontFamily: 'semiBold',
        color: COLORS.greyscale900,
    },
    closeButton: {
        marginTop: 24,
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    closeButtonText: {
        color: COLORS.white,
        fontFamily: 'semiBold',
        fontSize: 16,
    },
})

export default Home
