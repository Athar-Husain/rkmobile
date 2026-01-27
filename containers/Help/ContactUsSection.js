import React from 'react'
import { View, StyleSheet } from 'react-native'
// import HelpCenterItem from '../components/HelpCenterItem' // Assuming this component exists
import { COLORS, icons } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '../../theme/ThemeProvider'
import HelpCenterItem from '../../components/HelpCenterItem'

const ContactUsSection = () => {
    const navigation = useNavigation()
    const { dark } = useTheme()

    const routeContainerStyle = [
        styles.routeContainer,
        { backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite },
    ]

    return (
        <View style={routeContainerStyle}>
            <HelpCenterItem
                icon={icons.headset}
                title="Customer Service"
                onPress={() => navigation.navigate('CustomerService')}
            />
            <HelpCenterItem
                icon={icons.whatsapp}
                title="Whatsapp"
                onPress={() => console.log('Whatsapp')}
            />
            <HelpCenterItem
                icon={icons.world}
                title="Website"
                onPress={() => console.log('Website')}
            />
            <HelpCenterItem
                icon={icons.facebook2}
                title="Facebook"
                onPress={() => console.log('Facebook')}
            />
            <HelpCenterItem
                icon={icons.twitter}
                title="Twitter"
                onPress={() => console.log('Twitter')}
            />
            <HelpCenterItem
                icon={icons.instagram}
                title="Instagram"
                onPress={() => console.log('Instagram')}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    routeContainer: {
        flex: 1,
        paddingVertical: 22,
    },
})

export default ContactUsSection
