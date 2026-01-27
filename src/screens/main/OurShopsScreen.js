import React, { useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
    Alert,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import MapView, { Marker } from 'react-native-maps'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { fetchShops, selectShop } from '../../store/slices/shopSlice'

const OurShopsScreen = () => {
    const dispatch = useDispatch()
    const { shops, loading, error } = useSelector((state) => state.shop)

    useEffect(() => {
        dispatch(fetchShops())
    }, [dispatch])

    const handleCallShop = (phoneNumber) => {
        Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
            Alert.alert('Error', 'Could not make call')
        )
    }

    const handleGetDirections = (latitude, longitude) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
        Linking.openURL(url).catch((err) =>
            Alert.alert('Error', 'Could not open maps')
        )
    }

    const shopData = [
        {
            id: 1,
            name: 'RK Electronics - Ballari',
            description: 'Main Branch',
            phone: '+919876543210',
            location: { latitude: 15.1394, longitude: 76.9214 },
            address: 'Ballari Main Road, Ballari',
        },
        {
            id: 2,
            name: 'RK Electronics - Mothi circle',
            description: 'Mothi Circle Branch',
            phone: '+919876543211',
            location: { latitude: 15.135, longitude: 76.925 },
            address: 'Near Mothi Circle, Ballari',
        },
        {
            id: 3,
            name: 'RK Electronics - Ballari Branch-3',
            description: 'Ballari Branch-3',
            phone: '+919876543212',
            location: { latitude: 15.142, longitude: 76.93 },
            address: 'Sandalwood Road, Ballari',
        },
        {
            id: 4,
            name: 'RK Electronics - Tornagallu',
            description: 'Tornagallu Branch',
            phone: '+919876543213',
            location: { latitude: 15.2, longitude: 76.95 },
            address: 'Tornagallu Main Road',
        },
        {
            id: 5,
            name: 'RK Electronics - Sirguppa',
            description: 'Sirguppa Branch',
            phone: '+919876543214',
            location: { latitude: 15.12, longitude: 76.88 },
            address: 'Sirguppa Market Area',
        },
        {
            id: 6,
            name: 'RK Electronics - Hospet',
            description: 'Hospet Branch',
            phone: '+919876543215',
            location: { latitude: 15.2695, longitude: 76.3911 },
            address: 'Hospet City Center',
        },
    ]

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Our Shops</Text>
                <Text style={styles.subtitle}>Find our branches near you</Text>
            </View>

            {/* Map View */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 15.1394,
                        longitude: 76.9214,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    }}
                >
                    {shopData.map((shop) => (
                        <Marker
                            key={shop.id}
                            coordinate={shop.location}
                            title={shop.name}
                            description={shop.description}
                        />
                    ))}
                </MapView>
            </View>

            {/* Shops List */}
            <View style={styles.shopsList}>
                <Text style={styles.sectionTitle}>All Branches</Text>

                {shopData.map((shop) => (
                    <View key={shop.id} style={styles.shopCard}>
                        <View style={styles.shopInfo}>
                            <Text style={styles.shopName}>{shop.name}</Text>
                            <Text style={styles.shopDescription}>
                                {shop.description}
                            </Text>
                            <Text style={styles.shopAddress}>
                                {shop.address}
                            </Text>
                        </View>

                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={styles.directionButton}
                                onPress={() =>
                                    handleGetDirections(
                                        shop.location.latitude,
                                        shop.location.longitude
                                    )
                                }
                            >
                                <Icon
                                    name="directions"
                                    size={20}
                                    color="#3498db"
                                />
                                <Text style={styles.buttonText}>
                                    Get Directions
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.callButton}
                                onPress={() => handleCallShop(shop.phone)}
                            >
                                <Icon name="call" size={20} color="#2ecc71" />
                                <Text style={styles.buttonText}>Call Shop</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: 'white',
        padding: 20,
        paddingTop: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    subtitle: {
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 5,
    },
    mapContainer: {
        height: 250,
        margin: 15,
        borderRadius: 10,
        overflow: 'hidden',
    },
    map: {
        flex: 1,
    },
    shopsList: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 15,
    },
    shopCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    shopInfo: {
        marginBottom: 15,
    },
    shopName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 5,
    },
    shopDescription: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 5,
    },
    shopAddress: {
        fontSize: 12,
        color: '#95a5a6',
        fontStyle: 'italic',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    directionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ecf0f1',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        justifyContent: 'center',
    },
    callButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d5f4e6',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    buttonText: {
        marginLeft: 5,
        fontSize: 14,
        fontWeight: '500',
    },
})

export default OurShopsScreen
