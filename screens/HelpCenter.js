import React, { useState } from 'react'
import {
    View,
    StyleSheet,
    useWindowDimensions,
    Text,
    StatusBar as RNStatusBar,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabView, TabBar } from 'react-native-tab-view'
import { useTheme } from '../theme/ThemeProvider'
import { COLORS } from '../constants'
import { faqKeywords, faqs } from '../data'

import FaqSection from '../containers/Help/FaqSection'
import ContactUsSection from '../containers/Help/ContactUsSection'
import HelpCenterHeader from '../containers/Help/HelpCenterHeader'

const HelpCenter = ({ navigation }) => {
    const layout = useWindowDimensions()
    const { dark, colors } = useTheme()
    const [index, setIndex] = useState(0)

    const [routes] = useState([
        { key: 'faq', title: 'FAQ' },
        { key: 'contact', title: 'Contact Us' },
    ])

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'faq':
                return (
                    <FaqSection
                        faqsData={faqs}
                        faqKeywordsData={faqKeywords}
                        dark={dark}
                    />
                )
            case 'contact':
                return <ContactUsSection dark={dark} />
            default:
                return null
        }
    }

    const renderTabBar = (props) => (
        <View
            style={[
                styles.tabBarWrapper,
                { backgroundColor: colors.background },
            ]}
        >
            <TabBar
                {...props}
                activeColor={dark ? '#FFFFFF' : '#000000'}
                inactiveColor={dark ? COLORS.grayscale600 : COLORS.grayscale700}
                indicatorStyle={[
                    styles.tabIndicator,
                    {
                        backgroundColor: dark ? COLORS.primary : '#FFFFFF',
                        elevation: dark ? 0 : 3,
                        shadowOpacity: dark ? 0 : 0.2,
                    },
                ]}
                style={[
                    styles.tabBar,
                    { backgroundColor: dark ? COLORS.dark2 : '#E5E5E5' },
                ]}
                pressColor="transparent"
                renderLabel={({ route, focused }) => (
                    <Text
                        style={[
                            styles.tabLabel,
                            {
                                color: focused
                                    ? dark
                                        ? '#FFFFFF'
                                        : '#000000'
                                    : dark
                                      ? '#8E8E93'
                                      : '#636366',
                                fontWeight: focused ? '700' : '600',
                            },
                        ]}
                    >
                        {route.title}
                    </Text>
                )}
            />
        </View>
    )

    return (
        <SafeAreaView
            style={[styles.area, { backgroundColor: colors.background }]}
        >
            <HelpCenterHeader
                onBackPress={() => navigation.goBack()}
                dark={dark}
            />
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={renderTabBar}
                lazy
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: { flex: 1 },
    tabBarWrapper: { paddingHorizontal: 20, paddingVertical: 12 },
    tabBar: {
        borderRadius: 16,
        height: 50,
        elevation: 0,
        shadowOpacity: 0,
        overflow: 'hidden',
    },
    tabIndicator: { height: '84%', borderRadius: 12, bottom: '8%' },
    tabLabel: {
        fontSize: 14,
        textTransform: 'none',
        textAlign: 'center',
        width: '100%',
    },
})

export default HelpCenter
