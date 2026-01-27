import React from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux'
import { markOnboardingComplete } from '../redux/features/Customers/CustomerSlice'
import { images, COLORS } from '../constants'
import { useTheme } from '../theme/ThemeProvider'
import PageContainer from '../components/PageContainer'
import Button from '../components/Button'
import DotsView from '../components/DotsView'

// Get screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

// Some helpful scaling utilities
const guidelineBaseWidth = 375 // base design width (iPhone X / etc)
const guidelineBaseHeight = 812 // base design height

function scale(size) {
    return (SCREEN_WIDTH / guidelineBaseWidth) * size
}

function verticalScale(size) {
    return (SCREEN_HEIGHT / guidelineBaseHeight) * size
}

function moderateScale(size, factor = 0.5) {
    return size + (scale(size) - size) * factor
}

const OnboardingScreen = ({ navigation, data, index, totalScreens }) => {
    const { colors } = useTheme()
    const dispatch = useDispatch()

    const isLastScreen = index === totalScreens - 1

    const handleNext = () => {
        if (isLastScreen) {
            dispatch(markOnboardingComplete())
            // navigation.replace('Welcome')
        } else {
            const nextScreenKey = `Onboarding${index + 2}`
            navigation.navigate(nextScreenKey)
        }
    }

    const handlePrev = () => {
        if (index === 0) return
        const prevScreenKey = `Onboarding${index}`
        navigation.navigate(prevScreenKey)
    }

    const handleSkip = () => {
        dispatch(markOnboardingComplete())
        navigation.replace('Auth')
    }

    return (
        <SafeAreaView
            style={[styles.safeArea, { backgroundColor: colors.background }]}
        >
            <PageContainer>
                <View style={styles.contentWrapper}>
                    <Image
                        source={images[data.imageName]}
                        resizeMode="contain"
                        style={[
                            styles.illustration,
                            data.tintColor
                                ? { tintColor: data.tintColor }
                                : null,
                        ]}
                    />
                    <Image
                        source={images.ornament}
                        resizeMode="contain"
                        style={styles.ornament}
                    />

                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: colors.text }]}>
                            {data.title}
                        </Text>
                        <Text style={styles.subTitle}>{data.subTitle}</Text>
                    </View>

                    <Text style={[styles.description, { color: colors.text }]}>
                        {data.description}
                    </Text>

                    <View style={styles.dotsWrapper}>
                        <DotsView progress={index + 1} numDots={totalScreens} />
                    </View>

                    <View style={styles.buttonsRow}>
                        {index > 0 ? (
                            <Button
                                title="Previous"
                                onPress={handlePrev}
                                textColor={colors.primary}
                                style={styles.previousButton}
                            />
                        ) : (
                            <View style={styles.previousPlaceholder} />
                        )}

                        <View style={styles.skipNextRow}>
                            <Button
                                title="Skip"
                                onPress={handleSkip}
                                textColor={colors.primary}
                                style={styles.skipButton}
                            />
                            <Button
                                title={isLastScreen ? 'Finish' : 'Next'}
                                filled
                                onPress={handleNext}
                                style={styles.nextButton}
                            />
                        </View>
                    </View>
                </View>
            </PageContainer>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    contentWrapper: {
        flex: 1,
        width: '100%',
        paddingHorizontal: scale(20),
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: verticalScale(20),
    },
    illustration: {
        width: '100%',
        height: verticalScale(250),
        marginTop: verticalScale(20),
    },
    ornament: {
        width: scale(120),
        height: verticalScale(40),
        position: 'absolute',
        top: verticalScale(30),
        left: scale(20),
    },
    textContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: verticalScale(10),
    },
    title: {
        fontSize: moderateScale(24),
        textAlign: 'center',
        fontFamily: 'bold',
    },
    subTitle: {
        fontSize: moderateScale(20),
        textAlign: 'center',
        marginTop: verticalScale(5),
        fontFamily: 'semiBold',
    },
    description: {
        fontSize: moderateScale(16),
        textAlign: 'center',
        marginTop: verticalScale(10),
    },
    dotsWrapper: {
        marginTop: verticalScale(20),
    },
    buttonsRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: verticalScale(30),
    },
    previousButton: {
        paddingHorizontal: scale(15),
        paddingVertical: verticalScale(10),
        borderRadius: scale(25),
    },
    previousPlaceholder: {
        width: scale(100), // same as approx size of Previous
    },
    skipNextRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    skipButton: {
        marginRight: scale(10),
        paddingHorizontal: scale(15),
        paddingVertical: verticalScale(10),
        borderRadius: scale(25),
    },
    nextButton: {
        paddingHorizontal: scale(20),
        paddingVertical: verticalScale(12),
        borderRadius: scale(25),
    },
})

export default OnboardingScreen
