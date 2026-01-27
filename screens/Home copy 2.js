// Home.js (The main screen)
import React, { useState, useCallback } from 'react'
import {
    View,
    ScrollView,
    StyleSheet,
    Dimensions,
    Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images, COLORS, SIZES, icons } from '../constants'
import { useTheme } from '../theme/ThemeProvider'
import HomeHeader from '../containers/Header'
import BannerCarousel from '../containers/Home/BannerCarousel'
import UserConnectionSection from '../containers/Home/UserConnectionSection'
import OverviewCards from '../containers/Home/OverviewCards'
import FeaturedPlansSection from '../containers/Home/FeaturedPlansSection'
import ConnectionModal from '../containers/Home/ConnectionModal'

import { banners, categories, mostPopularServices } from '../data'

const BOTTOM_NAV_HEIGHT = Platform.OS === 'ios' ? 90 : 60

// Sample data (can be moved to a data file)
const overviewData = [
    {
        id: 1,
        title: 'My Connections',
        value: 3,
        icon: icons.wifi,
        bg: COLORS.primary,
    },
    {
        id: 2,
        title: 'Monthly Bill',
        value: '$42.00',
        icon: icons.wallet,
        bg: '#6C63FF',
    },
    {
        id: 3,
        title: 'Pending Balance',
        value: '$10.00',
        icon: icons.infoCircle,
        bg: '#FF6B6B',
    },
    {
        id: 4,
        title: 'Subscribed Plan',
        value: 'Pro Max',
        icon: icons.box,
        bg: '#3DD598',
    },
    {
        id: 5,
        title: 'Open Tickets',
        value: 1,
        icon: icons.ticket,
        bg: '#FEC260',
    },
    {
        id: 6,
        title: 'Last Payment',
        value: '$32.00',
        icon: icons.check,
        bg: '#4D9DE0',
    },
]

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
    const [selectedConnection, setSelectedConnection] = useState('Home WiFi')
    const { colors } = useTheme()

    const handleSwitchConnection = useCallback(() => {
        setModalVisible(false)
        navigation.navigate('Connections', {
            onConnectionSelected: setSelectedConnection,
        })
    }, [navigation])

    const connectionDetails = {
        name: selectedConnection,
        status: 'Active',
        ipAddress: '192.168.0.101',
        speed: '150 Mbps',
        dataUsed: '120 GB',
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
                <HomeHeader navigation={navigation} />
                <BannerCarousel
                    banners={banners}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                />
                <UserConnectionSection
                    selectedConnection={selectedConnection}
                    onPress={() => setModalVisible(true)}
                />
                <OverviewCards data={overviewData} />
                <FeaturedPlansSection
                    data={featuredPlansData}
                    onPressSeeAll={() => navigation.navigate('Plans')}
                />
            </ScrollView>
            <ConnectionModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                connectionDetails={connectionDetails}
                onSwitchConnection={handleSwitchConnection}
            />
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
})

export default Home
