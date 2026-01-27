import React from 'react'
import { View, Text, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import PageContainer from '../components/PageContainer'
import Button from '../components/Button'
import Onboarding1Styles from '../styles/OnboardingStyles'
import { COLORS, images } from '../constants'
import { useTheme } from '../theme/ThemeProvider'

const Onboarding3 = ({ navigation }) => {
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
                        source={images.onboarding3}
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
                                Efficient
                            </Text>
                            <Text style={Onboarding1Styles.subTitle}>
                                A Reliable Service
                            </Text>
                        </View>
                        <Text
                            style={[
                                Onboarding1Styles.description,
                                { color: colors.text },
                            ]}
                        >
                            Discover a network of trusted professionals ready to
                            tackle any task, ensuring your home is always in
                            tip-top shape.
                        </Text>
                        <Button
                            title="Next"
                            filled
                            onPress={() => navigation.navigate('Onboarding4')}
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

export default Onboarding3
