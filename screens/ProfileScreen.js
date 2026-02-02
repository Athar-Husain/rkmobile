import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    TouchableOpacity,
    Switch,
    ActivityIndicator,
    Modal,
    TextInput,
    FlatList,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker'

// Components
import Header from '../../components/Header'
import Button from '../../components/Button'
import CityModal from '../../components/CityModal'
import AreaModal from '../../components/AreaModal'

// Constants
import { COLORS, SIZES, icons, images } from '../../constants'
import { useTheme } from '../../theme/ThemeProvider'

// API
import api from '../../services/api'

const ProfileScreen = () => {
    const navigation = useNavigation()
    const { colors, dark } = useTheme()

    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [user, setUser] = useState(null)
    const [cities, setCities] = useState([])
    const [areas, setAreas] = useState([])
    const [modalVisible, setModalVisible] = useState(null)
    const [editMode, setEditMode] = useState(false)

    // Form state
    const [name, setName] = useState('')
    const [selectedCity, setSelectedCity] = useState(null)
    const [selectedArea, setSelectedArea] = useState(null)
    const [profileImage, setProfileImage] = useState('')
    const [preferences, setPreferences] = useState({
        notifications: true,
        smsAlerts: true,
        emailNotifications: true,
    })

    // Load user data
    useEffect(() => {
        loadUserData()
        fetchCities()
    }, [])

    const loadUserData = async () => {
        try {
            setLoading(true)
            const userString = await AsyncStorage.getItem('user')
            if (userString) {
                const userData = JSON.parse(userString)
                setUser(userData)
                setName(userData.name)
                setProfileImage(userData.profileImage)

                // Load preferences
                if (userData.preferences) {
                    setPreferences(userData.preferences)
                }

                // Load city and area
                if (userData.city) {
                    setSelectedCity({
                        id: userData.city,
                        name: userData.cityName || 'City',
                    })
                    fetchAreas(userData.city)
                }
                if (userData.area) {
                    setSelectedArea({
                        id: userData.area,
                        name: userData.areaName || 'Area',
                    })
                }
            }
        } catch (error) {
            console.error('Failed to load user data:', error)
            Alert.alert('Error', 'Failed to load profile')
        } finally {
            setLoading(false)
        }
    }

    const fetchCities = async () => {
        try {
            const response = await api.get('/auth/cities')
            if (response.data.success) {
                setCities(response.data.cities)
            }
        } catch (error) {
            console.error('Failed to fetch cities:', error)
        }
    }

    const fetchAreas = async (cityId) => {
        try {
            const response = await api.get(`/auth/cities/${cityId}/areas`)
            if (response.data.success) {
                setAreas(response.data.areas)
            }
        } catch (error) {
            console.error('Failed to fetch areas:', error)
        }
    }

    const handleImagePicker = async () => {
        try {
            const permissionResult =
                await ImagePicker.requestMediaLibraryPermissionsAsync()

            if (!permissionResult.granted) {
                Alert.alert(
                    'Permission Required',
                    'Please allow access to your photos'
                )
                return
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            })

            if (!result.canceled && result.assets[0]) {
                // In a real app, you would upload the image to a server
                // For now, we'll just set the local URI
                setProfileImage(result.assets[0].uri)
            }
        } catch (error) {
            console.error('Image picker error:', error)
            Alert.alert('Error', 'Failed to pick image')
        }
    }

    const handleUpdateProfile = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Name is required')
            return
        }

        setUpdating(true)
        try {
            const updateData = {
                name: name.trim(),
                preferences,
            }

            const response = await api.patch('/auth/profile', updateData)

            if (response.data.success) {
                // Update local storage
                const updatedUser = { ...user, ...response.data.user }
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser))
                setUser(updatedUser)

                setEditMode(false)
                Alert.alert('Success', 'Profile updated successfully')
            } else {
                Alert.alert(
                    'Error',
                    response.data.message || 'Failed to update profile'
                )
            }
        } catch (error) {
            console.error('Update profile error:', error)
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to update profile'
            )
        } finally {
            setUpdating(false)
        }
    }

    const handleLogout = async () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await api.post('/auth/logout')

                        // Clear storage
                        await AsyncStorage.clear()

                        // Navigate to auth stack
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'AuthStack' }],
                        })
                    } catch (error) {
                        console.error('Logout error:', error)
                        // Still logout locally even if API fails
                        await AsyncStorage.clear()
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'AuthStack' }],
                        })
                    }
                },
            },
        ])
    }

    if (loading) {
        return (
            <SafeAreaView
                style={[styles.area, { backgroundColor: colors.background }]}
            >
                <Header title="Profile" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={[styles.loadingText, { color: colors.text }]}>
                        Loading profile...
                    </Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView
            style={[styles.area, { backgroundColor: colors.background }]}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                <Header
                    title="Profile"
                    rightComponent={
                        editMode ? (
                            <TouchableOpacity
                                onPress={() => setEditMode(false)}
                            >
                                <Text
                                    style={[
                                        styles.headerButton,
                                        { color: colors.primary },
                                    ]}
                                >
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => setEditMode(true)}>
                                <Text
                                    style={[
                                        styles.headerButton,
                                        { color: colors.primary },
                                    ]}
                                >
                                    Edit
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                />

                <View style={styles.content}>
                    {/* Profile Image */}
                    <View style={styles.profileImageContainer}>
                        <TouchableOpacity
                            disabled={!editMode}
                            onPress={handleImagePicker}
                            style={[
                                styles.profileImageWrapper,
                                editMode && styles.profileImageEditable,
                            ]}
                        >
                            <Image
                                source={
                                    profileImage
                                        ? { uri: profileImage }
                                        : images.avatar
                                }
                                style={styles.profileImage}
                            />
                            {editMode && (
                                <View style={styles.editOverlay}>
                                    <Text style={styles.editText}>Edit</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <Text style={[styles.name, { color: colors.text }]}>
                            {user?.name}
                        </Text>
                        <Text style={[styles.email, { color: colors.gray }]}>
                            {user?.email}
                        </Text>
                    </View>

                    {/* Edit Form */}
                    {editMode ? (
                        <>
                            {/* Name Input */}
                            <View style={styles.formGroup}>
                                <Text
                                    style={[
                                        styles.label,
                                        { color: colors.text },
                                    ]}
                                >
                                    Name
                                </Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor:
                                                colors.inputBackground,
                                            color: colors.text,
                                            borderColor: colors.border,
                                        },
                                    ]}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Enter your name"
                                    placeholderTextColor={colors.gray}
                                />
                            </View>

                            {/* City Selection */}
                            <View style={styles.formGroup}>
                                <Text
                                    style={[
                                        styles.label,
                                        { color: colors.text },
                                    ]}
                                >
                                    City
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setModalVisible('city')}
                                    style={[
                                        styles.selectInput,
                                        {
                                            backgroundColor:
                                                colors.inputBackground,
                                            borderColor: colors.border,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.selectText,
                                            {
                                                color: selectedCity
                                                    ? colors.text
                                                    : colors.gray,
                                            },
                                        ]}
                                    >
                                        {selectedCity?.name || 'Select City'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Area Selection */}
                            <View style={styles.formGroup}>
                                <Text
                                    style={[
                                        styles.label,
                                        { color: colors.text },
                                    ]}
                                >
                                    Area
                                </Text>
                                <TouchableOpacity
                                    disabled={!selectedCity}
                                    onPress={() =>
                                        selectedCity && setModalVisible('area')
                                    }
                                    style={[
                                        styles.selectInput,
                                        {
                                            backgroundColor:
                                                colors.inputBackground,
                                            borderColor: colors.border,
                                            opacity: selectedCity ? 1 : 0.5,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.selectText,
                                            {
                                                color: selectedArea
                                                    ? colors.text
                                                    : colors.gray,
                                            },
                                        ]}
                                    >
                                        {selectedArea?.name || 'Select Area'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Preferences */}
                            <View style={styles.preferencesContainer}>
                                <Text
                                    style={[
                                        styles.sectionTitle,
                                        { color: colors.text },
                                    ]}
                                >
                                    Preferences
                                </Text>

                                <View style={styles.preferenceItem}>
                                    <Text
                                        style={[
                                            styles.preferenceText,
                                            { color: colors.text },
                                        ]}
                                    >
                                        Push Notifications
                                    </Text>
                                    <Switch
                                        value={preferences.notifications}
                                        onValueChange={(value) =>
                                            setPreferences({
                                                ...preferences,
                                                notifications: value,
                                            })
                                        }
                                        trackColor={{
                                            false: colors.gray,
                                            true: COLORS.primary,
                                        }}
                                        thumbColor={colors.white}
                                    />
                                </View>

                                <View style={styles.preferenceItem}>
                                    <Text
                                        style={[
                                            styles.preferenceText,
                                            { color: colors.text },
                                        ]}
                                    >
                                        SMS Alerts
                                    </Text>
                                    <Switch
                                        value={preferences.smsAlerts}
                                        onValueChange={(value) =>
                                            setPreferences({
                                                ...preferences,
                                                smsAlerts: value,
                                            })
                                        }
                                        trackColor={{
                                            false: colors.gray,
                                            true: COLORS.primary,
                                        }}
                                        thumbColor={colors.white}
                                    />
                                </View>

                                <View style={styles.preferenceItem}>
                                    <Text
                                        style={[
                                            styles.preferenceText,
                                            { color: colors.text },
                                        ]}
                                    >
                                        Email Notifications
                                    </Text>
                                    <Switch
                                        value={preferences.emailNotifications}
                                        onValueChange={(value) =>
                                            setPreferences({
                                                ...preferences,
                                                emailNotifications: value,
                                            })
                                        }
                                        trackColor={{
                                            false: colors.gray,
                                            true: colors.primary,
                                        }}
                                        thumbColor={colors.white}
                                    />
                                </View>
                            </View>

                            {/* Update Button */}
                            <Button
                                title={
                                    updating ? 'Updating...' : 'Update Profile'
                                }
                                filled
                                onPress={handleUpdateProfile}
                                style={styles.updateButton}
                                disabled={updating}
                            />
                        </>
                    ) : (
                        /* View Mode */
                        <>
                            {/* Account Info */}
                            <View style={styles.infoContainer}>
                                <Text
                                    style={[
                                        styles.sectionTitle,
                                        { color: colors.text },
                                    ]}
                                >
                                    Account Information
                                </Text>

                                <View style={styles.infoItem}>
                                    <Text
                                        style={[
                                            styles.infoLabel,
                                            { color: colors.gray },
                                        ]}
                                    >
                                        Mobile
                                    </Text>
                                    <Text
                                        style={[
                                            styles.infoValue,
                                            { color: colors.text },
                                        ]}
                                    >
                                        {user?.mobile}
                                    </Text>
                                </View>

                                <View style={styles.infoItem}>
                                    <Text
                                        style={[
                                            styles.infoLabel,
                                            { color: colors.gray },
                                        ]}
                                    >
                                        City
                                    </Text>
                                    <Text
                                        style={[
                                            styles.infoValue,
                                            { color: colors.text },
                                        ]}
                                    >
                                        {selectedCity?.name || 'Not set'}
                                    </Text>
                                </View>

                                <View style={styles.infoItem}>
                                    <Text
                                        style={[
                                            styles.infoLabel,
                                            { color: colors.gray },
                                        ]}
                                    >
                                        Area
                                    </Text>
                                    <Text
                                        style={[
                                            styles.infoValue,
                                            { color: colors.text },
                                        ]}
                                    >
                                        {selectedArea?.name || 'Not set'}
                                    </Text>
                                </View>

                                <View style={styles.infoItem}>
                                    <Text
                                        style={[
                                            styles.infoLabel,
                                            { color: colors.gray },
                                        ]}
                                    >
                                        Account Type
                                    </Text>
                                    <Text
                                        style={[
                                            styles.infoValue,
                                            { color: colors.text },
                                        ]}
                                    >
                                        {user?.userType}
                                    </Text>
                                </View>

                                <View style={styles.infoItem}>
                                    <Text
                                        style={[
                                            styles.infoLabel,
                                            { color: colors.gray },
                                        ]}
                                    >
                                        Member Since
                                    </Text>
                                    <Text
                                        style={[
                                            styles.infoValue,
                                            { color: colors.text },
                                        ]}
                                    >
                                        {user?.createdAt
                                            ? new Date(
                                                  user.createdAt
                                              ).toLocaleDateString()
                                            : 'N/A'}
                                    </Text>
                                </View>
                            </View>

                            {/* Wallet */}
                            <View style={styles.walletContainer}>
                                <Text
                                    style={[
                                        styles.sectionTitle,
                                        { color: colors.text },
                                    ]}
                                >
                                    Wallet Balance
                                </Text>
                                <Text
                                    style={[
                                        styles.walletAmount,
                                        { color: COLORS.primary },
                                    ]}
                                >
                                    ₹{user?.walletBalance?.toFixed(2) || '0.00'}
                                </Text>
                                <Button
                                    title="Add Money"
                                    onPress={() =>
                                        navigation.navigate('Wallet')
                                    }
                                    style={styles.walletButton}
                                />
                            </View>

                            {/* Quick Actions */}
                            <View style={styles.actionsContainer}>
                                <Text
                                    style={[
                                        styles.sectionTitle,
                                        { color: colors.text },
                                    ]}
                                >
                                    Quick Actions
                                </Text>

                                <TouchableOpacity
                                    style={[
                                        styles.actionItem,
                                        { backgroundColor: colors.card },
                                    ]}
                                    onPress={() =>
                                        navigation.navigate('Orders')
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.actionText,
                                            { color: colors.text },
                                        ]}
                                    >
                                        My Orders
                                    </Text>
                                    <Text style={styles.actionArrow}>→</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.actionItem,
                                        { backgroundColor: colors.card },
                                    ]}
                                    onPress={() =>
                                        navigation.navigate('Addresses')
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.actionText,
                                            { color: colors.text },
                                        ]}
                                    >
                                        My Addresses
                                    </Text>
                                    <Text style={styles.actionArrow}>→</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.actionItem,
                                        { backgroundColor: colors.card },
                                    ]}
                                    onPress={() =>
                                        navigation.navigate('Referral')
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.actionText,
                                            { color: colors.text },
                                        ]}
                                    >
                                        Refer & Earn
                                    </Text>
                                    <Text style={styles.actionArrow}>→</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.actionItem,
                                        { backgroundColor: colors.card },
                                    ]}
                                    onPress={() =>
                                        navigation.navigate('Support')
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.actionText,
                                            { color: colors.text },
                                        ]}
                                    >
                                        Support
                                    </Text>
                                    <Text style={styles.actionArrow}>→</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>

            {/* Logout Button (only in view mode) */}
            {!editMode && (
                <View style={styles.footer}>
                    <Button
                        title="Logout"
                        onPress={handleLogout}
                        style={styles.logoutButton}
                        textStyle={styles.logoutText}
                    />
                </View>
            )}

            {/* City Modal */}
            <CityModal
                visible={modalVisible === 'city'}
                cities={cities}
                onClose={() => setModalVisible(null)}
                onSelect={(city) => {
                    setSelectedCity({ id: city._id, name: city.name })
                    setSelectedArea(null)
                    fetchAreas(city._id)
                    setModalVisible(null)
                }}
            />

            {/* Area Modal */}
            <AreaModal
                visible={modalVisible === 'area'}
                areas={areas}
                selectedCity={selectedCity}
                onClose={() => setModalVisible(null)}
                onSelect={(area) => {
                    setSelectedArea({ id: area._id, name: area.name })
                    setModalVisible(null)
                }}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    headerButton: {
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        padding: 20,
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImageWrapper: {
        position: 'relative',
        marginBottom: 15,
    },
    profileImageEditable: {
        opacity: 0.9,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: COLORS.primary,
    },
    editOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editText: {
        color: 'white',
        fontWeight: '600',
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 5,
    },
    email: {
        fontSize: 14,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    selectInput: {
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        justifyContent: 'center',
    },
    selectText: {
        fontSize: 16,
    },
    preferencesContainer: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 15,
    },
    preferenceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    preferenceText: {
        fontSize: 16,
    },
    updateButton: {
        borderRadius: 25,
        height: 50,
    },
    infoContainer: {
        marginBottom: 30,
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoLabel: {
        fontSize: 14,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
    },
    walletContainer: {
        backgroundColor: COLORS.primary + '10',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 30,
    },
    walletAmount: {
        fontSize: 36,
        fontWeight: '700',
        marginVertical: 10,
    },
    walletButton: {
        width: '100%',
        borderRadius: 25,
        height: 40,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    actionsContainer: {
        marginBottom: 30,
    },
    actionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    actionText: {
        fontSize: 16,
        fontWeight: '500',
    },
    actionArrow: {
        fontSize: 18,
        color: COLORS.primary,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    logoutButton: {
        borderRadius: 25,
        height: 50,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.error,
    },
    logoutText: {
        color: COLORS.error,
    },
})

export default ProfileScreen
