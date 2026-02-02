// components/OverviewCards.js

import React from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

import { COLORS } from '../../constants'
import SubHeaderItem from '../../components/SubHeaderItem'
import OverviewCardItem from '../../components/OverviewCardItem'

const OverviewCards = ({ data }) => {
    const renderItem = ({ item }) => (
        <OverviewCardItem
            icon={item.icon}
            title={item.title}
            value={String(item.value)} // ensure string
            bgColor={item.bg}
            testID={`overview-card-${item.id}`}
        />
    )

    const keyExtractor = (item) =>
        item?.id != null ? item.id.toString() : Math.random().toString()

    return (
        <View style={styles.container}>
            <SubHeaderItem title="Overview" />
            <FlatList
                data={data}
                keyExtractor={keyExtractor}
                numColumns={3}
                scrollEnabled={false}
                columnWrapperStyle={styles.cardRow}
                contentContainerStyle={styles.cardContainer}
                renderItem={renderItem}
            />
        </View>
    )
}

OverviewCards.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            icon: PropTypes.any.isRequired,
            title: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            bg: PropTypes.string.isRequired,
        })
    ).isRequired,
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingBottom: 16,
    },
    cardRow: {
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    cardContainer: {
        paddingTop: 8,
    },
})

export default React.memo(OverviewCards)
