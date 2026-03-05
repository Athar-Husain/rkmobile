import React, { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    LayoutAnimation,
} from 'react-native'
import { COLORS, icons } from '../../constants'

const FaqSection = ({ faqsData, faqKeywordsData, dark }) => {
    const [expanded, setExpanded] = useState(-1)
    const [searchText, setSearchText] = useState('')

    const toggleExpand = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setExpanded(expanded === index ? -1 : index)
    }

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.searchBar,
                    { backgroundColor: dark ? '#1C1C1E' : '#F2F2F7' },
                ]}
            >
                <Image source={icons.search} style={styles.searchIcon} />
                <TextInput
                    placeholder="Search topics..."
                    placeholderTextColor="#8E8E93"
                    style={[
                        styles.input,
                        { color: dark ? COLORS.white : COLORS.black },
                    ]}
                    onChangeText={setSearchText}
                />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
            >
                {faqsData
                    .filter((f) =>
                        f.question
                            .toLowerCase()
                            .includes(searchText.toLowerCase())
                    )
                    .map((faq, index) => (
                        <View
                            key={index}
                            style={[
                                styles.card,
                                {
                                    backgroundColor: dark
                                        ? '#1C1C1E'
                                        : COLORS.white,
                                },
                            ]}
                        >
                            <TouchableOpacity
                                onPress={() => toggleExpand(index)}
                                style={styles.cardHeader}
                            >
                                <Text
                                    style={[
                                        styles.question,
                                        {
                                            color: dark
                                                ? COLORS.white
                                                : COLORS.black,
                                        },
                                    ]}
                                >
                                    {faq.question}
                                </Text>
                                <Text
                                    style={{
                                        color: COLORS.primary,
                                        fontSize: 18,
                                    }}
                                >
                                    {expanded === index ? '−' : '+'}
                                </Text>
                            </TouchableOpacity>
                            {expanded === index && (
                                <View style={styles.answerContainer}>
                                    <View style={styles.divider} />
                                    <Text style={styles.answer}>
                                        {faq.answer}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20 },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 52,
        borderRadius: 16,
        marginTop: 10,
    },
    searchIcon: { width: 18, height: 18, tintColor: '#8E8E93' },
    input: { flex: 1, marginLeft: 10, fontSize: 15 },
    list: { paddingVertical: 20, paddingBottom: 50 },
    card: {
        borderRadius: 20,
        marginBottom: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    question: { fontSize: 15, fontWeight: '600', flex: 1, marginRight: 10 },
    answerContainer: { marginTop: 12 },
    divider: { height: 1, backgroundColor: '#8E8E9320', marginBottom: 10 },
    answer: { fontSize: 14, color: '#8E8E93', lineHeight: 20 },
})

export default FaqSection
