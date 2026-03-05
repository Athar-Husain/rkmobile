import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
} from 'react-native'
import { COLORS, icons } from '../../constants'
import { useNavigation } from '@react-navigation/native'

const ContactUsSection = ({ dark }) => {
    const navigation = useNavigation()

    const contacts = [
        {
            title: 'Customer Service',
            icon: icons.headset,
            color: '#5856D6',
            route: 'CustomerService',
        },
        {
            title: 'WhatsApp',
            icon: icons.whatsapp,
            color: '#34C759',
            route: null,
        },
        { title: 'Website', icon: icons.world, color: '#007AFF', route: null },
        {
            title: 'Instagram',
            icon: icons.instagram,
            color: '#FF2D55',
            route: null,
        },
    ]

    return (
        <ScrollView style={styles.container}>
            <View
                style={[
                    styles.group,
                    { backgroundColor: dark ? '#1C1C1E' : COLORS.white },
                ]}
            >
                {contacts.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.item,
                            {
                                borderBottomWidth:
                                    index === contacts.length - 1 ? 0 : 0.5,
                                borderBottomColor: dark ? '#2C2C2E' : '#F2F2F7',
                            },
                        ]}
                        onPress={() =>
                            item.route && navigation.navigate(item.route)
                        }
                    >
                        <View
                            style={[
                                styles.iconBox,
                                { backgroundColor: item.color + '15' },
                            ]}
                        >
                            <Image
                                source={item.icon}
                                style={{
                                    width: 22,
                                    height: 22,
                                    tintColor: item.color,
                                }}
                            />
                        </View>
                        <Text
                            style={[
                                styles.label,
                                { color: dark ? COLORS.white : COLORS.black },
                            ]}
                        >
                            {item.title}
                        </Text>
                        <Image
                            source={icons.arrowRight}
                            style={styles.chevron}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    group: {
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 2,
    },
    item: { flexDirection: 'row', alignItems: 'center', padding: 18 },
    iconBox: {
        width: 42,
        height: 42,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: { flex: 1, marginLeft: 16, fontSize: 16, fontWeight: '600' },
    chevron: { width: 12, height: 12, tintColor: '#C7C7CC' },
})

export default ContactUsSection
