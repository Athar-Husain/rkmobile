import { View, StyleSheet, useWindowDimensions, Text } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { useTheme } from '../theme/ThemeProvider'
import { COLORS } from '../constants'
// import HelpCenterHeader from './HelpCenterHeader'
// import FaqSection from './FaqSection'
// import SupportTicketsSection from './SupportTicketsSection'
// import ContactUsSection from './ContactUsSection'
import { faqs, faqKeywords, supportTickets } from '../data'
import FaqSection from '../containers/Help/FaqSection'
import SupportTicketsSection from '../containers/Help/SupportTicketsSection'
import ContactUsSection from '../containers/Help/ContactUsSection'
import HelpCenterHeader from '../containers/Help/HelpCenterHeader'





const renderScene = SceneMap({
    first: () => <FaqSection faqsData={faqs} faqKeywordsData={faqKeywords} />,
    second: () => <SupportTicketsSection ticketsData={supportTickets} />,
    third: () => <ContactUsSection />,
})

const HelpCenter = ({ navigation }) => {
    const layout = useWindowDimensions()
    const { colors, dark } = useTheme()

    const [index, setIndex] = useState(0)
    const [routes] = useState([
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
            renderLabel={({ route, focused }) => (
                <Text
                    style={{
                        color: focused ? COLORS.primary : 'gray',
                        fontSize: 16,
                        fontFamily: 'bold',
                    }}
                >
                    {route.title}
                </Text>
            )}
        />
    )

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
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
})

export default HelpCenter
