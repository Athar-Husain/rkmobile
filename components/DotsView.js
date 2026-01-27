import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { COLORS } from '../constants'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

// Scale utility
const scale = (size) => (SCREEN_WIDTH / 375) * size

const DotsView = ({
    progress = 1,
    numDots = 3,
    dotSize = scale(10),
    dotSpacing = scale(8),
    dotColor = '#ccc',
    activeDotColor = COLORS.primary,
}) => {
    const renderDots = () => {
        return Array.from({ length: numDots }).map((_, i) => {
            const isActive = i === progress - 1
            return (
                <View
                    key={`dot-${i}`}
                    style={[
                        styles.dot,
                        {
                            width: dotSize,
                            height: dotSize,
                            marginHorizontal: dotSpacing / 2,
                            backgroundColor: isActive
                                ? activeDotColor
                                : dotColor,
                        },
                    ]}
                />
            )
        })
    }

    return <View style={styles.container}>{renderDots()}</View>
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: scale(10),
    },
    dot: {
        borderRadius: 50,
    },
})

export default DotsView
