import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Modal,
    FlatList,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useSelector } from 'react-redux'

import { COLORS } from '../constants'
import { useTheme } from '../theme/ThemeProvider'

const CityModal = ({ visible, onClose, onSelect }) => {
    const { colors, dark } = useTheme()

    // Get cities from Redux slice
    // const cities = useSelector((state) => state.cityarea.cities || [])
    const {
        cities,
        areas,
        // status: locationStatus,
        isLocationLoading,
    } = useSelector((state) => state.cityarea)
    const [filteredCities, setFilteredCities] = useState([])
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        if (visible) {
            setFilteredCities(cities)
        }
    }, [visible, cities])

    const handleSearch = (query) => {
        setSearchQuery(query)
        if (!query.trim()) {
            setFilteredCities(cities)
            return
        }

        const filtered = cities.filter((city) =>
            city.name.toLowerCase().includes(query.toLowerCase())
        )
        setFilteredCities(filtered)
    }

    const handleSelect = (city) => {
        onSelect(city)
        onClose()
    }

    const renderCityItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.cityItem, { backgroundColor: colors.card }]}
            onPress={() => handleSelect(item)}
        >
            <View style={styles.cityInfo}>
                <Icon name="location-city" size={24} color={COLORS.primary} />
                <View style={styles.cityDetails}>
                    <Text style={[styles.cityName, { color: colors.text }]}>
                        {item.name}
                    </Text>
                    <Text style={[styles.areasCount, { color: colors.gray }]}>
                        {item.areas?.length || 0} areas
                    </Text>
                </View>
            </View>
            <Icon name="chevron-right" size={24} color={colors.gray} />
        </TouchableOpacity>
    )

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <SafeAreaView
                style={[
                    styles.container,
                    { backgroundColor: colors.background },
                ]}
            >
                {/* Header */}
                <View style={[styles.header, { backgroundColor: colors.card }]}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.backButton}
                    >
                        <Icon name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        Select City
                    </Text>
                    <View style={styles.headerRight} />
                </View>

                {/* Search Bar */}
                <View
                    style={[
                        styles.searchContainer,
                        { backgroundColor: colors.card },
                    ]}
                >
                    <Icon
                        name="search"
                        size={20}
                        color={colors.gray}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search city..."
                        placeholderTextColor={colors.gray}
                        value={searchQuery}
                        onChangeText={handleSearch}
                        autoFocus
                    />
                    {searchQuery ? (
                        <TouchableOpacity onPress={() => handleSearch('')}>
                            <Icon name="close" size={20} color={colors.gray} />
                        </TouchableOpacity>
                    ) : null}
                </View>

                {/* Loading or List */}
                {cities.length === 0 ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator
                            size="large"
                            color={COLORS.primary}
                        />
                        <Text
                            style={[styles.loadingText, { color: colors.text }]}
                        >
                            Loading cities...
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredCities}
                        renderItem={renderCityItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Icon
                                    name="location-off"
                                    size={48}
                                    color={colors.gray}
                                />
                                <Text
                                    style={[
                                        styles.emptyText,
                                        { color: colors.text },
                                    ]}
                                >
                                    {searchQuery
                                        ? 'No cities found'
                                        : 'No cities available'}
                                </Text>
                                {searchQuery ? (
                                    <Text
                                        style={[
                                            styles.emptySubtext,
                                            { color: colors.gray },
                                        ]}
                                    >
                                        Try a different search term
                                    </Text>
                                ) : null}
                            </View>
                        }
                    />
                )}
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    backButton: { padding: 5 },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginLeft: -30,
    },
    headerRight: { width: 40 },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 16, padding: 0 },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: { marginTop: 10, fontSize: 16 },
    listContent: { padding: 15 },
    cityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cityInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    cityDetails: { marginLeft: 15, flex: 1 },
    cityName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
    areasCount: { fontSize: 12 },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 50,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 15,
        textAlign: 'center',
    },
    emptySubtext: { fontSize: 14, marginTop: 5, textAlign: 'center' },
})

export default CityModal
