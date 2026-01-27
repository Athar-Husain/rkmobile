import React from 'react'
import { View, Text, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageContainer from '../components/PageContainer'
import Button from '../components/Button'
import Onboarding1Styles from '../styles/OnboardingStyles'
import { COLORS, images } from '../constants'
import { useTheme } from '../theme/ThemeProvider'

const Onboarding2 = ({ navigation }) => {
    const { colors } = useTheme()

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
                        source={images.onboarding2}
                        resizeMode="contain"
                        style={Onboarding1Styles.illustration}
                    />
                    <Image
                        source={images.ornament}
                        resizeMode="contain"
                        style={Onboarding1Styles.ornament}
                    />
                    <View style={Onboarding1Styles.buttonContainer}>
                        <View style={Onboarding1Styles.titleContainer}>
                            <Text
                                style={[
                                    Onboarding1Styles.title,
                                    { color: colors.text },
                                ]}
                            >
                                Enjoy the convenience of
                            </Text>
                            <Text style={Onboarding1Styles.subTitle}>
                                CONVENIENCE
                            </Text>
                        </View>
                        <Text
                            style={[
                                Onboarding1Styles.description,
                                { color: colors.text },
                            ]}
                        >
                            Access home services whenever and wherever you need
                            them. From routine maintenance to emergency repairs,
                            we've got you covered.
                        </Text>
                        <Button
                            title="Next"
                            filled
                            onPress={() => navigation.navigate('Onboarding3')}
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

export default Onboarding2
