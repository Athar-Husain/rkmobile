import React from 'react'
import { View, Text, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageContainer from '../components/PageContainer'
import DotsView from '../components/DotsView'
import Button from '../components/Button'
import Onboarding1Styles from '../styles/OnboardingStyles'
import { useDispatch } from 'react-redux' // Import useDispatch hook
// import { markOnboardingComplete } from '../redux/features/Customers/CustomerSlice' // Import completeOnboarding action
import { COLORS, images } from '../constants'
import { useTheme } from '../theme/ThemeProvider'
import { markOnboardingComplete } from '../redux/features/Auth/AuthSlice'

const Onboarding4 = ({ navigation }) => {
    const { colors } = useTheme()
    const dispatch = useDispatch()

    const handleNextPress = () => {
        // Dispatch the action to mark onboarding as complete
        dispatch(markOnboardingComplete())

        // Navigate to the Welcome screen
        navigation.navigate('Welcome')
    }

    return (
        <SafeAreaView
            style={[
                Onboarding1Styles.container,
                { backgroundColor: colors.background },
            ]}
        >
            <PageContainer>
                <View style={Onboarding1Styles.contentContainer}>
                    <Image
                        source={images.onboarding4}
                        resizeMode="contain"
                        style={Onboarding1Styles.illustration}
                    />
                    <Image
                        source={images.ornament}
                        resizeMode="contain"
                        style={Onboarding1Styles.ornament}
                    />
                    <View
                        style={[
                            Onboarding1Styles.buttonContainer,
                            { backgroundColor: colors.background },
                        ]}
                    >
                        <View style={Onboarding1Styles.titleContainer}>
                            <Text
                                style={[
                                    Onboarding1Styles.title,
                                    { color: colors.text },
                                ]}
                            >
                                Premium Home Assistance
                            </Text>
                            <Text style={Onboarding1Styles.subTitle}>
                                PROVIDA PRO
                            </Text>
                        </View>

                        <Text
                            style={[
                                Onboarding1Styles.description,
                                { color: colors.text },
                            ]}
                        >
                            Let us handle the chores, so you can focus on what
                            matters most.
                        </Text>

                        <View style={Onboarding1Styles.dotsContainer}>
                            <DotsView progress={1} numDots={4} />
                        </View>
                        <Button
                            title="Next"
                            filled
                            onPress={handleNextPress} // Call handleNextPress to dispatch and navigate
                            style={Onboarding1Styles.nextButton}
                        />
                        <Button
                            title="Skip"
                            onPress={() => navigation.navigate('Login')}
                            textColor={COLORS.primary}
                            style={Onboarding1Styles.skipButton}
                        />
                    </View>
                </View>
            </PageContainer>
        </SafeAreaView>
    )
}

export default Onboarding4
