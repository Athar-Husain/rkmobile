import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Modal,
} from 'react-native'
import { useTheme } from '../theme/ThemeProvider'
import Icon from 'react-native-vector-icons/Ionicons'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPlans } from '../redux/features/Plan/PlanSlice'

// Detailed data for all plans
export const allPlansData = [
    {
        id: '1-40',
        duration: '1 Month',
        speed: 40,
        price: '588',
        originalPrice: null,
        savings: null,
        isCurrent: false,
        isFeatured: false,
        dataLimit: 'Unlimited',
    },
    {
        id: '1-100',
        duration: '1 Month',
        speed: 100,
        price: '999',
        originalPrice: null,
        savings: null,
        isCurrent: false,
        isFeatured: false,
        dataLimit: 'Unlimited',
    },
    {
        id: '1-60',
        duration: '1 Month',
        speed: 60,
        price: '699',
        originalPrice: null,
        savings: null,
        isCurrent: false,
        isFeatured: false,
        dataLimit: 'Unlimited',
    },
    {
        id: '7-40',
        duration: '7 Months',
        speed: 40,
        price: '3499',
        originalPrice: '4116',
        savings: '₹600',
        isCurrent: false,
        isFeatured: false,
        dataLimit: 'Unlimited',
    },
    {
        id: '7-100',
        duration: '7 Months',
        speed: 100,
        price: '5499',
        originalPrice: '6999',
        savings: '₹1500',
        isCurrent: true,
        isFeatured: true,
        dataLimit: 'Unlimited',
    },
    {
        id: '7-60',
        duration: '7 Months',
        speed: 60,
        price: '3999',
        originalPrice: '4900',
        savings: '₹900',
        isCurrent: false,
        isFeatured: false,
        dataLimit: 'Unlimited',
    },
    {
        id: '12-40',
        duration: '12 Months',
        speed: 40,
        price: '5999',
        originalPrice: '7056',
        savings: '₹1056',
        isCurrent: false,
        isFeatured: false,
        dataLimit: 'Unlimited',
    },
    {
        id: '12-100',
        duration: '12 Months',
        speed: 100,
        price: '9499',
        originalPrice: '12000',
        savings: '₹2500',
        isCurrent: false,
        isFeatured: true,
        dataLimit: 'Unlimited',
    },
    {
        id: '12-60',
        duration: '12 Months',
        speed: 60,
        price: '6999',
        originalPrice: '8400',
        savings: '₹1400',
        isCurrent: false,
        isFeatured: false,
        dataLimit: 'Unlimited',
    },
]

const allDurations = ['1-Month', '7-Months', '12-Months']
const allSpeeds = ['40 Mbps', '60 Mbps', '100 Mbps']

const PlansScreen = () => {
    const { dark } = useTheme()
    const dispatch = useDispatch()
    const [selectedDuration, setSelectedDuration] = useState(null)
    const [selectedSpeed, setSelectedSpeed] = useState(null)
    const [showUnlimitedDataOnly, setShowUnlimitedDataOnly] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState(null)

    const { allPlans } = useSelector((state) => state.plan)

    console.log('all Plans ', allPlans)

    useEffect(() => {
        dispatch(getAllPlans())
    }, [dispatch])

    // Filter Logic
    const filterPlans = (plan) => {
        const matchesDuration =
            !selectedDuration || plan.duration === selectedDuration
        const matchesSpeed =
            !selectedSpeed || `${plan.speed} Mbps` === selectedSpeed
        const matchesDataLimit =
            !showUnlimitedDataOnly || plan.dataLimit === 'Unlimited'
        return matchesDuration && matchesSpeed && matchesDataLimit
    }

    const filteredPlans = allPlansData.filter(filterPlans)
    const featuredPlans = allPlansData.filter((plan) => plan.isFeatured)

    const handleClearFilters = () => {
        setSelectedDuration(null)
        setSelectedSpeed(null)
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

    // A separate, styled component for the Plan Card
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
                {/* Current plan badge */}
                {plan.isCurrent && (
                    <View style={styles.currentPlanBadge}>
                        <Text style={styles.currentPlanText}>Current</Text>
                    </View>
                )}

                {/* Plan header */}
                <View style={styles.planHeader}>
                    <Text
                        style={[
                            speedStyle,
                            { color: dark ? '#EAEAEA' : '#333' },
                        ]}
                    >
                        {plan.speed} <Text style={styles.speedUnit}>Mbps</Text>
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

                {/* Price and savings */}
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

                {/* Plan features */}
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
                            {plan.dataLimit} Data
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
                            {plan.speed} Mbps Speed
                        </Text>
                    </View>
                </View>

                {/* Action button */}
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
                                key={plan.id}
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
                                <PlanCard key={plan.id} plan={plan} />
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
            </ScrollView>

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
                            You have selected the {selectedPlan?.speed} Mbps (
                            {selectedPlan?.duration}) plan for ₹
                            {selectedPlan?.price}.
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.modalButton,
                                    styles.buttonClose,
                                    { borderColor: dark ? '#444' : '#E0E0E0' },
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
                                style={[styles.modalButton, styles.buttonPay]}
                                onPress={handlePayNow}
                            >
                                <Text style={styles.buttonText}>Pay Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        // The core change to make the cards fit better
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
        fontSize: 14,
        fontWeight: 'bold',
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
})

export default PlansScreen
