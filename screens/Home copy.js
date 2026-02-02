// screens/Home.js

import React, { useState, useCallback, useMemo } from 'react'
import {
    View,
    ScrollView,
    StyleSheet,
    Platform,
    Dimensions,
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

import { useDispatch, useSelector } from 'react-redux'
import { getActiveConnection } from '../redux/features/Connection/ConnectionSlice'
import { useFocusEffect } from '@react-navigation/native'

const BOTTOM_NAV_HEIGHT = Platform.OS === 'ios' ? 90 : 60

const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - 48) / 2

const Home = ({ navigation }) => {
    const { colors } = useTheme()
    const dispatch = useDispatch()

    // const connection = useSelector((state) => state.connection)
    const {
        connections,
        connection,
        isConnectionLoading,
        isConnectionError,
        message,
    } = useSelector((state) => state.connection)

    const [modalVisible, setModalVisible] = useState(false)

    useFocusEffect(
        useCallback(() => {
            dispatch(getActiveConnection())
        }, [dispatch])
    )

    // If you want to show in header etc
    const handleSwitchConnection = useCallback(() => {
        setModalVisible(false)
        navigation.navigate('Connections', {
            // avoid passing function if it causes non-serializable warnings
            // maybe pass connection aliasName and then update in a global state
        })
    }, [navigation])

    // Build overviewData dynamically from connection
    const overviewData = useMemo(() => {
        if (!connection) return []

        return [
            {
                id: 1,
                title: 'Connection Status',
                value: connection.connectionStatus ?? 'Unknown',
                icon: icons.wifi,
                bg: COLORS.primary,
            },
            {
                id: 2,
                title: 'Plan Price',
                value: `₹${connection.activePlan?.price ?? '--'}`,
                icon: icons.wallet,
                bg: '#6C63FF',
            },
            {
                id: 3,
                title: 'Plan Status',
                value: connection.activePlan?.status ?? '--',
                icon: icons.infoCircle,
                bg: '#FF6B6B',
            },
            {
                id: 4,
                title: 'Plan Duration',
                value:
                    connection.activePlan?.duration != null
                        ? `${connection.activePlan.duration} days`
                        : '--',
                icon: icons.box,
                bg: '#3DD598',
            },
            {
                id: 5,
                title: 'Region',
                value: connection.serviceArea?.region ?? '--',
                icon: icons.ticket,
                bg: '#FEC260',
            },
            {
                id: 6,
                title: 'Installed On',
                value: connection.installedAt
                    ? new Date(connection.installedAt).toLocaleDateString()
                    : '--',
                icon: icons.check,
                bg: '#4D9DE0',
            },
        ]
    }, [connection, icons, COLORS])

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
                    currentIndex={0}
                    setCurrentIndex={() => {}}
                />
                <UserConnectionSection onPress={() => setModalVisible(true)} />
                <OverviewCards data={overviewData} />
                <FeaturedPlansSection
                    // data={[] /* replace with real data */}
                    onPressSeeAll={() => navigation.navigate('Plans')}
                />
            </ScrollView>
            <ConnectionModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                connectionDetails={connection}
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
