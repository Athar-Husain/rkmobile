import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Linking,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const ShopsScreen = () => {
    const [shops, setShops] = useState([])

    useEffect(() => {
        setShops([
            {
                id: '1',
                name: 'RK Electronics - Main Branch',
                address: 'Cowl Bazaar, Ballari',
                phone: '+91 9876543210',
                lat: 15.1394,
                lng: 76.9214,
            },
            {
                id: '2',
                name: 'RK Electronics - Service Center',
                address: 'Station Road, Ballari',
                phone: '+91 9876543211',
                lat: 15.145,
                lng: 76.924,
            },
        ])
    }, [])

    const openMaps = (lat, lng, name) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
        Linking.openURL(url)
    }

    const renderShop = ({ item }) => (
        <View style={styles.shopCard}>
            <View style={styles.shopInfo}>
                <Text style={styles.shopName}>{item.name}</Text>
                <Text style={styles.shopAddr}>{item.address}</Text>
            </View>
            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => Linking.openURL(`tel:${item.phone}`)}
                >
                    <MaterialCommunityIcons
                        name="phone"
                        size={20}
                        color="#fff"
                    />
                    <Text style={styles.btnLabel}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.btn, styles.btnMap]}
                    onPress={() => openMaps(item.lat, item.lng, item.name)}
                >
                    <MaterialCommunityIcons
                        name="google-maps"
                        size={20}
                        color="#004AAD"
                    />
                    <Text style={[styles.btnLabel, { color: '#004AAD' }]}>
                        Directions
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Our Stores</Text>
            <FlatList
                data={shops}
                renderItem={renderShop}
                keyExtractor={(item) => item.id}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA', padding: 20 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    shopCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        elevation: 4,
    },
    shopName: { fontSize: 18, fontWeight: 'bold', color: '#004AAD' },
    shopAddr: { color: '#666', marginVertical: 5 },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    btn: {
        backgroundColor: '#004AAD',
        flexDirection: 'row',
        flex: 0.48,
        padding: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnMap: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#004AAD' },
    btnLabel: { color: '#fff', fontWeight: 'bold', marginLeft: 8 },
})

export default ShopsScreen
