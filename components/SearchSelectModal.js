import React, { useState, useMemo } from 'react'
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    TextInput,
    Image,
    StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, icons } from '../constants'

const SearchSelectModal = ({
    visible,
    onClose,
    data,
    onSelect,
    title,
    placeholder,
    dark,
    colors,
}) => {
    const [search, setSearch] = useState('')

    const filteredData = useMemo(
        () =>
            data.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
            ),
        [search, data]
    )

    return (
        <Modal visible={visible} animationType="slide">
            <SafeAreaView
                style={{ flex: 1, backgroundColor: colors.background }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Image
                            source={icons.back}
                            style={{
                                width: 24,
                                height: 24,
                                tintColor: colors.text,
                            }}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {title}
                    </Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.searchWrap}>
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder={placeholder}
                        placeholderTextColor={COLORS.gray}
                        style={[
                            styles.search,
                            {
                                backgroundColor: dark
                                    ? COLORS.dark3
                                    : COLORS.grayscale100,
                                color: colors.text,
                            },
                        ]}
                    />
                </View>

                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.row,
                                { borderBottomColor: colors.border },
                            ]}
                            onPress={() => {
                                onSelect(item)
                                setSearch('')
                                onClose()
                            }}
                        >
                            <Text style={{ color: colors.text }}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    title: { fontSize: 18, fontWeight: 'bold' },
    searchWrap: { paddingHorizontal: 16, marginBottom: 10 },
    search: {
        height: 50,
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    row: {
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
})

export default SearchSelectModal
