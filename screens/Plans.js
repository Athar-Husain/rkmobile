import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Modal,
    ActivityIndicator,
} from 'react-native'
import { useTheme } from '../theme/ThemeProvider'
import Icon from 'react-native-vector-icons/Ionicons'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPlans } from '../redux/features/Plan/PlanSlice'

const PlansScreen = () => {
    const { dark } = useTheme()
    const dispatch = useDispatch()
    const { allPlans, loading, error } = useSelector((state) => state.plan)

    const [selectedDuration, setSelectedDuration] = useState(null)
    const [selectedSpeed, setSelectedSpeed] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState(null) // New state for categories
    const [showUnlimitedDataOnly, setShowUnlimitedDataOnly] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState(null)

    // Dynamic filter options
    const [allDurations, setAllDurations] = useState([])
    const [allSpeeds, setAllSpeeds] = useState([])
    const [allCategories, setAllCategories] = useState([])

    useEffect(() => {
        // Dispatch the async thunk to fetch plans when the component mounts.
        dispatch(getAllPlans())
    }, [dispatch])

    useEffect(() => {
        if (allPlans && allPlans.length > 0) {
            // Dynamically get unique durations, speeds, and categories from the fetched data
            const uniqueDurations = [
                ...new Set(allPlans.map((plan) => plan.duration)),
            ]
            const uniqueSpeeds = [
                ...new Set(
                    allPlans.map((plan) => `${plan.internetSpeed} Mbps`)
                ),
            ]
            const uniqueCategories = [
                ...new Set(allPlans.map((plan) => plan.category)),
            ]

            setAllDurations(uniqueDurations)
            setAllSpeeds(uniqueSpeeds)
            setAllCategories(uniqueCategories)
        }
    }, [allPlans])

    const filterPlans = (plan) => {
        const matchesDuration =
            !selectedDuration || plan.duration === selectedDuration
        const matchesSpeed =
            !selectedSpeed || `${plan.internetSpeed} Mbps` === selectedSpeed
        const matchesCategory =
            !selectedCategory || plan.category === selectedCategory // New filter check
        const matchesDataLimit =
            !showUnlimitedDataOnly || plan.dataLimitType === 'unlimited'
        return (
            matchesDuration &&
            matchesSpeed &&
            matchesCategory &&
            matchesDataLimit
        )
    }

    const filteredPlans = allPlans.filter(filterPlans)
    const featuredPlans = allPlans.filter((plan) => plan.featured)

    const handleClearFilters = () => {
        setSelectedDuration(null)
        setSelectedSpeed(null)
        setSelectedCategory(null)
        setShowUnlimitedDataOnly(false)
    }

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan)
        setModalVisible(true)
    }

    const handlePayNow = () => {
        console.log('Simulating payment for plan:', selectedPlan)
        setModalVisible(false)
        // In a real app, you would navigate to a payment screen here.
    }

    const PlanCard = ({ plan, isFeatured }) => {
        const cardStyle = isFeatured ? styles.featuredCard : styles.planCard
        const speedStyle = isFeatured ? styles.featuredSpeed : styles.planSpeed
        const priceStyle = isFeatured ? styles.featuredPrice : styles.planPrice
        const buttonStyle = isFeatured
            ? styles.featuredButton
            : styles.planButton

        return (
            <View
                style={[
                    cardStyle,
                    {
                        backgroundColor: dark ? '#1C1C1E' : '#FFFFFF',
                        borderColor: plan.isCurrent
                            ? '#335EF7'
                            : dark
                              ? '#333'
                              : '#E0E0E0',
                    },
                ]}
            >
                {plan.featured && (
                    <View style={styles.currentPlanBadge}>
                        <Text style={styles.currentPlanText}>Featured</Text>
                    </View>
                )}
                <View style={styles.planHeader}>
                    <Text
                        style={[
                            speedStyle,
                            { color: dark ? '#EAEAEA' : '#333' },
                        ]}
                    >
                        {plan.internetSpeed}{' '}
                        <Text style={styles.speedUnit}>
                            {plan.internetSpeedUnit}
                        </Text>
                    </Text>
                    <Text
                        style={[
                            styles.planDuration,
                            { color: dark ? '#999' : '#666' },
                        ]}
                    >
                        {plan.duration}
                    </Text>
                </View>

                <View style={styles.priceContainer}>
                    <Text
                        style={[
                            priceStyle,
                            { color: dark ? '#EAEAEA' : '#333' },
                        ]}
                    >
                        ₹{plan.price}
                    </Text>
                    {plan.originalPrice && (
                        <View style={styles.savingsBadge}>
                            <Text style={styles.savingsText}>
                                Save {plan.savings}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.featuresList}>
                    <View style={styles.featureItem}>
                        <Icon
                            name="checkmark-circle"
                            size={14}
                            color="#14C9A0"
                        />
                        <Text
                            style={[
                                styles.featureText,
                                { color: dark ? '#EAEAEA' : '#333' },
                            ]}
                        >
                            {plan.dataLimitType === 'unlimited'
                                ? 'Unlimited'
                                : plan.dataLimit}{' '}
                            Data
                        </Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Icon
                            name="checkmark-circle"
                            size={14}
                            color="#14C9A0"
                        />
                        <Text
                            style={[
                                styles.featureText,
                                { color: dark ? '#EAEAEA' : '#333' },
                            ]}
                        >
                            {plan.internetSpeed} {plan.internetSpeedUnit} Speed
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[
                        buttonStyle,
                        {
                            backgroundColor: plan.isCurrent
                                ? '#14C9A0'
                                : '#335EF7',
                        },
                    ]}
                    disabled={plan.isCurrent}
                    onPress={() => handleSelectPlan(plan)}
                >
                    <Text style={styles.planButtonText}>
                        {plan.isCurrent ? 'Current Plan' : 'Select Plan'}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    if (loading === 'pending') {
        return (
            <SafeAreaView style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#335EF7" />
                <Text
                    style={[
                        styles.loadingText,
                        { color: dark ? '#fff' : '#000' },
                    ]}
                >
                    Loading plans...
                </Text>
            </SafeAreaView>
        )
    }

    if (error) {
        return (
            <SafeAreaView style={[styles.container, styles.centerContent]}>
                <Icon name="warning-outline" size={50} color="#FF6B6B" />
                <Text
                    style={[
                        styles.errorText,
                        { color: dark ? '#fff' : '#000' },
                    ]}
                >
                    Failed to load plans: {error}
                </Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: dark ? '#000' : '#F4F5F7' },
            ]}
        >
            <View
                style={[
                    styles.header,
                    { borderBottomColor: dark ? '#333' : '#E0E0E0' },
                ]}
            >
                <Text
                    style={[
                        styles.headerTitle,
                        { color: dark ? '#EAEAEA' : '#333' },
                    ]}
                >
                    Our Plans
                </Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Featured Plans Section */}
                <View style={styles.section}>
                    <Text
                        style={[
                            styles.sectionTitle,
                            { color: dark ? '#EAEAEA' : '#333' },
                        ]}
                    >
                        Featured Plans
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalScrollView}
                    >
                        {featuredPlans.map((plan) => (
                            <PlanCard
                                key={plan._id}
                                plan={plan}
                                isFeatured={true}
                            />
                        ))}
                    </ScrollView>
                </View>

                {/* Filter Section */}
                <View style={styles.section}>
                    <View style={styles.filterHeader}>
                        <Text
                            style={[
                                styles.filterLabel,
                                { color: dark ? '#EAEAEA' : '#333' },
                            ]}
                        >
                            Filter Plans:
                        </Text>
                        <TouchableOpacity onPress={handleClearFilters}>
                            <Text style={styles.clearFiltersText}>
                                Clear All
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterScrollView}
                    >
                        {allDurations.map((duration) => (
                            <TouchableOpacity
                                key={duration}
                                style={[
                                    styles.filterButton,
                                    selectedDuration === duration &&
                                        styles.activeFilterButton,
                                ]}
                                onPress={() =>
                                    setSelectedDuration(
                                        selectedDuration === duration
                                            ? null
                                            : duration
                                    )
                                }
                            >
                                <Text
                                    style={[
                                        styles.filterButtonText,
                                        selectedDuration === duration
                                            ? styles.activeFilterText
                                            : { color: dark ? '#999' : '#666' },
                                    ]}
                                >
                                    {duration}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        {allSpeeds.map((speed) => (
                            <TouchableOpacity
                                key={speed}
                                style={[
                                    styles.filterButton,
                                    selectedSpeed === speed &&
                                        styles.activeFilterButton,
                                ]}
                                onPress={() =>
                                    setSelectedSpeed(
                                        selectedSpeed === speed ? null : speed
                                    )
                                }
                            >
                                <Text
                                    style={[
                                        styles.filterButtonText,
                                        selectedSpeed === speed
                                            ? styles.activeFilterText
                                            : { color: dark ? '#999' : '#666' },
                                    ]}
                                >
                                    {speed}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        {allCategories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.filterButton,
                                    selectedCategory === category &&
                                        styles.activeFilterButton,
                                ]}
                                onPress={() =>
                                    setSelectedCategory(
                                        selectedCategory === category
                                            ? null
                                            : category
                                    )
                                }
                            >
                                <Text
                                    style={[
                                        styles.filterButtonText,
                                        selectedCategory === category
                                            ? styles.activeFilterText
                                            : { color: dark ? '#999' : '#666' },
                                    ]}
                                >
                                    {category.slice(0, 4)}...
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={[
                                styles.filterButton,
                                showUnlimitedDataOnly &&
                                    styles.activeFilterButton,
                            ]}
                            onPress={() =>
                                setShowUnlimitedDataOnly(!showUnlimitedDataOnly)
                            }
                        >
                            <Text
                                style={[
                                    styles.filterButtonText,
                                    showUnlimitedDataOnly
                                        ? styles.activeFilterText
                                        : { color: dark ? '#999' : '#666' },
                                ]}
                            >
                                Unlimited Data
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* Plans List */}
                <View style={styles.section}>
                    <Text
                        style={[
                            styles.sectionTitle,
                            { color: dark ? '#EAEAEA' : '#333' },
                        ]}
                    >
                        All Plans
                    </Text>
                    <View style={styles.plansContainer}>
                        {filteredPlans.length > 0 ? (
                            filteredPlans.map((plan) => (
                                <PlanCard key={plan._id} plan={plan} />
                            ))
                        ) : (
                            <Text
                                style={[
                                    styles.noResultsText,
                                    { color: dark ? '#999' : '#666' },
                                ]}
                            >
                                No plans match your selected filters.
                            </Text>
                        )}
                    </View>
                </View>

                {/* Payment Modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.centeredView}>
                        <View
                            style={[
                                styles.modalView,
                                { backgroundColor: dark ? '#222' : '#fff' },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.modalTitle,
                                    { color: dark ? '#fff' : '#000' },
                                ]}
                            >
                                Proceed to Payment
                            </Text>
                            <Text
                                style={[
                                    styles.modalText,
                                    { color: dark ? '#ccc' : '#666' },
                                ]}
                            >
                                You have selected the{' '}
                                {selectedPlan?.internetSpeed}{' '}
                                {selectedPlan?.internetSpeedUnit} (
                                {selectedPlan?.duration}) plan for ₹
                                {selectedPlan?.price}.
                            </Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.modalButton,
                                        styles.buttonClose,
                                        {
                                            borderColor: dark
                                                ? '#444'
                                                : '#E0E0E0',
                                        },
                                    ]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            { color: dark ? '#fff' : '#000' },
                                        ]}
                                    >
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.modalButton,
                                        styles.buttonPay,
                                    ]}
                                    onPress={handlePayNow}
                                >
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            { color: '#fff' },
                                        ]}
                                    >
                                        Pay Now
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 24,
        marginBottom: 10,
    },
    horizontalScrollView: {
        paddingHorizontal: 16,
    },
    featuredCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderColor: '#FFD166',
        width: 160,
    },
    featuredSpeed: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    featuredPrice: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    planCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 12,
        marginBottom: 12,
        flexGrow: 1,
        flexShrink: 0,
        flexBasis: '47%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    currentPlanBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#14C9A0',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderBottomLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    currentPlanText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    planHeader: {
        marginBottom: 8,
        gap: 2,
    },
    planSpeed: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    speedUnit: {
        fontSize: 10,
        fontWeight: 'normal',
    },
    planDuration: {
        fontSize: 11,
        fontWeight: '600',
    },
    priceContainer: {
        marginBottom: 10,
    },
    planPrice: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    savingsBadge: {
        backgroundColor: '#FF6B6B',
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginTop: 2,
        alignSelf: 'flex-start',
    },
    savingsText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: 'bold',
    },
    featuresList: {
        marginBottom: 12,
        gap: 6,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    featureText: {
        marginLeft: 8,
        fontSize: 11,
    },
    planButton: {
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    featuredButton: {
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    planButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'semibold',
    },
    filterSection: {
        paddingHorizontal: 24,
    },
    filterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    clearFiltersText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#335EF7',
    },
    filterScrollView: {
        paddingBottom: 16,
        gap: 8,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginRight: 8,
    },
    activeFilterButton: {
        backgroundColor: '#335EF7',
        borderColor: '#335EF7',
    },
    filterButtonText: {
        fontSize: 13,
        fontWeight: '600',
    },
    activeFilterText: {
        color: '#FFFFFF',
    },
    plansContainer: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    noResultsText: {
        textAlign: 'center',
        marginTop: 30,
        fontSize: 16,
    },
    // Modal Styles
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 20,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalText: {
        marginBottom: 20,
        textAlign: 'center',
        lineHeight: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        minWidth: 100,
        alignItems: 'center',
    },
    buttonPay: {
        backgroundColor: '#335EF7',
    },
    buttonClose: {
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
    buttonText: {
        fontWeight: 'bold',
    },
    // Styles for loading and error states
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    errorText: {
        marginTop: 10,
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
})

export default PlansScreen
