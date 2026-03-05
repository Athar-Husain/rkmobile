import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import Checkbox from 'expo-checkbox'

import Header from '../components/Header'
import Input from '../components/Input'
import Button from '../components/Button'
import CityModal from '../components/CityModal'
import AreaModal from '../components/AreaModal'

import { COLORS, icons, images } from '../constants'
import { useTheme } from '../theme/ThemeProvider'
import {
    getAreasByCity,
    getCities,
} from '../redux/features/CityAreas/CityAreaSlice'
import { signupSendOTP, setTempToken } from '../redux/features/Auth/AuthSlice'

const Signup = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { colors } = useTheme()
    const [isChecked, setChecked] = useState(false)
    const [modalVisible, setModalVisible] = useState(null)

    const { cities, areas } = useSelector((state) => state.cityarea)
    const { loading: authLoading } = useSelector((state) => state.auth)

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        trigger, // Use this to manually trigger validation if needed
        formState: { errors },
    } = useForm({
        mode: 'onTouched', // VALIDATION FIX: triggers errors when user leaves a field
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
            city: null,
            area: null,
            referralCode: '',
        },
    })

    const selectedCity = watch('city')

    useEffect(() => {
        dispatch(getCities())
    }, [dispatch])

    useEffect(() => {
        if (selectedCity?.id) {
            dispatch(getAreasByCity(selectedCity.id))
            setValue('area', null)
            trigger('city') // Clear city error when value is set
        }
    }, [selectedCity?.id, dispatch, setValue, trigger])

    const handleSignup = async (data) => {
        if (!isChecked) {
            Alert.alert('Required', 'Please accept the Terms & Privacy Policy')
            return
        }

        const payload = {
            name: data.name.trim(),
            email: data.email.toLowerCase().trim(),
            mobile: data.phone.trim(),
            password: data.password,
            city_id: data.city.id,
            area_id: data.area.id,
            referralCode: data.referralCode || undefined,
        }

        try {
            const result = await dispatch(signupSendOTP(payload)).unwrap()
            if (result?.tempToken) {
                dispatch(setTempToken(result.tempToken))
                navigation.navigate('VerifyOTPScreen', {
                    email: payload.email,
                    cityName: data.city.name,
                    areaName: data.area.name,
                    purpose: 'SIGNUP',
                })
            }
        } catch (error) {
            Alert.alert('Signup Failed', error || 'Please try again')
        }
    }

    return (
        <SafeAreaView
            style={[styles.area, { backgroundColor: colors.background }]}
        >
            <Header
                title="Create Account"
                onPress={() => navigation.goBack()}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    <View style={styles.headerSection}>
                        <Image source={images.logo} style={styles.logo} />
                        <Text style={[styles.title, { color: colors.text }]}>
                            Join RK Electronics
                        </Text>
                        <Text
                            style={[
                                styles.subtitle,
                                { color: colors.grayscale700 },
                            ]}
                        >
                            Your Trusted Electronics Partner
                        </Text>
                    </View>

                    {/* Name Field */}
                    <Controller
                        control={control}
                        name="name"
                        rules={{
                            required: 'Full name is required',
                            minLength: {
                                value: 3,
                                message: 'Name must be at least 3 characters',
                            },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                placeholder="Full Name"
                                icon={icons.user}
                                value={value}
                                onBlur={onBlur} // FIX: notifies Hook Form when user leaves input
                                onInputChanged={(_, v) => onChange(v)}
                                errorText={errors.name?.message}
                            />
                        )}
                    />

                    {/* Mobile Field */}
                    <Controller
                        control={control}
                        name="phone"
                        rules={{
                            required: 'Mobile number is required',
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: 'Enter a valid 10-digit number',
                            },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                placeholder="Mobile Number"
                                icon={icons.call}
                                keyboardType="phone-pad"
                                maxLength={10}
                                value={value}
                                onBlur={onBlur}
                                onInputChanged={(_, v) =>
                                    onChange(v.replace(/[^0-9]/g, ''))
                                }
                                errorText={errors.phone?.message}
                            />
                        )}
                    />

                    {/* Email Field */}
                    <Controller
                        control={control}
                        name="email"
                        rules={{
                            required: 'Email address is required',
                            pattern: {
                                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                message: 'Invalid email',
                            },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                placeholder="Email Address"
                                icon={icons.email}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={value}
                                onBlur={onBlur}
                                onInputChanged={(_, v) => onChange(v)}
                                errorText={errors.email?.message}
                            />
                        )}
                    />

                    {/* Password Field */}
                    <Controller
                        control={control}
                        name="password"
                        rules={{
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Minimum 6 characters',
                            },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                placeholder="Password"
                                icon={icons.padlock}
                                secureTextEntry
                                value={value}
                                onBlur={onBlur}
                                onInputChanged={(_, v) => onChange(v)}
                                errorText={errors.password?.message}
                            />
                        )}
                    />

                    {/* City Selection */}
                    <Controller
                        control={control}
                        name="city"
                        rules={{ required: 'Please select a city' }}
                        render={({ field: { value } }) => (
                            <View>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => setModalVisible('city')}
                                    style={styles.selectorWrapper}
                                >
                                    <View pointerEvents="none">
                                        <Input
                                            placeholder="Select City"
                                            icon={icons.location}
                                            value={value?.name || ''}
                                            editable={false}
                                            errorText={errors.city?.message}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                    />

                    {/* Area Selection */}
                    <Controller
                        control={control}
                        name="area"
                        rules={{ required: 'Please select an area' }}
                        render={({ field: { value } }) => (
                            <View>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    disabled={!selectedCity}
                                    onPress={() => setModalVisible('area')}
                                    style={[
                                        styles.selectorWrapper,
                                        { opacity: selectedCity ? 1 : 0.6 },
                                    ]}
                                >
                                    <View pointerEvents="none">
                                        <Input
                                            placeholder={
                                                selectedCity
                                                    ? 'Select Area'
                                                    : 'Select city first'
                                            }
                                            icon={icons.location}
                                            value={value?.name || ''}
                                            editable={false}
                                            errorText={errors.area?.message}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                    />

                    {/* Referral Code */}
                    <Controller
                        control={control}
                        name="referralCode"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder="Referral Code (Optional)"
                                icon={icons.discount}
                                value={value}
                                onInputChanged={(_, v) => onChange(v)}
                            />
                        )}
                    />

                    {/* Terms & Conditions */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.privacyContainer}
                        onPress={() => setChecked(!isChecked)}
                    >
                        <Checkbox
                            value={isChecked}
                            onValueChange={setChecked}
                            color={isChecked ? COLORS.primary : undefined}
                            style={styles.checkbox}
                        />
                        <Text
                            style={[styles.privacyText, { color: colors.text }]}
                        >
                            I agree to the{' '}
                            <Text style={styles.link}>
                                Terms & Privacy Policy
                            </Text>
                        </Text>
                    </TouchableOpacity>

                    <Button
                        title={
                            authLoading
                                ? 'Creating Account...'
                                : 'Create Account'
                        }
                        onPress={handleSubmit(handleSignup)}
                        filled
                        disabled={authLoading}
                        style={styles.signupBtn}
                    />

                    <View style={styles.footer}>
                        <Text
                            style={{
                                color: colors.text,
                                fontSize: 15,
                                fontFamily: 'regular',
                            }}
                        >
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.linkText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <CityModal
                visible={modalVisible === 'city'}
                cities={cities}
                onClose={() => setModalVisible(null)}
                onSelect={(city) => {
                    setValue(
                        'city',
                        { id: city._id, name: city.city },
                        { shouldValidate: true }
                    )
                    setModalVisible(null)
                }}
            />

            <AreaModal
                visible={modalVisible === 'area'}
                areas={areas}
                selectedCity={selectedCity}
                onClose={() => setModalVisible(null)}
                onSelect={(area) => {
                    setValue(
                        'area',
                        { id: area._id, name: area.name },
                        { shouldValidate: true }
                    )
                    setModalVisible(null)
                }}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: { flex: 1 },
    scrollContainer: { paddingHorizontal: 24, paddingBottom: 40 },
    headerSection: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    logo: { width: 80, height: 80, resizeMode: 'contain', marginBottom: 16 },
    title: { fontSize: 26, fontFamily: 'bold', marginBottom: 8 },
    subtitle: { fontSize: 14, fontFamily: 'regular', opacity: 0.8 },
    selectorWrapper: { width: '100%' },
    privacyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
        paddingHorizontal: 4,
    },
    checkbox: { width: 20, height: 20, borderRadius: 6 },
    privacyText: { marginLeft: 12, fontSize: 14, fontFamily: 'medium' },
    link: { color: COLORS.primary, fontFamily: 'bold' },
    linkText: { color: COLORS.primary, fontFamily: 'bold', fontSize: 15 },
    signupBtn: { height: 56, borderRadius: 16, marginTop: 10 },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
        alignItems: 'center',
    },
})

export default Signup
