import React, { useState } from 'react'
import {
    View,
    StyleSheet,
    useWindowDimensions,
    Text,
    StatusBar,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabView, TabBar } from 'react-native-tab-view'

// Theme and Constants
import { useTheme } from '../theme/ThemeProvider'
import { COLORS } from '../constants'
import { faqKeywords, faqs } from '../data'

// Import sub-components
import FaqSection from '../containers/Help/FaqSection'
import ContactUsSection from '../containers/Help/ContactUsSection'
import HelpCenterHeader from '../containers/Help/HelpCenterHeader'

const HelpCenter = ({ navigation }) => {
    const layout = useWindowDimensions()
    const { colors, dark } = useTheme() // Consume theme context
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

    // const renderTabBar = (props) => (
    //     <View
    //         style={[
    //             styles.tabBarWrapper,
    //             { backgroundColor: colors.background },
    //         ]}
    //     >
    //         <TabBar
    //             {...props}
    //             indicatorStyle={[
    //                 styles.tabIndicator,
    //                 {
    //                     // High-visibility: White pill in light mode, Primary in dark
    //                     backgroundColor: dark ? COLORS.primary : COLORS.white,
    //                     // Elevated shadow for light mode visibility
    //                     ...(dark
    //                         ? {}
    //                         : {
    //                               shadowColor: '#000',
    //                               shadowOffset: { width: 0, height: 2 },
    //                               shadowOpacity: 0.1,
    //                               shadowRadius: 4,
    //                               elevation: 2,
    //                           }),
    //                 },
    //             ]}
    //             style={[
    //                 styles.tabBar,
    //                 {
    //                     // Background of the tab track
    //                     backgroundColor: dark
    //                         ? COLORS.dark2 // Darker gray for track in dark mode
    //                         : COLORS.grayscale200, // Light gray track in light mode
    //                 },
    //             ]}
    //             pressColor="transparent"
    //             indicatorContainerStyle={styles.indicatorContainer}
    //             renderLabel={({ route, focused }) => (
    //                 <Text
    //                     style={[
    //                         styles.tabLabel,
    //                         {
    //                             color: focused
    //                                 ? dark
    //                                     ? COLORS.white
    //                                     : COLORS.black
    //                                 : dark
    //                                   ? COLORS.grayscale600
    //                                   : COLORS.grayscale500,
    //                             fontWeight: focused ? '700' : '600',
    //                         },
    //                     ]}
    //                 >
    //                     {route.title}
    //                 </Text>
    //             )}
    //         />
    //     </View>
    // )
    const renderTabBar = (props) => (
        <View
            style={[
                styles.tabBarWrapper,
                { backgroundColor: colors.background },
            ]}
        >
            <TabBar
                {...props}
                // Force active/inactive colors at the component level
                activeColor={dark ? COLORS.white : COLORS.black}
                inactiveColor={dark ? COLORS.grayscale600 : COLORS.grayscale700}
                indicatorStyle={[
                    styles.tabIndicator,
                    {
                        // In Light Mode, the pill MUST be white to contrast with the gray track
                        backgroundColor: dark ? COLORS.primary : '#FFFFFF',
                        ...(dark
                            ? {}
                            : {
                                  shadowColor: '#000',
                                  shadowOffset: { width: 0, height: 2 },
                                  shadowOpacity: 0.15,
                                  shadowRadius: 3,
                                  elevation: 4,
                              }),
                    },
                ]}
                style={[
                    styles.tabBar,
                    {
                        // Track background: slightly darker gray in light mode for better contrast
                        backgroundColor: dark ? COLORS.dark2 : '#E5E5E5',
                    },
                ]}
                pressColor="transparent"
                indicatorContainerStyle={styles.indicatorContainer}
                renderLabel={({ route, focused }) => (
                    <Text
                        style={[
                            styles.tabLabel,
                            {
                                // Logic: If on the white pill (focused) in light mode, text MUST be black.
                                color: focused
                                    ? dark
                                        ? '#FFFFFF'
                                        : '#000000'
                                    : dark
                                      ? '#A1A1A1'
                                      : '#666666',
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
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

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
                lazy // Optimization: Pre-renders scenes to avoid white flash
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
    },
    tabBarWrapper: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    tabBar: {
        borderRadius: 16,
        height: 50,
        elevation: 0,
        shadowOpacity: 0,
        overflow: 'hidden', // Ensures indicator stays inside the "pill" track
    },
    indicatorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIndicator: {
        height: '84%', // Inset pill effect
        width: '46%', // Adjust width slightly to leave a gap from edges
        borderRadius: 12,
        bottom: '8%', // Centering vertically
        marginLeft: '2%', // Centering horizontally within its segment
    },
    tabLabel: {
        fontSize: 14,
        textTransform: 'none',
        letterSpacing: -0.2,
        width: '100%',
        textAlign: 'center',
    },
})

export default HelpCenter
