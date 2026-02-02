import React from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
// import { resetOnboarding } from '../redux/features/Customers/CustomerSlice'
import { useTheme } from '../theme/ThemeProvider'
import { COLORS } from '../constants'
import { resetOnboarding } from '../redux/features/Auth/AuthSlice'

const ResetOnboardingButton = ({ label = 'Reset Onboarding', style = {} }) => {
    const dispatch = useDispatch()
    const { dark } = useTheme()

    const handleReset = () => {
        dispatch(resetOnboarding())
    }

    return (
        <TouchableOpacity onPress={handleReset} style={style}>
            <Text
                style={[
                    styles.resetText,
                    { color: dark ? COLORS.white : COLORS.black },
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    resetText: {
        fontSize: 16,
        fontFamily: 'medium',
        textAlign: 'center',
    },
})

export default ResetOnboardingButton
