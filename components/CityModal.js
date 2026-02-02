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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTheme } from '../theme/ThemeProvider'
import { COLORS } from '../constants'

const CityModal = ({ visible, onClose, onSelect, cities }) => {
    const { colors } = useTheme()
    const [filteredCities, setFilteredCities] = useState([])
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        if (visible) {
            setFilteredCities(cities || [])
            setSearchQuery('')
        }
    }, [visible, cities])

    const handleSearch = (query) => {
        setSearchQuery(query)
        if (!query.trim()) {
            setFilteredCities(cities || [])
            return
        }
        const filtered = (cities || []).filter((item) =>
            item.city.toLowerCase().includes(query.toLowerCase())
        )
        setFilteredCities(filtered)
    }

    const renderCityItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.cityItem,
                { borderBottomColor: colors.border || '#eee' },
            ]}
            onPress={() => {
                onSelect(item)
                onClose()
            }}
        >
            <View style={styles.cityIconContainer}>
                <Icon
                    name="map-marker-radius-outline"
                    size={22}
                    color={COLORS.primary}
                />
            </View>
            <View style={styles.cityDetails}>
                <Text style={[styles.cityName, { color: colors.text }]}>
                    {item.city}
                </Text>
            </View>
            <Icon
                name="chevron-right"
                size={20}
                color={colors.gray || '#ccc'}
            />
        </TouchableOpacity>
    )

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView
                style={[
                    styles.container,
                    { backgroundColor: colors.background },
                ]}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Icon name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        Select your city
                    </Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.searchWrapper}>
                    <View
                        style={[
                            styles.searchBar,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border || '#ddd',
                            },
                        ]}
                    >
                        <Icon
                            name="magnify"
                            size={20}
                            color={colors.gray}
                            style={styles.searchIcon}
                        />
                        <TextInput
                            style={[styles.searchInput, { color: colors.text }]}
                            placeholder="Search for your city..."
                            value={searchQuery}
                            onChangeText={handleSearch}
                        />
                    </View>
                </View>

                <FlatList
                    data={filteredCities}
                    renderItem={renderCityItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.centered}>
                            <Icon
                                name="map-marker-off-outline"
                                size={48}
                                color={colors.gray}
                            />
                            <Text style={{ color: colors.text, marginTop: 10 }}>
                                No cities found
                            </Text>
                        </View>
                    }
                />
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    searchWrapper: { paddingHorizontal: 20, paddingBottom: 10 },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
    },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, fontSize: 15 },
    listContent: { paddingHorizontal: 20 },
    cityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 0.5,
    },
    cityIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    cityDetails: { flex: 1 },
    cityName: { fontSize: 16, fontWeight: '600' },
    centered: { flex: 1, alignItems: 'center', marginTop: 50 },
})

export default CityModal
