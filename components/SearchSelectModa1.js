import React from 'react'
import {
    View,
    Text,
    Modal,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from 'react-native'
import { useTheme } from '../theme/ThemeProvider'

const SearchSelectModal = ({
    visible,
    title,
    data = [],
    onClose,
    onSelect,
}) => {
    const theme = useTheme()
    const colors = theme?.colors || {}

    const backgroundColor = colors.background || '#FFFFFF'
    const textColor = colors.text || '#000000'
    const borderColor = colors.border || '#E0E0E0'

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor }]}>
                    <Text style={[styles.title, { color: textColor }]}>
                        {title}
                    </Text>

                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.item,
                                    { borderColor },
                                ]}
                                onPress={() => onSelect(item)}
                            >
                                <Text style={{ color: textColor }}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <Text style={{ color: textColor }}>
                                No data found
                            </Text>
                        }
                    />

                    <TouchableOpacity onPress={onClose}>
                        <Text style={{ color: colors.primary || '#007AFF' }}>
                            Close
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    container: {
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '70%',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    item: {
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
})

export default SearchSelectModal
