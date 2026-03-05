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
        formState: { errors },
    } = useForm({
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
        }
    }, [selectedCity?.id, dispatch, setValue])

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
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    <Header
                        title="Create Account"
                        onPress={() => navigation.goBack()}
                    />

                    <View style={styles.logoContainer}>
                        <Image source={images.logo} style={styles.logo} />
                        <Text style={[styles.subtitle, { color: colors.text }]}>
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
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder="Full Name"
                                icon={icons.user}
                                value={value}
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
                                message: 'Enter a valid 10-digit mobile number',
                            },
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder="Mobile Number"
                                icon={icons.call}
                                keyboardType="phone-pad"
                                maxLength={10}
                                value={value}
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
                                message: 'Please enter a valid email',
                            },
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder="Email Address"
                                icon={icons.email}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={value}
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
                                message:
                                    'Password must be at least 6 characters',
                            },
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder="Password"
                                icon={icons.padlock}
                                secureTextEntry
                                value={value}
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
                            <TouchableOpacity
                                onPress={() => setModalVisible('city')}
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
                        )}
                    />

                    {/* Area Selection */}
                    <Controller
                        control={control}
                        name="area"
                        rules={{ required: 'Please select an area' }}
                        render={({ field: { value } }) => (
                            <TouchableOpacity
                                disabled={!selectedCity}
                                onPress={() => setModalVisible('area')}
                                style={{ opacity: selectedCity ? 1 : 0.6 }}
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
                        )}
                    />

                    {/* Referral Code (Optional) */}
                    <Controller
                        control={control}
                        name="referralCode"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder="Referral Code (Optional)"
                                icon={icons.gift || null} // Use gift icon if available
                                value={value}
                                onInputChanged={(_, v) => onChange(v)}
                            />
                        )}
                    />

                    {/* Terms & Conditions */}
                    <View style={styles.privacyContainer}>
                        <Checkbox
                            value={isChecked}
                            onValueChange={setChecked}
                            color={isChecked ? COLORS.primary : undefined}
                            style={styles.checkbox}
                        />
                        <TouchableOpacity
                            onPress={() => setChecked(!isChecked)}
                        >
                            <Text
                                style={[
                                    styles.privacyText,
                                    { color: colors.text },
                                ]}
                            >
                                I agree to{' '}
                                <Text style={styles.link}>
                                    Terms & Privacy Policy
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Button
                        title={
                            authLoading
                                ? 'Creating Account...'
                                : 'Create Account'
                        }
                        onPress={handleSubmit(handleSignup)}
                        disabled={authLoading}
                        style={styles.signupBtn}
                    />
                </ScrollView>

                {/* Modals */}
                <CityModal
                    visible={modalVisible === 'city'}
                    cities={cities}
                    onClose={() => setModalVisible(null)}
                    onSelect={(city) => {
                        setValue('city', { id: city._id, name: city.city })
                        setModalVisible(null)
                    }}
                />

                <AreaModal
                    visible={modalVisible === 'area'}
                    areas={areas}
                    selectedCity={selectedCity}
                    onClose={() => setModalVisible(null)}
                    onSelect={(area) => {
                        setValue('area', { id: area._id, name: area.name })
                        setModalVisible(null)
                    }}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: { flex: 1 },
    container: { flex: 1, paddingHorizontal: 20 },
    logoContainer: { alignItems: 'center', marginVertical: 20 },
    logo: { width: 100, height: 100, resizeMode: 'contain' },
    subtitle: { fontSize: 14, marginTop: 5, opacity: 0.8 },
    privacyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
        paddingHorizontal: 5,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
    },
    privacyText: { marginLeft: 10, fontSize: 13 },
    link: { color: COLORS.primary, fontWeight: 'bold' },
    signupBtn: { marginTop: 10 },
})

export default Signup
