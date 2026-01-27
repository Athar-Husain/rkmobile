import React, { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    FlatList,
    LayoutAnimation,
    Platform,
    UIManager,
    ScrollView,
} from 'react-native'
import { COLORS, SIZES, icons } from '../../constants'
import { useTheme } from '../../theme/ThemeProvider'
// import { useTheme } from '../theme/ThemeProvider'

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}

// A reusable component for a single keyword item
const KeywordItem = ({ item, onPress, selected }) => {
    const itemStyle = {
        paddingHorizontal: 14,
        marginHorizontal: 5,
        borderRadius: 21,
        height: 39,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: COLORS.primary,
        borderWidth: 1,
        backgroundColor: selected ? COLORS.primary : 'transparent',
    }

    return (
        <TouchableOpacity style={itemStyle} onPress={() => onPress(item.id)}>
            <Text style={{ color: selected ? COLORS.white : COLORS.primary }}>
                {item.name}
            </Text>
        </TouchableOpacity>
    )
}

// A reusable component for a single FAQ item
const FaqItem = ({ faq, isExpanded, onToggle, dark }) => {
    const faqContainerStyle = [
        styles.faqContainer,
        { backgroundColor: dark ? COLORS.dark2 : COLORS.grayscale100 },
    ]
    const questionColor = dark ? COLORS.white : COLORS.black
    const answerColor = dark ? COLORS.secondaryWhite : COLORS.gray2

    return (
        <View style={faqContainerStyle}>
            <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
                <View style={styles.questionContainer}>
                    <Text style={[styles.question, { color: questionColor }]}>
                        {faq.question}
                    </Text>
                    <Text style={[styles.icon, { color: questionColor }]}>
                        {isExpanded ? '-' : '+'}
                    </Text>
                </View>
            </TouchableOpacity>
            {isExpanded && (
                <Text style={[styles.answer, { color: answerColor }]}>
                    {faq.answer}
                </Text>
            )}
        </View>
    )
}

const FaqSection = ({ faqsData, faqKeywordsData }) => {
    const [selectedKeywords, setSelectedKeywords] = useState([])
    const [expanded, setExpanded] = useState(-1)
    const [searchText, setSearchText] = useState('')
    const { dark } = useTheme()

    const handleKeywordPress = (id) => {
        const selectedKeyword = faqKeywordsData.find(
            (keyword) => keyword.id === id
        )
        if (!selectedKeyword) return

        setSelectedKeywords((prev) =>
            prev.includes(selectedKeyword.name)
                ? prev.filter((keyword) => keyword !== selectedKeyword.name)
                : [...prev, selectedKeyword.name]
        )
    }

    const toggleExpand = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setExpanded((prev) => (prev === index ? -1 : index))
    }

    const filteredFaqs = faqsData
        .filter((faq) => {
            if (selectedKeywords.length === 0) return true
            return faq.type && selectedKeywords.includes(faq.type)
        })
        .filter((faq) =>
            faq.question.toLowerCase().includes(searchText.toLowerCase())
        )

    return (
        <View>
            <View style={{ marginVertical: 16 }}>
                <FlatList
                    data={faqKeywordsData}
                    horizontal
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <KeywordItem
                            item={item}
                            onPress={handleKeywordPress}
                            selected={selectedKeywords.includes(item.name)}
                        />
                    )}
                />
            </View>
            <View
                style={[
                    styles.searchBar,
                    {
                        backgroundColor: dark
                            ? COLORS.dark2
                            : COLORS.grayscale100,
                    },
                ]}
            >
                <Image
                    source={icons.search}
                    resizeMode="contain"
                    style={[
                        styles.searchIcon,
                        {
                            tintColor: dark
                                ? COLORS.greyscale600
                                : COLORS.grayscale400,
                        },
                    ]}
                />
                <TextInput
                    style={[
                        styles.input,
                        {
                            color: dark
                                ? COLORS.greyscale600
                                : COLORS.grayscale400,
                        },
                    ]}
                    placeholder="Search"
                    placeholderTextColor={
                        dark ? COLORS.greyscale600 : COLORS.grayscale400
                    }
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ marginVertical: 22 }}
            >
                {filteredFaqs.map((faq, index) => (
                    <FaqItem
                        key={index}
                        faq={faq}
                        isExpanded={expanded === index}
                        onToggle={() => toggleExpand(index)}
                        dark={dark}
                    />
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        width: SIZES.width - 32,
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    searchIcon: {
        width: 24,
        height: 24,
    },
    input: {
        flex: 1,
        marginHorizontal: 12,
    },
    faqContainer: {
        marginBottom: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    questionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    question: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'semiBold',
    },
    icon: {
        fontSize: 18,
    },
    answer: {
        fontSize: 14,
        marginTop: 10,
        paddingHorizontal: 16,
        paddingBottom: 10,
        fontFamily: 'regular',
    },
})

export default FaqSection
