import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Modal,
    FlatList,
    TouchableOpacity,
    TextInput,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTheme } from '../theme/ThemeProvider'
import { COLORS } from '../constants'

const AreaModal = ({ visible, onClose, onSelect, selectedCity, areas }) => {
    const { colors } = useTheme()
    const [filteredAreas, setFilteredAreas] = useState([])
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        if (visible) {
            setFilteredAreas(areas || [])
            setSearchQuery('')
        }
    }, [visible, areas])

    const handleSearch = (query) => {
        setSearchQuery(query)
        if (!query.trim()) {
            setFilteredAreas(areas || [])
            return
        }
        const filtered = (areas || []).filter((area) =>
            area.name.toLowerCase().includes(query.toLowerCase())
        )
        setFilteredAreas(filtered)
    }

    const renderAreaItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.areaItem,
                { borderBottomColor: colors.border || '#eee' },
            ]}
            onPress={() => {
                onSelect(item)
                onClose()
            }}
        >
            <View style={styles.areaIconContainer}>
                <Icon
                    name="map-marker-outline"
                    size={22}
                    color={COLORS.primary}
                />
            </View>
            <View style={styles.areaDetails}>
                <Text style={[styles.areaName, { color: colors.text }]}>
                    {item.name}
                </Text>
                {item.pincodes?.length > 0 && (
                    <Text style={[styles.pincodeText, { color: colors.gray }]}>
                        Pincode: {item.pincodes[0]}{' '}
                        {item.pincodes.length > 1
                            ? `(+${item.pincodes.length - 1} more)`
                            : ''}
                    </Text>
                )}
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
            presentationStyle="pageSheet" // Modern modal look on iOS
            onRequestClose={onClose}
        >
            <SafeAreaView
                style={[
                    styles.container,
                    { backgroundColor: colors.background },
                ]}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Icon name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        {selectedCity
                            ? `Areas in ${selectedCity.name}`
                            : 'Select Area'}
                    </Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Search Bar */}
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
                            placeholder="Search for your area..."
                            placeholderTextColor={colors.gray}
                            value={searchQuery}
                            onChangeText={handleSearch}
                        />
                    </View>
                </View>

                {/* List */}
                <FlatList
                    data={filteredAreas}
                    renderItem={renderAreaItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.centered}>
                            <Icon
                                name="map-marker-off-outline"
                                size={48}
                                color={colors.gray}
                            />
                            <Text
                                style={[
                                    styles.emptyText,
                                    { color: colors.text },
                                ]}
                            >
                                No areas found in this city
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
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    searchWrapper: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    areaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 0.5,
    },
    areaIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary + '15', // 15% opacity primary color
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    areaDetails: {
        flex: 1,
    },
    areaName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    pincodeText: {
        fontSize: 12,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 16,
        opacity: 0.6,
    },
})

export default AreaModal
